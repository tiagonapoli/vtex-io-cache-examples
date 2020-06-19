import { method, Service, ServiceContext } from '@vtex/api'
import { Clients, clients } from './clients'
import {
  dataProvider,
  populateDiskCache,
  populateMemoryCache,
  testDiskCache,
  testMemoryCache,
} from './handlers'

declare global {
  type HandlerContext = ServiceContext<Clients>
}

export default new Service({
  clients,
  routes: {
    dataProvider: method({
      GET: dataProvider,
    }),
    populateDiskCache: method({
      GET: populateDiskCache,
    }),
    testDiskCache: method({
      GET: testDiskCache,
    }),
    populateMemoryCache: method({
      GET: populateMemoryCache,
    }),
    testMemoryCache: method({
      GET: testMemoryCache,
    }),
  },
})
