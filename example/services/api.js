let counter = 0

export function resolve(e$, args) {
  console.log("Resolving API...")
  return { api: "API", time: +Date.now() }
}

export function registered() {
  console.log("API registered...")
}

export function counter() {
  return counter
}

export function increment(o, e$, args) {
  const amt = args.amount || 1
  return counter += amt
}

export { find as user
       , create as createUser
       } from './models/user/service'

export { find     as zone
       , all      as zones
       , create   as createZone
       , update   as updateZone
       , destroy  as destroyZone
       } from './models/zone/service'
