import { connect } from 'react-redux'

import { load, init } from './DataLoaderReducer'
import { DATA_LOADER_NAMESPACE, GlobalState } from './DataLoaderState'
import { DataLoaderProps, DataLoaderComponent, StateProps, DispatchProps } from './DataLoader';
import { defaultDataKeyFunc } from './utils';

const mapStateToProps = (state: GlobalState, ownProps: DataLoaderProps) => {
  const name = ownProps.name
  const key = ownProps.dataKey ? ownProps.dataKey(name, ownProps.params) : defaultDataKeyFunc(name, ownProps.params)
  return {
    loaderStatus: state[DATA_LOADER_NAMESPACE] && state[DATA_LOADER_NAMESPACE][ownProps.name] && state[DATA_LOADER_NAMESPACE][ownProps.name][key]
  }
}

const mergeProps = (stateProps: StateProps, dispatchProps: DispatchProps, ownProps: DataLoaderProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    dataKey: ownProps.dataKey || defaultDataKeyFunc,
  }
}

export const DataLoader = connect(mapStateToProps, { load, init }, mergeProps)(DataLoaderComponent)
