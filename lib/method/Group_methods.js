Meteor.methods({

	'_insertGroup': function(userId, data) {
		if(userId) {
			data[userId] = true;
			// data.userId = userId;
			// added cheked name group in collection
			data.menu = {	"sup": {"price": "8$", "counter": {"t4hFRJTM8Dfm6jLgi": 2}},
										"regu": {"price": "9$", "counter": {}},
										"chai": {"price": "10$", "counter": {}}
									};
			Groups.insert(data);
	}},
	'_editCount': function( group, userId, data) {
			var menu = Groups.find({name: group}).fetch()[0].menu;

			for(var opt in menu) {
				delete menu[opt].counter[userId];
			}

			for(var op in data) {
				menu[op].counter[userId] = data[op];
			}
			Groups.update({name: group}, {$set: {menu: menu}});

		// for(var op in data) {
		// 	console.log(Groups.update({name: group}, {$set: {menu:{[op]:{counter:{[userId]: data[op]}}}}}));
		// }
	}
});
