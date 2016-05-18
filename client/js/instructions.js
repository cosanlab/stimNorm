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
		template: "summary"
	}
];

Template.instructions.helpers({
	options: {
		steps: tutorialSteps,
		emitter: new EventEmitter(),
		onFinish: function(){
			var currentUser = Meteor.userId();
			Meteor.call('updateInfo',currentUser,{'status':'survey'},'set');
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
	gameComm: function(){
		return Labels.findOne('gameComm');
	},
	noText: function(){
		return Labels.findOne('noText');
	},
	other: function(){
		return Labels.findOne('other');
	},
	nonsense: function(){
		return Labels.findOne('nonsense');
	},
	chitchat: function(){
		return Labels.findOne('chitchat');
	},
	affirmation: function(){
		return Labels.findOne('affirmation');
	}
});

Template.labels1.inheritsHelpersFrom("instructions");
Template.labels2.inheritsHelpersFrom("instructions");
Template.labels3.inheritsHelpersFrom("instructions");