Meteor.methods({
	'_getEmailUserss': function(userId, group) {
		var arrUsers = Meteor.users.find().fetch();
		var groupR = Groups.find({name: group}).fetch()[0];
		var arrPropGroup = [];
		var arrReruen = [];

		for(var op in groupR) {
			arrPropGroup.push(op);
		}

		arrUsers.forEach(function(e) {
			if(!_.contains(arrPropGroup, e._id)) {
				if(e.emails === undefined) {
					arrReruen.push({'email': e.services.google.email});
				} else {
					arrReruen.push({'email': e.emails[0].address});
				}
			}
		});

		return arrReruen;
	},
	'_addUsersInGroup': function(userId, group, arr) {
		var obj = {};
		var arrUserss = Meteor.users.find().fetch();
		var arrId = [];

		arrUserss.forEach(function(e) {
			if(e.emails === undefined) {
					if(_.indexOf(arr, e.services.google.email) !== -1) {
						arrId.push(e._id);
					}
				} else {
					if(_.indexOf(arr, e.emails[0].address) !== -1) {
						arrId.push(e._id);
					}
				}
		});
		arrId.forEach(function(e) {
			Groups.update({name: group}, {$set: {[e]: false}})
		});

	}
});
