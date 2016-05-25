 Meteor.startup(function(){
 	//Read in each game's data as json file and add to mongo collection
 	//Should be able to adapt to any stimlus type
 	var done, files, labelMaker;
 	var fs = Npm.require('fs');
 	files = fs.readdirSync("../../../../../private/",function(e,r){});
 	done = Meteor.bindEnvironment(function(files){
 		return _.each(files,function(filename,i){
 			var game = JSON.parse(Assets.getText(filename));
 			var exists = Stims.findOne(game._id);
 			if(!exists){
 				Stims.insert(game);
 				console.log('Game: ' + filename + ' added to db!');
 				Counter.insert({_id:game._id,'idx':i,'labelCount':0});
 			} else{
 				console.log('Game: ' + filename + ' already in db!')
 			} 			
 		});
 	}, function(e){
 		throw e;
 	});
 	done(files);
 	labelMaker = Meteor.bindEnvironment(function(){
		var labels = [];
		labels[0] = {
			_id: 'gossip',
			header: 'Gossip',
			body: "When an individual is discussing information about other individuals' behavior (either a specific individual or the entire group). This may include passing judgement on how those players acted. Sometimes this may simply be the number of points contributed by another person with no other words.",
			examples: "'Ugh the cat is being so selfish', 'Damn that bee!','Some people only care about themselves' 'I see 50' '100'"
		};
		labels[1] = {
			_id: 'inquiry',
			header: 'Inquiry',
			body: "When an individual is asking a question to the other person.",
			examples: "'How many rounds are left?', 'What did you see?'"
		};
		labels[2] = {
			_id: 'affirmation',
			header: 'Affirmation',
			body: "When an individual replies to a question or statement in a confirmatory way.",
			examples: "'Ok', 'sure', 'will do','I agree'"
		};
		labels[3] = {
			_id: 'strategy',
			header: 'Strategy',
			body: "When an individual is discussing game tactics such as: what they think the best action is in the game, what action they are planning to take, or what action the other individual ought to take.",
			examples: "'We should all contribute everything', 'I'm giving 100', 'You should give more'"
		};
		labels[4] = {
			_id: 'chitchat',
			header: 'Chit-chat',
			body: "'Getting-to-know-each-other' types of messages or playful social exchanges. This might be things like finding out more about the other individual or trying to relate to them in some way.",
			examples: "'So how long have you been on mTurk?', 'Where are you from?', 'I love football too! Who's your favorite team?' 'Are you a bot?'"
		};
		labels[5] = {
			_id: 'gameMech',
			header: 'Game Mechanics',
			body: "Messages remarking on some aspect of the game such as the number of rounds left, what the purpose of this game/experiment is, comments about the requester or experimenter and questions clarifying how to play (but not explicity strategic questions).",
			examples: "'Wait I thought there were only 5 rounds', 'I wonder what the point of this is','Yea this requester is great I've done his HITs in the past', 'This is really boring'"
		};
		labels[6] = {
			_id: 'nonsense',
			header: 'Nonsense',
			body: "Messages that seem like random string of letters or numbers or seem to be completely random and meaningless.",
			examples: "'!!Ekas','C mannnn','00109'"
		};
		labels[7] = {
			_id: 'briefExp',
			header: 'Brief Expressions',
			body: "Brief one or two word messages that include things like emoticons, exclamations, laughing, abbreviations and chat slang.",
			examples: "'lol','haha','!!!',':)'"
		};
		labels[8] = {
			_id: 'random',
			header: 'Random',
			body: "Messages that don't fit into one of the previous labels. We have found that most messages can be described using a combination of the previous labels, but for some messages that may not be true. If so please use this label.",
			examples: "There was once a man who lived in a tree"
		};
		labels[9] = {
			_id: 'noText',
			header: 'No Text',
			body: "Messages that are completeley blank. Occassionally some individuals sent no message to the other person.",
			examples: "' '"
		};

		for(var i = 0; i<labels.length; i++){
			var exists = Labels.findOne(labels[i]._id);
			if(!exists){
				Labels.insert(labels[i]);
			}
		}

 	});
 	labelMaker();
 	var counterExists = Counter.findOne('counter');
 	if(!counterExists){
 		Counter.insert({_id:'counter',val:0});
 	}

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
	return Responses.find(currentUser);
});
Meteor.publish('Labels',function(){
	return Labels.find();
});
