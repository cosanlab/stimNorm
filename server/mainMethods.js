Meteor.methods({
	//Add each new user to the database and assign them to a randomly selected stimulus, storing the stimulus data with the user data
	'addUser':function(currentUser, workerId){
		//Might want to make this into a modular function with more complicated random sampling in the future 
		var doc = _.sample(Stims.find().fetch(),1);
		var responseData = {
			1:[],
			2:[],
			3:[]
		};
		var data = {
			_id: currentUser,
			workerId: workerId,
			enterTime: new Date(),
			status: 'consent',
			consent: false,
			stimData: doc,
			responses: responseData
		};
		Partitioner.directOperation(function(){
			Responses.insert(data);
		});
	},

	//General purpose document modification function
	'updateInfo': function(currentUser,data,operation){
		Partitioner.directOperation(function(){
			if(operation == 'set'){
				Responses.update(currentUser, {$set: data});
			} else if(operation == 'inc'){
				Responses.update(currentUser, {$inc: data});
			} else if(operation == 'dec'){
				Responses.update(currentUser, {$dec: data});
			}
		});

	}
})
