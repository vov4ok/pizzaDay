/*************
 * _getUsersData,
 * _addRemoveUsersInGroup,
 * _deleteGroup,
 * _newEvent,
 * _setEventStatus,
 * _subscribeToEvent,
 * _removeAddItemMenu,
 * _completeOrdersInGroup
 * _changeOfStatus
 * _updateItemMenu
 * _newNotificatio
 * _addRemoveSale
 * _endEvent
 * sendEmail
 */
Meteor.startup(function() {
	process.env.MAIL_URL = 'smtp://login:password@...'
});

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
		} else {
			// out group
			_.values(_.pick(_getMap, idUsersInGroup)).forEach(function(e) {
				arrReturn.push({ 'email': e });
			});
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
	},
	'_endEvent': function(userId, nameGroup) {
		var _allow = Groups.findOne({ name: nameGroup, isAdmin: Meteor.userId() });

		if (_allow) {
			Groups.update({ name: nameGroup }, {
				$unset: {
					event: ""
				}
			});
			for (var op in _allow.menu) {
				Groups.update({ name: nameGroup }, {
					$set: {
						[`menu.${op}.counter`]: ""
					}
				});
			}
		}
	},
	sendEmail: function(userId, nameGroup) {
		this.unblock();
		var group = Groups.findOne({ name: nameGroup, isAdmin: Meteor.userId() });
		var data = {};
		var arrUsers = Meteor.users.find({}).fetch();
		var _getMap = {};
		var _arrAllUsersId = [];
		var _objAllUsersId_count = {};
			console.log('send Email');

		if (false) { // group
			arrUsers.forEach(function(e) {
				if (e.emails !== undefined) {
					_getMap[e._id] = {
						'email': e.emails[0].address,
						'name': e.profile['first-name']
					};
				} else {
					_getMap[e._id] = {
						'email': e.services.google.email,
						'name': e.services.google['given_name']
					}
				}
			});

			for (var option in group.menu) {
				_arrAllUsersId = _.union(_arrAllUsersId, _.keys(group.menu[option].counter));
			}

			_arrAllUsersId.forEach(function(e) {
				_objAllUsersId_count[e] = 0;
				for (var _op in group.menu) {
					_objAllUsersId_count[e] += +group.menu[_op].counter[e];
				}

			})

			console.log('_objAllUsersId_count', _objAllUsersId_count);

			function _getOrder(menu, _userId) {
				let _strReturn = ``;
				for (var op in menu) {
					if (menu[op].counter[_userId] !== undefined) {
						_strReturn += `<tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: left; width: 31%; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="left" valign="top">${op}</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="center" valign="top">${menu[op].counter[_userId]}</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; width: 31%; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="right" valign="top">${menu[op].price}$</td> </tr>`
					}
				}
				return _strReturn;
			}

			function getToPay(menu, _userId) {
				var objReturn = { units: 0, total: 0 };
				var _sale = 0;
				var _strReturn = ``;

				//console.log('menu', menu);
				//
				for (var op in menu) {
					if (menu[op].counter[_userId] !== undefined) {
						objReturn.units += menu[op].counter[_userId]
						objReturn.total += parseInt(menu[op].price) * menu[op].counter[_userId];

						let _saleItem;
						let _allCount = _.reduce(_.values(menu[op].counter), function(m, e) {
							return m + e;
						}, 0);
						let _allPrice = _allCount * menu[op].price;

						if (menu[op].sale != undefined) {
							switch (menu[op].sale.type) {
								case 'coupon':
									_saleItem = menu[op].sale.count * menu[op].price;
									break;
								case '%':
									_saleItem = _allPrice * (menu[op].sale.count) / 100;
									break;
								case '$':
									_saleItem = _allCount * menu[op].sale.count;
									break;
								default:
									_saleItem = -1
							}
						}
						if (_saleItem > 0) {
							_sale += _saleItem / _allCount * menu[op].counter[_userId];
						}
					}
				}
				//
				objReturn.to_pay = ((objReturn.total - _sale) >= 0) ? (+(objReturn.total - _sale).toFixed(2)) : (0);


				return objReturn;
			};

			// console.log('setEmailList', getToPay(group.menu, userId));
			// console.log('_getOrder', _getOrder(group.menu, userId));


			data.email = 'mwowa0105@gmail.com';


			console.log('send Email');
			_.difference(_arrAllUsersId, group.isAdmin).forEach(function(e) {
				var _countTotalToPay = getToPay(group.menu, e)
				Email.send({
					to: 'mwowa0105@gmail.com', // _getMap[e].email,
					from: 'PizzaDay@meteor.com',
					subject: `Pizza ${group.event.dateAt.getDate()}-${group.event.dateAt.getMonth()+1}-${group.event.dateAt.getFullYear()}`,
					html: `<!DOCTYPE html> <html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta> <meta charset="UTF-8"> <title>Pizza Day</title> </head> <body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0; padding: 0;" bgcolor="#f6f6f6"> <table style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td> <td width="600" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; width: 100% !important; margin: 0 auto; padding: 0;" valign="top"> <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 0;"> <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; margin: 0; padding: 10px;" align="center" valign="top"> <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> <h2 style="font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; box-sizing: border-box; font-size: 18px !important; color: #000; line-height: 1.2em; font-weight: 800 !important; margin: 20px 0 5px;">Thank you for your order </br> ${_getMap[e].name}</h2> </td> </tr> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; margin: 0; padding: 0 0 20px;" align="center" valign="top"> <table style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; text-align: left; width: 100% !important; margin: 40px auto;"> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top">${group.event.dateAt.getDate()}-${group.event.dateAt.getMonth()+1}-${group.event.dateAt.getFullYear()}</td> </tr> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top"> <table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; margin: 0;"> ${_getOrder(group.menu, e)} <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: left; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="left" valign="top">Total</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="center" valign="top">${_countTotalToPay.units}</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="right" valign="top">${_countTotalToPay.total}$</td> </tr> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: left; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="left" valign="top">To Pay</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="center" valign="top">${_countTotalToPay.units}</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="right" valign="top">${_countTotalToPay.to_pay}$</td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </div> </td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td> </tr> </table> </body> </html>`
				});

			});
			// for Admin

			function _forAdminCheck() {
				let _strForReturn = ``;
				let _saleAll = 0;
				let _total = 0;
				let _countAll = 0;

				for (var itMenu in group.menu) {
					let _saleItem = 0;
					let _count = _.reduce(_.values(group.menu[itMenu].counter), function(m, e) {
						return m + e;
					}, 0);
					_countAll += _count;
					_total += _count * group.menu[itMenu].price;

					if (group.menu[itMenu].sale != undefined) {
						switch (group.menu[itMenu].sale.type) {
							case 'coupon':
								_saleItem = group.menu[itMenu].sale.count * group.menu[itMenu].price;
								break;
							case '%':
								_saleItem = _allPrice * (group.menu[itMenu].sale.count) / 100;
								break;
							case '$':
								_saleItem = _allCount * group.menu[itMenu].sale.count;
								break;
							default:
								_saleItem = -1
						}
					}
					if (_saleItem > 0) {
						_saleAll += _saleItem;
					}
					_strForReturn += `<tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: left; width: 31%; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="left" valign="top">${itMenu}</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="center" valign="top">${_count}</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; width: 31%; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="right" valign="top">${group.menu[itMenu].price}$</td> </tr>`;
				}
				return _strForReturn += `<tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: left; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="left" valign="top">Total</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="center" valign="top">${_countAll}</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="right" valign="top">${_total.toFixed(2)}$</td> </tr> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: left; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="left" valign="top">To Pay</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="center" valign="top">${_countAll}</td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; width: 31%; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="right" valign="top">${(_total - _saleAll).toFixed(2)}$</td> </tr>`;
			}

			Email.send({
				to: 'mwowa0105@gmail.com', // _getMap[group.isAdmin].email
				from: 'PizzaDay@meteor.com',
				subject: `Pizza ${group.event.dateAt.getDate()}-${group.event.dateAt.getMonth()+1}-${group.event.dateAt.getFullYear()} Total`,
				html: `<!DOCTYPE html> <html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta> <meta charset="UTF-8"> <title>Pizza Day</title> </head> <body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0; padding: 0;" bgcolor="#f6f6f6"> <table style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td> <td width="600" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; width: 100% !important; margin: 0 auto; padding: 0;" valign="top"> <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 0;"> <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; margin: 0; padding: 10px;" align="center" valign="top"> <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> <h2 style="font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; box-sizing: border-box; font-size: 18px !important; color: #000; line-height: 1.2em; font-weight: 800 !important; margin: 20px 0 5px;">General check ${nameGroup}</h2> </td> </tr> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; width: 31%; margin: 0; padding: 0 0 20px;" align="center" valign="top"> <table style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; text-align: left; width: 100% !important; margin: 40px auto;"> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top">${group.event.dateAt.getDate()}-${group.event.dateAt.getMonth()+1}-${group.event.dateAt.getFullYear()}</td> </tr> <tr style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top"> <table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; margin: 0;">${_forAdminCheck()}</table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </div> </td> <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td> </tr> </table> </body> </html>`
			});
		}
	}
});

/*
 * email
 */
