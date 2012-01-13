/** unit tests for decl
*/
var My = {}, declTests = [

function () {
  
  this.title = 'empty decl';
  
  My.EmptyThing = decl();
  
  var thing = new My.EmptyThing();
  
  this.assert(thing instanceof My.EmptyThing);
  
},

function () {
  
  this.title = 'weird decl';
  
  My.WeirdThing1 = decl(1);  
  My.WeirdThing2 = decl('foo');
  My.WeirdThing3 = decl(new Date());
  My.WeirdThing4 = decl(/x/);
  
  var thing1 = new My.WeirdThing1();
  var thing2 = new My.WeirdThing2();
  var thing3 = new My.WeirdThing3();
  var thing4 = new My.WeirdThing4();
  
  this.assert(thing1 instanceof My.WeirdThing1);
  this.assert(thing2 instanceof My.WeirdThing2);
  this.assert(thing3 instanceof My.WeirdThing3);
  this.assert(thing4 instanceof My.WeirdThing4);
  
},

function () {
  
  this.title = 'implicit ctor';
  
  My.ImpThing = decl(function () {
    this.id = 42;
    this.name = 'imp';
  });
  
  var thing = new My.ImpThing();
  
  this.assert(thing.id == 42 && thing.name == 'imp');
  this.assert(thing instanceof My.ImpThing);
  
},

function () {
  
  this.title = 'explicit ctor';

  My.ExpThing = decl(function () {
    this.constructor = function(x, y) { 
      this.x = x; this.y = y; 
    };
    this.name = 'exp';
  });
  
  var thing = new My.ExpThing(12, 34);
  
  this.assert(thing.x == 12 && thing.y == 34 && 
              thing.name == 'exp');
  this.assert(thing instanceof My.ExpThing);
  
},

function () {
  
  this.title = 'implicit ctor -> implicit ctor';

  My.ImpThingImpKid = decl(function () {
    this.extend(My.ImpThing);
  });
  
  var thing = new My.ImpThingImpKid();
  
  this.assert(thing.id == 42 && thing.name == 'imp');
  this.assert(thing instanceof My.ImpThingImpKid);
  this.assert(thing instanceof My.ImpThing);
  
},

function () {
  
  this.title = 'explicit ctor -> implicit ctor';

  My.ImpThingExpKid = decl(function () {
    this.constructor = function () { 
      this.id = 123; 
    };
    this.extend(My.ImpThing);
  });
  
  var thing = new My.ImpThingExpKid();
  
  this.assert(thing.id == 123 && thing.name == 'imp');
  this.assert(thing instanceof My.ImpThingExpKid);
  this.assert(thing instanceof My.ImpThing);
  
},
               
function () {
  
  this.title = 'implicit ctor -> explicit ctor';

  My.ExpThingImpKid = decl(function () {
    this.extend(My.ExpThing);
    this.getY = function () { 
      return this.y; 
    };
  });
  
  var thing = new My.ExpThingImpKid(12, 34);
  
  this.assert(thing.x == 12 && thing.getY() == 34 && 
              thing.name == 'exp');
  this.assert(thing instanceof My.ExpThingImpKid);
  this.assert(thing instanceof My.ExpThing);
  
},
                                 
function () {
  
  this.title = 'explicit ctor -> explicit ctor';
  
  My.ExpThingExpKid = decl(function () {
    this.extend(My.ExpThing);
    this.constructor = function(x, y) { 
      this.a = x; this.b = y; 
    };
  });
  
  var thing = new My.ExpThingExpKid(12, 34);
  
  this.assert(thing.x != 12 && thing.y != 34);
  this.assert(thing.a == 12 && thing.b == 34);
  this.assert(thing instanceof My.ExpThingExpKid);
  this.assert(thing instanceof My.ExpThing);
  
},

function () {
  
  this.title = 'extend returns parent prototype';

  var test = this;

  My.ExpThingExpKid2 = decl(function () {
    var parent = this.extend(My.ExpThing);
    this.constructor = function(x, y) { 
      parent.constructor.apply(this, arguments);
      this.a = x; this.b = y; 
    };
    
    test.assert(parent == My.ExpThing.prototype);
  });
  
  var thing = new My.ExpThingExpKid2(11, 22);
  
  this.assert(thing.x == 11 && thing.y == 22 && 
              thing.a == 11 && thing.b == 22);
  this.assert(thing instanceof My.ExpThingExpKid2);
  this.assert(thing instanceof My.ExpThing);
  
},

function () {
  
  this.title = 'obj lit implicit ctor';

  My.ObjImpThing = decl({
    id: 42,
    name: 'imp'
  });
  
  var thing = new My.ObjImpThing();
  
  this.assert(thing.id == 42 && thing.name == 'imp');
  this.assert(thing instanceof My.ObjImpThing);
  
},

function () {
  
  this.title = 'obj lit explicit ctor';

  My.ObjExpThing = decl({
    constructor: function(x, y) { 
      this.x = x; this.y = y; 
    },
    name: 'exp'
  });
  
  var thing = new My.ObjExpThing(12, 34);
  
  this.assert(thing.x == 12 && thing.y == 34 && 
              thing.name == 'exp');
  this.assert(thing instanceof My.ObjExpThing);
  
},

function () {
  
  this.title = 'obj lit implicit ctor -> implicit ctor';
  
  My.ObjImpThingObjImpKid = decl({
    'decl-data': {extend: My.ObjImpThing},
    foo: 'bar'
  });
  
  var thing = new My.ObjImpThingObjImpKid();
  
  this.assert(thing.id == 42 && thing.name == 'imp' && 
              thing.foo == 'bar');
  this.assert(thing instanceof My.ObjImpThingObjImpKid);
  this.assert(thing instanceof My.ObjImpThing);
  
},

function () {
  
  this.title = 'obj lit explicit ctor -> implicit ctor';

  My.ObjImpThingObjExpKid = decl({
    'decl-data': {extend: My.ObjImpThing},
    constructor: function () { 
      this.id = 123; 
    }
  });
  
  var thing = new My.ObjImpThingObjExpKid();
  
  this.assert(thing.id == 123 && thing.name == 'imp');
  this.assert(thing instanceof My.ObjImpThingObjExpKid);
  this.assert(thing instanceof My.ObjImpThing);
  
},

function () {
  
  this.title = 'internal properties not leaky';
  
  var k, k2, re=/^(extend|_getCtor|augment)$/,
      ctorOk=true, protoOk=true;
  
  checkingCtor: for (k in My) for (k2 in My[k]) {
    if (k2 == decl.dataKey || k2.match(re)) {
      ctorOk=false; break checkingCtor;
    }
  }
  checkingProto: for (k in My) for (k2 in new (My[k])) {
    if (k2 == decl.dataKey || k2.match(re)) {
      protoOk=false; break checkingProto;
    }
  }
  
  this.assert(ctorOk);
  this.assert(protoOk);
} // last test
  
];
