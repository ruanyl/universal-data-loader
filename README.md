# Introduction

universal-data-loader is a library that aims to make data fetching easier to manage in React application. You can easily manage cache, integrate with data persisters\(such as localStorage\), configure fetching behaviours. It works with [redux](https://github.com/reduxjs/redux) + [redux-saga](https://github.com/redux-saga/redux-saga) or the new [React Context API](https://reactjs.org/docs/context.html)

## Getting started

### Install

```text
$ npm i universal-data-loader --save
```

### Usage Example  <a id="usage-example"></a>

#### step 1: say you have an api call

```typescript
// an api call is simply a function that returns promise
type ApiCall = (args: any) => Promise<any>;
```

Let's create a mock api call which returns a random number in 1000ms

```typescript
const mockApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Math.random()), 1000)
  })
}
```

#### step 2: use DataLoader component

```typescript
import { DataLoader } from 'universal-data-loader'
// if you are using redux and redux-saga, import this one:
import { ReduxDataLoader as DataLoader } from 'universal-data-loader'

export const App = () =>
  <DataLoader name="randomNumber" apiCall={mockApi}>
  {
    (loader) => {
      if (loader.loading) {
        return <div>loading...</div>
      }
      if (loader.error) {
        return <div>Error!!!</div>
      }
      return <div>{loader.data ? loader.data : 'No Data!'}</div>
    }
  }
  </DataLoader>
```

The `loader` that child function gets as parameter:

```typescript
// data: the data you get from the api call
// loading: the load status, `true` when api call is running
// error: the Error throw from api call
// lastUpdateTime: the last time that data was loaded from api call
// lastErrorTime: the last time that data fetching throw an error
// load: call this function to manually start to load data
interface Loader<T = any> {
  data: T | null
  loading: boolean
  error: Error | null
  lastUpdateTime?: number
  lastErrorTime?: number
  load: () => void;
}
```

#### Step 3: If you are using React &gt;= 16.4.0 with the new Context API

```typescript
import { DataProvider } from 'universal-data-loader'

ReactDOM.render(
  <DataProvider>
    <App />
  </DataProvider>,
  document.getElementById('root')
)
```

#### \(Step 3\): If you are using redux and redux-saga

```typescript
import {
  dataLoaderSagas, 
  dataLoaderReducer, 
  DATA_LOADER_NAMESPACE, 
} from 'universal-data-loader'

// combine dataLoaderReducer with your own reducers and give it the name: DATA_LOADER_NAMESPACE
const reducers = combineReducers({
  [DATA_LOADER_NAMESPACE]: dataLoaderReducer,
})

// run sagas with dataLoaderSagas
sagaMiddleware.run(dataLoaderSagas)
```

