
Template.registrationGroup.events({
	'click button[name=button-create-group]': function(e, tmpl) {
		var data = {};
		data.name = document.getElementsByName('name-group')[0].value;
		Meteor.call('_insertGroup', Meteor.userId(), data, function(err, res) {
			var elem = $('#name-group-create');
			if(res) {
				elem.css({'border':'1px solid silver'}).val('').next().replaceWith(function(){
					return ' <span> </span>';
				});
			} else {
				elem.css({'border':'2px solid red'}).next().replaceWith(function(){
					return ' <span style="color:red"> &times; </span>';
				});
			}

		});
		console.log('Group added');
	},
	'change #name-group-create': function(e, tmpl) {
		console.log(e.currentTarget.value);
		var dataa = {};

		dataa.name = e.currentTarget.value;
		Meteor.call('_checkNameGroup', Meteor.userId(), dataa, function(err, res) {
			var elem = $('#name-group-create');
			if(elem.val().length <= 0) {
				elem.css({'border':'1px solid silver'}).next().replaceWith(function(){
					return ' <span> </span>';
				});
			} else {
				if(res) {
					elem.css({'border':'2px solid green'}).next().replaceWith(function(){
						return ' <span style="color:green"> &#10004; </span>';
					});
				} else {
					elem.css({'border':'2px solid red'}).next().replaceWith(function(){
						return ' <span style="color:red"> &times; </span>';
					});
				}
			}
		});
	}
});
