Template.survey.onRendered(function(){
	$('leftLabel').validate();
	$('rightLabel').validate();

})

Template.survey.helpers({
	//Find the first pair for which the user has not provided any labels
	'data':function(){
		var currentUser = Meteor.userId();
		var data = Responses.findOne(currentUser);
		var idx = _.findIndex(data.responses, function(d){return d.A.length == 0 && d.B.length==0;});
		return {
			exchanges: data.stimData.pairs[idx].rounds,
			pairNum: idx+1
		};
	}
});

Template.survey.events({
	'click button':function(event){
		event.preventDefault();
		//Validation
		if (($('.leftLabel input:radio:checked').length != 10) || ($('.rightLabel input:radio:checked').length != 10)){
			$('#submitValidation').css("visibility", "visible");
			//$('.submitPair').removeClass('btn-primary').addClass('btn-danger').text('Some of the labels are unanswered!');
		} else{
			var currentUser = Meteor.userId();
			//Grab first players data
			var p1 = _.map($(".leftLabel input[type='radio']:checked"),function(elem){return elem.value});
			//Grab second players data
			var p2 = _.map($(".rightLabel input[type='radio']:checked"),function(elem){return elem.value});
			Meteor.call('addResponses',currentUser,[p1,p2]);
			//Empty form and scroll page
			$('.leftLabel, .rightLabel').trigger('reset');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			//Refresh the page instead
			//location.reload(true);
		}
	}

});

function makeConvo(data){
	var idx = _.findIndex(data.stimData.pairs, function(pair){
		return pair.labeled === false;
	});
	var pairData = data.stimData.pairs[idx].rounds;

}