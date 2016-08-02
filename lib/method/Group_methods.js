Meteor.methods({
	'_insertGroup': function(userId, data) {
		if(userId) {
			var arr = _.isEmpty(Groups.find({name: data.name}).fetch());
			if(arr) {
				data[userId] = true;
				data.menu = {	"sup": {"price": "8$", "counter": {}},
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
	'_removeItemMenu': function(group, userId, data) {
		var arr = Groups.find({name: group}).fetch()[0];

		delete arr.menu[data.name];
		Groups.update({name: group}, {$set: {menu: arr.menu}});
		console.log(arr);
	},
	'_insertItemMenu': function(group, userId, data) {
		var arr = Groups.find({name: group}).fetch()[0];

		arr.menu[data.name] = {"price": data.price + '$', "counter": {}},
		Groups.update({name: group}, {$set: {menu: arr.menu}});
		console.log(arr);
	},
	'_getEmailUsers': function(userId) {
		var a = Meteor.users.find().fetch();
		var arr = [];

		a.forEach(function (e) {
				if(e.emails == undefined) {
					//arr.push(e.services.google.email);
				} else {
					arr.push({'email': e.emails[0].address});
				}
			});

		return arr;
	}
});
