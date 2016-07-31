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