import { delay, Task } from 'redux-saga'
import { put, call, select, takeEvery, fork, cancel, all } from 'redux-saga/effects'

import * as DL from './DataLoaderState'
import { loadSuccess, loadFailure, LoadAction, loadStart } from './DataLoaderReducer'
import { isDataValid } from './utils'
import { Meta } from './DataLoader.types';

type IntervalFunction = (meta: Meta) => any

function* load(action: LoadAction) {
  const { value: meta } = action
  if (meta.interval) {
    yield call(runInInterval, fetchData, meta)
  } else {
    yield call(fetchData, meta)
  }
}

function* runInInterval(func: IntervalFunction, meta: Meta): IterableIterator<any> {
  const task: Task = yield fork(func, meta)
  yield call(delay, meta.interval)

  // cancel task if task is still running after interval
  if (task.isRunning()) {
    yield cancel(task)
  }

  if (meta.shouldInterval && meta.shouldInterval(task.result())) {
    yield call(runInInterval, func, meta)
  }
}

function* fetchData(meta: Meta) {
  const name = meta.name
  const key = meta.dataKey(meta.name, meta.params)

  let data = yield select(DL.getDataStorageValue(name, key))
  if (data && isDataValid(data, meta)) {
    return data
  }

  yield put(loadStart(meta))

  try {
    if (meta.dataPersister) {
      data = meta.dataPersister.getItem(key, meta)
    }

    // when it's lazy load(data retrieved from cache, for example, localstorage)
    // then set data to state immediately
    if (data && meta.lazyLoad) {
      yield call(handleData, data, meta, false)
    }

    data = yield call(meta.apiCall, meta.params)
    yield call(handleData, data, meta, true)

    if (meta.dataPersister) {
      yield call(meta.dataPersister.setItem, key, data, meta)
    }

  } catch (e) {
    yield put(loadFailure(meta, e))

    if (meta.onFailure) {
      yield call(meta.onFailure, e)
    }
  }
  return data
}

function* handleData(data: any, meta: Meta, isFresh: boolean) {
  yield put(loadSuccess(meta, data, isFresh))

  if (meta.onSuccess) {
    yield call(meta.onSuccess, data)
  }
}

export function* dataLoaderSagas() {
  yield all([
    takeEvery('@@DATA_LOADER/LOAD', load),
  ])
}
