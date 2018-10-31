// blank lines in documetns are sometimes set to header levels rather thannoemal text.
// this converts them to normal text
function demoteHeaderLevels () {
  
  var doc = DocumentApp.getActiveDocument();
  
  // set this to false when it looks like it does what's needed
  var DRY_RUN = false;
  
  // this is the list of heading types to convert..(them all in this case)
  var heirarchy = [ 
    DocumentApp.ParagraphHeading.HEADING1,
    DocumentApp.ParagraphHeading.HEADING2,
    DocumentApp.ParagraphHeading.HEADING3,
    DocumentApp.ParagraphHeading.HEADING4,
    DocumentApp.ParagraphHeading.HEADING5,
    DocumentApp.ParagraphHeading.HEADING6,
    DocumentApp.ParagraphHeading.SUBTITLE,
    DocumentApp.ParagraphHeading.TITLE
  ];

  // what to set blank lines to,normally it would be normal
  var demote = DocumentApp.ParagraphHeading.NORMAL;
  
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

