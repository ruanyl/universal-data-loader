import { delay } from 'redux-saga'
import { put, call, select, takeEvery, fork, cancel } from 'redux-saga/effects'
import { identity } from 'ramda'

import { ActionTypes as AT, loadSuccess, loadFailure } from './DataLoaderReducer'
import { DataLoader as DL } from './DataLoaderState'

function* load(action) {
  const { api, params } = action.value
  const cachedData = yield select(DL.getDataStorageValue(api.uniqueApiKey))
  const cacheExpiresIn = api.cacheExpiresIn ? api.cacheExpiresIn : 0
  if (cachedData && (Date.now() - cachedData.lastUpdateTime) < cacheExpiresIn) {
    return
  }
  if (api.interval) {
    yield call(runInInterval, fetchData, { api, params }, api.interval, api.shouldStopInterval)
  } else {
    yield call(fetchData, { api, params })
  }
}

function* runInInterval(func, args, interval, shouldStopInterval = identity) {
  const task = yield fork(func, args)
  yield call(delay, interval)

  // cancel task if task is still running after interval
  if (task.isRunning()) {
    yield cancel(task)
  }

  if (!shouldStopInterval(task.result())) {
    yield call(runInInterval, func, args, interval, shouldStopInterval)
  }
}

/* eslint-disable complexity */
function* fetchData({ api, params }) {
  try {
    const data = yield call(api.apiCall, params)
    yield put(loadSuccess(api.uniqueApiKey, data))

    if (api.onSuccess) {
      yield call(api.onSuccess, data)
    }
  } catch (e) {
    yield put(loadFailure(api.uniqueApiKey, e))

    if (api.onFailure) {
      yield call(api.onFailure, e)
    }
    return
  }
}

export function* dataLoaderSagas() {
  yield [
    takeEvery(AT.DATA_LOADER.LOAD_START, load),
  ]
}
