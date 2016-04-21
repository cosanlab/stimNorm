 Meteor.startup(function(){
 	//Read in each game's data as json file and add to mongo collection
 	//Should be able to adapt to any stimlus type
 	var done, files;
 	var fs = Npm.require('fs');
 	files = fs.readdirSync("../../../../../private/",function(e,r){});
 	done = Meteor.bindEnvironment(function(files){
 		return _.each(files,function(filename){
 			var game = JSON.parse(Assets.getText(filename));
 			var exists = Games.findOne(game._id);
 			if(!exists){
 				Games.insert(game);
 				console.log('Game: ' + filename + ' added to db!');
 			} else{
 				console.log('Game: ' + filename + ' already in db!')
 			} 			
 		});
 	}, function(e){
 		throw e;
 	});
 	done(files)

 	//Create a single batch
	Batches.upsert({'name':'main'},{'name':'main',active:true});
	//Apply basic assigner
	Batches.find().forEach(function(batch){
		TurkServer.Batch.getBatch(batch._id).setAssigner(new TurkServer.Assigners.SimpleAssigner);
	});
});

//Games pre-populated DB
Meteor.publish('games', function(){
	return Games.find();
});

//Labels applied
Meteor.publish('labels',function(){
	return Labels.find()
});
