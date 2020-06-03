const is = require('@sindresorhus/is');
/**
 * Performs a light check to validate if the object passed has
 * the common four functions used in logging:
 * - debug
 * - info
 * - warn
 * - error
 * 
 * @param {*} object
 *  The object to interrorgate
 * @returns {boolean}
 */
module.exports = function isLogger(object) {
  const {
    debug,
    info,
    warn,
    error
  } = object || {};

  if (is.function(debug) === false) {
    return false;
  }

  if (is.function(info) === false) {
    return false;
  }

  if (is.function(warn) === false) {
    return false;
  }

  return is.function(error);
};