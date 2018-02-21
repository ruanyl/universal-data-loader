import keyMirror from 'key-mirror-nested'
import { createReducer, valueReducer } from 'create-state-immutable'

import { DataLoader as DL } from './DataLoaderState'

export const ActionTypes = keyMirror({
  DATA_LOADER: {
    LOAD: null,
    LOAD_DATA_SUCCESS: null,
    LOAD_DATA_FAILURE: null,
  },
})

export const load = (api, params) => ({
  type: ActionTypes.DATA_LOADER.LOAD,
  value: {
    api,
    params,
  },
})

export const loadSuccess = (uniqueApiKey, data) => ({
  type: ActionTypes.DATA_LOADER.LOAD_DATA_SUCCESS,
  value: {
    uniqueApiKey,
    data,
    lastUpdateTime: Date.now(),
  },
})

export const loadFailure = (uniqueApiKey, error) => ({
  type: ActionTypes.DATA_LOADER.LOAD_DATA_FAILURE,
  value: {
    uniqueApiKey,
    error,
    lastErrorTime: Date.now(),
  },
})

export const dataLoaderReducer = createReducer(DL.create(), {
  [ActionTypes.DATA_LOADER.LOAD]: valueReducer(DL.loadStart),
  [ActionTypes.DATA_LOADER.LOAD_DATA_SUCCESS]: valueReducer(DL.loadSuccess),
  [ActionTypes.DATA_LOADER.LOAD_DATA_FAILURE]: valueReducer(DL.loadFailure),
})
