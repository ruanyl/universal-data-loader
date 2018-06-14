import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import * as React from 'react'

import { LoaderStatus, State } from './DataLoaderState'
import { load, init, Meta } from './DataLoaderReducer'

export const DATA_LOADER = '@@dataloader'

interface Store {
  [key: string]: State;
}

export interface OwnProps<TData = any, TParams = any> extends Meta<TData, TParams> {
  name: string;
  children: (loaderStatus: LoaderStatus<TData>) => React.ReactNode;
}

export interface StateProps<TData = any> {
  loaderStatus: LoaderStatus<TData>;
}

export interface DispatchProps<TData = any, TParams = any> {
  load: (name: string, meta: Meta<TData, TParams>) => AnyAction;
  init: (name: string) => AnyAction;
}

class DataLoaderComponent<TData = any, TParams = any> extends React.PureComponent<OwnProps<TData, TParams> & StateProps<TData> & DispatchProps<TData, TParams>, {}> {
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
    if (this.props.loaderStatus) {
      return this.props.children(this.props.loaderStatus)
    }
    return null
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  loaderStatus: state[DATA_LOADER] && state[DATA_LOADER][ownProps.name]
})

export const DataLoader = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, { load, init })(DataLoaderComponent)
