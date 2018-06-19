import * as React from 'react'
import { DataLoaderContext, DataProviderState } from './DataProvider'
import { DataLoaderComponent, DataLoaderProps } from './DataLoader'
import { DATA_LOADER_NAMESPACE } from './DataLoaderState'

export class DataConsumer<TData = any, TParams = any> extends React.PureComponent<DataLoaderProps<TData, TParams>, {}> {
  render() {
    const { children, ...props } = this.props
    return (
      <DataLoaderContext.Consumer>
        {(state: DataProviderState) => {
          const loaderStatus = state[DATA_LOADER_NAMESPACE][props.name]
          return <DataLoaderComponent {...props} load={state.load} init={state.init} loaderStatus={loaderStatus}>{this.props.children}</DataLoaderComponent>
        }}
      </DataLoaderContext.Consumer>
    )
  }
}

export const DataLoader = DataConsumer
