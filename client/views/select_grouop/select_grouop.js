var itemMenu = new ReactiveDict();

Template.selectGrouop.helpers({
	menuItem: function() {
		var elem = Groups.find({name: this.nameGroup}, {fields: {menu: 1}}).fetch()[0].menu;
		var arr = [];
		var uId = Meteor.userId();

		for(var op in elem) {
			arr.push({
				name: op,
				price: elem[op].price,
				count: (elem[op].counter[uId])?(elem[op].counter[uId]):(0)
			})
		}

		return _.sortBy(arr, 'name');
	},
	nameGroup: function() {
		return {name: this.nameGroup};
	},
	autent: function() {
		return Groups.find({name: this.nameGroup, isAdmin: Meteor.userId()}).fetch();
	}
});

Template.selectGrouop.events({
	'click .add-item': function(e, tmp) {
		+e.currentTarget.parentElement.firstElementChild.innerText++;
	},
	'click .rem-item': function(e, tmp) {
		if(+e.currentTarget.parentElement.firstElementChild.innerText > 0) {
			+e.currentTarget.parentElement.firstElementChild.innerText--;
		}
	},
	'click .submit-order': function(e, tmp) {
		var userId = Meteor.userId();
		var GName = this.nameGroup;
		console.log('this.n', this.nameGroup);
		var a = $('.name-item');
		var a1 = $('.count-item');
		var obj = {};

		for (var i = a.length - 1; i >= 0; i--) {
			if(a1[i].innerText == 0) {continue};
			obj[a[i].innerText] = a1[i].innerText;
		}

		Meteor.call('_editCount', GName, userId , obj);
	},
	'click .remove-item-menu-real': function(e, tmp) {
		var GName = tmp.data.nameGroup;
		var userId = Meteor.userId();
		var valItem = {};
		console.log(tmp	);
		valItem.name = e.currentTarget.parentElement.nextElementSibling.innerText;
		console.log(GName);
		Meteor.call('_removeItemMenu', GName, userId, valItem);
	},
	'click .update-item-menu-real': function(e, tmp) {

		// якись переключатель щоб можна було заблокувати подію на кнопці редагувати!!!!!!!!!!!!!!!!!!!!!!!!!!

		itemMenu.set('name', $(e.target).parent().next().text());
		itemMenu.set('price', $(e.target).parent().next().next().text());
		itemMenu.set('order', $(e.target).parent().next().next().next().html());

		console.log('name ====================== ', itemMenu.get('name'));
		console.log('price ======================', itemMenu.get('price'));
		console.log('order ======================', itemMenu.get('order'));


	},
	'click .end-update-ok': function(e, tmp) {
		console.log('All ok');
	},
	'click .end-update-cancel': function(e, tmp) {
		console.log('All canceled');
	},
	'click .button-add-item-in-menu': function(e, tmp) {
		var group = this.nameGroup;
		var userId = Meteor.userId();
		var data = {};
		var name = $('.new-item-menu-name > input');
		var price = $('.new-item-menu-price > input');

		name.val(name.val().trim());
		price.val(price.val().trim());

		if(name.val().length > 0 && price.val().length > 0 && parseFloat(price.val())) {
			var d = _.isNumber(price.val());

			data.name = name.val();
			data.price = price.val();

			name.val('');
			price.val('');

			Meteor.call('_insertItemMenu', group, userId, data);
		}
	}
});
