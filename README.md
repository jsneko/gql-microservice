# gpl-microservice

Consolidates the boilerplate for running an Apollo GraphQL federated service.

License: [MIT](/LICENSE.md)

## Synopsis

There is a bit of setup required to create an Apollo GraphQL federated service. This module attempts to abstract that code so that developers can concentrate on writing the schemas, resolvers, and directives without worrying (too much) about the server.

## Install

`yarn add https://github.com/jsneko/gql-microservice.git`

`npm install https://github.com/jsneko/gql-microservice.git`

## Simple Example
```js
const microservice = require('gpl-microservice');
const typeDefs = require(/** location for typdefs file **/);
const resolvers = require(/** location for resolvers file **/);
const datasources = require(/** location for datasources file **/);
const options = {
    logger: /* Logger instance, if any */,
    context: /* additional context */
    config: {
      /* additional ApolloServer configuration options (i.e: mock)*/
    }
};

function main(port) {
    return microservice(typeDefs, resolvers, datasources, options)
        .start(port);
}

main(4000)
    .catch((error) => {
        /* handle error */
    });
```

## API
<a name="module_gql-microservice"></a>

## gql-microservice ⇒ <code>object</code>
Provides a method for creating an Apollo federated service and skipping the boilerplate.See https://www.apollographql.com/docs/apollo-server/federation/implementing-services/ fordetails on how to create a Apollo federate service.

**Throws**:

- <code>AssertionError</code> - typeDefs must be either a string, or a plain object created from the gpl function.
- <code>AssertionError</code> - resolvers must be a plain object
- <code>AssertionError</code> - datasources must be either a class instance, a plain object, or a function
- <code>AssertionError</code> - options.schemaDirectives must be a plain object


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| typeDefs | <code>string</code> \| <code>object</code> |  | Expects to either be a plain object created by the gql function from apollo-server, or a GraphQL schema definition string. If the latter, it will be passed into the gql function before being supplied to the server. See https://www.apollographql.com/docs/apollo-server/schema/schema/ for details on how to create a schema. |
| resolvers | <code>object</code> |  | The list of resolvers to use in the services. See https://www.apollographql.com/docs/apollo-server/data/resolvers/ for details on how to create the object. |
| datasources | <code>object</code> \| <code>instance</code> |  | The datasources to provide in a resolver's context. Remember what you pass as that will be the object type in the context.datasources property. See https://www.apollographql.com/docs/apollo-server/data/data-sources/ for details on creating datasources for an Apollo server. |
| [options] | <code>object</code> | <code>{}</code> | Other options to provide to the server. |
| [options.context] | <code>object</code> \| <code>function</code> |  | Extra context to provide to the resolvers. If this is a function, it must return a plain object. |
| [options.logger] | <code>object</code> |  | A logger to pass into the context. The function does a "duck-typing" check to ensure that what is passed is a logger (i.e.: that it implements the four basic log functions: debug, info, warn, and error). If a context has also been passed: - if the context is a function, a new context function will be created, wrapping the results of old function with the logger. If a logger property already exists in the context it will overwrite this value. - if the context is an object and does not have a logger property, this value will be added as the logger property. - if the context is an object, has a logger property, but "duck-typing" indicates that it isn't a valid "logger", this value will replace that property value. |
| [options.schemaDirectives] | <code>object</code> | <code>{}</code> | A map of custom directives to use in the server. See https://www.apollographql.com/docs/apollo-server/schema/creating-directives/ for details on how to create custom directives. This parameter must be a plain object of the directives. |
| [options.config] | <code>object</code> |  | An configuration object to pass to the server instance. This object may contain any other configuration properties that the ApolloServer constructor will consume. However, the main parameters passed to this function (typeDefs, resolvers, datasources, schemaDirectives), as well as the context option property will take precedence over the settings in this property. |


* [gql-microservice](#module_gql-microservice) ⇒ <code>object</code>
    * [~server](#module_gql-microservice..server) ⇒ <code>ApolloServer</code>
    * [~start([port])](#module_gql-microservice..start) ⇒ <code>Promise.&lt;{url:String, subscriptionPath:String, server:http.Server}&gt;</code>
    * [~stop()](#module_gql-microservice..stop) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="module_gql-microservice..server"></a>

### gql-microservice~server ⇒ <code>ApolloServer</code>
Getter.Provides the Apollo Server instance.

**Kind**: inner property of [<code>gql-microservice</code>](#module_gql-microservice)  
**See**: https://www.apollographql.com/docs/apollo-server/api/apollo-server/  
<a name="module_gql-microservice..start"></a>

### gql-microservice~start([port]) ⇒ <code>Promise.&lt;{url:String, subscriptionPath:String, server:http.Server}&gt;</code>
Starts the server

**Kind**: inner method of [<code>gql-microservice</code>](#module_gql-microservice)  
**See**: https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserverlisten  

| Param | Type | Description |
| --- | --- | --- |
| [port] | <code>number</code> | The port to listen on. If this is not provided a random port will be chosen. |

<a name="module_gql-microservice..stop"></a>

### gql-microservice~stop() ⇒ <code>Promise.&lt;\*&gt;</code>
Stops the server

**Kind**: inner method of [<code>gql-microservice</code>](#module_gql-microservice)  
