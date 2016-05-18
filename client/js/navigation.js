Template.navigation.helpers({
	dispTitle: function(){
		var currentUser = Meteor.userId();
		if (currentUser === null){
			return false;
		} else {
			return true;
		}

	}
});