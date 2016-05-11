var tutorialSteps = [
	{
		template: "accept"
	},
	{	
		template: "overview"
	},
	{	
		template: "context"
	},
	{
		template: "layout",
	},
	{	
		template: "example",
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

