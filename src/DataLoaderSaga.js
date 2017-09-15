import { put, call, select, takeEvery } from 'redux-saga/effects'

import { ActionTypes as AT, loadSuccess, loadFailure } from './DataLoaderReducer'
import { DataLoader as DL } from './DataLoaderState'

function* load(api, params) {
  const cachedData = yield select(DL.getDataStorageValue(api.uniqueApiKey))
  const cacheExpiresIn = api.cacheExpiresIn ? api.cacheExpiresIn : 0
  if (cachedData && (Date.now() - cachedData.lastUpdateTime) < cacheExpiresIn) {
    return cachedData
  }
  const data = yield call(fetchData, api, params)
  return data
}

function* loadData(action) {
  const { api, params } = action.value
  yield call(load, api, params)
}

/* eslint-disable complexity */
function* fetchData(api, params) {
  const data = yield call(api.apiCall, params)

  if (data.error) {
    yield put(loadFailure(api.uniqueApiKey, data.error))
    if (api.onFailure) {
      yield call(api.onFailure, data.error)
    }
    return
  }

  yield put(loadSuccess(api.uniqueApiKey, data))

  if (api.onSuccess) {
    yield call(api.onSuccess, data)
  }
}

export function* dataLoaderSagas() {
  yield [
    takeEvery(AT.DATA_LOADER.LOAD, loadData),
  ]
}
