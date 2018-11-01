// find all the one cell tables 
// set to a standard

function cleanUp() {

    var doc = DocumentApp.getActiveDocument();

    // these are the properties to set in selected tables
    var attribs = {
      cell: [{
        value: "#ffffff",
        attribute: "BackgroundColor",
        types: ["VBA"]
      }, {
        value: "#f3f3f3",
        attribute: "BackgroundColor",
        types: ["JS"]
      }],
      text: [{
        value: 9,
        attribute: "FontSize"
      }, {
        value: "Consolas",
        attribute: "FontFamily"
      }, {
        value: "#000000",
        attribute: "ForegroundColor",
        types: ["JS"]
      }, {
        value: "#434343",
        attribute: "ForegroundColor",
        types: ["VBA"]
      }],
      table: [{
        value: "#d9d9d9",
        attribute: "BorderColor",
        types: ["VBA", "JS"]
      }, ]
    };

    // look at all the tables
    doc.getBody().getTables().forEach(function(d) {

      // im only doing 1 cell tables
      if (d.getNumChildren() === 1) {

        // single cell table
        var cell = d.getCell(0, 0);
        var text = cell.editAsText();

        // simple test for language is look for semicolons.. not perfect but it'll do
        var type = text.getText().indexOf(';') === -1 ? 'VBA' : 'JS';

        // now set the attributes at each level
        setAttributes(attribs.table, d, type);
        setAttributes(attribs.cell, cell, type);
        setAttributes(attribs.text, text, type);
      }
    });

    // set the attributes          
    function setAttributes(obAttribs, ob, type) {
      (obAttribs || []).forEach(function(d) {
        if (!d.types || !d.types.length || d.types.some(function(e) {
            return e === type;
          })) {
          ob['set' + d.attribute] ( d.value);
        }
      });
    }
}
