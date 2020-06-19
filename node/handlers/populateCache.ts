import { randomIntFromInterval } from '../utils'
import { recordedIds, responses } from './dataProvider'

/** Batch size */
const BATCH_SIZE = 100

const populateSequentially = async (
  ids: number[],
  req: (id: number) => Promise<any>
) => {
  for (const id of ids) {
    try {
      await req(id)
    } catch (err) {}
  }
}

const populateConcurrently = async (
  ids: number[],
  req: (id: number) => Promise<any>
) => {
  while (ids.length > 0) {
    const batch: number[] = []
    const sz = Math.min(ids.length, BATCH_SIZE)
    for (let i = 0; i < sz; i++) {
      batch.push(ids.pop() as number)
    }

    await Promise.all(
      batch.map(async id => {
        try {
          await req(id)
        } catch (err) {}
      })
    )
  }
}

const populate = async (
  ctx: HandlerContext,
  req: (id: number) => Promise<any>
) => {
  responses.clear()
  recordedIds.splice(0, recordedIds.length)

  let entries = ctx.query.entries ?? 8
  let concurrent = !(ctx.query.concurrent === 'false')

  const ids = []
  for (let i = 0; i < entries; i++) {
    ids.push(randomIntFromInterval(1, 10000000))
  }

  if (concurrent) {
    await populateConcurrently(ids, req)
  } else {
    await populateSequentially(ids, req)
  }

  ctx.status = 200
  ctx.body = ctx.vtex.tracer.fallbackSpanContext().toTraceId()
}

export function populateDiskCache(ctx: HandlerContext) {
  return populate(ctx, (id: number) =>
    ctx.clients.cacheExampleClient.getWithDiskCache(id)
  )
}

export function populateMemoryCache(ctx: HandlerContext) {
  return populate(ctx, (id: number) =>
    ctx.clients.cacheExampleClient.getWithMemoryCache(id)
  )
}
