//Function to allow easy subclassing, in coffee script this is just extend
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

//Survey Assigner - custom assigner that creates single user experiment instances only if a user provides consent
TurkServer.Assigners.SurveyAssigner = (function(superClass){
	extend(SurveyAssigner, superClass);
  	
	function SurveyAssigner(){
		return SurveyAssigner.__super__.constructor.apply(this,arguments);
	};

	SurveyAssigner.prototype.initialize = function(){
		SurveyAssigner.__super__.initialize.apply(this,arguments);
    this.lobby.events.on("consent-received", this.consentReceived.bind(this));
	};

  	SurveyAssigner.prototype.userJoined = function(asst){
  		var currentUser = Responses.findOne(asst.userId);
  		if (asst.getInstances().length > 0){
  			this.lobby.pluckUsers([asst.userId]);
        asst.showExitSurvey();
        console.log('TURKER: ' + Date() + ': ' + asst.workerId + ' completed experiment! Sent to exit survey!\n');
  		} else if(!currentUser){
  			Meteor.call('addUser',asst.userId,asst.workerId);
  		} else{
  			//We'll only get here if a user is reconnecting to the consent or instructions
  		}
  	};

    //Triggers a new single-user experiment instance only if they provide consent
    SurveyAssigner.prototype.consentReceived = function(asst){
        var treatment = this.batch.getTreatments();
        this.instance = this.batch.createInstance(treatment);
        this.instance.setup();
        this.lobby.pluckUsers([asst.userId]);
        this.instance.addAssignment(asst);
    };

	return SurveyAssigner;
  })(TurkServer.Assigner);  