"use strict";
const parseConfig = require("./parseListConfig");
const _ = require("lodash");
const path = require("path");

module.exports = function exposeLists(keystone, config) {
  //todo: throw error if keystone not supplied or lists not available
  var output = {};
  _.each(keystone.lists, function (list, key) {
    var restConfig = parseConfig(list, config.resources[key]);
    if (!restConfig.hidden) {
      var entry = path.join(config.root, restConfig.path);
      var isWin = /^win/.test(process.platform);
      if (isWin) {
        entry = entry.replace(/\\/g, '/');
      }
      var methods = restConfig.methods;
      output[key] = {};
      _.each(methods, function (methodName) {
        var method = require("../methods/" + methodName);
        output[key][methodName] = method(list, restConfig, entry);
      });
    }
  });
  return output;
};
