Meteor.methods({
	'_insertGroup': function(userId, data) {
		if(userId) {
			var arr = _.isEmpty(Groups.find({name: data.name}).fetch());
			if(arr) {
				data.isAdmin = userId;
				data.menu = {	"sup": {"price": 8, "counter": {}},
											"ragu": {"price": 9, "counter": {}},
											"chai": {"price": 10, "counter": {}}
										};
				data.usersId = [];
				Groups.insert(data);
				return true;
			} else {
				return false;
			}
		}
	},
	'_checkNameGroup': function(userId, data) {
		if(userId) {
			var arr = _.isEmpty(Groups.find({name: data.name}).fetch());
			return !!arr;
		}
	}
});
