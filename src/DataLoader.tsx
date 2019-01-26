import React from 'react'
import { connect, Omit } from 'react-redux'

import { LoaderStatus, State, DATA_LOADER_NAMESPACE } from './DataLoaderState'
import { load, init } from './DataLoaderReducer'
import { Meta } from './DataLoader.types';

interface Store {
  [key: string]: State;
}

export interface Loader<TData = any, TParams = any> extends LoaderStatus<TData> {
  load: (params: TParams) => any;
}

export interface DataLoaderProps<TData = any, TParams = any> extends Omit<Meta<TData, TParams>, 'params'> {
  name: string;
  children: (loader: Loader<TData, TParams>) => React.ReactNode;
}

export interface StateProps<TData = any> {
  loaderStatus: LoaderStatus<TData>;
}

export interface DispatchProps<TData = any, TParams = any> {
  load: (name: string, meta: Meta<TData, TParams>) => any;
  init: (name: string) => any;
}

export class DataLoaderComponent<TData = any, TParams = any> extends React.PureComponent<DataLoaderProps<TData, TParams> & StateProps<TData> & DispatchProps<TData, TParams>, {}> {
  static defaultProps = {
    cacheExpiresIn: 0,
    autoLoad: true,
    onSuccess: () => true,
    onFailure: () => true,
    shouldInterval: () => true,
  }

  componentWillMount() {
    const { name, load, init, ...meta } = this.props;
    if (meta.autoLoad) {
      load(name, meta)
    } else {
      init(name)
    }
  }

  render() {
    const { name, load, ...meta } = this.props
    if (this.props.loaderStatus) {
      return this.props.children({ ...this.props.loaderStatus, load: (params: TParams) => load(name, { ...meta, params }) })
    }
    return null
  }
}

const mapStateToProps = (state: Store, ownProps: DataLoaderProps) => ({
  loaderStatus: state[DATA_LOADER_NAMESPACE] && state[DATA_LOADER_NAMESPACE][ownProps.name]
})

export const DataLoaderRedux = connect<StateProps, DispatchProps, DataLoaderProps>(mapStateToProps, { load, init })(DataLoaderComponent)
