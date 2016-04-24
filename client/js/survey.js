Template.survey.helpers({
	//Find the first pair for which the user has not provided any labels
	'data':function(){
		var data = Responses.findOne();
		var idx = _.findIndex(data.responses, function(d){return d.A.length == 0 && d.B.length==0;});
		return {
			exchanges: data.stimData.pairs[idx].rounds,
			pairNum: idx+1
		};
	}
});

Template.survey.events({
	'change .leftLabel': function(event,template){
		var x = template.find('input:radio[name=radioLeft]:checked')
		console.log($(x).val());
	},
	'change .rightLabel': function(event,template){
		var x = template.find('input:radio[name=radioRight]:checked')
		console.log($(x).val());
	},
	'click button':function(event){
		event.preventDefault();
		//Look up next pair
	}

});