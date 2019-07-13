import React from 'react'

import { DATA_LOADER_NAMESPACE, LoaderStatus } from './DataLoaderState'
import { Meta } from './DataLoader.types'
import { isDataValid, all, race } from './utils'

export const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms))

export interface ContextType {
  [DATA_LOADER_NAMESPACE]: DataShape
  load: DataFunc
  init: DataFunc
}

export const DataLoaderContext = React.createContext<ContextType>({
  [DATA_LOADER_NAMESPACE]: {},
  load: function() {},
  init: function() {},
})

export interface DataShape {
  [key: string]: {
    [key: string]: LoaderStatus
  }
}

export type DataFunc = (meta: Meta) => any

export interface DataProviderState {
  [DATA_LOADER_NAMESPACE]: DataShape
}

export class DataProvider extends React.PureComponent<{}, DataProviderState> {

  update = (name: string, key: string, data: Partial<LoaderStatus>) => {
    this.setState(state => {
      let dataStorage = state[DATA_LOADER_NAMESPACE][name] || {}
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
        [DATA_LOADER_NAMESPACE]: {
          ...state[DATA_LOADER_NAMESPACE],
          [name]: dataStorage,
        }
      }
    })
  }

  started = (name: string, key: string) => {
    this.update(name, key, { loading: true })
  }

  succeed = (name: string, key: string, data: any, isFresh: boolean) => {
    let updated: Partial<LoaderStatus> = {
      data,
      error: null,
      lastUpdateTime: Date.now(),
    }

    if (isFresh) {
      updated = {
        ...updated,
        loading: false,
      }
    }

    this.update(name, key, updated)
  }

  failed = (name: string, key: string, error: Error) => {
    this.update(name, key, {
      error,
      loading: false,
      lastErrorTime: Date.now(),
    })
  }

  handleData = (data: any, name: string, key: string, meta: Meta, isFresh: boolean) => {
    this.succeed(name, key, data, isFresh)
    if (meta.onSuccess) {
      meta.onSuccess(data)
    }
  }

  fetchOnce = async (meta: Meta) => {
    const timeout = meta.interval
    const name = meta.name
    const key = meta.dataKey(meta.name, meta.params)

    let result = this.state[DATA_LOADER_NAMESPACE][name] && this.state[DATA_LOADER_NAMESPACE][name][key]

    if (result && isDataValid(result, meta)) {
      return result
    }

    this.started(name, key)
    try {
      if (meta.dataPersister) {
        result = meta.dataPersister.getItem(key, meta)
      }

      if (result && meta.lazyLoad) {
        this.handleData(result, name, key, meta, false)
      }

      if (timeout) {
        // terminate the execution if timeout
        const data = await race({
          timeout: delay(timeout),
          result: meta.apiCall(meta.params),
        })
        if (data.timeout) {
          throw new Error(`Looks like the request of "${name}" is taking too much time. Timeout: ${timeout}ms`)
        }
        result = data.result
      } else {
        result = await meta.apiCall(meta.params)
      }

      this.handleData(result, name, key, meta, true)
      if (meta.dataPersister) {
        meta.dataPersister.setItem(key, result)
      }

    } catch (e) {
      this.failed(name, key, e)
      if (meta.onFailure) {
        meta.onFailure(e)
      }
    }
    return result
  }

  fetchInterval = async (meta: Meta) => {
    // give fetchOnce a third argument to enable timeout
    // this makes sure the fetchInterval function to be executed in interval
    const data = await all({
      timeout: delay(meta.interval as number),
      result: this.fetchOnce(meta),
    });

    if (meta.shouldInterval && meta.shouldInterval(data.result)) {
      await this.fetchInterval(meta)
    }
  }

  load = (meta: Meta) => {
    if (meta.interval) {
      this.fetchInterval(meta)
    } else {
      this.fetchOnce(meta)
    }
  }

  init = (meta: Meta) => {
    this.update(meta.name, meta.dataKey(meta.name, meta.params), {
      data: null,
      loading: false,
      error: null,
    })
  }

  state: DataProviderState = {
    [DATA_LOADER_NAMESPACE]: {},
  }

  render() {
    return (
      <DataLoaderContext.Provider value={{ ...this.state, load: this.load, init: this.init }}>
        {this.props.children}
      </DataLoaderContext.Provider>
    )
  }
}
