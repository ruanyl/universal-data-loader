export interface DataPersister {
  getItem: (key: string, meta?: Meta) => any
  setItem: (key: string, value: any, meta?: Meta) => void
  removeItem: (key: string, meta?: Meta) => void
}

export interface MandatoryProps<TParams = any> {
  name: string;
  apiCall: (params?: TParams) => Promise<any>
}

export interface OptionalProps<TData = any, TParams = any> {
  cacheExpiresIn: number
  autoLoad: boolean
  onSuccess: (data?: TData) => any
  onFailure: (error?: Error) => any
  interval: number
  shouldInterval: (data?: TData) => boolean
  params: TParams
  dataPersister: DataPersister
  lazyLoad: boolean
  dataKey: (name: string, params?: TParams) => string
}

export interface Meta<TData = any, TParams = any> extends MandatoryProps<TParams>, OptionalProps<TData, TParams> {}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
