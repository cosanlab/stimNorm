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
	}
});

