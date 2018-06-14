export interface Dict {
  [key: string]: any;
}

export interface SuccessPayload {
  key: string;
  data: any;
  lastUpdateTime: number;
}

export interface FailurePayload {
  key: string;
  error: Error;
  lastErrorTime: number;
}

export interface LoaderStatus<TData = any> {
  data: TData;
  loading: boolean;
  error: Error;
  lastUpdateTime: number | undefined;
  lastErrorTime: number | undefined;
}

export interface State {
  [key: string]: LoaderStatus;
}

export const getDataStorageValue = (key: string) => (state: Dict) => {
  if (state) {
    return state[key]
  }
  return undefined
}

export const getDataStorageByKeys = (keys: string[]) => (state: Dict) => {
  const dataStorages: Dict = {}
  keys.forEach(key => {
    dataStorages[key] = state[key]
  })
  return dataStorages
}

export const init = (key: string) => (state: Dict) => {
  let dataStorage = state[key]
  if (!dataStorage) {
    dataStorage = {
      data: null,
      loading: false,
      error: null,
    }
  }
  return { ...state, [key]: dataStorage }
}

export const loadStart = (key: string) => (state: Dict) => {
  let dataStorage = state[key]
  if (!dataStorage) {
    dataStorage = {
      data: null,
      loading: true,
      error: null,
    }
  } else {
    dataStorage = { ...dataStorage, loading: true }
  }
  return { ...state, [key]: dataStorage }
}

export const loadSuccess = (payload: SuccessPayload) => (state: Dict) => {
  let dataStorage = state[payload.key]
  if (dataStorage) {
    dataStorage = {
      ...dataStorage,
      error: null,
      loading: false,
      data: payload.data,
      lastUpdateTime: payload.lastUpdateTime,
    }
    return { ...state, [payload.key]: dataStorage }
  }
  return state
}

export const loadFailure = (payload: FailurePayload) => (state: Dict) => {
  let dataStorage = state[payload.key]
  if (dataStorage) {
    dataStorage = {
      ...dataStorage,
      error: payload.error,
      loading: false,
      lastErrorTime: payload.lastErrorTime,
    }
    return { ...state, [payload.key]: dataStorage }
  }
  return state
}
