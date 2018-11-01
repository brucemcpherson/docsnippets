// create a table of contents, but only with the selected heading levels.
function createToc () {
  
  var doc = DocumentApp.getActiveDocument();
  
  // set this to false when it looks like it does what's needed
  var DRY_RUN = false;
  
  // this is the list of heading types to include in the toc
  var heirarchy = [ 
    DocumentApp.ParagraphHeading.HEADING1,
    DocumentApp.ParagraphHeading.HEADING2
  ];
  
  // this is where we are - either replace a selection, or enter at current position
  
  // see if there is a current selection
  var selected = doc.getSelection();
  
  // otherwise create a range for the current element
  if (!selected) {
    // the current position
    var cursor = doc.getCursor();
    
    if (cursor) {
      
      // the element containing the current position
      var element = cursor.getElement();
      
      // now add that entire element to a new range
      if (element) {
        selected = doc.newRange().addElement(element).build();
      }
    }
  }

  
  doc.getBody().getParagraphs().forEach (function (d,i) {
    
    var heading = d.getHeading();
    var idx = heirarchy.indexOf(heading);
    
    // check it's an interesting one
    if (idx !== -1) {
      
      // if only blank then demote to normal text
      if (!d.getText().replace(/\s/gmi,"")) {
        if (!DRY_RUN) {
          d.setHeading (demote);
        }
        Logger.log( (DRY_RUN ? ' would have adjusted' : ' adjusting') + 
          ' paragraph ' + i + ' from ' + heading + ' to ' + demote);
      }
    }
  });
}

