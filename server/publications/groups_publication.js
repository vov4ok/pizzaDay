Meteor.publish('groups', function() {
	return Groups.find({$or: [{isAdmin: this.userId}, {usersId: this.userId}]}/*, {fields: {menu: 0}}*/);
})

/*Meteor.publish('_getMenu', function( _nameGroup) {
	return Groups.find({name: _nameGroup}, {fields: {menu: 1}});
})*/
Groups.deny({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

Groups.allow({
	insert: function (userId, doc) {
		return false;
	},
	update: function (userId, doc, fields, modifier) {
		return false;
	},
	remove: function (userId, doc) {
		return false;
	}
});
