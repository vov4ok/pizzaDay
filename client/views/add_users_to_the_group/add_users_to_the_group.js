var listUsersAdd = new ReactiveVar();
var listUsersRem = new ReactiveVar();
var nameG = new ReactiveVar();

Template.addUsersToTheGroup.helpers({
	'listUsersAdd': function() {
			nameG.set(this.nameGroup);
		return listUsersAdd.get();
	},
	'listUsersRem': function() {
			nameG.set(this.nameGroup);
		return listUsersRem.get();
	}
});

Template.addUsersToTheGroup.events({
	'click .add-use': function () {
		$('.add-use').next().slideToggle();
			var text = $(".add-use > span").text();
			$(".add-use > span").text(text != "∨" ? "∨" : "∧");
		Meteor.call('_getEmailUsers', Meteor.userId(), nameG.get(), function (err, res) {
			listUsersAdd.set(res);
		});
	},
	'click .btns > button[name=add-u]': function(e, tmp) {
		var arr = [];

		$('.add-userss').find('li').children('label').each(function(i, e) {
			if($(e).children('input').first().prop("checked")) {
				$(e).parent().remove();
				arr.push($(e).text());
			}
		});
		Meteor.call('_addUsersInGroup', Meteor.userId(), nameG.get(), arr);
	},
	'click .rem-use': function () {
		$('.rem-use').next().slideToggle();
			var text = $(".rem-use > span").text();
			$(".rem-use > span").text(text != "∨" ? "∨" : "∧");
		Meteor.call('_getUsersInGroup', Meteor.userId(), nameG.get(), function (err, res) {
			listUsersRem.set(res);
		});
	},
	'click .rem-userss > li > span': function(e, tmp) {
		var it = e.currentTarget.nextElementSibling.innerText;

		Meteor.call('_remUsersInGroup', Meteor.userId(), nameG.get(), it);
		console.log(e.currentTarget.parentElement.remove());
	}
});
