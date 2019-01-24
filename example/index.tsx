import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { createStore, applyMiddleware, Reducer, Store, AnyAction, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'

import { dataLoaderSagas } from '../src/DataLoaderSagas'
import { DATA_LOADER_NAMESPACE } from '../src/DataLoaderState'
import { dataLoaderReducer } from '../src/DataLoaderReducer'
import { App as AppRedux } from './AppRedux'
import { App as AppContext } from './AppContext'
import { DataProvider } from '../src/DataProvider'

const sagaMiddleware = createSagaMiddleware()
const loggerMiddleware = createLogger()

let middlewares: any[] = [sagaMiddleware, loggerMiddleware]

export const configureStore = (reducers: Reducer, sagas: any, preloadedState: any = undefined): Store<any, AnyAction> => {
  const store = createStore(
    reducers,
    preloadedState,
    applyMiddleware(...middlewares)
  )
  sagaMiddleware.run(sagas)
  return store
}

const reducers = combineReducers({
  [DATA_LOADER_NAMESPACE]: dataLoaderReducer,
})

const store = configureStore(reducers, dataLoaderSagas)

ReactDOM.render(
  <Provider store={store}>
    <DataProvider>
      <div>
        <h2>With React new Context API</h2>
        <AppContext />
      </div>
    </DataProvider>
  </Provider>,
  document.getElementById('root')
)
