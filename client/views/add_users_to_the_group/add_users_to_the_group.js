var listUser = new ReactiveVar();
var nameG = new ReactiveVar();

Template.addUsersToTheGroup.helpers({
	'listUser': function() {
			nameG.set(this.nameGroup);
		return listUser.get();
	}
});

Template.addUsersToTheGroup.events({
	'click .box h3': function () {
		$('.box h3').next().slideToggle();
			var text = $(".box > h3 > span").text();
			$(".box > h3 > span").text(text != "∨" ? "∨" : "∧");
		Meteor.call('_getEmailUserss', Meteor.userId(), nameG.get(), function (err, res) {
			listUser.set(res);
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
	}
});



