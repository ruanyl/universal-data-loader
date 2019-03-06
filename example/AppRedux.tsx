import * as React from 'react'
import { LocalStorageDataPersister, Loader } from 'universal-data-loader'
import { DataLoaderRedux as DataLoader } from 'universal-data-loader/redux'

const mockApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Math.random()), 1000)
  })
}

export class App extends React.PureComponent<any, any> {
  render() {
    return (
      <div>
        <h3>Example 1: auto load when component mount</h3>
        <DataLoader name="api1" apiCall={mockApi}>
        {
          (loader: Loader<number>) => {
            if (loader.loading) {
              return <div>loading...</div>
            }
            if (loader.error) {
              return <div>Error!!!</div>
            }
            return <div>{loader.data ? loader.data : 'No Data!'}</div>
          }
        }
        </DataLoader>
        <hr />
        <h3>Example 2: load manually</h3>
        <DataLoader name="api2" apiCall={mockApi} autoLoad={false}>
        {
          (loader: Loader<string>) => {
            let txt
            if (loader.loading) {
              txt = 'loading...'
            } else if (loader.error) {
              txt = 'error!!!'
            } else if (loader.data) {
              txt = loader.data
            } else {
              txt = 'No Data!'
            }
            return <div>{txt} <button onClick={() => loader.load()}>load data</button></div>
          }
        }
        </DataLoader>
        <hr />
        <h3>Example 2.1: load data from cached data in example 2</h3>
        <DataLoader name="api2" apiCall={mockApi} autoLoad={false}>
        {
          (loader: Loader<string>) => {
            let txt
            if (loader.data) {
              txt = loader.data
            } else {
              txt = 'No Data!'
            }
            return <div>{txt}</div>
          }
        }
        </DataLoader>
        <hr />
        <h3>Example 2.2: cache data for 5s, only load new data after 5s</h3>
        <DataLoader name="api2.2" apiCall={mockApi} autoLoad={false} cacheExpiresIn={5000}>
        {
          (loader: Loader<string>) => {
            let txt
            if (loader.loading) {
              txt = 'loading...'
            } else if (loader.error) {
              txt = 'error!!!'
            } else if (loader.data) {
              txt = loader.data
            } else {
              txt = 'No Data!'
            }
            return (
              <div>
                {txt}
                <div>last update time: {loader.lastUpdateTime ? new Date(loader.lastUpdateTime).toLocaleString() : 0}</div>
                <button onClick={() => loader.load()}>load data</button>
              </div>
            )
          }
        }
        </DataLoader>
        <hr />
        <h3>Example 3: load every 3s</h3>
        <DataLoader name="api3" apiCall={mockApi} interval={3000}>
        {
          (loader: Loader<number>) => {
            if (loader.loading || loader.error) {
              return <div>loading...</div>
            }
            return <div>{loader.data}</div>
          }
        }
        </DataLoader>
        <hr/>

        <h3>Example 4: with localStorage</h3>
        <DataLoader name="api4" apiCall={mockApi} dataPersister={LocalStorageDataPersister()} lazyLoad={true}>
        {
          (loader: Loader<number>) => {
            if (loader.error) {
              return <div>Error!!!</div>
            }
            return <div>{loader.data ? loader.data : 'No Data!'}-{loader.loading ? 'loading' : ''}</div>
          }
        }
        </DataLoader>
      </div>
    )
  }
}
