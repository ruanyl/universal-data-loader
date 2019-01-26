---
description: Fetch data in an interval
---

# Example 2: interval

#### Configure to automatically fetch data every 3s

```typescript
const App = () =>
  <DataLoader name="api3" apiCall={mockApi} interval={3000}>
  {
    (loader: Loader<number>) => {
      if (loader.loading || loader.error) {
        return <div>loading...</div>
      }
      return <div>{loader.data}</div>
    }
  }
  </DataLoader>
```

