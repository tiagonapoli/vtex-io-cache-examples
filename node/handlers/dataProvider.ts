import { randomIntFromInterval } from '../utils'

/**
 * Change the probabilities of each status code here
 * They have to sum up 1.0
 */
const StatusCodeWeights = {
  200: 1,
  404: 0.0,
  400: 0.00,
  500: 0.00,
}

const StatusCodeWeightsEntries = Object.entries(StatusCodeWeights)
const totalWeight = StatusCodeWeightsEntries.reduce(
  (acc, [_, val]) => acc + val,
  0
)
if (Math.abs(totalWeight - 1.0) > 1e-6) {
  throw new Error('StatusCodeWeights have to sum up to 1.0')
}

function getRandomStatusCode() {
  const num = Math.random()
  let s = 0
  const lastIndex = StatusCodeWeightsEntries.length

  for (let i = 0; i < lastIndex; i++) {
    s += StatusCodeWeightsEntries[i][1]
    if (num < s) {
      return StatusCodeWeightsEntries[i][0]
    }
  }

  return StatusCodeWeightsEntries[lastIndex][0]
}

export const responses = new Map()
export const recordedIds: number[] = []

export async function dataProvider(ctx: HandlerContext) {
  const { id } = ctx.query
  recordedIds.push(id)
  const fields = randomIntFromInterval(5, 10)
  const obj: Record<string, any> = {
    id,
    fields,
  }

  console.log(`Generated [${id}] with ${fields} fields`)
  for (let i = 0; i < fields; i++) {
    obj[`field${i}`] = '1'.repeat(i)
  }

  const status = parseInt(getRandomStatusCode())
  responses.set(id, { status, obj: { ...obj } })
  ctx.set('cache-control', 'max-age=600')
  ctx.status = status
  ctx.body = obj
}
