Template.newMainMenu.events({
	'click a.groups-select': function(e, tmpl) {
		e.preventDefault();
		Router.go('selectGrouop', {name: e.target.innerText});
		console.log(e.target.text);
	}
})

Template.newMainMenu.helpers({
	myGrou: function() {
		return Groups.find({[Meteor.userId()]: true},{sort: {name: 1}}).fetch();
	},
	iGrou: function() {
		return Groups.find({[Meteor.userId()]: false},{sort: {name: 1}}).fetch();
	}
});

