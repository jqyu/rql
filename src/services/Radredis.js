import _ from 'lodash'

// process a schema
function M(schema) {

}

function Type(schema, src) {

  const m = M(schema)

  const type =
    { name: schema.name
    , properties: null
    }

  return type

}

function Service(schema, src) {

  const typeName = schema.name

  const m = M(schema)

  const service =
    { find:
      { type: typeName
      , args: { id: 'Id'
              }
      , resolve: (e$, args) =>
          e$.fetch( src.req.get(m, args.id) )
      }

    , findMany:
      { type: [typeName]
      , args: { ids: ['Id']
              }
      , resolve: (e$, args) =>
          e$.fetchAll
            ( _.map
                ( args.ids
                , id => e$.fetch( src.req.get(m, args.id) )
                )
            )
      }

    , all:
      { type: [typeName]
      , args: { limit: 'Integer'
              , offset: 'Integer'
              }
      , resolve: (e$, args) => {
          // resolve params
          const params = {

          }
          return e$
            .fetch( src.req.getIndex(m, params) )
            .then(ids => e$.exec( service.findMany, { ids } ) )
        }
      }

    , create:
      { type: typeName
      , args: { // do some witchcraft with schema
              }
      , resolve(e$, args) {

        }
      }

    , update:
      { type: typeName
      , args: { id: 'Id'
              , // do some witchcraft with schema
              }
      , resolve(e$, args) {
        }
      }

    , delete:
      { type: 'String'
      , args: { id: 'Id'
              }
      , resolve(e$, args) {

        }
      }

    }

  return service

}

const Radredis =
  { Type
  , Service
  }

export default Radredis
