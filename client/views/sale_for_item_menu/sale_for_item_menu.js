Template.saleForItemMenu.helpers({
	_itemsNoSale: function() {
		var _arrReturn = [];
		var _menu = Groups.findOne({ name: this.nameGroup }, { sort: { name: 1 } }).menu;

		for (var op in _menu) {
			if( _menu[op].sale == undefined) {
			_arrReturn.push({
				name: op
			});
		}
		}
		console.log('_arrReturn', _arrReturn);
		return _arrReturn;
	},
	_itemsOfSale: function() {
		var _arrReturn = [];
		var _menu = Groups.findOne({ name: this.nameGroup }, { sort: { name: 1 } }).menu;

		for (var op in _menu) {
			if( _menu[op].sale != undefined) {
			_arrReturn.push({
				name: op
			});
		}
		}
		console.log('_arrReturn', _arrReturn);
		return _arrReturn;
	}
});

Template.saleForItemMenu.events({
	'click .addSale': function(e, tmp) {
		var self = $('.sale-for-item-menu');
		var data = {
			name: self.find('[name=nameGroupAdd]').val(),
			count: self.find('[name=countSaleAdd]').val(),
			type: self.find('[name=typeSaleAdd]').find('select').val()
		};

		console.log('data', data);
		Meteor.call('_addRemoveSale', Meteor.userId(), tmp.data.nameGroup, data, true);
	},
	'click .removeSale': function(e, tmp) {
		var self = $('.sale-for-item-menu');
		var data = {
			name: self.find('[name=nameGroupRemove]').val()
		};

		Meteor.call('_addRemoveSale', Meteor.userId(), tmp.data.nameGroup, data, false);
	}
});
