var _saleRender = new ReactiveVar();

Template.saleForItemMenu.onRendered(function() {
	_saleRender.set($('select[name=nameGroupRemove]').val());
});

Template.saleForItemMenu.helpers({
	_itemsNoSale: function() {
		var _arrReturn = [];
		var _menu = Groups.findOne({ name: this.nameGroup }, { sort: { name: 1 } }).menu;

		for (var op in _menu) {
			if (_menu[op].sale == undefined) {
				_arrReturn.push({
					name: op
				});
			}
		}
		return _arrReturn;
	},
	_itemsOfSale: function() {
		var _arrReturn = [];
		var _menu = Groups.findOne({ name: this.nameGroup }, { sort: { name: 1 } }).menu;

		for (var op in _menu) {
			if (_menu[op].sale != undefined) {
				_arrReturn.push({
					name: op
				});
			}
		}
		return _arrReturn;
	},
	_sale: function() {
		if (_saleRender.get()) {
			var _ItemMenu = Groups.findOne({ name: this.nameGroup }).menu[_saleRender.get()];
			if (_ItemMenu.sale) {
				_saleRender.set($('select[name=nameGroupRemove]').val())
				_ItemMenu = Groups.findOne({ name: this.nameGroup }).menu[_saleRender.get()];
				return { count: _ItemMenu.sale.count, type: _ItemMenu.sale.type };
			};
		}
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
		Meteor.setTimeout(function() {
			_saleRender.set($('select[name=nameGroupRemove]').val());
		}, 200);
	},
	'click .removeSale': function(e, tmp) {
		var self = $('.sale-for-item-menu');
		var data = {
			name: self.find('[name=nameGroupRemove]').val()
		};
		Meteor.call('_addRemoveSale', Meteor.userId(), tmp.data.nameGroup, data, false);
		Meteor.setTimeout(function() {
			_saleRender.set($('select[name=nameGroupRemove]').val());
		}, 200);
	},
	'change select[name=nameGroupRemove]': function(e, tmp) {
		_saleRender.set($(e.currentTarget).val());
		console.log('select ', _saleRender.get());
	}
});
