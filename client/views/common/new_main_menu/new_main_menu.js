Template.newMainMenu.helpers({
	myGrou: function() {
		return Groups.find({isAdmin: Meteor.userId()},{sort: {name: 1}}).fetch();
	},
	iGrou: function() {
		return Groups.find({usersId: Meteor.userId()},{sort: {name: 1}}).fetch();
	}
});

Template.newMainMenu.events({
	'click a.groups-select': function(e, tmpl) {
		e.preventDefault();
		Router.go('selectGrouop', {name: e.target.innerText});
		console.log(e.target.text);
	}
})
