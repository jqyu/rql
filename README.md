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
    Counter will

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

We describe an API `Fun` containing two fields: `counter` and `foobar`, as well as o mutation `incrementCounter`.
Now we must provide implementations for these fields and mutations:

### `api.js`
