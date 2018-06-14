import { delay, Task } from 'redux-saga'
import { put, call, select, takeEvery, fork, cancel, all } from 'redux-saga/effects'

import { loadSuccess, loadFailure, Meta, LoadAction, loadStart } from './DataLoaderReducer'
import * as DL from './DataLoaderState'

type IntervalFunction = (name: string, meta: Meta) => any

function* load(action: LoadAction) {
  const { value, meta } = action
  if (meta.interval) {
    yield call(runInInterval, fetchData, value, meta)
  } else {
    yield call(fetchData, value, meta)
  }
}

function* runInInterval(func: IntervalFunction, name: string, meta: Meta): any {
  const task: Task = yield fork(func, name, meta)
  yield call(delay, meta.interval)

  // cancel task if task is still running after interval
  if (task.isRunning()) {
    yield cancel(task)
  }

  if (meta.shouldInterval && meta.shouldInterval(task.result())) {
    yield call(runInInterval, func, name, meta)
  }
}

function* fetchData(name: string, meta: Meta) {
  let data = yield select(DL.getDataStorageValue(name))
  const cacheExpiresIn = meta.cacheExpiresIn ? meta.cacheExpiresIn : 0

  if (data && (Date.now() - data.lastUpdateTime) < cacheExpiresIn) {
    return data
  }

  try {
    yield put(loadStart(name))
    data = yield call(meta.apiCall, meta.params)
    yield put(loadSuccess(name, data))

    if (meta.onSuccess) {
      yield call(meta.onSuccess, data)
    }
  } catch (e) {
    yield put(loadFailure(name, e))

    if (meta.onFailure) {
      yield call(meta.onFailure, e)
    }
  }
  return data
}

export function* dataLoaderSagas(): any {
  yield all([
    takeEvery('@@DATA_LOADER/LOAD', load),
  ])
}
