var clientId = '958398529813';
var apiKey = 'AIzaSyDEiPoOLx-XZvaPSJCRwBi9hwebeo_d4fA';
var scope = 'https://www.googleapis.com/auth/calendar';

function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
	window.setTimeout(checkAuth,1);
}

function checkAuth() {
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('authorize-button');
	if (authResult && !authResult.error) {
		authorizeButton.style.visibility = 'hidden';
		//makeApiCall();
	} else {
		authorizeButton.style.visibility = '';
		authorizeButton.onclick = handleAuthClick;
	}
}

function handleAuthClick(event) {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
	return false;
}