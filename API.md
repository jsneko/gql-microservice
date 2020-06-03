# gpl-microservice

<a name="module_gql-microservice"></a>

## gql-microservice ⇒ <code>object</code>
Provides a method for creating an Apollo federated service and skipping the boilerplate.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| typeDefs | <code>string</code> \| <code>object</code> |  | Expects to either be a plain object created by the gql function from apollo-server, or a GraphQL schema definition string. If the latter, it will be passed into the gql function. |
| resolvers | <code>object</code> |  | The list of resolvers to use in the services. See https://www.apollographql.com/docs/apollo-server/data/resolvers/ for details on how to create the object. |
| datasources | <code>object</code> \| <code>instance</code> |  | The datasources to provide in a resolver's context. Remember what you pass as that will be the object type in the context.datasources property. |
| [schemaDirectives] | <code>object</code> | <code>{}</code> | A map of custom directives to use in the server. See https://www.apollographql.com/docs/apollo-server/schema/creating-directives/ for details on how to create custom directives. This parameter must be a plain object of the directives. |
| [options] | <code>object</code> | <code>{}</code> | Other options to provide to the server |
| [options.context] | <code>object</code> \| <code>function</code> |  | The default context to provide to the resolvers. If this is a function, it must return a plain object. |
| [options.logger] | <code>object</code> |  | A logger to pass into the context. The function does a light check to see if the logger "looks" like a logger (i.e.: it implements the four basic log functions: debug, info, warn, and error). If a context has also been passed: - if the context is a function, a new context function will be created, wrapping the results of old function with the logger. If a logger property already exists in the context it will overwrite this value. - if the context is an object and does not have a logger property, this value will be added as the logger property. - if the context is an object, has a logger property, but it isn't a valid "logger", this value will replace that property value. |
| [options.config] | <code>object</code> |  | An configuration object to pass to the server instance. This object may contain any other configuration properties that the ApolloServer constructor will consume. However, the main parameters passed to this function (typeDefs, resolvers, datasources, schemaDirectives), as well as the context option property will take precedence over this property. |


* [gql-microservice](#module_gql-microservice) ⇒ <code>object</code>
    * [~server](#module_gql-microservice..server) ⇒ <code>ApolloServer</code>
    * [~start([port])](#module_gql-microservice..start) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~stop()](#module_gql-microservice..stop) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="module_gql-microservice..server"></a>

### gql-microservice~server ⇒ <code>ApolloServer</code>
Getter.Provides the Apollo Server instance.

**Kind**: inner property of [<code>gql-microservice</code>](#module_gql-microservice)  
<a name="module_gql-microservice..start"></a>

### gql-microservice~start([port]) ⇒ <code>Promise.&lt;object&gt;</code>
Starts the server

**Kind**: inner method of [<code>gql-microservice</code>](#module_gql-microservice)  

| Param | Type | Description |
| --- | --- | --- |
| [port] | <code>number</code> | The port to listen on. If this is not provided a random port will be chosen. |

<a name="module_gql-microservice..stop"></a>

### gql-microservice~stop() ⇒ <code>Promise.&lt;\*&gt;</code>
Stops the server

**Kind**: inner method of [<code>gql-microservice</code>](#module_gql-microservice)  
