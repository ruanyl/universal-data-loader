import React from 'react'

import { LoaderStatus } from './DataLoaderState'
import { Meta, MandatoryProps, OptionalProps } from './DataLoader.types';

export interface Loader<TData = any> extends LoaderStatus<TData> {
  load: () => any;
}

export interface DataLoaderProps<TData = any, TParams = any> extends MandatoryProps<TParams>, Partial<OptionalProps<TData, TParams>> {
  children: (loader: Loader<TData>) => React.ReactNode;
}

export interface DataLoaderComponentProps<TData = any, TParams = any> extends MandatoryProps<TParams>, OptionalProps<TData, TParams> {
  children: (loader: Loader<TData>) => React.ReactNode;
}

export interface StateProps<TData = any> {
  loaderStatus?: LoaderStatus<TData>;
}

export interface DispatchProps<TData = any, TParams = any> {
  load: (meta: Meta<TData, TParams>) => any;
  init: (meta: Meta<TData, TParams>) => any;
}

export class DataLoaderComponent<TData = any, TParams = any> extends React.PureComponent<DataLoaderComponentProps<TData, TParams> & StateProps<TData> & DispatchProps<TData, TParams>, {}> {
  static defaultProps = {
    cacheExpiresIn: 0,
    autoLoad: true,
    onSuccess: () => true,
    onFailure: () => true,
    interval: 0,
    shouldInterval: () => true,
    params: undefined,
    dataPersister: undefined,
    lazyLoad: false,
  }

  componentWillMount() {
    const { load, init, loaderStatus, children, ...meta } = this.props;
    if (meta.autoLoad) {
      load(meta)
    } else {
      init(meta)
    }
  }

  render() {
    const { load, init, loaderStatus, children, ...meta } = this.props
    if (loaderStatus) {
      return children({ ...loaderStatus, load: () => load(meta) })
    }
    return null
  }
}
