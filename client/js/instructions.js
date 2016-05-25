var tutorialSteps = [
	{
		template: "accept"
	},
	{	
		template: "overview"
	},
	{	
		template: "messageInfo",
		spot: ".bubbleLeft, .labelsRight"
	},
	{
		template: "labelP1",
		spot: ".labelsLeft"
	},
	{
		template: "labelP2",
		spot: ".labelsRight"
	},
	{	
		template: "addInfo1",
		spot: ".bubbleLeft, .labelsRight"
	},
	{	
		template: "addInfo2",
		spot: ".btnDiv"
	},
	{
		template: "context"
	},
	{
		template: "labels1"
	},
	{
		template: "labels2"
	},
	{
		template: "labels3"
	},
	{
		template: "labels4",
		spot: ".labelsLeft"
	},
	{
		template: "labels5",
		spot: "#gameInfo"
	},
	{
		template: "prequiz"
	},
	{
		template: 'quiz',
		require: {
			event: 'submittedQuiz'
		}
	}
];

quizEmitter = new EventEmitter();

Template.instructions.helpers({
	options: {
		steps: tutorialSteps,
		emitter: quizEmitter,
		onFinish: function(){
			var currentUser = Meteor.userId();
			var passedQuiz = Responses.findOne(currentUser).passedQuiz;
			Meteor.call('checkEligibility',currentUser,passedQuiz);
			$("html, body").animate({ scrollTop: 0 }, 100);
		}
	},
	inquiry: function(){
		return Labels.findOne('inquiry');
	},
	gossip: function(){
		return Labels.findOne('gossip');
	},
	strategy: function(){
		return Labels.findOne('strategy');
	},
	gameMech: function(){
		return Labels.findOne('gameMech');
	},
	noText: function(){
		return Labels.findOne('noText');
	},
	random: function(){
		return Labels.findOne('random');
	},
	nonsense: function(){
		return Labels.findOne('nonsense');
	},
	chitchat: function(){
		return Labels.findOne('chitchat');
	},
	affirmation: function(){
		return Labels.findOne('affirmation');
	},
	briefExp: function(){
		return Labels.findOne('briefExp');
	}
});

Template.labels1.inheritsHelpersFrom("instructions");
Template.labels2.inheritsHelpersFrom("instructions");
Template.labels3.inheritsHelpersFrom("instructions");