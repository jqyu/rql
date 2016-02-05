import Radredis from './Radredis'

const schema =
  {
  }

// apply some transformation to the PostType to auto-gen

// TODO: register type with GraphQL service
const PostService =
  { find:
    { type: ['post']
    , args: [['id']]
    , resolve: (id) {

      }
    }
  }
