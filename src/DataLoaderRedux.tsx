import { connect } from 'react-redux'

import { load, init } from './DataLoaderReducer'
import { State, DATA_LOADER_NAMESPACE } from './DataLoaderState'
import { DataLoaderProps, DataLoaderComponent, StateProps, DispatchProps } from './DataLoader';

interface Store {
  [key: string]: State;
}

const mapStateToProps = (state: Store, ownProps: DataLoaderProps) => ({
  loaderStatus: state[DATA_LOADER_NAMESPACE] && state[DATA_LOADER_NAMESPACE][ownProps.name]
})

export const DataLoader = connect<StateProps, DispatchProps, DataLoaderProps>(mapStateToProps, { load, init })(DataLoaderComponent)
