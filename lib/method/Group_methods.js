Meteor.methods({
	'_insertGroup': function(userId, data) {
		if(userId) {
			var arr = _.isEmpty(Groups.find({name: data.name}).fetch());
			if(arr) {
				data[userId] = true;
				data.menu = {	"sup": {"price": "8$", "counter": {"t4hFRJTM8Dfm6jLgi": 2}},
											"regu": {"price": "9$", "counter": {}},
											"chai": {"price": "10$", "counter": {}}
				};
				Groups.insert(data);
				return true;
			} else {
				return false;
			}
		}
	},
	'_editCount': function( group, userId, data) {
		var menu = Groups.find({name: group}).fetch()[0].menu;

		for(var opt in menu) {
			delete menu[opt].counter[userId];
		}

		for(var op in data) {
			menu[op].counter[userId] = data[op];
		}
		Groups.update({name: group}, {$set: {menu: menu}});
	},
	'_checkNameGroup': function(userId, data) {
		if(userId) {
			var arr = _.isEmpty(Groups.find({name: data.name}).fetch());
			return !!arr;
		}
	},
	'_removeItemMenu': function(data) {
		var a = data.name;
		console.log(Groups.find({name: a}).fetch());
	}
});
