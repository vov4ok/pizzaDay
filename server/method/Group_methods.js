Meteor.methods({
	'_getUsersData': function(nameGrou, bool) {
		var group = Groups.find({name: nameGrou}).fetch()[0];
		var idUsersInGroup = group.usersId;
		var arrUsers = Meteor.users.find({}).fetch();
		var arrReturn = [];
		var _getMap = {};

		// get map Id - email
		arrUsers.forEach(function(e) {
			if(e.emails !== undefined){
				_getMap[e._id] = e.emails[0].address;
			} else {
				_getMap[e._id] = e.services.google.email;
			}
		});
		delete _getMap[group.isAdmin];
		// get map Id - email

		if(bool) {
			// in group
			_.values(_.omit(_getMap, idUsersInGroup)).forEach(function(e) {
				arrReturn.push({'email': e});
			});
			console.log(arrReturn);
		} else {
			// out group
			_.values(_.pick(_getMap, idUsersInGroup)).forEach(function(e) {
				arrReturn.push({'email': e});
			});
			console.log(arrReturn);
		}
		return arrReturn;
	},
	'_addRemoveUsersInGroup': function(userId, nameGrou, arr, bool) {
		var group = Groups.find({name: nameGrou}).fetch()[0];
		var arrUsers = Meteor.users.find({}).fetch();
		var _getMap = {};
		var ress = [];

		// get map Id - email
		arrUsers.forEach(function(e) {
			if(e.emails !== undefined){
				_getMap[e._id] = e.emails[0].address;
			} else {
				_getMap[e._id] = e.services.google.email;
			}
		});
		// get map Id - email

		if(bool) {
			// add users in group
			ress = _.values(_.pick(_.invert(_getMap), arr));
			Groups.update({name: nameGrou}, {$pushAll: {usersId: ress}});
		} else {
			// remove users in group
			ress = _.values(_.pick(_.invert(_getMap), arr));
			Groups.update({name: nameGrou}, {$pullAll: {usersId: ress}});
		}
	},
	'_deleteGroup': function(userId, nameGroup) {
		var _allow = Groups.find({isAdmin: userId, name: nameGroup}).count();

		if(_allow) {
			Groups.remove({isAdmin: userId, name: nameGroup});
		}
	},
	'_removeItemMenu': function(group, userId, data) {
		var arr = Groups.find({name: group}).fetch()[0];

		delete arr.menu[data.name];
		Groups.update({name: group}, {$set: {menu: arr.menu}});
		console.log(arr);
	},
	'_qwe': function() {
		console.log(Groups.update({name: "qwe"}, {$pushAll: {arr: [1,5,7]}}));
	}
});
