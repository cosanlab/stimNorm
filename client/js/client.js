//Setup reative computation that monitors clients' state changes
Meteor.startup(function(){
	Meteor.defer(function(){
		Tracker.autorun(function(){
			if (TurkServer.inLobby()){
				Router.go('lobby');
			}
			else if (TurkServer.inExperiment()){
				Router.go('survey');
			}
			else if (TurkServer.inExitSurvey()){
				Router.go('endSurvey');
			}
		})
	})
})

//Data subscriptions
Tracker.autorun(function(){
	var group = TurkServer.group();
	if (group==null){
		return;
	}
	Meteor.subscribe('stims');
	Meteor.subscribe('responses',group);
});

//New Spacebars function that should work on all templates
Template.registerHelper('Cond', function (v1, operator, v2) {
    switch (operator) {
        case '==':
            return (v1 == v2);
        case '!=':
            return (v1 != v2);
        case '<':
            return (v1 < v2);
        case '<=':
            return (v1 <= v2);
        case '>':
            return (v1 > v2);
        case '>=':
            return (v1 >= v2);
        case '&&':
            return (v1 && v2);
        case '||':
            return (v1 || v2);
    }
});