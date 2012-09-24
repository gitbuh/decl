
/** Detest 

    Simple test harness for decl.
    
    @param {HTMLElement} summaryArea
    @param {HTMLElement} detailArea
    @param {HTMLElement} testArea
*/
function Detest (summaryArea, detailArea, testArea) {
  this.summaryArea = summaryArea;
  this.detailArea = detailArea;
  this.testArea = testArea;
}

/** Test

    A detest test.
    
    @param  {Function} fn test function.
*/
Detest.Test = function(fn){
  this.assertions = [];
  this.fn = fn;
};

Detest.Test.prototype = {
  
  // internal stuff
  ok: true, error: null, passCount: 0, failCount: 0,
  
  /** title 
  
      The title of this test. Set it at the beginning of the test.
  
      @type {String}
  */
  title: "untitled test", 
  
  /** assert 
  
      Call this at least once per test.
  
      @param  {Boolean} value 
  */
  assert: function(value) {
    this.assertions.push(value ? 1 : 0);
    if (!value) {
      this.ok = false;
      ++this.failCount;
    } else {
      ++this.passCount;
    }
  }

};

Detest.prototype = {
  
  /** run 

    Run all the tests
    
    @param  {Array} testFunctions
  */
  run: function (testFunctions) {
    var result, test, pass=0, fail=0, e;
    this.reset();
    for (var i=0, len=testFunctions.length; i<len; i++) {
      test = new Detest.Test(testFunctions[i]);
      if (this.runTest(test)) { 
        ++pass;
      } else {
        ++fail;
      }
      e = this.logTest(test);
      if ((i==0) || ((!test.ok) && fail==1)) e.onclick();
    }
    this.summaryArea.textContent = pass + ' passed, ' + fail +' failed.';
    if (!fail) {
      this.summaryArea.style.background = '#393';
    } else {
      this.summaryArea.style.background = '#933';
    }
  },
  
  //
  // internal stuff
  //
  
  runTest: function (test) {
    var msg;
    try {
      test.fn();
      test.status = test.ok ? 'pass' : 'FAIL';
    } catch (e) {
      console.log(e);
      test.status = 'ERROR';
      test.error = e;
      test.ok = false;
    }
    return test.ok;
  },
  
  reset: function() {
    while (this.testArea.firstChild) { 
      this.testArea.removeChild(this.testArea.firstChild);
    };
  },
  
  log: function (msg, detail) {
    var e = document.createElement('li');
    var pre = document.createElement('pre');
    pre.textContent = msg;
    e.onclick=function(){
      while (detailArea.firstChild) detailArea.removeChild(detailArea.firstChild);
      var pre = detailArea.appendChild(document.createElement('pre')),
          code = pre.appendChild(document.createElement('code'));
      code.textContent=detail;
      if (typeof hljs != 'undefined') {
        hljs.highlightBlock(pre);
      }
    };
    if (msg.match(/^(fail|error)/i)) {
      pre.style.color = '#900';
    }
    e.appendChild(pre);
    this.testArea.appendChild(e);
    return e;
  },
  
  logTest: function (test) {
    var count = test.ok ? (test.passCount + '/' + test.assertions.length) :
                test.assertions.join('').replace(/0/g,'x').replace(/1/g,'.'),
        msg = test.status +' (' + count + '): ' + test.title;
    if (test.error) {
       msg += '\n' + test.error;
    } 
    return this.log(msg, test.fn);
  }

};

if (typeof exports != 'undefined') {
  exports['Detest'] = Detest;
}
