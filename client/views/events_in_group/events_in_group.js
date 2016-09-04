Template.eventsInGroup.helpers({
	'event': function() {
		var _objRet = {};
		var obj = Groups.findOne({$and: [{name: this.nameGroup}, {[`event.subscribeUsers.${Meteor.userId()}`]: true}]});
		if (!obj) {return;}

		function ress(num) {
			switch(num) {
				case 0: return 'ordering';
				case 1: return 'ordered';
				case 2: return 'delivering';
				case 3: return 'delivered';
				default: return ''
			}
		}

		if(obj.event === undefined) {
			return;
		} else {
			switch(obj.event.status) {
				case 0: if(obj.event.subscribeUsers[Meteor.userId()] === true) {
									_objRet.status = ress(obj.event.status);
									_objRet.nav = '<div class="btn-sm bg-success">wait for the response of all users</div>';
									_objRet.date = `${obj.event.dateAt.getDate()}-${obj.event.dateAt.getMonth()+1}-${obj.event.dateAt.getFullYear()}`;
									return _objRet;
								}
								break;
				case 1: if(obj.event.subscribeUsers[Meteor.userId()] === true) {
										_objRet.status = ress(obj.event.status);
										_objRet.nav = '<button type="button" class="btn btn-primary btn-sm text-uppercase" name="show-menu">menu</button>';
										_objRet.date = `${obj.event.dateAt.getDate()}-${obj.event.dateAt.getMonth()+1}-${obj.event.dateAt.getFullYear()}`;
										return _objRet;
								}
								break;
				case 2: case 3: if(obj.event.subscribeUsers[Meteor.userId()] === true) {
										_objRet.status = ress(obj.event.status);
										_objRet.nav = '<button type="button" class="btn btn-primary btn-sm text-uppercase" name="cont-status">view orders</button>';
										_objRet.date = `${obj.event.dateAt.getDate()}-${obj.event.dateAt.getMonth()+1}-${obj.event.dateAt.getFullYear()}`;
										return _objRet;
								}
								break;
				default: return false
			}
		}

	},
	'viewEvent': function() {
		var obj = Groups.findOne({
											$and: [
												{name: this.nameGroup},
												{$or : [
													{
														usersId: Meteor.userId()
													},
													{
														isAdmin: Meteor.userId()
													}]
												}]});

		if(obj.event == undefined) {
			return false;
		} else {
			if(obj.event.subscribeUsers[Meteor.userId()] === undefined) {
				return true;
			} else {
				return obj.event.subscribeUsers[Meteor.userId()];
			}
		}
	},
	'showMenu': function() {
		return _showMenu.get();
	}
});

Template.eventsInGroup.events({
	'click button[name=subscribe]': function(e,tmp) {
		console.log('button[name=subscribe]');

		Meteor.call('_subscribeToEvent', Meteor.userId(), tmp.data.nameGroup, true);
	},
	'click button[name=ignore]': function(e,tmp) {
		console.log('button[name=ignore]');

		Meteor.call('_subscribeToEvent', Meteor.userId(), tmp.data.nameGroup, false);
	}
});


// Template.eventsInGroup.helpers({
// 	'event': function() {
// 		var _thisGroup = this.nameGroup;
// 		var obj = Groups.find({name: _thisGroup}).fetch()[0].event;

// 		// console.log(obj);
// 		function ress(num) {
// 			switch(num) {
// 				case 0: return 'Впорядкування';
// 				case 1: return 'Замовити';
// 				case 2: return 'Доставкa';
// 				case 3: return 'Доставлено';
// 				default: return ''
// 			}
// 		}

// 		if(obj === undefined) {
// 			return;
// 		}

// 		if(_isSubscribe.get()) {
// 			return false;
// 		} else {
// 			Meteor.subscribe('_getMenu', this.nameGroup);
// 			if(obj.status < 4 && obj.subscribeUsers[Meteor.userId()] === true) {
// 			return {'status': ress(obj.status), 'nav': 'wait for the response of all users'};
// 		}
// 		}



// 	}
// });
