Router.configure({
	layoutTemplate: 'MasterLayout',
	yieldTemplates: {
		'Header': {'to': 'header'},
		'Footer': {'to': 'footer'}
	},
	waitOn() {
		return Meteor.subscribe('groups');
	}
})

Router.onBeforeAction(function() {
	if(Meteor.users.findOne() === undefined) {
		this.redirect('HomePage');
	}
	this.next();
});