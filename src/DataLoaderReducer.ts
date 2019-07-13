import { createReducer } from 'reducer-tools'

import * as DL from './DataLoaderState'
import { Meta } from './DataLoader.types'

export const init = (meta: Meta) => ({
  type: '@@DATA_LOADER/INIT',
  value: meta,
})
export type InitAction = ReturnType<typeof init>

export const load = (meta: Meta) => ({
  type: '@@DATA_LOADER/LOAD',
  value: meta,
})
export type LoadAction = ReturnType<typeof load>

export const loadStart = (meta: Meta) => ({
  type: '@@DATA_LOADER/LOAD_START',
  value: meta,
})
export type LoadStartAction = ReturnType<typeof loadStart>

export const loadSuccess = (meta: Meta, data: any, isFresh: boolean) => ({
  type: '@@DATA_LOADER/LOAD_DATA_SUCCESS',
  value: {
    meta,
    data,
    isFresh,
    lastUpdateTime: Date.now(),
  },
})
export type LoadSuccessAction = ReturnType<typeof loadSuccess>

export const loadFailure = (meta: Meta, error: Error) => ({
  type: '@@DATA_LOADER/LOAD_DATA_FAILURE',
  value: {
    meta,
    error,
    lastErrorTime: Date.now(),
  },
})
export type LoadFailureAction = ReturnType<typeof loadFailure>

export const dataLoaderReducer = createReducer({}, {
  '@@DATA_LOADER/INIT': DL.initialized,
  '@@DATA_LOADER/LOAD_START': DL.started,
  '@@DATA_LOADER/LOAD_DATA_SUCCESS': DL.succeed,
  '@@DATA_LOADER/LOAD_DATA_FAILURE': DL.failed,
})
