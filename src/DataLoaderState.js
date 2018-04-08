import { Map } from 'immutable'
import { createState } from 'create-state-immutable'

export const DataLoader = createState({
  name: 'DataLoader',
  fields: {
    dataStorage: new Map(),
  },
})

const DL = DataLoader

DL.getDataStorageByKeys = keys => state => {
  const dataStorages = {}
  keys.forEach(key => {
    dataStorages[key] = DL.getDataStorageValue(key)(state)
  })
  return dataStorages
}

DL.init = uniqueApiKey => s => {
  let dataStorage = DL.getDataStorageValue(uniqueApiKey)(s)
  if (!dataStorage) {
    dataStorage = {
      data: null,
      loading: false,
      error: null,
    }
  }
  return DL.setDataStorageValue(uniqueApiKey, dataStorage)(s)
}

DL.loadStart = ({ api: { uniqueApiKey } }) => s => {
  let dataStorage = DL.getDataStorageValue(uniqueApiKey)(s)
  if (!dataStorage) {
    dataStorage = {
      data: null,
      loading: true,
      error: null,
    }
  } else {
    dataStorage = { ...dataStorage, loading: true }
  }
  return DL.setDataStorageValue(uniqueApiKey, dataStorage)(s)
}

DL.loadSuccess = ({ uniqueApiKey, data, lastUpdateTime }) => s => {
  let dataStorage = DL.getDataStorageValue(uniqueApiKey)(s)
  dataStorage = {
    ...dataStorage,
    error: null,
    loading: false,
    data,
    lastUpdateTime,
  }
  return DL.setDataStorageValue(uniqueApiKey, dataStorage)(s)
}

DL.loadFailure = ({ uniqueApiKey, error, lastErrorTime }) => s => {
  let dataStorage = DL.getDataStorageValue(uniqueApiKey)(s)
  dataStorage = {
    ...dataStorage,
    error,
    loading: false,
    lastErrorTime,
  }
  return DL.setDataStorageValue(uniqueApiKey, dataStorage)(s)
}
