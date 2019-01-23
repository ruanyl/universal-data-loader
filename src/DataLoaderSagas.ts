import { delay, Task } from 'redux-saga'
import { put, call, select, takeEvery, fork, cancel, all } from 'redux-saga/effects'

import { loadSuccess, loadFailure, Meta, LoadAction, loadStart } from './DataLoaderReducer'
import * as DL from './DataLoaderState'
import { isDataValid } from './utils'

type IntervalFunction = (name: string, meta: Meta) => any

function* load(action: LoadAction) {
  const { value, meta } = action
  if (meta.interval) {
    yield call(runInInterval, fetchData, value, meta)
  } else {
    yield call(fetchData, value, meta)
  }
}

function* runInInterval(func: IntervalFunction, name: string, meta: Meta): IterableIterator<any> {
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
  if (isDataValid(data, meta)) {
    return data
  }

  yield put(loadStart(name))

  try {
    if (meta.dataPersister) {
      data = meta.dataPersister.getItem(name, meta)
    }

    if (data && meta.lazyLoad) {
      yield call(handleData, data, name, meta, false)
    }

    data = yield call(refresh, name, meta)

    if (meta.dataPersister) {
      yield call(meta.dataPersister.setItem, name, data, meta)
    }

  } catch (e) {
    yield put(loadFailure(name, e))

    if (meta.onFailure) {
      yield call(meta.onFailure, e)
    }
  }
  return data
}

function* refresh(name: string, meta: Meta) {
  const data = yield call(meta.apiCall, meta.params)
  yield call(handleData, data, name, meta, true)
  return data
}

function* handleData(data: any, name: string, meta: Meta, isFresh: boolean) {
  yield put(loadSuccess(name, data, isFresh))

  if (meta.onSuccess) {
    yield call(meta.onSuccess, data)
  }
}

export function* dataLoaderSagas() {
  yield all([
    takeEvery('@@DATA_LOADER/LOAD', load),
  ])
}
