var InstanceSecurityGroup = require('./InstanceSecurityGroup')
  , userData = require('./user-data')
  ;

function applicable(config) {
  return !! config.instances;
}

function contexts(config) {
  return [config];
}

function key(config) {
  return 'LaunchConfiguration';
}

function build(config) {
  return {
    'Type': 'AWS::AutoScaling::LaunchConfiguration',
    'Properties': {
      'ImageId': config.instances.ami,
      'InstanceMonitoring': false,
      'InstanceType': config.instances.type,
      'KeyName': keyName(config),
      'SecurityGroups': [
        {'Ref': InstanceSecurityGroup.key(config)}
      ],
      'UserData': {'Fn::Base64': userData.build(config)},
    }
  };
}

function outputs(config) {
  return Object();
}

// -- Private

function keyName(config) {
  if (config.instances.ssh) {
    return config.instances.ssh.key;
  } else {
    return {'Ref': 'AWS::NoValue'};
  }
}

module.exports.applicable = applicable;
module.exports.contexts = contexts;
module.exports.key = key;
module.exports.build = build;
module.exports.outputs = outputs;
