Parse.Cloud.afterSave("MoMGames", function(request) {
	console.log("NoMGame afterSave Triggered");
	var objectId = request.object.id.toString();
	var Players = Parse.Object.extend("Players");
	var query = new Parse.Query(Players);
	query.equalTo("SendMoMResponseEmail", true);
	query.find({
		success: function(results) {
			console.log(results);
			console.log("Query Player Find success - " + results.length);
			for (var i = 0; i < results.length; i++) { 
				var object = results[i];
				var playerid = object.id.toString();
				var name = object.get('Name');
				var email = object.get('Email');
				var phone = object.get('Phone');
				var uid = generateUUID();
				var MoMResponse = Parse.Object.extend("MoMResponse");
				var momResponsebject = new MoMResponse();
				momResponsebject.save({UID:uid, MoMResponseGameId : objectId, PlayerId : playerid}, {
					success: function(object){
						sendEmail('This is a test','Test Email', 'ChicagoTigers@chicric.com','Chicago Tigers Admin', 'shobhit.kasliwal@gmail.com','Shobhit Kasliwal');
					},
					error: function(model, error) {
					}    
				})
			}},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
});

function sendEmail(text,subject,fromEmail,fromName,toEmail,toName)
{
	var Mandrill = require('mandrill');
	Mandrill.initialize('URiGCmSpZMR58CU13OZ3ug');
	console.log("Sending Email");
	Mandrill.sendEmail({
		message: {
			text: text,
			subject: subject,
			from_email: fromEmail,
			from_name: fromName,
			to: [
			{
				email: toEmail,
				name: toName
			}
			]
		},
		async: true
	},{
		success: function(httpResponse) {
			console.log(httpResponse);
			
		},
		error: function(httpResponse) {
			console.error(httpResponse);

		}
	});
}


function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};