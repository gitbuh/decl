var decl = (function(_p, _c){

var Clone = new Function(), // dummy function for prototypal cloning
      
    /** dataKey

        The name of the property where declaration objects' 
        metadata will be stored. If you want to pass objects to decl 
        instead of functions, put the metadata (parent, partial, etc.) 
        in this property.
    */
    dataKey = 'decl-data',
    
    /** proto

        This object is used as a prototype for declaration objects,
        so all properties are available as properties of `this`
        inside the body of each declaration function.

    */
    proto = {

      /** extend

          Perform prototypal inheritance by calling `this.extend(ParentCtor)`
          within your decalration function.

          @param {Function} ctor to extend.

          @return {Object} prototype of parent ctor.
      */
      extend: function (ctor) { 
        return (this[dataKey].extend=ctor)[_p]; 
      },

      /** augment

          Finish a partial declaration.
          TODO: test for bugs, possibly retroactively fix child classes when augmenting parent.

          @param {Function} ctor to augment.

          @return {Object} prototype of partial ctor.
      */
      augment: function (ctor) { 
        return (this[dataKey].augment=ctor)[_p]; 
      }

    };


/** decl

    Create a prototype object and return its constructor.
    
    @param {Function|Object} declaration
*/
function decl (declaration) {
  if (!declaration) {
    declaration = {};
  }
  else if (declaration.call) {
    declaration[_p]=proto;
    declaration[_p][dataKey]={};
  }
  return getCtor(declaration);
}

/** setDataKey

    Sets the name of the property where declaration objects' 
    metadata will be stored. If you want to pass objects to decl 
    instead of functions, put the metadata (parent, partial, etc.) 
    in this property.
    
    @param {String} String value to use for dataKey
*/
decl['setDataKey'] = function (value) { dataKey=value; };

/** clone

    Create a copy of a simple object.
    
    @param {Object} obj
    
    @return {Object} clone of obj.

*/
function clone (object) {
  var r=new Clone(Clone[_p]=object);
  Clone[_p]={};
  return r;
};

/** merge

    Merge src object's properties into target object.
    
    @param {Object} target object to merge properties into.
    
    @param {Object} src object to merge properties from.
    
    @return {Object} target for chaining.

*/
function merge (target, src) { 
  for (var k in src) {
    if (src.hasOwnProperty(k) && k!=_p && k!=dataKey) {  
      target[k] = src[k];
    }
  }
  return target;
};

/** getCtor

    Prepare a constructor to be returned by decl.
    
    @param {Function|Object} declaration
    
    @return {Function} constructor.

*/
function getCtor (declaration) {    
  var oldProto,
      declFn = declaration.call ? declaration : null,
      declObj = declFn ? new declFn(declFn) : declaration, 
      data = declObj[dataKey] || {},
      parent = data.extend, partial = data.augment, 
      ctor =  // user-defined ctor 
              declObj.hasOwnProperty(_c) ? declObj[_c] : 
              // ctor already defined (partial)  
              partial ? partial : 
              // generated wrapper for parent ctor
              parent ? decl.wrap(parent) : 
              // generated empty function
              new Function(); 
  
  // If there's a parent constructor, use a clone of its prototype
  // and copy the properties from the current prototype.
  if (parent) {
    oldProto = ctor[_p];
    ctor[_p] = clone(parent[_p]);
    merge(ctor[_p], oldProto);
  }
  
  // Merge the declaration function's properties into the constructor.
  // This allows adding properties to `this.constructor` in the declaration function
  // without defining a constructor, or before defining one.
  merge(ctor, declFn);
  
  // Merge the declaration objects's properties into the prototype.
  merge(ctor[_p], declObj);
  
  // Have the constructor reference itself in its prototype, and return it.
  return (ctor[_p][_c]=ctor);
};

return decl;

}('prototype', 'constructor'));

// This is outside of the main closure so wrapper functions
// will have as short a lookup chain as possible.
    
/** wrap

    Generate wrapper for parent constructor.
    
    @param {Function} parent constructor to wrap.
    
    @return {Function} child constructor.

*/
decl.wrap = function (parent) {
  return function(){ parent.apply(this, arguments); };
};
