# Example 1: fetch data manually

Stop auto load data when component mount

## Example 1: fetch data manually

`DataLoader` component will start to fetch data automatically by default\(when component mount\). You can disabled auto load and start to load data manually, for example, by clicking a button.

```typescript
const App = () =>  
  <DataLoader name="AnUniqueName" apiCall={mockApi} autoLoad={false}>
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

