//This is kind of janky since quiz is based on Batch condition, but the look up needs to be in the template helper; returning subsets of questions doesn't work with validation, there's probably a better solution...
var Questions = new Mongo.Collection(null);
var questions = [];

questions[0] = {
	text: "1) Man that bee really stings",
	answer: ['gossip'],
	correct: false,
	answered: false
};
questions[1] = {
	text: "2) I'm giving 100",
	answer: ['strategy'],
	correct: false,
	answered: false
};
questions[2] = {
	text: "3) I thought there were only 5 rounds",
	answer: ['game commentary'],
	correct: false,
	answered: false
};

questions[3] = {
	text: "4) Why is the sky blue?",
	answer: ['random'],
	correct: false,
	answered: false
};
questions[4] = {
	text: "5) mulalalooo",
	answer: ['nonsense'],
	correct: false,
	answered: false
};
questions[5] = {
	text: "6) Yea I've been on mturk for 3 years now",
	answer: ['chit-chat'],
	correct: false,
	answered: false
};
questions[6] = {
	text: "7) Agreed",
	answer: ['affirmation'],
	correct: false,
	answered: false
};
questions[7] = {
	text: "8) What did you see?",
	answer: ['inquiry'],
	correct: false,
	answered: false
};


for(var q = 0; q<questions.length; q++){
	Questions.insert(questions[q]);
}

Template.quiz.helpers({
	questions: function(){
		return Questions.find();
	},
	quizAttempts: function(){
		return Responses.findOne(Meteor.userId()).quizAttempts;
	},
	passedQuiz: function(){
		return Responses.findOne(Meteor.userId()).passedQuiz;
	}
});

Template.question.helpers({
	incorrect: function(){
		return this.answered && !this.correct;
	}
});

Template.quiz.events({
	'submit .quiz': function(event){
		//Only allow clients to attempt quiz twice before preventing them from doing so
		event.stopPropagation();
		event.preventDefault();
		var currentUser = Meteor.userId();
		var quizAttempts = Responses.findOne(currentUser).quizAttempts;
		var form = event.target;
		Questions.find().forEach(function (q) {
			var answer = $.trim(form[q._id].value.toLowerCase());
			var correct = $.inArray(answer,q.answer) >= 0 ? true: false;
			Questions.update({_id: q._id}, {$set: {correct: correct, answered: true}});
		});
		var result = Questions.find({correct:true}).count() == Questions.find().count();
		if(!result){
			Meteor.call('updateInfo',currentUser,{'quizAttempts':1},'inc');
			if(quizAttempts == 1){
				//End the quiz if they've submitted answers once before
				quizEmitter.emit('submittedQuiz');
			}
		} else{
			Meteor.call('updateInfo',currentUser,{'passedQuiz':true}, 'set');
			quizEmitter.emit('submittedQuiz');
		}
	}
});