## React Data Loader
Makes it easy to load data for your components. Config loader's behaviour such as: cache, interval. It works with [redux](https://github.com/reduxjs/redux) + [redux-saga](https://github.com/redux-saga/redux-saga) or the new [React Context API](https://reactjs.org/docs/context.html)

### With React new Context API
```javascript
import { DataProvider, DataLoader } from 'universal-data-loader'

// A function returns Promise
const mockApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Math.random()), 1000)
  })
}

// It requires function as a child
class App extends React.PureComponent {
  render() {
    return (
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
  }
}

ReactDOM.render(
  <DataProvider>
    <App />
  </DataProvider>,
  document.getElementById('root')
)
```

### Config With Redux
Use universal-data-loader with [redux-saga](https://github.com/redux-saga/redux-saga), please refer to [redux-saga](https://github.com/redux-saga/redux-saga) to see how to config the redux with redux-saga

```javascript
import {
  dataLoaderSagas, 
  dataLoaderReducer, 
  DATA_LOADER_NAMESPACE, 
  ReduxDataLoader as DataLoader 
} from 'universal-data-loader'

// combine dataLoaderReducer with your own reducers and give it the name: DATA_LOADER_NAMESPACE
const reducers = combineReducers({
  [DATA_LOADER_NAMESPACE]: dataLoaderReducer,
})

// run sagas with dataLoaderSagas
sagaMiddleware.run(dataLoaderSagas)

// Use DataLoader FaCC
class App extends React.PureComponent {
  render() {
    return (
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
  }
}
```

##### Config DataLoader
`ReduxDataLoader` and `DataLoader` component accept the same props and behave the same.

Accept props:
```typescript
{
  apiCall: () => Promise; // A function returns a promise, which is usually and api call
  name: string; // a unique name for each promise
  cacheExpiresIn?: number; // (optinal) - A number which indicate how much time(ms) the cache will live. No more request if cache is valid. By default is 0 which means no cache
  autoLoad?: boolean; // (option) default true, automatically start to load data when component mount
  onSuccess?: (data?: TData) => any; // (optinal) callback function when load succeed
  onFailure?: (error?: Error) => any; // (optional) callback function when load failed
  interval?: number; // (optinal) if > 0, it will call the `apiCall` every <interval> ms
  shouldInterval?: (data?: TData) => boolean; // (optinal) provides a way to stop interval
  params?: TParams; // (optional) the parameters passed to `apiCall`
}
```

Data passed to the child(function as a child):
```typescript
{
  data: TData | null;       // the data return from `apiCall`
  loading: boolean;         // the loading status, false or true
  error: Error | null;      // the error status, throw by apiCall if error happens
  load: Function;           // used to manually start the data loader
  lastUpdateTime?: number;  // the timestamp of last successful call
  lastErrorTime?: number;   // the timestamp of last failed call
}
```

#### Config cache
Makes the cache valid for 5s

```javascript
<DataLoader name="randomNumber" apiCall={mockApi} cacheExpiresIn={5000}>
{(loader) => ...}
</DataLoader>
```

#### Config interval
Make a call every 3s

```javascript
<DataLoader name="randomNumber" apiCall={mockApi} interval={3000}>
{() => ...}
</DataLoader>
```

#### Manually start a loader
Set `autoLoad=false`, and call the `load` function when needed

```javascript
<DataLoader name="randomNumber" apiCall={mockApi} autoLoad={false}>
{
  (loader: Loader<string>) => {
    let txt
    if (loader.loading) {
      txt = 'loading...'
    } else if (loader.error) {
      txt = 'error!!!'
    } else if (loader.data) {
      txt = loader.data
    } else {
      txt = 'No Data!'
    }
    return <div>{txt} <button onClick={() => loader.load()}>load data</button></div>
  }
}
</DataLoader>

```
