// sometimes header levels get screwed up and need to be readjusted
// this will ensure that a header level is never more than one higher than the one before it
function workHeaderLevels () {
  
  var doc = DocumentApp.getActiveDocument();
  
  // set this to false when it looks like it does what's needed
  var DRY_RUN = false;
  
  // these are the only ones to be considered
  var heirarchy = [ 
    DocumentApp.ParagraphHeading.HEADING1,
    DocumentApp.ParagraphHeading.HEADING2,
    DocumentApp.ParagraphHeading.HEADING3,
    DocumentApp.ParagraphHeading.HEADING4,
    DocumentApp.ParagraphHeading.HEADING5,
    DocumentApp.ParagraphHeading.HEADING6
  ];

  
  doc.getBody().getParagraphs().reduce (function (p,c) {
    var heading = c.getHeading();
    var idx = heirarchy.indexOf(heading);
    
    // check it's an interesting one
    if (idx !== -1) {
      if (idx > p+1) {
        p++;
        Logger.log( (DRY_RUN ? ' would have adjusted' : ' adjusting') + 
          c.getText().slice(0,10) + ' from ' + heading + ' to ' + heirarchy[p]);
        
        // really do it
        if (!DRY_RUN) {
          c.setHeading (heirarchy[p]);
        }

        
      }
      else {
        p = idx;
      }
    }
    return p;
  },-1);
}

