_usersGroup = new ReactiveDict();
var _toggle = new ReactiveVar(false);


Template.addUsersToTheGroup.helpers({
	'usersEmailIsGroup': function() {
		_toggle.get();

		Meteor.call('_getUsersData', this.nameGroup, true, function(err, res) {
			_usersGroup.set('in', res);
		});
		return _usersGroup.get('in');
	},
	'usersEmailNotGroup': function() {
		_toggle.get();

		Meteor.call('_getUsersData', this.nameGroup, false, function(err, res) {
			_usersGroup.set('out', res);
		});
		return _usersGroup.get('out');
	}
});

Template.addUsersToTheGroup.events({
	'click .button-add': function(e, tmp) {
		var arr = [];
		var nameGroup = this.nameGroup;

		$('.data-for-add').each(function(i, el) {
			let bool = $(el).prev().children().first();

			if (bool.prop('checked')) {
				arr.push($(el).val());
				bool.removeAttr('checked');
			}

		});
		Meteor.call('_addRemoveUsersInGroup', Meteor.userId(), nameGroup, arr, true);
		_toggle.set(!_toggle.get());
	},
	'click .button-rem': function(e, tmp) {
		var arr = [];
		var nameGroup = this.nameGroup;

		$('.data-for-rem').each(function(i, el) {
			let bool = $(el).prev().children().first();

			if (bool.prop('checked')) {
				arr.push($(el).val());
				bool.removeAttr('checked');
			}

		});
		Meteor.call('_addRemoveUsersInGroup', Meteor.userId(), nameGroup, arr, false);
		_toggle.set(!_toggle.get());
	}
});






// Template.addUsersToTheGroup.events({
// 'click .label-add': function() {
// 	var nameGroup = this.nameGroup;

// 	$('.add-users').find('input:checkbox').prop('checked', false);
// 	Meteor.call('_getUsersData', nameGroup, true, function (err, res) {
// 		_usersGroup.set(res);

// 	});
// },
// 'click .label-rem': function() {
// 	var nameGroup = this.nameGroup;

// 	$('.remove-users').find('input:checkbox').prop('checked', false);
// 	Meteor.call('_getUsersData', nameGroup, false, function (err, res) {
// 		_usersGroup.set(res);
// 	});
// },
// 'click .add-users > div > button:first()': function(e, tmp) {					// button +
// 	var nameGroup = this.nameGroup;
// 	var arr = [];

// 	$('.add-users').find('li').each(function(index, el) {
// 		var ee = $(el);

// 		if(ee.find('input').prop('checked')) {
// 			arr.push(ee.text());
// 			ee.find('input').removeAttr('checked');
// 			ee.remove();
// 		}
// 	});

// 	Meteor.call('_addRemoveUsersInGroup', Meteor.userId(), nameGroup, arr, true);

// },
// 'click .add-users > div > button:last()': function(e, tmp) {
// 	$('.add-users').find('li').each(function(index, el) {
// 		if($(el).find('input').prop('checked') === true) {
// 			$(el).find('input').prop('checked', false);
// 		}
// 	});
// },
// 'click .remove-users > div > button:first()': function(e, tmp) {					// button -
// 	var nameGroup = this.nameGroup;
// 	var arr = [];

// 	$('.remove-users').find('li').each(function(index, el) {
// 		var ee = $(el);

// 		if(ee.find('input').prop('checked')) {
// 			arr.push(ee.text());
// 			ee.find('input').prop('checked', false);
// 			ee.remove();
// 		}
// 	});
// 	console.log(arr);
// 	Meteor.call('_addRemoveUsersInGroup', Meteor.userId(), nameGroup, arr, false);
// },
// 'click .remove-users > div > button:last()': function(e, tmp) {
// 	$('.remove-users').find('li').each(function(index, el) {
// 		if($(el).find('input').prop('checked') === true) {
// 			$(el).find('input').prop('checked', false);
// 		}
// 	});
// }
// });
