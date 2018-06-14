import * as React from 'react'
import { DataLoader } from '../src/DataLoader'
import { LoaderStatus } from '../src/DataLoaderState'

const mockApi1 = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('data'), 1000)
  })
}

export class App extends React.PureComponent<any, any> {
  render() {
    return (
      <div>
        <DataLoader name="test" apiCall={mockApi1}>
        {
          (loaderStatus: LoaderStatus<string>) => {
            console.log(loaderStatus)
            if (loaderStatus.loading || loaderStatus.error) {
              return <div>loading</div>
            }
            return <div>{loaderStatus.data}</div>
          }
        }
        </DataLoader>
      </div>
    )
  }
}
