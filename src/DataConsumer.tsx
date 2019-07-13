import * as React from 'react'
import { DataLoaderContext, ContextType, DataFunc, DataShape } from './DataProvider'
import { DataLoaderComponent, DataLoaderProps } from './DataLoader'
import { DATA_LOADER_NAMESPACE, LoaderStatus } from './DataLoaderState'

export const defaultDataKeyFunc = () => 'default'

export class DataConsumer<TData = any, TParams = any> extends React.PureComponent<DataLoaderProps<TData, TParams>, {}> {
  render() {
    const { children, ...props } = this.props
    return (
      <DataLoaderContext.Consumer>
        {(state: ContextType) => {
          const dataKey = props.dataKey || defaultDataKeyFunc
          const key = dataKey(props.name, props.params)

          let loaderStatus: LoaderStatus | undefined = undefined
          // exclude 'load' and 'init' function which passed from context
          if (typeof state[DATA_LOADER_NAMESPACE] !== 'function') {
            loaderStatus = (state[DATA_LOADER_NAMESPACE] as DataShape)[props.name] && (state[DATA_LOADER_NAMESPACE] as DataShape)[props.name][key]
          }

          return (
            <DataLoaderComponent
              {...props}
              dataKey={dataKey}
              load={state.load as DataFunc}
              init={state.init as DataFunc}
              loaderStatus={loaderStatus}
            >
              {this.props.children}
            </DataLoaderComponent>
          )
        }}
      </DataLoaderContext.Consumer>
    )
  }
}

export const DataLoader = DataConsumer
