import {Meta} from './DataLoaderReducer'

export interface DataPersister {
  getItem: (key: string, meta?: Meta) => any
  setItem: (key: string, value: any, meta?: Meta) => void
  removeItem: (key: string, meta?: Meta) => void
}

export const LocalStorageDataPersister = () => {
  const getItem = (key: string) => {
    const data = localStorage.getItem(key)
    return data && JSON.parse(data)
  }

  const setItem = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const removeItem = (key: string) => {
    localStorage.removeItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem,
  }
}
