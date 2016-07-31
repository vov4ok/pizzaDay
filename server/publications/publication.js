// Meteor.publish('groups', function() {
// 	var self = this;
// 	var subsk = Groups.find().observe({
// 		adedd: function(doc) {
// 				self.adedd('', doc.id, doc);
// 		}
// 		changed: function(doc) {
// 				self.changed('', doc.id, doc);
// 		}
// 	})
// })
Meteor.publish('groups', function() {

	return Groups.find({[this.userId]: {$in: [true, false]}});
})

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