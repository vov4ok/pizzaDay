var _toggleMenu = new ReactiveVar(false);
var _toggleOrder = new ReactiveVar(false);

Template.selectGrouop.helpers({
	nameGroup: function() {
		return { name: this.nameGroup };
	},
	autent: function() {
		return Groups.find({ name: this.nameGroup, isAdmin: Meteor.userId() }).fetch();
	},
	allowMenu: function() {
		var obj = Groups.findOne({ name: this.nameGroup });
		if (obj !== undefined && obj.event !== undefined) {
			if (obj.event.status === 1) {
				return _toggleMenu.get();
			}
		} else {
			_toggleMenu.set(false);
		}
	},
	allowOrder: function() {
		var obj = Groups.findOne({ name: this.nameGroup });
		if (obj !== undefined && obj.event !== undefined) {
			if ((obj.event.status === 2) || (obj.event.status === 3)) {
				return _toggleOrder.get();
			}
		} else {
			_toggleOrder.set(false);
		}
	},
	allowCreateEvent: function() {
		var _obj = Groups.findOne({ name: this.nameGroup }).event;
		if (!_obj) {
			return true;
		}
	},
	allowEndEvent: function() {
		var _obj = Groups.findOne({ name: this.nameGroup }).event;
		if (_obj && _obj.status === 3) {
			return true;
		}
	},
	imageGroup: function() {
		return Groups.findOne({name: this.nameGroup}).icon || '/logo/1.jpg'
	}
});

Template.selectGrouop.events({
	'click button[name=show-menu]': function(e, tmp) {

		// toggle menu
		_toggleMenu.set(!_toggleMenu.get());
		// end toggle menu
	},
	'click button[name=cont-status]': function(e, tmp) {
		console.log('button[cont-status]');

		// toggle Order
		_toggleOrder.set(!_toggleOrder.get());
		// toggle Order
	},
	'click #create-new-event': function(e, tmp) {

		Meteor.call('_newEvent', Meteor.userId(), tmp.data.nameGroup);
		Meteor.call('_newNotificatio', Meteor.userId(), tmp.data.nameGroup);
		console.log('Event added');
	},
	'click #end-event': function(e, tmp) {
		Meteor.call('_endEvent', Meteor.userId(), tmp.data.nameGroup);
	}
});
