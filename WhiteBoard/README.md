# A handy script for classifying and grouping whiteboard data on export. 

## Usage

- Create a whiteboard
- Put a load of unstructured notes on it
- Brainstorm away
- When done, draw some boxes to group the notes
- Give each box a textbox for a heading
- Make sure the notes are inside the boxes
- Export it to html and open the html
- Paste ExtractWhiteboard.js into the developer console. 
- Run findIntersectingShapesAndPlainText() from the developer console for an object-based representation
- Run generateMarkdownTable(findIntersectingShapesAndPlainText()) from the developer console for a markdown table representation.

You will get a JS / JSON output with the classification of your boxes and sub-texts. 

- Optionally look in the commented part of the script for pulling metadata from extra cards outside of your boxes.
