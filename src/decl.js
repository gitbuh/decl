/** decl

    Create a prototype object and return its constructor.
    
    @param {Function|Object} declaration
*/
function decl (declaration) {
  if (!declaration) {
    declaration = {};
  }
  else if (declaration.call) {
    declaration.prototype=decl.proto;
    declaration.prototype[decl.dataKey]={};
  }
  return decl.getCtor(declaration);
}

// Name of property where declaration objects' metadata will be stored.
// If you want to pass objects to decl instead of functions,
// put the metadata (parent, partial, etc.) in this property.
decl.dataKey = 'decl-data';

// This object is used as a prototype for declaration objects,
// so everything here is available as properties of `this`
// inside the body of each declaration function.
decl.proto = {

  extend: function (ctor) { 
    return (this[decl.dataKey].parent=ctor).prototype; 
  },

  augment: function (ctor) { 
    return (this[decl.dataKey].partial=ctor).prototype; 
  },

};

// Create a copy of a simple object
decl.clone = function (obj) { 
  return this instanceof decl.clone ? this : 
         new decl.clone(decl.clone.prototype=obj);
};

// Merge src object's properties into target object
decl.merge = function (target, src) { 
  for (var k in src) {
    if (src.hasOwnProperty(k) && k!='prototype' && k!=decl.dataKey) {  
      target[k] = src[k];
    }
  }
};

// Generate empty constructor
decl.empty = function () { 
  return function(){}; 
};

// Generate wrapper for parent constructor
decl.wrap = function (parent) {
  return function(){ parent.apply(this, arguments); };
};

// Prepare a constructor to be returned by decl
decl.getCtor = function (declaration) {    
  var oldProto, p = 'prototype', c = 'constructor',
      declFn = declaration.call ? declaration : null,
      declObj = declFn ? new declFn(declFn) : declaration, 
      data = declObj[decl.dataKey] || {},
      parent = data.parent, partial = data.partial, 
      ctor = 
          declObj.hasOwnProperty(c) ? declObj[c] : // ctor is user-defined 
          partial ? partial : // ctor is already defined (partial)  
          parent ? decl.wrap(parent) : // ctor is generated wrapper for parent ctor
          decl.empty(); // ctor is generated empty function
  
  // If there's a parent constructor, use a clone of its prototype
  // and copy the properties from the current prototype.
  if (parent) {
    oldProto = ctor[p];
    ctor[p] = decl.clone(parent[p]);
    decl.merge(ctor[p], oldProto);
  }
  
  // Merge the declaration function's properties into the constructor.
  // This allows adding properties to `this.constructor` in the declaration function
  // without defining a constructor, or before defining one.
  decl.merge(ctor, declFn);
  
  // Merge the declaration objects's properties into the prototype.
  decl.merge(ctor[p], declObj);
  
  // Have the constructor reference itself in its prototype, and return it.
  return (ctor[p][c]=ctor);
};
