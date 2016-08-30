Template.registrationGroup.events({
	'click div[name=button-create-group]': function(e, tmpl) {
		var data = {};
		data.name = document.getElementsByName('name-group')[0].value;
		var elem = $('#name-group-create');
		data.name = data.name.trim();
		data.icon = $('.selectImage').find('._this').attr('src');
		var _allow = data.name.search(/^(([a-z-_0-9іьєї\']{1,7}\s?){1,4})$/ig);

		if (data.name !== '') {
			if (_allow !== -1) {
				Meteor.call('_insertGroup', Meteor.userId(), data, function(err, res) {
					if (res) {
						console.log('ok');
						elem.parent().removeClass('has-error has-success');
						elem.next().removeClass('glyphicon-remove glyphicon-ok');
						elem.next().next().html('');
						elem.val('');
					} else {
						console.log('err');
						elem.parent().removeClass('has-success').addClass('has-error');
						elem.next().removeClass('glyphicon-ok').addClass('glyphicon-remove');
						elem.next().next().html('(error)');
					}
				});
			} else {
				elem.parent().removeClass('has-success').addClass('has-error');
				elem.next().removeClass('glyphicon-ok').addClass('glyphicon-remove');
				elem.next().next().html('(error)');
			}
		} else {
			elem.parent().removeClass('has-success has-error');
			elem.next().removeClass('glyphicon-ok glyphicon-remove');
			elem.next().next().html('');
		}
		console.log('Group added');
	},
	'change #name-group-create': function(e, tmpl) {
		console.log(e.currentTarget.value);
		var data = {};
		var elem = $('#name-group-create');
		data.name = document.getElementsByName('name-group')[0].value.trim();
		var _allow = data.name.search(/^(([a-z-_0-9іьєї\']{1,7}\s?){1,4})$/ig);


		if (data.name !== '') {
			if (_allow !== -1) {
				Meteor.call('_checkNameGroup', Meteor.userId(), data, function(err, res) {
					console.log('res == ', res);
					if (res) {
						console.log('ok');
						elem.parent().removeClass('has-error').addClass('has-success');
						elem.next().removeClass('glyphicon-remove').addClass('glyphicon-ok');
						elem.next().next().html('(success)');
					} else {
						console.log('err');
						elem.parent().removeClass('has-success').addClass('has-error');
						elem.next().removeClass('glyphicon-ok').addClass('glyphicon-remove');
						elem.next().next().html('(error)');
					}
				});
			} else {
				elem.parent().removeClass('has-success').addClass('has-error');
				elem.next().removeClass('glyphicon-ok').addClass('glyphicon-remove');
				elem.next().next().html('(error)');
			}
		} else {
			elem.parent().removeClass('has-success has-error');
			elem.next().removeClass('glyphicon-ok glyphicon-remove');
			elem.next().next().html('');
		}
	},
	'click .selectImage>img': function(e, tmp) {
		$(e.currentTarget).siblings().removeClass('img-thumbnail img-circle _this');
		$(e.currentTarget).addClass('img-thumbnail _this');
	}
});


/*

var allow = newCategory.search(/^(((([a-zа-яієї])[a-zа-я0-9іьєї\']{0,10}\s?){1,2}[a-zа-я0-9іьєї\']{1,10}[a-zа-яієьї]){1,1})$/ig);

*/
