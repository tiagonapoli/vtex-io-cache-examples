import {
  AppClient,
  CacheType,
  ClientsConfig,
  DiskCache,
  InstanceOptions,
  IOClients,
  IOContext,
  LRUCache,
  RequestConfig,
} from '@vtex/api'

export const diskCache = new DiskCache<any>('/cache')
export const memoryCache = new LRUCache<string, any>({
  max: 10,
})

export class CacheExampleClient extends AppClient {
  constructor(ioContext: IOContext, options?: InstanceOptions) {
    super('vtex.cache-examples@0.x', ioContext, {
      ...options,
      diskCache,
      memoryCache,
    })
  }

  public getWithDiskCache(id: number, requestConfig?: RequestConfig) {
    return this.http.getRaw(`/_v/data?id=${id}`, {
      ...requestConfig,
      cacheable: CacheType.Disk,
      tracing: {
        ...requestConfig?.tracing,
        requestSpanNameSuffix: 'with-disk-cache',
      },
    })
  }

  public getWithMemoizationCache(id: number, requestConfig?: RequestConfig) {
    return this.http.getRaw(`/_v/data?id=${id}`, {
      ...requestConfig,
      tracing: {
        ...requestConfig?.tracing,
        requestSpanNameSuffix: 'with-memoization-cache',
      },
    })
  }

  public getWithMemoryCache(id: number, requestConfig?: RequestConfig) {
    return this.http.getRaw(`/_v/data?id=${id}`, {
      ...requestConfig,
      cacheable: CacheType.Memory,
      tracing: {
        ...requestConfig?.tracing,
        requestSpanNameSuffix: 'with-memory-cache',
      },
    })
  }
}

export class Clients extends IOClients {
  public get cacheExampleClient(): CacheExampleClient {
    return this.getOrSet('cacheExampleClient', CacheExampleClient)
  }
}

const options = {
  cacheExampleClient: {
    timeout: 500,
    retries: 1,
  },
}

export const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options,
}
