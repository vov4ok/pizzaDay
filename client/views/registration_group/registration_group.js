Template.registrationGroup.events({
	'click button[name=button-create-group]': function(e, tmpl) {
		var data = {};
		data.name = document.getElementsByName('name-group')[0].value;
		Meteor.call('_insertGroup', Meteor.userId(), data);
		console.log('Group added');
	}
});
