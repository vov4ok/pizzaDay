Template.eventStatistics.helpers({
	'_statisticEvent': function() {
		var _objReturn = {};
		var _group = Groups.findOne({ name: this.nameGroup });

		function _find(_obj, _val) {
			var _arrRet = [];

			for (var op in _obj) {
				if (_obj[op] === _val) {
					_arrRet.push(op);
				}
			}
			return _arrRet
		};

		function _orderr(_menu) {
			var _arrRet = [];

			for (var op in _menu) {
				for (var op1 in _menu[op].counter) {
					_arrRet.push(op1);
				}
			}
			return _.union(_arrRet).length;;
		};

		_objReturn.signed = (_find(_group.event.subscribeUsers, true)).length;
		_objReturn.ignored = (_find(_group.event.subscribeUsers, false)).length;
		_objReturn.ordered = _orderr(_group.menu);
		_objReturn.all = _group.usersId.length;
		return _objReturn;
	},
	_AdminGroup: function() {
		var _allow = Groups.findOne({name: this.nameGroup}).isAdmin;
		if(Meteor.userId() === _allow) {
			return true;
		}
	},
	_eventIsCreate: function() {
		var _allow = Groups.findOne({name: this.nameGroup});

		if(Meteor.userId() && _allow.event !== undefined) {
			return true;
		}
	}
});

Template.eventStatistics.events({
	'click .tim': function (e, tmp) {
		console.log('.tim');

	},
	'click div[name=status-group-raise]': function(e, tmp) {
		console.log('div[name=status-group-raise]');
		Meteor.call('_changeOfStatus', Meteor.userId(), tmp.data.nameGroup, true);
	},
	'click div[name=status-group-lower]': function(e, tmp) {
		console.log('div[name=status-group-lower]');
		Meteor.call('_changeOfStatus', Meteor.userId(), tmp.data.nameGroup, false);
	},
});
