import radredis from '../../sources/radredis'

const schema =
  { key: 'fuck'
  }

const users = {}

export function find(ctx, e$, args) {
  return users[args.id]
}

export function create(ctx, e$, args) {
  return e$
    .all( [ radredis.req.incrId(schema)
          , radredis.req.destroy(schema, 1)
          , radredis.req.incrId(schema)
          ]
        )
    .then( ids => {
        const id = ids[0]
        const user =
          { id
          , name: args.name
          }
        return users[id] = user
      })
}
