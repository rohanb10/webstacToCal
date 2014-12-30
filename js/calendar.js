// *
// All the authorization functions
// *
var clientId = '958398529813-dsebceuap5kr2pjfdskq7rhrimh7p34n.apps.googleusercontent.com';
var apiKey = 'AIzaSyDEiPoOLx-XZvaPSJCRwBi9hwebeo_d4fA';
var scope = 'https://www.googleapis.com/auth/calendar';
// api name: calendar
// api version: v3

var loggedin = false;
var validFail = false;

/* Called when Google's Javascript client loads */
function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
}

/* Called when someone presses the login button */
function authorize(event) {
	loggedin = false;
	// Working...
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('authorize-button');
	validFail = false;
	if (authResult && !authResult.error) {
	
		if (validateToken(authResult)) {
			loggedin = true;
			authorizeButton.style.visibility = 'hidden';
		} else {
			validFail = true;
			loginFailed();
		}
		
	}
	else
		loginFailed();
}

function loginFailed() {
	console.log("Login failed.")
}

function logout() {

}

/* 
 * Sends a request to Google's servers to make sure that our access token was
 * not originally issued to a different app.  Returns true if validation
 * succeeded, false if not.  This function is synchronous.
 */
function validateToken(token) {
	if (!token)
		return false;

	url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=";
	url += token.access_token;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url, false);
	xmlhttp.send();
	
	try { response = jQuery.parseJSON(xmlhttp.responseText); }
	catch (err) { return false; }
	return (!response.error && response.audience == clientId);
}

// *
// All the add to calendar functions below...
// *

/* Creates the URI for HTTP post requests from a calendar ID. */
function convertCalId(calId) {
	return 'https://www.googleapis.com/calendar/v3/calendars/' + calId + '/events';
}

/*
 * Searches for a calendar with summary of 'Classes', and if there isn't one,
 * creates it.  Returns a promise; the success handler will be passed the
 * postUri.
 */
var postUri = null;
var promise = null;
function getClassCal() {
	if (!promise) {
		promise = gapi.client.request({ // Get calendar list
			'path':'https://www.googleapis.com/calendar/v3/users/me/calendarList',
			'params': {'minAccessRole': 'owner'}
		}).then(searchCals)
			.then(makeNewCal);
	}
	
	return promise;
}

/*
 * Returns the calendar ID of the calendar with the name of "Classes",
 * or null if there was no such calendar.
 */
function searchCals(response) {
	cals = response.result.items;
	for (index in cals) {
		if (cals[index].summary == 'Classes') { // Class calendar found
			postUri = convertCalId(cals[index].id);
			return postUri;
		}
	}
	return null;
}

/*
 * If postUri is empty, makes a new calendar with name of "Classes".
 * Returns the postUri.
 */
function makeNewCal() {
	if (postUri)
		return postUri;

	return gapi.client.request({
		'path':'https://www.googleapis.com/calendar/v3/calendars',
		'method': 'POST',
		'body': {'summary': 'Classes'}
	}).then( function(response) {
		postUri = convertCalId(response.result.id);
		return postUri;
	});
}

function postEvent(postUri, body) {
	return gapi.client.request({
		'path': postUri,
		'method': 'POST',
		'body': body
	});
}

function sendEventRequest(request, rowId) {
	getClassCal()
		.then( function(postUri) {
			return postEvent(postUri, request);
		},
		function(err) { // getClassCal failed
			promise = null; // Reset getClassCal's promise so we can retry
			
			if (err.result) // Whatever happens, let the next error handler take it
				throw('Error getting your calendar: ' + err.result.error.message);
			else
				throw(err);
		})
		
		.then ( function() { // Success!
			originRow = document.getElementById(rowId);
			btn = $(originRow.children[4].children[0]);
			btn.replaceWith("<a class='btn btn-success'><span class='glyphicon glyphicon-ok'></span> Added</a>");
		},
		function(err) { // All errors eventually find their way here.
			if (typeof(err) == "string") // Passed from above block
				reason = err;
			else if (err.result)
				reason = 'Error trying post the event: ' + err.result.error.message;
			else
				reason = 'Unexpected exception: ' + err;
			
			originRow = document.getElementById(rowId);
			btn = $(originRow.children[4].children[0]);
			btn.replaceWith(makeErrorButton(reason, rowId));
		});
}

/*
 * Called when a user presses an "Add to Google Calendar" button
 */
function addBtnPressed(rowId) {
	if (validFail) {
		error("Auth fail");
		return;
	}
	if (!loggedin) {
		authorize();
		return;
	}
	
	originRow = document.getElementById(rowId);
	originRow.children[1].removeAttribute("style"); // Remove red borders from the catch block
	originRow.children[2].removeAttribute("style");
	
	btn = $(originRow.children[4].children[0]);
	btn.tooltip('destroy');
	try {
		request = genRequestBody(originRow);
	}
	catch (badCol) {
		if (badCol == 1) { // Days of the week
			btn.replaceWith(makeErrorButton("Select at least one day of the week.", rowId));
		}
		else if (badCol == 2) { // Start and end time
			btn.replaceWith(makeErrorButton("Start time must be before end time", rowId));
		}
		else // ???
			btn.replaceWith(makeErrorButton("Unexpected exception: "+badCol, rowId));
			
		originRow.children[badCol].setAttribute("style", "border: 2px solid red;");
		return;
	}
	
	btn.replaceWith("<a class='btn btn-default disabled'>Working...</a>");
	sendEventRequest(request, rowId);
}

function makeErrorButton(reason, id) {
	errBtn = $("<a class='btn btn-danger' onclick= data-toggle='tooltip' data-placement='top'>Error - retry?</a>");
	errBtn.attr("title", reason);
	errBtn.attr("onclick", "addBtnPressed('"+id+"')");
	errBtn.tooltip(); // From Bootstrap
	return errBtn;
}