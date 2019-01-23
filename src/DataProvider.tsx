import React from 'react'

import { DATA_LOADER_NAMESPACE, LoaderStatus } from './DataLoaderState'
import { Meta } from './DataLoaderReducer'
import { isDataValid, all, race } from './utils'

export const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms))

export const DataLoaderContext = React.createContext({
  [DATA_LOADER_NAMESPACE]: {}
})

export interface DataProviderState {
  [DATA_LOADER_NAMESPACE]: {
    [key: string]: LoaderStatus;
  };
  load: (name: string, meta: Meta) => any;
  init: (name: string) => any;
}

export class DataProvider extends React.PureComponent<{}, DataProviderState> {

  started = (name: string) => {
    this.setState(state => {
      let dataStorage = state[DATA_LOADER_NAMESPACE][name]
      if (!dataStorage) {
        dataStorage = {
          data: null,
          loading: true,
          error: null,
        }
      }

      return {
        ...state,
        [DATA_LOADER_NAMESPACE]: {
          ...state[DATA_LOADER_NAMESPACE],
          [name]: {
            ...dataStorage,
            loading: true,
          }
        }
      }
    })
  }

  succeed = (name: string, data: any) => {
    this.setState(state => {
      let dataStorage = state[DATA_LOADER_NAMESPACE][name]
      if (dataStorage) {
        dataStorage = {
          ...dataStorage,
          error: null,
          loading: false,
          data,
          lastUpdateTime: Date.now(),
        }
        return {
          ...state,
          [DATA_LOADER_NAMESPACE]: {
            ...state[DATA_LOADER_NAMESPACE],
            [name]: {
              ...dataStorage,
            }
          }
        }
      }
      return state
    })
  }

  failed = (name: string, error: Error) => {
    this.setState(state => {
      let dataStorage = state[DATA_LOADER_NAMESPACE][name]
      if (dataStorage) {
        dataStorage = {
          ...dataStorage,
          error,
          loading: false,
          lastErrorTime: Date.now(),
        }
        return {
          ...state,
          [DATA_LOADER_NAMESPACE]: {
            ...state[DATA_LOADER_NAMESPACE],
            [name]: {
              ...dataStorage,
            }
          }
        }
      }
      return state
    })
  }

  fetchOnce = async (name: string, meta: Meta, timeout?: number) => {
    let result = this.state[DATA_LOADER_NAMESPACE][name]
    if (isDataValid(result, meta)) {
      return result
    }

    this.started(name)
    try {
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

      this.succeed(name, result)

      if (meta.onSuccess) {
        meta.onSuccess(result)
      }
    } catch (e) {
      this.failed(name, e)
      if (meta.onFailure) {
        meta.onFailure(e)
      }
    }
    return result
  }

  fetchInterval = async (name: string, meta: Meta) => {
    // give fetchOnce a third argument to enable timeout
    // this makes sure the fetchInterval function to be executed in interval
    const data = await all({
      timeout: delay(meta.interval as number),
      result: this.fetchOnce(name, meta, meta.interval),
    });

    if (meta.shouldInterval && meta.shouldInterval(data.result)) {
      await this.fetchInterval(name, meta)
    }
  }

  load = (name: string, meta: Meta) => {
    if (meta.interval) {
      this.fetchInterval(name, meta)
    } else {
      this.fetchOnce(name, meta)
    }
  }

  init = (name: string) => {
    this.setState(state => ({
      ...state,
      [DATA_LOADER_NAMESPACE]: {
        ...state[DATA_LOADER_NAMESPACE],
        [name]: {
          data: null,
          loading: false,
          error: null,
        }
      }
    }))
  }

  state: DataProviderState = {
    [DATA_LOADER_NAMESPACE]: {},
    load: this.load,
    init: this.init,
  }

  render() {
    return (
      <DataLoaderContext.Provider value={this.state}>
        {this.props.children}
      </DataLoaderContext.Provider>
    )
  }
}
