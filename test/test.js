import RQL     from '../src'
import Promise from 'bluebird'

import _       from 'lodash'

const NodeAPI =
  { // get node
    // mutate node
  }

const NodeService =
  { // top-level queries
    // mutations
  }

describe('RQL', function() {

  const obj = { key: 'a' };
  const abj = { key: 'b' };

  const arr =
    [ { d: obj, i: 1 }
    , { d: obj, i: 2 }
    , { d: abj, i: 3 }
    , { d: abj, i: 4 }
    ]

  console.log(_.groupBy(arr, 'd.key'))

  console.log('we ok?')

  it('should b ok', function() {
    return Promise.delay(10)
      .then(RQL)
  })

})
