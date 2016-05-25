Template.survey.helpers({
	//Find the first pair for which the user has not provided any labels
	'exchanges':function(){
		var currentUser = Meteor.userId();
		var data = Responses.findOne(currentUser);
		var key = _.findKey(data.stimData.pairs,function(o){return !o.ABlabeled || !o.BAlabeled;});
		if (key === undefined){
			Meteor.call('finished',currentUser);
			return;
		}
		var pageNum = parseInt(key)*2-1;
		var exchangeData = data.stimData.pairs[key];
		var currDir = data.direction;
		if (currDir == 'BA'){
			pageNum += 1;
		}
		var exchanges = makeConvo(exchangeData,currDir);
		return {
			exchanges: exchanges,
			pageNum: pageNum
		};
	},
});

Template.survey.events({
	'click button':function(event){
		event.preventDefault();
		//Validation to make sure that every message has at least 1 label applied to it
		var resps = [];
		$('.leftLabel, .rightLabel').each(function(){resps.push($(this).find('input:checkbox:checked').length)});
		if (!resps.every(function(elem){return elem>=1})){
			$('#submitValidation').css("visibility", "visible");
		} else{
			var currentUser = Meteor.userId();
			var data = Responses.findOne(currentUser);
			var currDir = data.direction;
			var pairNum = _.findKey(data.stimData.pairs,function(o){return !o.ABlabeled || !o.BAlabeled;});
			var exchangeData = data.stimData.pairs[pairNum].rounds;
			exchangeData = addData(exchangeData,currDir);
			Meteor.call('addResponses',currentUser,pairNum,currDir,exchangeData);
			//Empty form and scroll page REMOVE WHEN DONE DEBUGGING
			$('.leftLabel, .rightLabel').trigger('reset');
			$("html, body").animate({ scrollTop: 0 }, 500);
			$('#submitValidation').css("visibility", "hidden");
			//Refresh the page instead
			//location.reload(true);
		}
	},
	'click #gameInfo': function(event){
		event.preventDefault();
		event.stopPropagation();
		displayModalNoData(Template.contextInHIT);
	}

});



function makeConvo(exchangeData, direction){
	var rounds = exchangeData.rounds;
	var exchanges = [];
	//Because object iteration order isn't guaranteed use an array of keys in order for looping
	var keys = _.map(_.range(1,_.keys(rounds).length+1),function(elem){return String(elem);});
	_.each(keys,function(k){
		if (direction == 'AB'){
			exchanges.push({'messL':rounds[k].Am1,'messR':rounds[k].Bm2});
		} else{
			exchanges.push({'messL':rounds[k].Bm1,'messR':rounds[k].Am2});
		}
	});
	return exchanges;
}
function addData(exchanges, direction){
	var left = $('.leftLabel');
	var right = $('.rightLabel');
	var idx = 1;
	for (var i = 0; i < _.keys(exchanges).length; i++){
		var leftLabels = [];
		var rightLabels = [];
			$(left[i]).find('input:checkbox').each(function(){if(this.checked){leftLabels.push(this.value)}});
			$(right[i]).find('input:checkbox').each(function(){if(this.checked){rightLabels.push(this.value)}});
		if (direction == 'AB'){
			exchanges[String(idx)].Am1Lab = leftLabels;
			exchanges[String(idx)].Bm2Lab = rightLabels;
		} else if(direction == 'BA'){
			exchanges[String(idx)].Am2Lab = leftLabels;
			exchanges[String(idx)].Bm1Lab = rightLabels;
		}
		idx += 1;
	}
	return exchanges;
}

function displayModalNoData(template, options) {
  // minimum options to get message to show
  options = options || { message: " " };
  var dialog = bootbox.alert(options);
  // Take out the default body that bootbox rendered
  dialog.find(".bootbox-body").remove();
  Blaze.render(template, dialog.find(".modal-body")[0]);
  return dialog;
}
