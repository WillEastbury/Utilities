function extractShapeInfo() {
    // Find all elements with the specified attribute
    var shapeElements = document.querySelectorAll('[data-whiteboard-type="Shape"]');

    // Create an array to store the information for each shape
    var shapesArray = [];

    // Loop through each shape element and extract information
    shapeElements.forEach(function(shapeElement) {

        // Extract x and y coordinates of the parent card
        var rect = shapeElement.children[0].getBoundingClientRect();

        // Store information in an object
        var shapeInfo = {
            leftpos: rect.left + window.scrollX,
            toppos: rect.top + window.scrollY,
            rightpos : rect.right + window.scrollX ,
            bottompos : rect.bottom + window.scrollY ,
            Notes: [],
            PlainText: ''
       };

        // Push the object to the array
        shapesArray.push(shapeInfo);

    });

    // Return the JSON array
    return shapesArray;
}

  
function extractNoteInfo() {
    // Find all elements with the specified attribute
    var noteElements = document.querySelectorAll('[data-whiteboard-type="Note"]');

    // Create an array to store the information for each note
    var notesArray = [];

    // Loop through each note element and extract information
    noteElements.forEach(function(noteElement) {

        // Extract Content
        var contentElement = noteElement.querySelector('.DraftEditor-editorContainer [data-text="true"]');
        var content = contentElement ? contentElement.textContent.trim() : '';

        // Extract Author
        var authorElement = noteElement.querySelector('.ms-Button-label');
        var author = authorElement ? authorElement.textContent.trim() : '';

        // Extract x and y coordinates of the parent card
        var rect = noteElement.children[0].getBoundingClientRect();

        // Check if content is not blank and child width/height are not null
        if (content !== '') {
        // Store information in an object
        var noteInfo = {
            Content: content,
            Author: author,
            leftpos: rect.left + window.scrollX,
            toppos: rect.top + window.scrollY,
            rightpos : rect.right + window.scrollX ,
            bottompos : rect.bottom + window.scrollY ,
        };

        // Push the object to the array
        notesArray.push(noteInfo);
        }
    });

    // Return the JSON array
    return notesArray;
}

function extractPlainTextInfo() {
    // Find all PlainText elements
    var plainTextElements = document.querySelectorAll('[data-whiteboard-type="PlainText"]');
  
    // Create an array to store the information for each PlainText
    var plainTextArray = [];
  
    // Loop through each PlainText element and extract information
    plainTextElements.forEach(function(plainTextElement) {

      // Extract x and y coordinates of the PlainText
      var rect = plainTextElement.children[0].getBoundingClientRect();;
      // var rect = plainTextElement.getBoundingClientRect();
  
      var childElement = plainTextElement.querySelector('.textBoxNotInteractive');

      // Extract text content of the PlainText
      var textContent = childElement ? childElement.textContent.trim() : '';
  
      // Store information in an object
      var plainTextInfo = {
        leftpos:  rect.left + window.scrollX,
        toppos: rect.top + window.scrollY,
        rightpos : rect.right + window.scrollX ,
        bottompos : rect.bottom + window.scrollY,
        DataText: textContent
      };
  
      // Push the object to the array
      plainTextArray.push(plainTextInfo);
    });
  
    // Return the JSON array
    return plainTextArray;
}
  
function extractAllInfo() {
  
    // Return the JSON object
    return {
        Shapes: extractShapeInfo(),
        Notes: extractNoteInfo(),
        PlainText: extractPlainTextInfo()
      };
}
function doRectanglesOverlap(rect1, rect2) {

    // rect == 
    // leftpos: leftpos,
    // toppos: toppos,
    // rightpos : rightpos,
    // bottompos : bottompos

    // Check if the rectangles overlap in the X axis (access the properties by NAME)
    var overlapX = false;
    if (rect1.leftpos <= rect2.leftpos && rect1.rightpos >= rect2.leftpos) {
        overlapX = true;
        }
    else if (rect2.leftpos <= rect1.leftpos && rect2.rightpos >= rect1.leftpos) {
        overlapX = true;
        }
    
    
    // Check if the rectangles overlap in the Y axis
    var overlapY = false;
    if (rect1.toppos <= rect2.toppos && rect1.bottompos >= rect2.toppos) {
        overlapY = true;
        }
    else if (rect2.toppos <= rect1.toppos && rect2.bottompos >= rect1.toppos) {
        overlapY = true;
        }

    // Return true if there is both X and Y overlap
    return overlapX && overlapY;
  }

function findIntersectingShapesAndPlainText() {

    // Loop through the result of extractAllInfo() and find intersecting shapes
    const data = extractAllInfo();

    // Loop through each shape, for each PlainText
    data.Shapes.forEach(function(shape) {
        data.PlainText.forEach(function(plainText) {
            if (CheckIntersection(shape, plainText)) shape.PlainText = plainText.DataText;

        }
    )});

    // Now look through each note and find intersecting shapes
    data.Notes.forEach(function(note) {
        // Loop through each shape
        data.Shapes.forEach(function(shape) {
            if(CheckIntersection(note,shape)) shape.Notes.push(note);
        });
    });

    var newobj = {};
    newobj.notes = [];
    newobj.cards = data.Shapes.map(shape => {
        var shapeInfo = {
            Category: shape.PlainText,
            Hotspots: shape.Notes.map(note => ({
                Author: note.Author,
                Content: note.Content
            }))
        };
        return shapeInfo;
    });

    //newobj.Persona = data.Notes.filter (note => note.Content.startsWith("Persona:")).map(note => note.Content.replace("Persona:","").trim())[0];
    //newobj.Highlevel = data.Notes.filter (note => note.Content.startsWith("30,000 foot view:")).map(note => note.Content.replace("30,000 foot view:","").trim())[0];
    //newobj.FocusScenario = data.Notes.filter (note => note.Content.startsWith("Focus Scenario:")).map(note => note.Content.replace("Focus Scenario:","").trim())[0];
    //newobj.Project = data.Notes.filter (note => note.Content.startsWith("Project:")).map(note => note.Content.replace("Project:","").trim())[0];
    //newobj.Customer = data.Notes.filter (note => note.Content.startsWith("Customer:")).map(note => note.Content.replace("Customer:","").trim())[0];
    return newobj;

}

function CheckIntersection(shape, plainText) {
    
    // first we need to check if the shape and plaintext intersect
    // checking if the shape leftpos is less than the plaintext rightpos
    // and if the shape rightpos is greater than the plaintext leftpos
    // and if the shape toppos is less than the plaintext bottompos
    // and if the shape bottompos is greater than the plaintext toppos
    // if all of these are true, then the shape and plaintext intersect.
        
    if (
        shape.leftpos < plainText.rightpos && 
        shape.rightpos > plainText.leftpos && 
        shape.toppos < plainText.bottompos && 
        shape.bottompos > plainText.toppos
    ) {
        return true;
    }
    return false;
}

  // Example usage
  console.log(findIntersectingShapesAndPlainText());
