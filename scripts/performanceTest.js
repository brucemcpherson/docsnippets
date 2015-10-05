function testDocsPerformance() {
  // create new chunks in the docment
  
  for (var i= 0,package; i < 3; i++) {
    package = performanceTest (package)
  }
  dumpResult (package);
  
  Logger.log('i am finished');
}

function testThings() {
  doLotsOfThings ('1MR7QCbasRsAWRCeEc2baeNfyZBr2ZpMPsXxvNAHFfB4');
  Logger.log('i am finished');
}

function doLotsOfThings(docId) {
  
  var MAX = 20, MIN =2 , ROWS = 10, COLUMNS = 8, CYCLES = 20;
  var body = DocumentApp.openById (docId).getBody();
  
  // clear whats there
  body.clear();
  
  // generate some test data
  var rows = new Array(ROWS).join(',').split(',').map (function() {
    return new Array (COLUMNS).join(',').split(',').map(function() {
      return new Array(Math.floor(Math.random() * (MAX- MIN + 1)) + MIN).join(',').split(',').map(function() {
        return String.fromCharCode(Math.floor(Math.random() * (0x7E - 0x20 + 1)) + 0x20);    
      }).join('');
    });
  });

  // append a table of the given size  
  for (var i=0; i < CYCLES ; i++) {
    body.appendTable(cUseful.getRandomSheetStrings(ROWS,COLUMNS,MAX,MIN)); 
  }
}

function doGet() {
   // do the same thing but from htmlservice
 return HtmlService
      .createTemplateFromFile('testFromAddon')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function performanceTest (package) {
  return PerformanceTest.createChunk('1MR7QCbasRsAWRCeEc2baeNfyZBr2ZpMPsXxvNAHFfB4',package);
}

function dumpResult (package) {
  Logger.log(package);
  
}

var PerformanceTest = (function(pt) {
  'use strict';
  
  var ELEMENT_SIZE = 1000, ELEMENT_ROWS = 10, ELEMENT_COLUMNS = 8;
  
  function action_ ( packet , action , argOb , measure, func ) {
    
    var start = new Date().getTime();
    var result = func (argOb);

    packet.push ( {
      action:action,
      elapsed:new Date().getTime() - start,
      measure:measure
    });
    return result;
  }
  
    
  /**
   * create a bunch of pages
   */
  pt.createChunk = function (docId,packet) {
    
    if (!packet) {
      // first in, clear the document
      DocumentApp.openById (docId).getBody().clear();
    }
    var packet = packet || []; 

    // open a document
    var doc = action_ (packet , 'open' , docId , 0, function (id) {
      return DocumentApp.openById (id);
    }); 

    // get the body
    var body = action_ (packet , 'body' , null , 0 ,function () {
      return doc.getBody(); 
    }); 
    
    // add some stuff
    var stuff = new Array(ELEMENT_SIZE+1).join(new Date().getTime().toString(36));
    for (var j=0,rows=[] ; j < ELEMENT_ROWS ; j++) {
      rows[j] = [];
      for (var i = 0  ; i < ELEMENT_COLUMNS ;i++) {
        rows[j].push(stuff); 
      }
    }
    var elem = action_ (packet , 'chunk' , null, stuff.length  , function () {
      return cUseful.rateLimitExpBackoff(function () {
          return body.appendTable(rows); 
      });
    });
    // get the body as text
    var text = action_ (packet , 'text' , null , 0 ,function () {
      return body.getText(); 
    });
    // add the size of the text now
    packet[packet.length-1].measure = text.length;
    
    
    return packet;
  };


  return pt;
  
})(PerformanceTest || {});
