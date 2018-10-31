var DocUtils = (function myFunction(docUtils) {
  
  /**
   * display elements and their children
   * @param {Element} elem the element
   * @param {number} [indent=0] number of characters to indent
   * @param {boolean} [partial=false] element is only partial
   * @param {number} [start] start of partial element
   * @param {number} [finish] finish of partial element
   */
  docUtils.displayItems = function(elem, indent,partial,start,finish) {
      
      // default is no indentation
      indent = indent ||0;
  
      // get the element type
      var type = elem.getType();
  
      try {
        // not all elements can be cast as text
        var snip = elem.asText().getText().slice ( 
            partial ? start: 0, partial ? finish + 1 : 20);
      }
      catch(err) {
        var snip = "..no extractable text.."
      }
      
      Logger.log (new Array(indent+1).join("-") + 
        type + ":" + snip + (partial ? '(partial)' : '') + 
        ' : index:' + elem.getParent().getChildIndex(elem)); 
      
      // do any children and recurse
      if (elem.getNumChildren) {
        for (var i= 0; i < elem.getNumChildren() ; i++) {
          docUtils.displayItems ( elem.getChild(i) , indent +2);
        }
      }
  };

  
  /**
   * insert a element at the current element 
   * @param {string} insertName function type (eg Paragraph);
   * @param {Element} elem elem at which to insert
   * @param {*} content the content to insert
   * @param {boolean} [after=false] whether to insert after the given element
   * @return {Paragraph} the inserted paragraph
   */
  docUtils.insertElement = function( insertName, elem , content, after) {
    
    var functionName = 'insert' + insertName;
  
    // the place to insert the paragraph is in the first container element that can do it.
    for(var item = elem, parent; item && (parent = item.getParent()) && 
        typeof parent[functionName] !== 'function'  ; item = parent) {       
    }

    if (!parent) throw 'cannot not insert ' + insertName;
  
    // get where it's going to be inserted
    var index = parent.getChildIndex(item);
    if (after) index++;
    if (index >= parent.getNumChildren()) {
      // append
      functionName = 'append' + insertName;
      return typeof content !== typeof undefined ? 
        parent[functionName](content) : parent[functionName](content) ;
    }
    else {
      // insert
      return typeof content !== typeof undefined ? 
        parent[functionName](index, content) :  parent[functionName](index);
    }
    
  };


  /**
   * given a range, extract the contents and show the element
   * @param {Range} selected the range
   */
  docUtils.showRange = function (selected) {
    selected.getRangeElements().forEach(function(d) {
     docUtils.displayItems (d.getElement(),0,d.isPartial(), 
        d.getStartOffset(), d.getEndOffsetInclusive());
    });
  };

  /**
   * find all occurence of text in the document and make a range of it
   * @param {Document} doc the document
   * @param {string} textPattern a regex string
   * @return {Range} the range
   */
  docUtils.makeRangeFind = function (doc, textPattern) {
   
   var body = doc.getBody();
   
   var rangeElement=null, build = doc.newRange(); 
   
   while (rangeElement = body.findText(textPattern, rangeElement)) {
     if (rangeElement.isPartial()) {
       build.addElement(rangeElement.getElement(), 
         rangeElement.getStartOffset(), rangeElement.getEndOffsetInclusive());
     }
     else {
       build.addElement(rangeElement.getElement());
     }
   }
  
    return build.build();
  };
  
/**
 * if there's an active selection then use that, 
 * otherwise use the containing element of the cursor
 * @param {Document} doc the target document
 * @return {Range} the text range that needs to be dealt with
 */
 docUtils.getTarget = function(doc) {

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
    return selected;
}


  return docUtils;
   
})(DocUtils || {});

  
