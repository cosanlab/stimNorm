Meteor.methods({
	//Add a new document for each user
	'addUser':function(currentUser,workerId){
		var data = {
			_id: currentUser,
			workerId: workerId,
			enterTime: new Date(),
			//TODO what else?
			// Slots for game id, player ids, labels?
		};
		Labels.insert(data)
	}
})