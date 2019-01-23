import { createReducer, valueReducer } from 'reducer-tools'

import * as DL from './DataLoaderState'
import { Action, Meta } from './DataLoader.types'

export type DataLoaderReducer = (s: any, a: Action) => any

export interface LoadAction extends Action {
  value: string
  meta: Meta
}

export const init = (key: string) => ({
  type: '@@DATA_LOADER/INIT',
  value: key,
})

export const load = (key: string, meta: Meta) => ({
  type: '@@DATA_LOADER/LOAD',
  value: key,
  meta,
})

export const loadStart = (key: string) => ({
  type: '@@DATA_LOADER/LOAD_START',
  value: key,
})

export const loadSuccess = (key: string, data: any, isFresh: boolean) => ({
  type: '@@DATA_LOADER/LOAD_DATA_SUCCESS',
  value: {
    key,
    data,
    isFresh,
    lastUpdateTime: Date.now(),
  },
})

export const loadFailure = (key: string, error: Error) => ({
  type: '@@DATA_LOADER/LOAD_DATA_FAILURE',
  value: {
    key,
    error,
    lastErrorTime: Date.now(),
  },
})

export const dataLoaderReducer: DataLoaderReducer = createReducer({}, {
  '@@DATA_LOADER/INIT': valueReducer(DL.initialized),
  '@@DATA_LOADER/LOAD_START': valueReducer(DL.started),
  '@@DATA_LOADER/LOAD_DATA_SUCCESS': valueReducer(DL.succeed),
  '@@DATA_LOADER/LOAD_DATA_FAILURE': valueReducer(DL.failed),
})
