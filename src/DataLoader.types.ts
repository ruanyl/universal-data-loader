export interface DataPersister {
  getItem: (key: string, meta?: Meta) => any
  setItem: (key: string, value: any, meta?: Meta) => void
  removeItem: (key: string, meta?: Meta) => void
}

export interface Action {
  type: string
  value?: any
  meta?: any
}

export interface Meta<TData = any, TParams = any> {
  apiCall: (params?: TParams) => Promise<any>
  cacheExpiresIn?: number
  autoLoad?: boolean
  onSuccess?: (data?: TData) => any
  onFailure?: (error?: Error) => any
  interval?: number
  shouldInterval?: (data?: TData) => boolean
  params?: TParams
  dataPersister?: DataPersister
  lazyLoad?: boolean
}

