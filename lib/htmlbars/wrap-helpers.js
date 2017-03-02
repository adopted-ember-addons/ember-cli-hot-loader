/* global module */
/**
 HTMLBars AST transform to wrap all helpers into a hot-replacement-component

Original:

 ```handlebars
 {{mixed-classic positionalParam1 prop1=bound prop2="constant"}}
 ```

 Transformed example:

 ```handlebars
 {{#hot-replacement-component baseComponentName="mixed-classic"}}
   {{mixed-classic positionalParam1 prop1=bound prop2="constant"}}
 {{/hot-replacement-component}}
 ```
 */

// TODO: this needs to provide a "caching strategy" (figure out how) to avoid:
// "DEPRECATION: ember-cli-htmlbars is opting out of caching due to an AST plugin that does not provide a caching strategy: `wrap-helpers`."
function WrapHelpers () {}

WrapHelpers.prototype.transform = function (ast) {
  var _this = this;
  // var walker = new this.syntax.Walker();
  this.syntax.traverse(ast, {
    MustacheStatement: {
      enter: function (node) {
        if (_this.validate(node)) {
          return _this._buildWrapper(node);
        }
      }
    }, BlockStatement: {
      enter: function (node) {
        if (_this.validate(node)) {
          return _this._buildWrapper(node);
        }
      }
    }
  });

  return ast;
};

WrapHelpers.prototype._buildWrapper = function (node) {
  if (node.processed === true) {
    return;
  }
  node.processed = true;
  var builders = this.syntax.builders;
  var params = [];
  var pair = builders.pair('baseComponentName', builders.string(node.path.original));
  var hash = builders.hash([pair]);
  var program = builders.program([node]);
  var newNode = builders.block('hot-replacement-component', params, hash, program);
  console.log(this.syntax.print(newNode));
  return newNode;
};

// TODO: get this list based on what can be resolved and determine which file owns it e.g. vendor, app.js or a certain engine or engine-vendor?
// var componentsToWrap = ['mixed-classic', 'mixed-pod', 'inline-template-classic', 'inline-template-pod', 'js-only-classic', 'js-only-pod', 'template-only-classic', 'template-only-pod', 'positional-params'];
WrapHelpers.prototype.validate = function (node) {
  if (node.type === 'MustacheStatement' ||
      node.type === 'BlockStatement'
    // For future compat with angle bracket components?
    // || node.type === 'ElementNode'
    ) {
    var componentName = node.path.original;
    // For now, anything with a dash is considered a component until we fix the TODO above
    if (componentName.indexOf('-') > -1 && componentName !== 'hot-replacement-component') {
      console.log(componentName);
      return true;
    }
    // if (componentsToWrap.indexOf(node.path.original) > -1) {
    //   return true;
    // }
  }
  return false;
};

module.exports = WrapHelpers;
