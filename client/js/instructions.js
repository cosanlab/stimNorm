var tutorialSteps = [
	{
		template: "accept"
	},
	{	
		template: "overview"
	},
	{	
		template: "rounds"
	},
	{
		template: "exampleRound"
	},
	{
		template: "recap"
	},
	{	
		template: "timing"
	},
	{	
		template: "preQuiz"
	},
	{
		template: "quiz", 
		require: {
			event: 'submittedQuiz'
		}
	}
];

quizEmitter = new EventEmitter();
//Setup interactive instructions logic
Template.instructions.helpers({
	options: {
		steps: tutorialSteps,
		emitter: quizEmitter,
		onFinish: function(){
			var currentUser = Meteor.userId();
			var passedQuiz = Players.findOne(currentUser).passedQuiz;
    		Meteor.call('checkPlayerEligibility',currentUser, passedQuiz);
		}
	}
});

//Tutorial steps helpers
Template.overview.helpers({
	otherPlayers: function(){
		return String(groupSize - 1);
	},
	numPlayers: function(){
		return String(groupSize);
	},
	numRounds: function(){
		return String(numRounds);
	},
	batchCond: function(){
		var batchCond = Batches.findOne().treatments[0];
		var messaging;
		var fullInfo;
		switch (batchCond) {
			case '2G':
				messaging = true;
				fullInfo = false;
				break;
			case '2NG':
				messaging = false;
				fullInfo = false;
				break;
			case '6G':
				messaging = true;
				fullInfo = true;
				break;
			case '6NG':
				messaging = false;
				fullInfo = true;
				break;
		}
		return {
			messaging: messaging,
			fullInfo: fullInfo
		};
	}
});
Template.rounds.inheritsHelpersFrom('overview');
Template.exampleRound.inheritsHelpersFrom('overview');
Template.recap.inheritsHelpersFrom('overview');
Template.timing.inheritsHelpersFrom('overview');

//FROM UG APP, PROBS SIMPLER

var tutorialSteps = [
	{
		template: "step1",
		onLoad: function() {
			$(".playerAleft, #playerAleft, .playerAright, #playerAright").attr("stroke","black").attr("fill","black");
			$(".playerBleft, #playerBleft, .playerBright, #playerBright").attr("stroke","black").attr("fill","black");
		}
	},
	{	
		template: "step2",
		spot: "#tree",
		onLoad: function() {
		$(".playerAleft, #playerAleft, .playerAright, #playerAright").attr("stroke","black").attr("fill","black");
		$(".playerBleft, #playerBleft, .playerBright, #playerBright").attr("stroke","black").attr("fill","black");
		}
	},
	{	
		template: "step3",
		spot: "#tree",
		onLoad: function(){
			$(".playerAleft, #playerAleft, .playerAright, #playerAright").attr("stroke","red").attr("fill","red");
		}
	},
	{	
		template: "step4",
		spot: ".playerAleft",
		onLoad: function(){
			$(".playerAleft, #playerAleft, .playerAright, #playerAright").attr("stroke","black").attr("fill","black");
		}
	},
	{	
		template: "step5",
		spot: ".playerAright",
		onLoad: function(){
			$(".playerBleft, #playerBleft, .playerBright, #playerBright").attr("stroke","black").attr("fill","black");
}
	},
	{
		template: "step6",
		spot: "#tree",
		onLoad: function(){
			$(".playerBleft, #playerBleft, .playerBright, #playerBright").attr("stroke","red").attr("fill","red");
		}
	},
	{	
		template: "step7",
		spot: ".playerBleft",
		onLoad: function(){
			$(".playerBleft, #playerBleft, .playerBright, #playerBright").attr("stroke","black").attr("fill","black");
		}
	},
	{	
		template: "step8",
		spot: ".playerBright",
	},
	{
		template: "step9"
	},
	{
		template: "quiz",
		spot:"body",
		require: {
			event: 'correctAnswer'
		}
	},

];
//Global event emitter for quiz
var emitter = new EventEmitter();

//Setup interactive instructions logic
Template.instructionsInteractive.helpers({
	options: {
		steps: tutorialSteps,
		emitter: emitter,
		onFinish: function(){
			var gameId = Games.findOne()._id;
			var currentUser = Meteor.userId();
    		Meteor.call('playerInstrComplete',gameId, currentUser);
		}
	}
});

Template.quiz.helpers({
	feedback: function(){
		var currentUser = Meteor.userId();
		var player = Players.findOne(currentUser);
		var text;
		var dispClass;
		var promptDisp = 'visibility:hidden';
		if(player.passedQuiz){
			text = "Correct!";
			dispClass = 'correctQuiz';
			promptDisp = "";
		} else if(!player.passQuiz){
			if(player.quizAttempts == 0){
				text = "Placehodler";
				dispClass = 'noresponseQuiz';
			}
			else if(player.quizAttempts > 0 && player.quizAttempts < 2){
				text = "Incorrect. One try remaining";
				dispClass = 'incorrectQuiz';
			} 
		}
		return{
			text: text,
			dispClass: dispClass,
			promptDisp: promptDisp
		};
	}
});
//Event handler for quiz during instructions
	Template.quiz.events({
	'change #B':function(event){
		event.stopPropagation();
		event.preventDefault();
		var currentUser = Meteor.userId();
		Meteor.call('passedQuiz', currentUser);
		emitter.emit('correctAnswer');
	},
	'change #A, change #C':function(event){
		event.stopPropagation();
		event.preventDefault();
		var currentUser = Meteor.userId();
		var gameId = Games.findOne()._id;
		var userInst = Meteor.users.findOne(currentUser).group; 
		Meteor.call('incQuizAttempts',currentUser, gameId, userInst);
	}
});
