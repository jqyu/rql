# rql

## Getting Started

Starting code is available in [/starter/](https://github.com/jqyu/rql/tree/master/starter).

```shell
cd starter
npm install
npm start
```

An RQL server will be initialized at [localhost:3000](http://localhost:3000/graphql)

## Writing our first API

In RQL, an "API" is just a special root object in our graph. First, we write a `.yaml` file describing its interface.
This `.yaml` file will contain three documents:

- A meta document describing its contents
- A requests document describing a list of fields we can query
- An optional mutations document describing the list of mutations we can perform, if any

### `api.yaml`

```yaml
--- # META

name: "Fun"
description: >
  This is my fun little API, it doesn't do much yet.

--- # REQUESTS

counter:
  type: integer
  description: >
    Counter will return the current counter value

echo:
  type: string
  args:
    text: string!
  description: >
    Echo returns the given string, which must be provided

--- # MUTATIONS

incrementCounter:
  type: integer
  args:
    amount: integer
  description: >
    Increments the counter by the specified amount.
    Will be incremented by 1 if no amount is specified
```

The description fields are optional, and will be omitted from now on. They are used by `graphql-js` to produce more meaningful schemas.

We describe an API `Fun` containing two fields: `counter` and `foobar`, as well as o mutation `incrementCounter`.
Now we must provide implementations for these fields and mutations:

### `api.js`

```js
// API State

let counter = 0

// Requests

export function counter() {
  return counter
}

export function echo(o, e$, args) {
  return args.text
}

// Mutations

export function incrementCounter(o, e$, args) {
  const amt = args.amount || 1
  return counter += amt
}
```

Now we need to register our API with RQL so it can be served.

First we build our API from our header and implementation file:
```javascript
// index.js 
import { RQL
       , RadAPI
       } from '../src'

const API = RadAPI('api.yaml', require('./api'))
```

Then we send our API to RQL:
```javascript
// index.js
const rql = RQL(require('graphql'), [API])
```

Now, RQL should be ready to serve our new API, the following should both be valid queries, which can be executed on [GraphiQL](http://localhost:3000/graphql):
```graphql
{
  Fun {
    counter
    echo (text: "hello world")
  }
}
```
```graphql
mutation {
  m1: incrementCounter(amount: 5)
  m2: incrementCounter
}
```
Note that, due to limitations of `graphql-js`, mutations must be sent to the top-level in order to maintain serial execution.
As such, it is imperative that mutation names are globally unique, or else collisions will occur.

## Modular Services

Notice that `RQL` takes an array of APIs.
It is not uncommon for multiple APIs to share common resources.
As such, we design a set of modular, reusable services which our APIs can call for common tasks.

For example, we can separate our counter into its own service

### `services/counter.js`

```javascript
let counter = 0

export function get() {
  return counter
}

export function increment(ctx, e$, args) {
  const amt = args.amount || 1
  return counter ++ amt
}
```

And our API becomes as follows:

### `api.js`
 
```javascript
import counter from './services/counter'

// State

let counter = 0

// Requests

export function echo(o, e$, args) {
  return args.text
}

export const counter = counter.get

// Mutations

export const incrementCounter = counter.increment
```

**TODO:**

- Implement header-level aliasing to services, RQL should be able to figure out how to re-route fields to services
- Implement better header composition, so service headers can be reused as well

## Types

The main feature of GraphQL is the ability to compose queries.
In order to make this possible, we need to have a system of composable types

## Data Sources

Notice that all of our resolve functions have been taking an `e$` parameter.
This is the RQL executor, an interface for making efficient data requests.
Since GraphQL queries are executed in a breadth-first search, it is difficult to analyze the execution context to generate efficient queries.
Therefore, we defer data fetching to a batching executor, which collects requests from all points in the execution and sends them to a data source in batches.
