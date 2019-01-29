# Example 4: localStorage

Persist data with localStorage, so that next time when app initialized, data can be reloaded from localStorage immediately. And make the api call at the same time to fetch fresh data.

## Example 4: localStorage

```typescript
import { LocalStorageDataPersister } from 'universal-data-loader'

const App = () =>
  <DataLoader name="api4" apiCall={mockApi} dataPersister={LocalStorageDataPersister()} lazyLoad={true}>
  {
    (loader: Loader<number>) => {
      if (loader.error) {
        return <div>Error!!!</div>
      }
      return <div>{loader.data ? loader.data : 'No Data!'}-{loader.loading ? 'loading' : ''}</div>
    }
  }
  </DataLoader>
```

