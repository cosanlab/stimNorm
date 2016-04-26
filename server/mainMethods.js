Meteor.methods({
	//Add each new user to the database and assign them to a randomly selected stimulus, storing the stimulus data with the user data
	'addUser':function(currentUser, workerId){
		var doc = _.sample(Stims.find().fetch(),1);
		var responseData = [
			{A:[],B:[]},
			{A:[],B:[]},
			{A:[],B:[]}
		];
		var data = {
			_id: currentUser,
			workerId: workerId,
			enterTime: new Date(),
			status: 'consent',
			consent: false,
			stimData: doc,
			responses: responseData
		};
		Responses.insert(data);
	},
	//Consent checker that triggers lobby event or routes user to exit-survey
	'checkConsent': function(currentUser,consent){
		var asst = TurkServer.Assignment.getCurrentUserAssignment(currentUser);
		var batch = TurkServer.Batch.getBatch(asst.batchId);
		if (consent){
			Meteor.call('updateInfo',currentUser,{'consent':true,'status':'instructions'},'set');
			var emitter = batch.lobby.events;
			console.log('TURKER: ' + Date() + ': ' + asst.workerId + ' consented!\n');
			emitter.emit('consent-received',asst);
		} else{
			Meteor.call('updateInfo',currentUser,{'consent':false,'status':'noConsent'},'set');
			asst.showExitSurvey();
			console.log('TURKER: ' + Date() + ': ' + asst.workerId + ' did NOT consent! Sent to exit survey!\n');
		}
	},
	'addResponses': function(currentUser,data){
		var doc = Responses.findOne(currentUser);
		var idx = String(_.findIndex(doc.responses, function(d){return d.A.length == 0 && d.B.length==0;}));
		var queryDat = {};
		queryDat['responses.'+idx+'.A'] = data[0];
		queryDat['responses.'+idx+'.B'] = data[1];
		Responses.update(currentUser,{$set:queryDat});
		if (idx == doc.responses.length-1){
			Meteor.call('updateInfo',currentUser,{'status':'endSurvey'},'set');
			var exp = TurkServer.Instance.currentInstance();
			exp.teardown(returnToLobby = true);
		}
	},

	//General purpose document modification function
	'updateInfo': function(currentUser,data,operation){
		if(operation == 'set'){
			Responses.update(currentUser, {$set: data});
		} else if(operation == 'inc'){
			Responses.update(currentUser, {$inc: data});
		} else if(operation == 'dec'){
			Responses.update(currentUser, {$dec: data});
		}

	}
});

//Function to make a variable-based dot-notation query for updating a nested mongo document 
function makePQuery(currentUser,field,value){
	var pKey = {};
	pKey['players.' + currentUser + '.' + field] = value;
	return pKey;
}