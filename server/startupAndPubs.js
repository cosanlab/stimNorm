 Meteor.startup(function(){
 	//Read in each game's data as json file and add to mongo collection
 	//Should be able to adapt to any stimlus type
 	var done, files;
 	var fs = Npm.require('fs');
 	files = fs.readdirSync("../../../../../private/",function(e,r){});
 	done = Meteor.bindEnvironment(function(files){
 		return _.each(files,function(filename){
 			var game = JSON.parse(Assets.getText(filename));
 			var exists = Stims.findOne(game._id);
 			if(!exists){
 				Stims.insert(game);
 				console.log('Game: ' + filename + ' added to db!');
 			} else{
 				console.log('Game: ' + filename + ' already in db!')
 			} 			
 		});
 	}, function(e){
 		throw e;
 	});
 	done(files)
 	try {
	 	//Create a single batch
		Batches.upsert({'name':'main'},{'name':'main',active:true});
		TurkServer.ensureTreatmentExists({'name':'main'});
		Batches.update({name:'main'},{$addToSet:{treatments: 'main'}});
		//Apply basic assigner
		Batches.find().forEach(function(batch){
			TurkServer.Batch.getBatch(batch._id).setAssigner(new TurkServer.Assigners.SurveyAssigner());
		});
	} catch(e){
		console.log(e);
		return;
	}

});

//Labels applied
Meteor.publish('Responses',function(){
	var currentUser = this.userId;
	return Responses.find(currentUser)
});
