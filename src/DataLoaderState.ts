import {InitAction, LoadStartAction, LoadSuccessAction, LoadFailureAction} from './DataLoaderReducer';

export const DATA_LOADER_NAMESPACE = '@@dataloader'

export interface GlobalState {
  [DATA_LOADER_NAMESPACE]: State
}

export interface LoaderStatus<TData = any> {
  data: TData | null
  loading: boolean
  error: Error | null
  lastUpdateTime?: number
  lastErrorTime?: number
}

export interface State {
  [key: string]: {
    [key: string]: LoaderStatus
  }
}

export const getDataStorageValue = (name: string, key: string) => (state: GlobalState) => {
  if (state && state[DATA_LOADER_NAMESPACE] && state[DATA_LOADER_NAMESPACE][name]) {
    return state[DATA_LOADER_NAMESPACE][name][key]
  }
  return undefined
}

export const update = (name: string, key: string, state: State, data: Partial<LoaderStatus>): State => {
  let dataStorage = state[name] || {}
  // initialize with default values if data NOT exist
  if (!dataStorage[key]) {
    dataStorage = {
      ...dataStorage,
      [key]: {
        data: null,
        loading: false,
        error: null,
      }
    }
  }

  // update the state with data
  dataStorage = {
    ...dataStorage,
    [key]: {
      ...dataStorage[key],
      ...data,
    }
  }

  return {
    ...state,
    [name]: dataStorage
  }
}

export const initialized = (state: State, action: InitAction) => {
  const name = action.value.name
  const key = action.value.dataKey(name, action.value.params)
  return update(name, key, state, {
    data: null,
    loading: false,
    error: null,
  })
}

export const started = (state: State, action: LoadStartAction) => {
  const name = action.value.name
  const key = action.value.dataKey(name, action.value.params)
  return update(name, key, state, { loading: true })
}

export const succeed = (state: State, action: LoadSuccessAction) => {
  const name = action.value.meta.name
  const key = action.value.meta.dataKey(name, action.value.meta.params)

  let updated: Partial<LoaderStatus> = {
    data: action.value.data,
    error: null,
    lastUpdateTime: action.value.lastUpdateTime,
  }

  if (action.value.isFresh) {
    updated = {
      ...updated,
      loading: false,
    }
  }

  return update(name, key, state, updated)
}

export const failed = (state: State, action: LoadFailureAction) => {
  const name = action.value.meta.name
  const key = action.value.meta.dataKey(name, action.value.meta.params)

  return update(name, key, state, {
    error: action.value.error,
    loading: false,
    lastErrorTime: action.value.lastErrorTime,
  })
}
