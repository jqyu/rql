const users = []

export function find(ctx, e$, args) {
  return users[args.id]
}

export function create(ctx, e$, args) {
  const user =
    { id: users.length
    , name: args.name
    }
  users.push(user)
  return user
}
