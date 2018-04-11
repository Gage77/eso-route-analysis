//***************************************************************
// Global variables
//***************************************************************

var rows = [];
var cols = [];
var numRoutes = 0;  // Total number of unique routes for chosen csv
var uniqueRoutes = [];  // Array of unique routes for chosen csv

//***************************************************************
// Perform the route generation
//***************************************************************

// Generate the full route of the route chosen from the dropdown menu
function generateRoute() {

}

//***************************************************************
// Reading in the CSV
//***************************************************************

// Check to see if the current browser supports FileReader
function handleFiles(files) {
  if (window.FileReader) {
    // FileReader is supported
    getAsText(files[0]);
  } else {
    alert("FileReader is not supported in current browser");
  }
}

// Read in csv as text to be parsed in a different function
function getAsText(fileToRead) {
  var reader = new FileReader();
  // Read file inot memory as UTF-8 (text)
  reader.readAsText(fileToRead);
  // Handle any errors that may occur
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}

// Handle what happens when csv is read successfully
function loadHandler(event) {
  // Store the read in csv in the csv variable, then send it to the parser
  var csv = event.target.result;
  processData(csv);
}

// Handle what happens when csv is read UNsuccessfully
function errorHandler(evt) {
  if (evt.target.error.name == "NotReadableError") {
    alert("Cannot read file!");
  }
}

// Process the read in csv into rows and columns
function processData(csv) {
  var allTextLines = csv.split(/\r\n|\n/);  // First split the csv by new lines (so split into rows)
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');  // Next split by ',' to get individual elements in each row
    for (var j = 0; j < data.length; j++) {
      cols.push(data[j]);  // Create an array for column information for the current row
    }
    rows.push(col); // Put all of these columns into the row array (3-D array kinda)
  }
  console.log(rows);

  updateDropDown();
}

//***************************************************************
// Edit HTML page directly
//***************************************************************

// Toggle the dropdown menu
function showDropDown() {
  if (document.getElementById("dropdowndiv").style.display == "block") {
    document.getElementById("dropdowndiv").style.display = "none";
  }
  else {
    document.getElementById("dropdowndiv").style.display = "block";
  }
}

// Update the items in the routes dropdown menu
function updateDropDown() {
  // Run through the route names and add them to a global variable uniqueRoutes
  // if they are not already in that array
  for (var i = 0; i < rows.length; i++) {
    if ()
  }

  // Add HTML Select Options corresponding to the unique routes
}
