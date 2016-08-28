Template.buttonTest.events({
	'click input[name=test]': function(e,tmp) {


			Meteor.call('_setEventStatus', Meteor.userId(), 'mv1', 0);
	}
});
