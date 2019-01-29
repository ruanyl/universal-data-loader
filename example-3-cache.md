# Example 3: cache

Configure how much time the data will be valid before making another api call to fetch fresh data

## Example 3: cache

Configure cache expires in 5s, in this example, when clicking the load button, it will only run the api call after 5s the last time data was loaded

```typescript
const App = () =>
  <DataLoader name="somename" apiCall={mockApi} autoLoad={false} cacheExpiresIn={5000}>
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
      return (
        <div>
          {txt}
          <div>last update time: {loader.lastUpdateTime ? new Date(loader.lastUpdateTime).toLocaleString() : 0}</div>
          <button onClick={() => loader.load()}>load data</button>
        </div>
      )
    }
  }
  </DataLoader>
```

