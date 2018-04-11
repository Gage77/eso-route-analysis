//***************************************************************
// Global variables
//***************************************************************

var numRoutes = 0;  // Total number of unique routes for chosen csv
var uniqueRoutes = [];  // Array of unique routes for chosen csv
var tableHeaders = ["Driver", "Address", "City", "State", "Zip", "Route", "Full Address"];

//***************************************************************
// Perform the route generation / Google Maps stuff and thangs
//***************************************************************

// Initiate the map
function initMap() {
  // Set preset options for the google maps instance
  var options = {
    zoom:12,
    center:{lat: 35.2226, lng: -97.4395}
  }

  // Create google maps special variables
  var directionsService = new google.maps.DirectionsService;  // Used to calculate directions
  var directionsDisplay = new google.maps.DirectionsRenderer; // Renders the results of the DirectionsService calculations
  var map = new google.maps.Map(document.getElementById("map"), options); // The map itself

  // Set what map the directionsDisplay should use
  directionsDisplay.setMap(map);
}

// Generate the full route of the route chosen from the dropdown menu
// Also create a table of the route
function generateRoute() {
  // Get and store the currently selected option in the routeList select tag from the html page
  var select = document.getElementById("routeList");
  var selectedRoute = select.options[select.selectedIndex].value;
  console.log("generateRoute entered with selection" + selectedRoute);

  // Create the html table of the associated route
  generateTable(selectedRoute);

  // Set show table button to enabled
  document.getElementById("showtablebutton").disabled = false;
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
  var rows = [];
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');  // Next split by ',' to get individual elements in each row
    var col = [];
    for (var j = 0; j < data.length; j++) {
      col.push(data[j]);  // Create an array for column information for the current row
    }
    rows.push(col); // Put all of these columns into the row array (3-D array kinda)
  }
  console.log(rows);

  updateDropDown(rows);

}

//***************************************************************
// Edit HTML page directly
//***************************************************************

// Toggle the dropdown menu
function showDropDown() {
  console.log("show drop down pressed");
  if (document.getElementById("dropdowndiv").style.display == "block") {
    document.getElementById("dropdowndiv").style.display = "none";
  }
  else {
    document.getElementById("dropdowndiv").style.display = "block";
  }
}

// Update the items in the routes dropdown menu
function updateDropDown(rows) {
  // Run through the route names and add them to a global variable uniqueRoutes
  // if they are not already in that array
  for (var i = 1; i < rows.length; i++) {
    var route = rows[i][rows[i].length-1];
    console.log(route);
    // Add each unique route to the uniqueRoutes array, and increment numRoutes
    if (!(uniqueRoutes.indexOf(route) > -1)) {
      uniqueRoutes.push(route);
      numRoutes = numRoutes + 1;
    }

    // Enable the open dropdown button now that the dropdown is populated
    document.getElementById("dropdownbutton").disabled = false;
  }

  // Get the dropdown menu from the html page
  var select = document.getElementById("routeList");
  // Add HTML Select Options corresponding to the unique routes
  for (var j = 0; j < numRoutes; j++) {
    select.options[select.options.length] = new Option(uniqueRoutes[j], uniqueRoutes[j]);
  }
}

// Create the table for the selected route
function generateTable(selectedRoute) {
  // Get the table
  var table = document.getElementById("routesTable");

  // Set the table header to the currently selected route
  document.getElementById("currentRouteTableHeader").innerHTML = selectedRoute;


}

// Toggle the table
function showTable() {
  console.log("show table pressed");
  if (document.getElementById("tablediv").style.display == "block") {
    document.getElementById("tablediv").style.display = "none";
  }
  else {
    document.getElementById("tablediv").style.display = "block";
  }
}
