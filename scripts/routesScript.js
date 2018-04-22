//***************************************************************
// @Author: Hunter Black
// @Version: 0.8
//
// Notes:
//***************************************************************

//***************************************************************
// Global variables
//***************************************************************

var bigRouteArray = [];
var numRoutes = 0;  // Total number of unique routes for chosen csv
var uniqueRoutes = [];  // Array of unique routes for chosen csv
var currentRoute = [];  // Array of the currently selected route's individual adresses
var currentRouteAddresses = []; // Array to hold actual addresses of the current route ("waypoints")
var selectedRoute = "";

var directionService; // Google maps api direction calculation
var directionsDisplay;  // Google maps api direction renderer

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
  directionsService = new google.maps.DirectionsService;  // Used to calculate directions
  directionsDisplay = new google.maps.DirectionsRenderer; // Renders the results of the DirectionsService calculations
  var map = new google.maps.Map(document.getElementById("map"), options); // The map itself

  // Set what map the directionsDisplay should use
  directionsDisplay.setMap(map);
}

// Generate the full route of the route chosen from the dropdown menu
// Also create a table of the route
function generateRoute() {
  // Get and store the currently selected option in the routeList select tag from the html page
  var select = document.getElementById("routeList");
  selectedRoute = select.options[select.selectedIndex].value;
  console.log("generateRoute entered with selection" + selectedRoute);

  // Create the html table of the associated route
  generateTable(selectedRoute);

  // Set show table button to enabled
  document.getElementById("showtablebutton").disabled = false;
}

function generateDirections() {
  console.log("generateDirections entered");

  var start = "Norman Regional Hospital, Norman, OK";  // Norman Regional Hospital lat/long

  for (var i = 0; i < currentRouteAddresses.length; i++) {
    console.log(currentRouteAddresses[i]);
  }

  directionsService.route({
    origin: start,
    waypoints: currentRouteAddresses,
    optimizeWaypoints: true,
    destination: currentRouteAddresses[currentRouteAddresses.length-1].location,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      // show directions
      directionsDisplay.setDirections(response);
      // calculate time
      showRouteData(response);
    }
    else {
      window.alert("Directions request failed due to " + status);
    }
  });
}

function showRouteData(directionResult) {
  var distance = 0;
  var time = 0;
  var numStops = 0;

  // Grab distance and time from directionResult object
  for (var i = 0; i < directionResult.routes[0].legs.length; i++) {
    distance += directionResult.routes[0].legs[i].distance.value;
    time += directionResult.routes[0].legs[i].duration.value;
  }

  // Convert distance and time variables
  distance = (Math.ceil(distance/1609.34*100)/100);
  time = (Math.ceil(time/60*100)/100);
  numStops = directionResult.routes[0].legs.length - 1;

  // Show distance and time variables in console
  console.log(distance);
  console.log(time);
  console.log(numStops)

  // Update direction data table
  dataTable = document.getElementById("directionDataTable");
  var newRow = dataTable.insertRow(dataTable.rows.length);
  var newCell;
  for (var j = 0; j < 4; j++) {
    newCell = newRow.insertCell(j);
    if (j === 0) {
      newCell.innerHTML = selectedRoute;
    }
    else if (j === 1) {
      newCell.innerHTML = numStops;
    }
    else if (j === 2) {
      newCell.innerHTML = distance;
    }
    else if (j === 3) {
      newCell.innerHTML = time;
    }
  }
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

  // Empty out the bigRouteArray in case there is any info in their currently
  // This is used for when user wants to switch CSV
  bigRouteArray = [];

  bigRouteArray = rows;

  updateDropDown(rows);

  // Empty out the direction data table of any old data
  var directionTable = document.getElementById("directionDataTable");
  var directionHeaderCount = 1;
  var rowCount = directionTable.rows.length;
  for (var i = directionHeaderCount; i < rowCount; i++) {
    directionTable.deleteRow(directionHeaderCount);
  }
}

//***************************************************************
// Edit HTML page directly
//***************************************************************

// Toggle the dropdown menu to visible
function showDropDown() {
  if (document.getElementById("dropdowndiv").style.display == "block") {
    document.getElementById("dropdownbutton").value = "Show route dropdown";
    document.getElementById("dropdowndiv").style.display = "none";
    console.log("hide drop down pressed");
  }
  else {
    document.getElementById("dropdowndiv").style.display = "block";
    document.getElementById("dropdownbutton").value = "Hide route dropdown";
    console.log("show drop down pressed");
  }
}

// Update the items in the routes dropdown menu
function updateDropDown() {
  uniqueRoutes.length = 0;
  // Run through the route names and add them to a global variable uniqueRoutes
  // if they are not already in that array
  for (var i = 1; i < bigRouteArray.length; i++) {
    var route = bigRouteArray[i][bigRouteArray[i].length-1];
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

  // Empty out whatever is in there
  select.options.length = 0;

  // Add HTML Select Options corresponding to the unique routes
  for (var j = 0; j < numRoutes; j++) {
    select.options[select.options.length] = new Option(uniqueRoutes[j], uniqueRoutes[j]);
  }
}

// Create the table for the selected route
function generateTable(selectedRoute) {
  // Get the table
  var table = document.getElementById("routesTable");

  // Get rid of any currently populated rows in the table to prevent "stacking"
  var headerCount = 2;
  var rowCount = table.rows.length;
  for (var i = headerCount; i < rowCount; i++) {
    table.deleteRow(headerCount);
  }

  // Set the table header to the currently selected route
  document.getElementById("currentRouteTableHeader").innerHTML = selectedRoute;

  // Creat column headers for the chosen route based on arrary length
  var rowCount = table.rows.length;
  var tr = table.insertRow(rowCount);

  // Clear the currently selected route array
  currentRoute = [];

  // Set the currently selected route array
  for (var i = 0; i < bigRouteArray.length; i++) {
    // If the route listed for the i'th index of bigRouteArray is the same as the currently selected route
    if (bigRouteArray[i][bigRouteArray[i].length-1] == selectedRoute) {
      currentRoute.push(bigRouteArray[i]);  // add it to the current route array
    }
  }

  // Confirm currnetRoute array is populated correctly
  for (var j = 0; j < currentRoute.length; j++) {
    console.log(currentRoute[j]);
  }

  // Add rows to the html table
  addRowsToTable(table);

  // Enable the generate direction button
  document.getElementById("directionButton").disabled = false;
}

// Toggle the table being visible
function showTable() {
  if (document.getElementById("tablediv").style.display == "block") {
    document.getElementById("showtablebutton").value = "Show table of route";
    document.getElementById("tablediv").style.display = "none";
    console.log("hide table pressed");
  }
  else {
    document.getElementById("tablediv").style.display = "block";
    document.getElementById("showtablebutton").value = "Hide table of route";
    console.log("show table pressed");
  }
}

//***************************************************************
// Utility functions
//***************************************************************

// Add rows to the table for the currently selected route
function addRowsToTable(table) {
  // Clear out any full addresses that may be in the currentRouteAddresses waypoint array
  currentRouteAddresses = [];

  console.log("Add rows to table function entered");
  // Populate table
  for (var i = 0; i < currentRoute.length; i++) {
    // Make a new row for each route in the currentRoute array
    var row = table.insertRow(table.rows.length);
    // Add 8 cells under each header item from the table
    for (var j = 0; j < 8; j++) {
      var newCell = row.insertCell(j);
      // Populate cell based on cell index
      switch (j) {
        case 0: // Name of route customer
          newCell.innerHTML = currentRoute[i][0].replace('\"', '').replace('\"', '');
          break;
        case 1: // Address
          newCell.innerHTML = currentRoute[i][1].replace('\"', '').replace('\"', '');
          break;
        case 2: // Building/room (if applicable)
          if (currentRoute[i].length == 6) {
            newCell.innerHTML = "-";
          }
          else if (currentRoute[i].length == 7) {
            var value = currentRoute[i][2];
            if (value.includes("Norman")) {
              newCell.innerHTML = "-";
            }
            else {
              newCell.innerHTML = currentRoute[i][2].replace('\"', '').replace('\"', '');
            }
          }
          else if (currentRoute[i].length == 8) {
            newCell.innerHTML = currentRoute[i][2].replace('\"', '').replace('\"', '') + currentRoute[i][3].replace('\"', '').replace('\"', '');
          }
          break;
        // The next 4 cases are based on the end of the array because of discrepencies
        // in the first few elements of the route arrays as well as varying lengths
        case 3: // City
          if (currentRoute[i][currentRoute[i].length - 4] == "\"") {
            newCell.innerHTML = "Norman";
          }
          else {
            newCell.innerHTML = currentRoute[i][currentRoute[i].length - 4].replace('\"', '').replace('\"', '');
          }
          break;
        case 4: // State
          newCell.innerHTML = currentRoute[i][currentRoute[i].length - 3].replace('\"', '').replace('\"', '');
          break;
        case 5: // Zip
          newCell.innerHTML = currentRoute[i][currentRoute[i].length - 2].replace('\"', '').replace('\"', '');
          break;
        case 6: // Route
          newCell.innerHTML = currentRoute[i][currentRoute[i].length - 1].replace('\"', '').replace('\"', '');
          break;
        case 7: // Full Address
          var fullAddress = currentRoute[i][1].replace('\"', '').replace('\"', '').replace('/', '').replace('-', '');
          fullAddress += ", Norman, Oklahoma, ";
          fullAddress += currentRoute[i][currentRoute[i].length - 2].replace('\"', '').replace('\"', '');
          newCell.innerHTML = fullAddress;
          // Add full address to the "waypoints" array
          currentRouteAddresses.push({
            location: fullAddress,
            stopover: true
          });
          break;
      }
    }
  }
}
