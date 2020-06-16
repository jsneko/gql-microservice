const assert = require('assert');
const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const isLogger = require('./isLogger');

const is = {
  logger: isLogger,
  ...require('@sindresorhus/is'),
};

/**
 * Provides a method for creating an Apollo federated service and skipping the boilerplate.
 * See https://www.apollographql.com/docs/apollo-server/federation/implementing-services/ for
 * details on how to create a Apollo federate service.
 * 
 * @param {(string|object)} typeDefs
 *  Expects to either be a plain object created by the gql function from apollo-server, or a
 * GraphQL schema definition string. If the latter, it will be passed into the gql function before
 * being supplied to the server. See https://www.apollographql.com/docs/apollo-server/schema/schema/
 * for details on how to create a schema.
 * @param {object} resolvers
 *  The list of resolvers to use in the services. See https://www.apollographql.com/docs/apollo-server/data/resolvers/
 * for details on how to create the object.
 * @param {(object|instance)} datasources
 *  The datasources to provide in a resolver's context. Remember what you pass as that will be
 * the object type in the context.datasources property. See https://www.apollographql.com/docs/apollo-server/data/data-sources/
 * for details on creating datasources for an Apollo server.
 * @param {object} [options = {}]
 *  Other options to provide to the server.
 * @param {(object|function)} [options.context]
 *  Extra context to provide to the resolvers. If this is a function, it must return a plain object.
 * @param {object} [options.logger]
 *  A logger to pass into the context. The function does a "duck-typing" check to ensure that what is passed is
 * a logger (i.e.: that it implements the four basic log functions: debug, info, warn, and error). If a context
 * has also been passed:
 * - if the context is a function, a new context function will be created, wrapping the results of old
 * function with the logger. If a logger property already exists in the context it will overwrite this
 * value.
 * - if the context is an object and does not have a logger property, this value will be added as the
 * logger property.
 * - if the context is an object, has a logger property, but "duck-typing" indicates that it isn't a
 * valid "logger", this value will replace that property value.
 * @param {object} [options.schemaDirectives={}]
 *  A map of custom directives to use in the server. See https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
 * for details on how to create custom directives. This parameter must be a plain object of the directives.
 * @param {object} [options.config]
 *  An configuration object to pass to the server instance. This object may contain any other configuration
 * properties that the ApolloServer constructor will consume. However, the main parameters passed to this
 * function (typeDefs, resolvers, datasources, schemaDirectives), as well as the context option property
 * will take precedence over the settings in this property.
 * @returns {object}
 * @throws {AssertionError} - typeDefs must be either a string, or a plain object created from the gpl function.
 * @throws {AssertionError} - resolvers must be a plain object
 * @throws {AssertionError} - datasources must be either a class instance, a plain object, or a function
 * @throws {AssertionError} - options.schemaDirectives must be a plain object
 * @module gql-microservice
 */
function microservice (typeDefs, resolvers, datasources, options = {}) {
  assert(
    is.any([is.plainObject, is.nonEmptyString], typeDefs) === true,
    'typeDefs must be either a string, or a plain object created from the gql function'
  );

  assert(is.plainObject(resolvers) === true, 'resolvers must be a plain object');
  assert(
    is.any([is.class_, is.function_, is.plainObject], datasources) === true,
    'datasources must be either a class instance, a plain object, or a function'
  );
  
  const {
    logger,
    context: _context,
    config : $config,
    schemaDirectives = {}
  } = options || {};
  
  assert(is.plainObject(schemaDirectives) === true, 'options.schemaDirectives must be a plain object');
  // remove schemaDirectives from the options config property.
  let {
    schemaDirectives : _schemaDirectives,
    ..._config
  } = $config || {};

  let dataSources;

  if (is.class_(datasources) === true) {
    dataSources = new datasources();
  } else {
    dataSources = datasources;
  }

  // clear out _schemaDirectives since we don't need it
  _schemaDirectives = undefined;

  const config = {};
  const schema = {
    resolvers,
    dataSources() {
      return dataSources;
    }
  };

  let context = is.any([is.plainObject,is.function_],_context)
    ? _context
    : {};

  if (is.string(typeDefs) === true) {
    typeDefs = gql(typeDefs);
  }

  schema.typeDefs = typeDefs;

  if (is.logger(logger) === true) {
    if (is.function_(context) === true) {
      const original = context;
      context = (integrationContext) => {
        return {
          logger,
          ...original(integrationContext),
        };
      };
    } else if (is.logger(context.logger) === false) {
      context.logger = logger;
    }
  }

  if (is.emptyObject(context) === false) {
    config.context = context;
  }

  config.schema = buildFederatedSchema([schema]);
  SchemaDirectiveVisitor.visitSchemaDirectives(config.schema, schemaDirectives);
  const server = new ApolloServer({
    ..._config,
    ...config,
  });

  return {
    /**
     * Starts the server
     * 
     * @param {number} [port]
     *  The port to listen on. If this is not provided a random port will be chosen.
     * @returns {Promise.<{url:String, subscriptionPath:String, server:http.Server}>}
     * @see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserverlisten
     */
    async start(port) {
      const response = await server.listen(port);
      const { url } = response;
      console.log(`Server ready at ${url}`);
      console.log(`Try your health check at: ${url}.well-known/apollo/server-health`);
      return response;
    },
    /**
     * Stops the server
     * 
     * @returns {Promise.<*>}
     */
    stop() {
      return server.stop();
    },
    /**
     * Getter.
     * 
     * Provides the Apollo Server instance.
     * 
     * @returns {ApolloServer}
     * @see https://www.apollographql.com/docs/apollo-server/api/apollo-server/
     */
    get server() {
      return server;
    },
  };
};

module.exports = microservice;