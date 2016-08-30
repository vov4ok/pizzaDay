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
		var _allow = data.name.search(/^(([a-z-_0-9іьєї\']{1,7}\s?){1,4})$/ig);
		if(userId && _allow !== -1) {
			var arr = _.isEmpty(Groups.find({name: data.name}).fetch());
			return !!arr;
		}
	}
});
