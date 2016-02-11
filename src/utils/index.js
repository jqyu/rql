import _    from 'lodash'

import fs   from 'fs'
import yaml from 'js-yaml'

// reusable methods

// MUTATES THE FIELD PROPERTY !!
function zipFields(fields, impl) {
  _.forEach ( fields , (field, name) => {
      // TODO: resolve specialized cases,
      // or else there will be a lot of redundant implementations
      field.resolve = impl[name]
    })
  return fields
}


// parse an API representation

export function RadAPIRead(path) {
  // get file
  const raw = fs.readFileSync(path, 'utf8')
  // set up response
  const header = {}
  const docs = [ 'meta', 'fields', 'mutations' ]
  let i = 0
  // read all files
  yaml.safeLoadAll(raw, d => header[docs[i++]] = d)
  // return header
  return header
}

export function RadAPI(header, impl) {
  if (typeof header === "string")
    header = RadAPIRead(header)
  return _.assign
    ( {}
    , header.meta
    , { fields: zipFields(header.fields, impl)
      , mutations: zipFields(header.mutations, impl)
      }
    )
}
