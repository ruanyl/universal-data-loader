import { Dispatch } from 'redux'
import { delay, Task } from 'redux-saga'
import { put, call, select, takeEvery, fork, cancel, all } from 'redux-saga/effects'

import { loadSuccess, loadFailure } from './DataLoaderReducer'
import * as DL from './DataLoaderState'
import { Action } from './DataLoaderReducer'

type IntervalFunction = (name: string, meta: Meta) => any

interface LoaderConfig {
  apiCall: (params: any) => Promise<any>;
  cacheExpiresIn?: number;
  autoLoad?: boolean;
  onSuccess?: (dispatch: Dispatch) => (data: any) => any;
  onFailure?: (dispatch: Dispatch) => (error: Error) => any;
  interval?: number;
  shouldInterval?: (result: any) => boolean;
  params?: any;
}

type Meta = LoaderConfig

interface LoadAction extends Action {
  value: string;
  meta: Meta;
}

function* load(action: LoadAction) {
  const { value, meta } = action
  const cachedData = yield select(DL.getDataStorageValue(value))
  const cacheExpiresIn = meta.cacheExpiresIn ? meta.cacheExpiresIn : 0
  if (cachedData && (Date.now() - cachedData.lastUpdateTime) < cacheExpiresIn) {
    return
  }
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
  try {
    const data = yield call(meta.apiCall, meta.params)
    yield put(loadSuccess(name, data))

    if (meta.onSuccess) {
      yield call(meta.onSuccess, data)
    }
  } catch (e) {
    yield put(loadFailure(name, e))

    if (meta.onFailure) {
      yield call(meta.onFailure, e)
    }
    return
  }
}

export function* dataLoaderSagas(): any {
  yield all([
    takeEvery('@@DATA_LOADER/LOAD', load),
  ])
}
