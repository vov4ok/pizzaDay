var _usersInGroup = new ReactiveVar();

Template.addUsersToTheGroup.helpers({
	'usersEmail': function() {
		var arr = _usersInGroup.get();
		return _usersInGroup.get();
	}
});

Template.addUsersToTheGroup.events({
	'click .label-add': function() {
		var nameGroup = this.nameGroup;

		$('.add-users').find('input:checkbox').prop('checked', false);
		Meteor.call('_getUsersData', nameGroup, true, function (err, res) {
			_usersInGroup.set(res);

		});
	},
	'click .label-rem': function() {
		var nameGroup = this.nameGroup;

		$('.remove-users').find('input:checkbox').prop('checked', false);
		Meteor.call('_getUsersData', nameGroup, false, function (err, res) {
			_usersInGroup.set(res);
		});
	},
	'click .add-users > div > button:first()': function(e, tmp) {					// button +
		var nameGroup = this.nameGroup;
		var arr = [];

		$('.add-users').find('li').each(function(index, el) {
			var ee = $(el);

			if(ee.find('input').prop('checked')) {
				arr.push(ee.text());
				ee.find('input').removeAttr('checked');
				ee.remove();
			}
		});

		Meteor.call('_addRemoveUsersInGroup', Meteor.userId(), nameGroup, arr, true);

	},
	'click .add-users > div > button:last()': function(e, tmp) {
		$('.add-users').find('li').each(function(index, el) {
			if($(el).find('input').prop('checked') === true) {
				$(el).find('input').prop('checked', false);
			}
		});
	},
	'click .remove-users > div > button:first()': function(e, tmp) {					// button -
		var nameGroup = this.nameGroup;
		var arr = [];

		$('.remove-users').find('li').each(function(index, el) {
			var ee = $(el);

			if(ee.find('input').prop('checked')) {
				arr.push(ee.text());
				ee.find('input').prop('checked', false);
				ee.remove();
			}
		});
		console.log(arr);
		Meteor.call('_addRemoveUsersInGroup', Meteor.userId(), nameGroup, arr, false);
	},
	'click .remove-users > div > button:last()': function(e, tmp) {
		$('.remove-users').find('li').each(function(index, el) {
			if($(el).find('input').prop('checked') === true) {
				$(el).find('input').prop('checked', false);
			}
		});
	}
});
