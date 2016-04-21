//Function to allow easy subclassing, in coffee script this is just extend
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },  hasProp = {}.hasOwnProperty;

//Survey Assigner
TurkServer.Assigners.SurveyAssigner = (function(superClass){
	extend(SurveyAssigner, superClass);
  	
  	function SurveyAssigner(){
  		return SurveyAssigner.__super__.constructor.apply(this,arguments);
  	};

  	SurveyAssigner.prototype.initialize = function(){
  		SurveyAssigner.__super__.initialize.apply(this,arguments);
  	};

  	SurveyAssigner.prototype.userJoined = function(asst){
  		var currentUser = Responses.findOne(asst.userId);
  		if (asst.getInstances().length > 0){
  			this.lobby.pluckUsers([asst.userId]);
  		} else if(!currentUser){
  			Meteor.call('addUser',asst.userId,asst.workerId);
  		} else{
  			//We'll only get here if a user is reconnecting to the consent or instructions
  		}
  	};

	return SurveyAssigner;
  })(TurkServer.Assigner);