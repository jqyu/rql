import _    from 'lodash'

import fs   from 'fs'
import yaml from 'js-yaml'

// reusable methods

// MUTATES THE FIELD PROPERTY !!
function zipFields(fields, impl) {
  _.forEach ( fields , (field, name) => {
      if (typeof field === "string" || typeof field === "array") {
        // return field of parent
        fields[name] =
          { type: field
          , resolve: (o) => o[name]
          }
      } else {
        // check implementation
        field.resolve = impl[name]
      }

    })
  return fields
}

function readHeader(path) {
  // get file
  const raw = fs.readFileSync(path + '.yaml', 'utf8')
  // set up response
  const header = {}
  const docs = [ 'meta', 'fields', 'mutations' ]
  let i = 0
  // read all files
  yaml.safeLoadAll(raw, d => header[docs[i++]] = d)
  // return header
  return header
}

export function RadService(header, impl) {
  if (typeof header === "string")
    header = readHeader(header)
  if (header.meta.registered)
    header.meta.registered = impl[header.meta.registered]
  if (header.meta.resolve)
    header.meta.resolve = impl[header.meta.resolve]
  return _.assign
    ( {}
    , header.meta
    , { fields: zipFields(header.fields, impl)
      , mutations: zipFields(header.mutations, impl)
      }
    )
}

export function RadType(header, impl) {
  if (typeof header === "string")
    header = readHeader(header)
  if (header.meta.registered)
    header.meta.registered = impl[header.meta.registered]
  return _.assign
    ( {}
    , header.meta
    , { fields: zipFields(header.fields, impl) }
    )
}
