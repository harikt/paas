var validate = require('jsonschema').validate
  , containers = require('./containers')
  , instances = require('./instances')
  , monitoring = require('./monitoring')
  , schema = require('./schema')
  ;

/**
 * Return a sanitized version of the input config.
 *
 * This adds default values where they need to be added and validates that the
 * input values are correct.
 *
 * @throws {Error}
 *   in the case the input is not valid
 *
 * @param {Object} config
 *   unsanitized parsed YAML config file
 *
 * @return {Object}
 *   sanitized YAML config file
 */
function sanitize(config) {
  var normalizedConfig = [
    containers,
    instances,
    monitoring
  ].reduce(
    function(config, sanitizer){
      return sanitizer.sanitize(config);
    },
    config
  );

  validateSchema(normalizedConfig);

  return normalizedConfig;
}

function validateSchema(config) {
  validate(
    config,
    schema,
    {propertyName: 'config', throwError: true}
  );
}

module.exports.sanitize = sanitize;