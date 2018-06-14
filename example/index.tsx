import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { createStore, applyMiddleware, Reducer, Store, AnyAction, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'

import { dataLoaderSagas } from '../src/DataLoaderSagas'
import { DATA_LOADER } from '../src/DataLoader'
import { dataLoaderReducer } from '../src/DataLoaderReducer'
import { App } from './App'

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
  [DATA_LOADER]: dataLoaderReducer,
})

const store = configureStore(reducers, dataLoaderSagas)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
