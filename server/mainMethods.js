Meteor.methods({
	//Add a new document for each user
	'addUser':function(currentUser, workerId){
		



		var data = {
			_id: currentUser,
			workerId: workerId,
			enterTime: new Date(),
			status: 'consent',
			responses: responseData
		};
		Labels.insert(data)
	}
})

//Function to randomly sample from stimList and return n documents for a user to respond to; currently just implemented to return a single document
function getRandomDocs(numDocs){
	var doc = _.sample(Stims.find().fetch());
	
}