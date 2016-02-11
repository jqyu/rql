import Promise from 'bluebird'
import _       from 'lodash'

function Service(s, src) {

  const service =

    { find: (_ctx, e$, args) =>
        e$.exec( src.req.get(s, args.id) )

    , findMany: (_ctx, e$, args) =>
        e$.map( args.ids, id => src.req.get(s, id) )

    , all: (_ctx, e$, args) =>
        e$.exec( src.req.getIndex(s, args) )
          .then( ids => service.findMany(_ctx, e$, {ids}) )

    , create: (_ctx, e$, args) =>
        e$.exec( src.req.incrId(s) )
          .then( id => { console.log('yes hello', id); return id } )
          .then( id => e$.exec( src.req.save(s, _.assign({ id }, args)) ))

    , update: (_ctx, e$, args) =>
        e$.exec( src.req.save(s, args) )

    , delete: (_ctx, e$, args) =>
        e$.exec( src.req.destroy(s, args.id) )

    }

  return service

}

export default Service
