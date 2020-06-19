## Cache examples in VTEX IO

This app shows how to use some client cache features from VTEX IO Node Clients. They can be visualizad on Jaeger for better understanding on what's happening.

This app exposes routes for populating cache with random data and routes for testing the cached calls.

The flow to use this app is: Call the route to populate the cache -> Call the route to test the cache. The cache entries generated on a previous populate cache route call will be called when testing the cache.

It's important to note though the following:
```
CALL populate-cache -> Added 8 entries to cahce
CALL test-cache -> Will call the previous 8 entries added to cache
CALL populate-cache -> Added 8 entries to cache, without cleaning it, so now possibly there will be 16 entries in the cache (depends on the storage management)
CALL test-cache -> Will call the previous 8 entries added to cache
```

The routes to populate cache are:
```
/_v/populate-cache/disk
/_v/populate-cache/memory
```
They accept options as query parameters:
```
entries: number [default 8]
The number of entries to populate the cache with in this call.

concurrent: boolean [default true]
Make http calls concurrently when populating the cache
```
When populating, the data generation route will answer random status codes, you can change each status code probability [here](./node/handlers/dataProvider.ts)

Also, the populating requests are made in batches, you can change the batch size [here](./node/handlers/populateCache.ts)

The routes to test the cache are:
```
/_v/test-cache/disk
/_v/test-cache/memory
```





