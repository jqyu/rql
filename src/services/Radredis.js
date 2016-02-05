function Radredis(schema, src) {

  const typeName = schema.name

  const type =
    { name: typeName
    , properties:
      {
      }
    }

  const service =

    { find:
      { type: [typeName]
      , args: [['id']]
      , resolve(e$, ids) {
        }
      }

    , findMany:
      { type: [typeName]
      , args: [['id']]
      , resolve(e$, ids) {
        }
      }

    , create:
      { type: typeName
      , args: ['object']
      , resolve(e$, attributes) {
        }
      }

    , update:
      { type: typeName
      , args: ['id', 'object']
      , resolve(e$, id, attributes) {
        }
      }

    , delete:
      { type: 'string'
      , args: ['id']
      , resolve(e$, id) {
        }
      }

    }

}
