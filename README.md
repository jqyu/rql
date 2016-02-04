# rql

Had to take a break from my work on [RSL](https://github.com/jqyu/RSL) because the lack of functional dependencies, kind polymorphism and GADTs in purescript, combined with my lack of real functional programming experience, made type inferencing too much of a mess. I'm just a kid I don't know what I'm doing.

So instead, here's RQL. Follows the same general architecture of Haxl, but uses type annotations instead of strong types and requires explicit concurrency (in the form of promises).

A data source declares a list of request constructors, and a means of performing batch execution. The RQL executor batches and caches requests.

A service is a set of functions with type annotations, RQL builds a GraphQL schema based on these annotations, and dynamically composes these services via GraphQL's executor.

Docs and examples coming.
