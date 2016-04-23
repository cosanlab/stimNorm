Template.consent.events({
	'click #Consent': function(event){
		Meteor.call('checkConsent',Meteor.userId(),true);
	},
	'click #NoConsent': function(event){
		Meteor.call('checkConsent',Meteor.userId(),false);
	}
})


