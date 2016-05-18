Meteor.methods({
	'addUser':function(currentUser, workerId){
		var gameNum = Counter.findOne('counter').val;
		var gameId = Counter.findOne({idx:gameNum})._id;
		var doc = Stims.findOne(gameId);
		var data = {
			_id: currentUser,
			workerId: workerId,
			enterTime: new Date(),
			status: 'consent',
			consent: false,
			stimData: doc,
			direction: 'AB'
		};
		Partitioner.directOperation(function(){Responses.insert(data);});
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

	'addResponses': function(currentUser,pairNum,currDir,exchangeData){
		var doc = Responses.findOne(currentUser);
		var query= {};
		query['stimData.pairs.' + pairNum + '.rounds'] = exchangeData;
		if (currDir == 'AB'){
			query['stimData.pairs.' + pairNum + '.ABlabeled'] = true;
			query['direction'] = 'BA';
		} else if (currDir == 'BA'){
			query['stimData.pairs.' + pairNum + '.BAlabeled'] = true;
			query['direction'] = 'AB';
		}
		Meteor.call('updateInfo',currentUser,query,'set');
	},

	'finished': function(currentUser){
		Meteor.call('updateInfo',currentUser,{'status':'endSurvey'},'set');
		var exp = TurkServer.Instance.currentInstance();
		if(exp != null){
			exp.teardown(returnToLobby= true);
		}
	},
	'updateCounter': function(currentUser){
		var gameId = Responses.findOne(currentUser).stimData._id;
		var currGameNum = Counter.findOne('counter').val;
		if (currGameNum == 76){
			currGameNum = 0;
		} else{
			currGameNum +=1;
		}
		Counter.update('counter',{$set: {'val':currGameNum}});
		Counter.update(gameId,{$inc:{'labelCount':1}});
	},

	//General purpose document modification function
	'updateInfo': function(currentUser,data,operation){
		if(operation == 'set'){
			Partitioner.directOperation(function(){
				Responses.update(currentUser, {$set: data});
			});
		} else if(operation == 'inc'){
			Partitioner.directOperation(function(){
				Responses.update(currentUser, {inc: data});
			});
			//Responses.update(currentUser, {$inc: data});
		} else if(operation == 'dec'){
			Partitioner.directOperation(function(){
				Responses.update(currentUser, {dec: data});
			});
			//Responses.update(currentUser, {$dec: data});
		}

	}
});