class SigninController {
	constructor($resource, $cookies, configs, OAuth) {
		this.OAuth = OAuth;
		this.Client = $resource(configs.apiUrl + '/client/:id');
		this.$cookies = $cookies;
	}

	submit() {
		this.OAuth.getAccessToken({
			username: this.user.email,
			password: this.user.password
		}).then(function(res) {
			
			
		});
	}

}

export default SigninController;