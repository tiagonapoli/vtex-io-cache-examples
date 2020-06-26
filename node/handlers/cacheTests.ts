import { recordedIds } from './dataProvider'
import pMap = require('p-map')

async function testCache(
  ctx: HandlerContext,
  req: (id: number) => Promise<any>
) {
  const { concurrency } = ctx.query
  const opts = concurrency ? { concurrency: parseInt(concurrency) } : undefined
  console.log("IDS LEN", recordedIds.length)
  await pMap(recordedIds, async id => {
    try {
      await req(id)
    } catch (err) {}
  }, opts)
  ctx.status = 200
  ctx.body = ctx.vtex.tracer.fallbackSpanContext().toTraceId()
}

export async function testDiskCache(ctx: HandlerContext) {
  return testCache(ctx, (id: number) =>
    ctx.clients.cacheExampleClient.getWithDiskCache(id)
  )
}

export async function testMemoryCache(ctx: HandlerContext) {
  return testCache(ctx, (id: number) =>
    ctx.clients.cacheExampleClient.getWithMemoryCache(id)
  )
}
