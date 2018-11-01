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
  
  var MAX = 40, MIN = 20 , ROWS = 20, COLUMNS = 8, CYCLES = 100;
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
    body.appendParagraph('table ' + i);
    body.appendTable(rows); 
  }
}

function doGet() {
   // do the same thing but from htmlservice
 return HtmlService
      .createTemplateFromFile('testFromAddon')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function performanceTest (package,initiated) {
  return PerformanceTest.createChunk(
    '1MR7QCbasRsAWRCeEc2baeNfyZBr2ZpMPsXxvNAHFfB4',
    package,
    initiated
  ); 
}

function dumpResult (package) {
  // write the data to the sheet
  new cSheetExec.SheetExec()
    .sheetOpen ('1Higg488LQnUzuvfXphD0fTaOqqpdAPDbwlWfokZYPyk','initiated')
    .clearContent()
    .setData (package);
}

var PerformanceTest = (function(pt) {
  'use strict';
  
  var MAX = 200, MIN = 50, ROWS = 40, COLUMNS = 10;
  
  function action_ ( packet , action , argOb , measure, func ) {
    
    var start = new Date().getTime();
    var result = func (argOb);

    packet.push ( {
      action:action,
      start:start,
      elapsed:new Date().getTime() - start,
      measure:measure
    });
    return result;
  }
  
    
  /**
   * create a bunch of pages
   */
  pt.createChunk = function (docId,packet,initiated) {
    
    if (!packet) {
      // first in, clear the document
      DocumentApp.openById (docId).getBody().clear();
    }
    var packet = packet || []; 
    
    action_ (packet , 'cycle', null, initiated , function () {
      // open a document
      var doc = action_ (packet , 'open' , docId , 0, function (id) {
        return DocumentApp.openById (id);
      }); 
      var openPacket = packet[packet.length-1];
      
      // get the body
      var body = action_ (packet , 'body' , null , 0,function () {
        return doc.getBody(); 
      }); 
      
      // get the body as text before adding some more
      var text = action_ (packet , 'pretext' , null , 0 ,function () {
        return body.getText(); 
      });
      openPacket.measure = text.length;
      
      var para = 'Writing another table';
      var elem = action_ (packet , 'paragraph' , para, para.length  , function (stuff) {
        return body.appendParagraph(stuff); 
      });
      
      // add some stuff
      var stuff = cUseful.getRandomSheetStrings(ROWS,COLUMNS,MAX,MIN);
      var elem = action_ (packet , 'chunk' , stuff, 0 , function () {
        return body.appendTable(stuff); 
      });
      
      // get the body as text
      var postText = action_ (packet , 'posttext' , null , 0 ,function () {
        return body.getText(); 
      });
      // add the size of the text now
      packet[packet.length-1].measure = postText.length;
      
      // and on the previous
      packet[packet.length-2].measure = postText.length - text.length;
      
      // close
      /*
      action_ (packet , 'saveandclose' , null, postText.length  , function () {
        doc.saveAndClose();
      });
      */
    
    });
    return packet;
  };


  return pt;
  
})(PerformanceTest || {});
