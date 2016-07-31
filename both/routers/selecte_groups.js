Router.route('selectGrouop',{
	path: '/group/:name',
	template: 'selectGrouop',
	data: function() {
		var _this = this;
		return {
			nameGroup: _this.params.name
		}
	}
});