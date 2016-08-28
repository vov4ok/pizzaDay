Template.controlGroup.helpers({

});

Template.controlGroup.events({
	'click .delete-this-group': function(e, tmp) {
		var nameGroup = this.nameGroup;

				Meteor.call('_deleteGroup', Meteor.userId(), nameGroup);
				// Router.go('HomePage');

	},

});
