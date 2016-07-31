var nameG = new ReactiveVar();

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
		return arr;
	},
	nameGroup: function() {
		nameG.set(this.nameGroup);
		return {name: this.nameGroup};
	},
	autent: function() {
		return Groups.find({name: this.nameGroup}, {fields: {[Meteor.userId()]: 1}}).fetch()[0][Meteor.userId()];
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
		var GName = nameG.get();
		var a = $('.name-item');
		var a1 = $('.count-item');
		var obj = {};

		for (var i = a.length - 1; i >= 0; i--) {
			if(a1[i].innerText == 0) {continue};
			obj[a[i].innerText] = a1[i].innerText;
		}
		console.log(obj);
		Meteor.call('_editCount', nameG.get(), userId , obj);
	}
});