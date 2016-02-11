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
