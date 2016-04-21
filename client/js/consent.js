Template.consent.events({
	'click #Consent': function(event){
		Meteor.call('updateInfo',Meteor.userId(),{'consent':true,'status':instructions});
	},
	'click #NoConsent': function(event){
		Meteor.call('updateInfo',Meteor.userId(),{'consent':false,'status':'noConsent'});
	}
})