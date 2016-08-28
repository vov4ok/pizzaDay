/*************
 * _getUsersData,
 * _addRemoveUsersInGroup,
 * _deleteGroup,
 * _newEvent,
 * _setEventStatus,
 * _subscribeToEvent,
 * _getSubscribeUser,
 * _removeAddItemMenu,
 * _completeOrdersInGroup
 * _changeOfStatus
 * _updateItemMenu
 * _newNotificatio
 * _addRemoveSale
 */

Meteor.methods({
	'_getUsersData': function(nameGrou, bool) {
		var group = Groups.find({ name: nameGrou }).fetch()[0];
		var idUsersInGroup = group.usersId;
		var arrUsers = Meteor.users.find({}).fetch();
		var arrReturn = [];
		var _getMap = {};

		// get map Id - email
		arrUsers.forEach(function(e) {
			if (e.emails !== undefined) {
				_getMap[e._id] = e.emails[0].address;
			} else {
				_getMap[e._id] = e.services.google.email;
			}
		});
		delete _getMap[group.isAdmin];
		// get map Id - email

		if (bool) {
			// in group
			_.values(_.omit(_getMap, idUsersInGroup)).forEach(function(e) {
				arrReturn.push({ 'email': e });
			});
			console.log(arrReturn);
		} else {
			// out group
			_.values(_.pick(_getMap, idUsersInGroup)).forEach(function(e) {
				arrReturn.push({ 'email': e });
			});
			console.log(arrReturn);
		}
		return arrReturn;
		/*------------*/
	},
	'_addRemoveUsersInGroup': function(userId, nameGrou, arr, bool) {
		var group = Groups.find({ name: nameGrou }).fetch()[0];
		var arrUsers = Meteor.users.find({}).fetch();
		var _getMap = {};
		var ress = [];

		// get map Id - email
		arrUsers.forEach(function(e) {
			if (e.emails !== undefined) {
				_getMap[e._id] = e.emails[0].address;
			} else {
				_getMap[e._id] = e.services.google.email;
			}
		});
		// get map Id - email

		if (bool) {
			// add users in group
			ress = _.values(_.pick(_.invert(_getMap), arr));
			Groups.update({ name: nameGrou }, { $pushAll: { usersId: ress } });

			if (!_.isEmpty(Groups.find({ name: nameGrou, [`event.read`]: { $exists: true } }).fetch())) {
				ress.forEach(function(e) {
					Groups.update({ name: nameGrou }, {
						$set: {
							[`event.read.${e}`]: false
						}
					});
				});
			}
		} else {
			// remove users in group
			ress = _.values(_.pick(_.invert(_getMap), arr));
			Groups.update({ name: nameGrou }, { $pullAll: { usersId: ress } });

			if (!_.isEmpty(Groups.find({ name: nameGrou, [`event.read`]: { $exists: true } }).fetch())) {
				ress.forEach(function(e) {
					Groups.update({ name: nameGrou }, {
						$unset: {
							[`event.read.${e}`]: ""
						}
					});
				});
			}
		}
	},
	'_deleteGroup': function(userId, nameGroup) {
		var _allow = Groups.find({ isAdmin: userId, name: nameGroup }).count();

		if (_allow) {
			Groups.remove({ isAdmin: userId, name: nameGroup });
		}
		/*------------*/
	},
	'_newEvent': function(userId, nameGroup, data) {
		if (userId === Meteor.userId()) {
			var a = Groups.find({ name: nameGroup }).fetch()[0].isAdmin;
			var b = Groups.find({ name: nameGroup, event: { $exists: false } }).fetch();
			if (userId == a && !_.isEmpty(b)) {
				// console.log('b', _.isEmpty(b));
				Groups.update({
					name: nameGroup
				}, {
					$set: {
						event: {
							status: 0,
							dateAt: new Date(),
							subscribeUsers: {
								[Meteor.userId()]: true
							},
						}
					}
				}); // end update
			} // end if
		}
		/*------------*/
	},
	'_setEventStatus': function(userId, nameGroup, setStatus) {

		Groups.update({ name: nameGroup }, {
			$set: {
				[`event.status`]: setStatus
			}
		});
		/*------------*/
	},
	'_subscribeToEvent': function(userId, nameGroup, _toggle) {
		if (userId === Meteor.userId()) {
			if (_toggle === true) {
				Groups.update({ name: nameGroup }, {
					$set: {
						[`event.subscribeUsers.${Meteor.userId()}`]: true,
						[`event.read.${Meteor.userId()}`]: true
					}
				});
			} else if (_toggle === false) {
				Groups.update({ name: nameGroup }, {
					$set: {
						[`event.subscribeUsers.${Meteor.userId()}`]: false,
						[`event.read.${Meteor.userId()}`]: true
					}
				});
			}
		}
		/*------------*/
	},
	'_getSubscribeUser': function(userId, nameGroup) {
		console.log(userId);
		console.log(nameGroup);
		return false;
		/*------------*/
	},
	'_removeAddItemMenu': function(userId, group, data, bool) {
		var gr = Groups.findOne({ name: group });
		var _alloww = Groups.find({
			$and: [
				{ $or: [{ isAdmin: Meteor.userId() }, { usersId: Meteor.userId() }] },
				{ name: group }
			]
		}).fetch();

		if (!bool && Meteor.userId() == userId && !_.isEmpty(_alloww) && gr.menu[data.name] != undefined) {
			// remove item menu
			Groups.update({ name: group }, {
				$unset: {
					[`menu.${data.name}`]: ""
				}
			});
		} else if (bool && Meteor.userId() == userId && Meteor.userId() == gr.isAdmin) {
			// add item menu
			Groups.update({ name: group }, {
				$set: {
					[`menu.${data.name}`]: { "price": parseFloat(data.price), "counter": {} }
				}
			});
		}
		/*------------*/
	},
	'_completeOrdersInGroup': function(userId, nameGroup, data) {
		var _allow = Groups.findOne({
			$and: [
				{ $or: [{ isAdmin: Meteor.userId() }, { usersId: Meteor.userId() }] },
				{ name: nameGroup }
			]
		});

		if (Meteor.userId() == userId && !_.isEmpty(_allow)) {
			for (var op in _allow.menu) {
				if (data[op] !== undefined) {
					Groups.update({ name: nameGroup }, {
						$set: {
							[`menu.${op}.counter.${Meteor.userId()}`]: parseInt(data[op])
						}
					});
				} else {
					Groups.update({ name: nameGroup }, {
						$unset: {
							[`menu.${op}.counter.${Meteor.userId()}`]: ""
						}
					});
				}
			}
		}
		/*------------*/
	},
	'_changeOfStatus': function(userId, nameGroup, bool) {
		var _allow = Groups.findOne({ name: nameGroup, isAdmin: Meteor.userId() });

		if (_allow !== undefined && _allow.event !== undefined && Meteor.userId() === userId) {
			if (bool === true && _allow.event.status < 3) {
				Groups.update({ name: nameGroup }, { $inc: { "event.status": 1 } });
			} else if (bool === false && _allow.event.status > 0) {
				Groups.update({ name: nameGroup }, { $inc: { "event.status": -1 } });
			}
		}
		/*------------*/
	},
	'_updateItemMenu': function(userId, nameGroup, data) {
		var _allow = Groups.findOne({
			$and: [
				{ $or: [{ isAdmin: Meteor.userId() }, { usersId: Meteor.userId() }] },
				{ name: nameGroup }, {
					[`menu.${data.oldName}`]: { $exists: true }
				}
			]
		});

		if (Meteor.userId() == userId && !_.isEmpty(_allow)) {
			Groups.update({ name: nameGroup }, {
				$rename: {
					[`menu.${data.oldName}`]: `menu.${data.newName}`
				}
			});
			Groups.update({ name: nameGroup }, {
				$set: {
					[`menu.${data.newName}.price`]: data.newPrice
				}
			});
		}
		/*------------*/
	},
	'_newNotificatio': function(userId, nameGroup) {
		var _allow = Groups.findOne({ isAdmin: Meteor.userId(), name: nameGroup, [`event.read`]: { $exists: false } });

		if (Meteor.userId() == userId && !_.isEmpty(_allow)) {
			Groups.update({ name: nameGroup }, {
				$set: {
					[`event.read.${_allow.isAdmin}`]: true
				}
			});
			_allow.usersId.forEach(function(e) {
				Groups.update({ name: nameGroup }, {
					$set: {
						[`event.read.${e}`]: false
					}
				});
			});
		}
		/*------------*/
	},
	'_addRemoveSale': function(userId, nameGroup, data, bool) {
		var _allow = Groups.findOne({ isAdmin: Meteor.userId(), name: nameGroup });

		if (!_.isEmpty(_allow)) {
			// add Sale
			bool && Groups.update({
				isAdmin: Meteor.userId(),
				name: nameGroup
			}, {
				$set: {
					[`menu.${data.name}.sale`]: {
						count: parseInt(data.count),
						type: data.type.toLowerCase()
					}
				}
			});
			// remove Sale
			!bool && Groups.update({
				isAdmin: Meteor.userId(),
				name: nameGroup
			}, {
				$unset: {
					[`menu.${data.name}.sale`]: ""
				}
			});
		}
	}
});


/* sale
 * email
 */
