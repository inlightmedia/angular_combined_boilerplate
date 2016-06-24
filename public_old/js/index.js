$(function() {
    $.getJSON('http://127.0.0.1:3006/message', {device: 'browser'}, function(data) {
        // Get info sent from express server
		console.log(data.message);
		alert('Express Server Says:' + data.message + '!');
    });
});
