Template.controlGroup.helpers({

});

Template.controlGroup.events({
	'click .delete-this-group': function(e, tmp) {
		var nameGroup = this.nameGroup;

		Router.go('HomePage');
		Meteor.setTimeout(function() {
				Meteor.call('_deleteGroup', Meteor.userId(), nameGroup);
		}, 1000)
	},

});
