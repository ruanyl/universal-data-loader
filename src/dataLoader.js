import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent, createElement } from 'react'
import { values } from 'ramda'

import { DataLoader as DL } from './DataLoaderState'
import { load } from './DataLoaderReducer'

const withDispatch = (apis, dispatch) => {
  const apisWithDispatch = {}
  Object.keys(apis).forEach(key => {
    apisWithDispatch[key] = { ...apis[key] }

    if (apisWithDispatch[key].onSuccess) {
      apisWithDispatch[key].onSuccess = apisWithDispatch[key].onSuccess(dispatch)
    }
    if (apis[key].onFailure) {
      apisWithDispatch[key].onFailure = apisWithDispatch[key].onFailure(dispatch)
    }
  })
  return apisWithDispatch
}

/**
 * Usage:
 * const ComponentWithDataLoader = dataLoader({
 *   getCompanyTags: {
 *     uniqueApiKey: 'anUniqueName',
 *     apiCall: getCompanyTags, // the function which returns Promise
 *     cacheExpiresIn: 10000, // if cache expires, make the request again
 *     autoLoad: true, // start to load data when componentWillMount
 *     onSuccess: dispatch => data => { // doing something with the `data` returned by apiCall
 *       console.log(data);
 *       const tags = tagsFromResult(data.res);
 *       dispatch(companyTagsUpdated(tags));
 *     },
 *     onFailure: dispatch => error => {
 *      // do something when error
 *     }
 *   }
 * })(Component)
 *
 * In the Component, you can do for example:
 *
 * onButtonClick = (params) => {
 *   this.props.load(apis.getCompanyTags, params)
 * }
 *
 * Props passed to Component
 * {
 *   loadedData: {
 *     [uniqueApiKey]: {
 *       loading: bool,
 *       data: any,
 *       error: any,
 *       lastUpdateTime: Date
 *     }
 *   },
 *   load: func, // load action creator bind with dispatch
 *   apis: object, // api config object passed to dataLoader()
 * }
 */
export const dataLoader = (apis = {}) => {
  const uniqueApiKeys = values(apis).map(api => api.uniqueApiKey)
  const mapStateToProps = createStructuredSelector({
    selectedDataStorage: DL.getDataStorageByKeys(uniqueApiKeys),
  })

  const connector = connect(mapStateToProps, dispatch => {
    const boundActionCreators = bindActionCreators({ load }, dispatch)
    const allActionProps = { ...boundActionCreators, dispatch }
    return allActionProps
  })

  return WrappedComponent => {
    class DataLoaderComponent extends PureComponent {

      static propTypes = {
        dispatch: React.PropTypes.func,
        load: React.PropTypes.func,
        passedProps: React.PropTypes.object,
        selectedDataStorage: React.PropTypes.object,
      }

      constructor(props) {
        super(props)
        this.apisWithDispatch = withDispatch(apis, props.dispatch)
        this.state = {
          loadedData: props.selectedDataStorage,
        }
      }

      componentWillMount() {
        values(this.apisWithDispatch).forEach(api => {
          if (api.autoLoad === true) {
            this.props.load(api)
          }
        })
      }

      componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.selectedDataStorage).some(k => nextProps.selectedDataStorage[k] !== this.props.selectedDataStorage[k])) {
          this.setState({ loadedData: nextProps.selectedDataStorage })
        }
      }

      render() {
        return (
          <WrappedComponent
            {...this.props.passedProps}
            apis={this.apisWithDispatch}
            loadedData={this.state.loadedData}
            load={this.props.load}
          />
        )
      }
    }

    DataLoaderComponent.WrappedComponent = WrappedComponent

    const ConnectedDataLoader = connector(DataLoaderComponent)

    return ({ ...props }) => createElement(ConnectedDataLoader, {
      ...props,
      passedProps: props,
    })
  }
}
