Template.controlGroup.events({
	'click .delete-this-group': function(e, tmp) {
		var nameGroup = this.nameGroup;
		if(confirm(`You confirm the removal of the "${nameGroup}" `)) {
			Meteor.call('_deleteGroup', Meteor.userId(), nameGroup);
		}
	}
});
