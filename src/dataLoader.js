import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent, createElement } from 'react'
import { keys, zipObj } from 'ramda'

import { DataLoader as DL } from './DataLoaderState'
import { load } from './DataLoaderReducer'

const withDispatch = (configs, dispatch) => configs.map(config => {
  let configWithDispatch = { ...config }
  if (configWithDispatch.onSuccess) {
    configWithDispatch = { ...configWithDispatch, onSuccess: configWithDispatch.onSuccess(dispatch) }
  }
  if (configWithDispatch.onFailure) {
    configWithDispatch = { ...configWithDispatch, onFailure: configWithDispatch.onFailure(dispatch) }
  }
  return configWithDispatch
})

/**
 * Usage:
 * const ComponentWithDataLoader = dataLoader({
 *   users: {
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
 *   this.props.load(apis.users, params)
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
  const uniqueApiKeys = keys(apis)
  const apiArrayWithKey = uniqueApiKeys.map(uniqueApiKey => ({ ...apis[uniqueApiKey], uniqueApiKey }))

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
        this.apisWithDispatch = withDispatch(apiArrayWithKey, props.dispatch)
        this._apis = zipObj(uniqueApiKeys, this.apisWithDispatch)
        this.state = {
          loadedData: props.selectedDataStorage,
        }
      }

      componentWillMount() {
        this.apisWithDispatch.forEach(api => {
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
            apis={this._apis}
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
