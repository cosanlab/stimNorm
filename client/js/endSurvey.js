Template.endSurvey.helpers({
	user: function(){
		var data = Responses.findOne(Meteor.userId());
		return{
			consent: data.consent,
			status: data.status
		}
	}
});

//Submit the HIT
Template.endSurvey.events({
	'click button': function(event){
		event.preventDefault();
		var currentUser = Meteor.userId();
		var player = Players.findOne(currentUser);
		var feedback = $('#feedback').val();
		var age = $('#age').val();
		var belief = $('#belief').val();
		var results;
		if(!feedback){
			if(player.status == 'failedQuiz'){
				feedback = 'FAILED QUIZ';
			} else if(player.status == 'lobbyTimeout'){
				feedback = 'LOBBY TIMEOUT';
			} else{
				feedback = 'NA';
			}
		}
		if (!age){
			age = 'NA';
		}
		if (!belief){
			belief = 'NA';
		}
		var gender;
		if($('#male').is(':checked')){
			gender = 'male';
		} else if($('#female').is(':checked')){
			gender = 'female';
		} else{
			gender = 'NA';
		}
		Meteor.call('updateInfo',currentUser,{'feedback':feedback,'age':age,'gender':gender,'belief':belief},'set');
		results = {Feedback: feedback};
		TurkServer.submitExitSurvey(results);
	}
});


