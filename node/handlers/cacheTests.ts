import { recordedIds } from './dataProvider'

async function testCache(
  ctx: HandlerContext,
  req: (id: number) => Promise<any>
) {
  await Promise.all(
    recordedIds.map(async id => {
      try {
        await req(id)
      } catch (err) {}
    })
  )

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
