import { createReducer, valueReducer } from 'reducer-tools'

import * as DL from './DataLoaderState'

export interface Action {
  type: string;
  value?: any;
  meta?: any;
}

export type DataLoaderReducer = (s: any, a: Action) => any

export interface Meta<TData = any, TParams = any> {
  apiCall?: (params?: TParams) => Promise<any>;
  cacheExpiresIn?: number;
  autoLoad?: boolean;
  onSuccess?: (data: TData) => any;
  onFailure?: (error: Error) => any;
  interval?: number;
  shouldInterval?: (data: TData) => boolean;
  params?: TParams;
}

export interface LoadAction extends Action {
  value: string;
  meta: Meta;
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

export const loadSuccess = (key: string, data: any) => ({
  type: '@@DATA_LOADER/LOAD_DATA_SUCCESS',
  value: {
    key,
    data,
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
  '@@DATA_LOADER/INIT': valueReducer(DL.init),
  '@@DATA_LOADER/LOAD_START': valueReducer(DL.loadStart),
  '@@DATA_LOADER/LOAD_DATA_SUCCESS': valueReducer(DL.loadSuccess),
  '@@DATA_LOADER/LOAD_DATA_FAILURE': valueReducer(DL.loadFailure),
})
