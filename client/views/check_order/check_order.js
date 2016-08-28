Template.checkOrder.helpers({
	_ifOrders: function() {
		var obj = Groups.findOne({ name: this.nameGroup }, { fields: { menu: 1 } }).menu;
		var userId = Meteor.userId();

		for (var op in obj) {
			if (obj[op].counter[userId] !== undefined) {
				return true;
			}
		}
	},
	_orders: function() {
		var arrReturn = [];
		var menu = Groups.findOne({ name: this.nameGroup }, { fields: { menu: 1 } }).menu;
		var userId = Meteor.userId();

		// console.log('menu', menu);
		for (var op in menu) {
			if (menu[op].counter[userId] !== undefined) {
				arrReturn.push({
					'name': op,
					'count': menu[op].counter[userId],
					'price': menu[op].price,
					'sale': (menu[op].sale)?(`${(menu[op].sale.type == "coupon")?(''):('-')}${menu[op].sale.count} ${menu[op].sale.type}`):('')
				})
			}
		}
		return _.sortBy(arrReturn, 'name');
	},

	_check: function() {
		var objReturn = { units: 0, total: 0 };
		var menu = Groups.findOne({ name: this.nameGroup }, { fields: { menu: 1 } }).menu;
		var userId = Meteor.userId();
		var _sale = 0;

		//console.log('menu', menu);
		//
		for (var op in menu) {
			if (menu[op].counter[userId] !== undefined) {
				objReturn.units += menu[op].counter[userId]
				objReturn.total += parseInt(menu[op].price) * menu[op].counter[userId];

				let _saleItem;
				let _allCount = _.reduce(_.values(menu[op].counter), function(m, e) {
					return m + e; }, 0);
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
					_sale += _saleItem / _allCount * menu[op].counter[userId];
				}
				console.log('_sale', _sale);
			}
		}
		//
		objReturn.to_pay = ((objReturn.total - _sale) >= 0) ? (+(objReturn.total - _sale).toFixed(2)) : (0);
		return objReturn;
		// {units: 25, total: '50$'}
	}
});
