Template.survey.helpers({
	'pairs': function(){
		var data = Responses.findOne();
		console.log(data.stimData.pairs);
		return data.stimData.pairs;
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

});