Template.menuGroup.helpers({
	itemMenu: function() {
		var arrForReturn = [];
		var uId = Meteor.userId();
		var objMenu = Groups.findOne({ name: this.nameGroup });

		if (objMenu.menu !== undefined) {
			for (var op in objMenu.menu) {
				let m = objMenu.menu[op];
				arrForReturn.push({
					'name': op,
					'price': objMenu.menu[op].price + '$',
					'count': (parseInt(objMenu.menu[op].counter[uId])) ? (parseInt(objMenu.menu[op].counter[uId])) : (parseInt('0')),
					'sale': (m.sale)?(`${(m.sale.type == "coupon")?(''):('-')}${m.sale.count} ${m.sale.type}`):('')
				});
			}
			return _.sortBy(arrForReturn, 'name');
		}
	}
});

Template.menuGroup.events({
	'click #idRemoveItemMenu': function(e, tmp) {
		var data = {};
		var _this = $(e.currentTarget);

		data.name = _this.parent().parent().next().text().trim();
		$(e.currentTarget)
			.parent()
			.parent()
			.parent()
			.addClass('js-hidden')
			.after(`<div class="row text-center bg-primary my-h-row-45 js-menu-group-row">
													<div class="btn btn-sm btn-danger my-btn-circle glyphicon glyphicon-ok"></div>
													<div class="btn btn-sm btn-danger my-btn-circle glyphicon glyphicon-remove"></div>
												</div>`)
			.next()
			.animate({
				'width': 'toggle',
				'opacity': 0
			}, 0)
			.animate({
				'width': 'toggle',
				'opacity': 1
			}, 500, 'linear', function() {
				$(this).children().first().on({
					'click': function(e) {
						console.log('this ok click');
						$(this).parent().remove();
						_this.parent().parent().parent().removeClass('js-hidden');
						Meteor.call('_removeAddItemMenu', Meteor.userId(), tmp.data.nameGroup, data, false);
					}
				});
				$(this).children().last().on({
					'click': function(e) {
						console.log('this remove click');
						$(this).parent().remove();
						_this.parent().parent().parent().removeClass('js-hidden');
					}
				});
			})
			.on({
				'mouseleave': function(e) {
					console.log('this mauseout');
					$(this).remove();
					_this.parent().parent().parent().removeClass('js-hidden');
				}
			});


	},
	'click .order-menu-plus-count': function(e, tmp) {
		$(e.currentTarget).parent().find('.countt').replaceWith(function() {
			return '<div class="countt" name="countItemMenu">' + (+($(this).text()) + 1) + '</div>';
		});
	},
	'click .order-menu-minus-count': function(e, tmp) {
		$(e.currentTarget).parent().find('.countt').replaceWith(function() {
			return '<div class="countt" name="countItemMenu">' + ((+($(this).text()) > 0) ? (+($(this).text()) - 1) : ($(this).text())) + '</div>';
		});
	},
	'click .insert-itemMenu-in-coll': function(e, tmp) {
		var nameItem = $(e.currentTarget).parent().parent().prev().prev().children().first().val().trim();
		var pr = $(e.currentTarget).parent().parent().prev().children().first().val().trim();
		var priceItem = parseFloat(pr);
		var data = {};

		if (nameItem.length > 0 && priceItem > 0) {
			data.name = nameItem;
			data.price = priceItem;
			Meteor.call('_removeAddItemMenu', Meteor.userId(), tmp.data.nameGroup, data, true);
			// clear value
			$(e.currentTarget).parent().parent().prev().prev().children().first().val('');
			$(e.currentTarget).parent().parent().prev().children().first().val('');
		}
	},
	'click .menu-group-template-complete-orders > div[name=completeOrders]': function(e, tmp) {
		var arrName = [],
			objReturn = {};

		$('.data-collect-this-group').find('div[name=nameItemMenu]').each(function(index, elem) {
			arrName.push($(elem).text().trim());
		});
		$('.data-collect-this-group').find('div[name=countItemMenu]').each(function(index, elem) {
			let val = $(elem).text().trim();
			if (parseInt(val) > 0) {
				objReturn[arrName[index]] = val;
			}
		});
		if (!_.isEmpty(objReturn)) {
			Meteor.call('_completeOrdersInGroup', Meteor.userId(), tmp.data.nameGroup, objReturn);
		}
		$(e.currentTarget).text('custom made');
		$(e.currentTarget).one('mouseout', function() {
			$(this).text('complete orders');
		});
	},
	'click #idUpdateItemMenu': function(e, tmp) {
		var data = {},
			objTemp = {};
		var _this = $(e.currentTarget);

		data.oldName = _this.parent().parent().next().text().trim();
		data.oldPrice = parseFloat(_this.parent().parent().next().next().find('[name="priceItem"]').text().trim());
		$('.my-this-menu-to-delete').remove();
		$('.js-hidden').removeClass('js-hidden');
		$(e.currentTarget)
			.parent()
			.parent()
			.parent()
			.addClass('js-hidden')
			.after(`<div class="row text-center bg-primary my-h-row-45 js-menu-group-row my-this-menu-to-delete">
							<div class="col-md-1"></div>
							<div class="col-md-5">
								<input type="text" placeholder="Name" class="my-h-row-45 text-center my-c-black btn-group btn-group-justified" value="${data.oldName}">
							</div>
							<div class="col-md-3">
								<input type="text" placeholder="Price" class="my-h-row-45 my-c-black text-center btn-group btn-group-justified" value="${data.oldPrice}">
							</div>
							<div class="col-md-3">
								<div class="btn btn-sm btn-danger my-btn-circle glyphicon glyphicon-ok"></div>
								<div class="btn btn-sm btn-danger my-btn-circle glyphicon glyphicon-remove"></div>
							</div>
							</div>`)
			.next()
			.animate({
				'width': 'toggle',
				'opacity': 0
			}, 0)
			.animate({
				'width': 'toggle',
				'opacity': 1
			}, 100, 'linear', function() {
				$(this).children().last().children().first().on({
					'click': function(e) {
						console.log('this ok click');
						objTemp.name = $(this).parent().prev().prev().children().first().val().trim();
						objTemp.price = parseFloat($(this).parent().prev().children().first().val().trim());

						if (objTemp.name !== '' && objTemp.price > 0) {
							$(this).parent().parent().remove();
							_this.parent().parent().parent().removeClass('js-hidden');

							data.newName = objTemp.name;
							data.newPrice = objTemp.price;

							Meteor.call('_updateItemMenu', Meteor.userId(), tmp.data.nameGroup, data);
						}
					}
				});
				$(this).children().last().children().last().on({
					'click': function(e) {
						console.log('this remove click');
						$(this).parent().parent().remove();
						_this.parent().parent().parent().removeClass('js-hidden');
					}
				});
			})
	}
});
