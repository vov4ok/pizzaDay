var _totalCountRVar = new ReactiveVar();

Template.newMainMenu.helpers({
	myGrou: function() {
		return Groups.find({ isAdmin: Meteor.userId() }, { sort: { name: 1 } }).fetch();
	},
	iGrou: function() {
		var _totalCountwer = 0;
		var arrReturn = [];
		var temp = Groups.find({
			usersId: Meteor.userId()
		}).fetch();

		temp.forEach(function(e) {
			let data = {};

			data.name = e.name;
			if (e.event !== undefined) {
				if (e.event.read !== undefined && (e.event.status < 2 && e.event.status >= 0)) {
					if (e.event.read[Meteor.userId()] !== undefined) {
						if (e.event.read[Meteor.userId()] === false) {
							data.count = 1;
							_totalCountwer++;
						}
					}
				}
			}
			arrReturn.push(data);
		})
		_totalCountRVar.set(_totalCountwer);
		return arrReturn;
	},
	_totalCount: function() {
		return _totalCountRVar.get();
	}
});

Template.newMainMenu.events({
	'click a.groups-select': function(e, tmpl) {
		e.preventDefault();
		var _name = $(e.currentTarget).find('span[name=group-to-go]').text();
		console.log('_name', _name);
		Router.go('selectGrouop', { name: _name });
	}
})
