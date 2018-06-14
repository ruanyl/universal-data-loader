import * as React from 'react'
import { DataLoader, Loader } from '../src/DataLoader'
import { LoaderStatus } from '../src/DataLoaderState'

const mockApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Math.random()), 1000)
  })
}

export class App extends React.PureComponent<any, any> {
  render() {
    return (
      <div>
        <p>Example 1: auto load when component mount</p>
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
        <p>Example 2: load manually</p>
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
        <p>Example 3: load every 3s</p>
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
      </div>
    )
  }
}
