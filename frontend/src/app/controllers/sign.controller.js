class SignController {
	constructor($mdToast, $resource, $cookies, $state, configs, userService, OAuth) {
		this.$cookies = $cookies;
		this.$mdToast = $mdToast;
		this.$state = $state;
		this.OAuth = OAuth;
		this.Client = $resource(configs.apiUrl + '/client/:id');
		this.userService = userService;
		
	}

	signinSubmit() {
		this.OAuth.getAccessToken({
			username: this.signin.email,
			password: this.signin.password
		}).then((succ) => {
			this.$state.go('orb');
		}, (err) => {
			this.form.signin.email.$setValidity("emailPassInvalid", false);
			this.form.signin.password.$setValidity("emailPassInvalid", false);
		});
	}

	signupSubmit() {
		console.log(this.signup.firstName);
		this.userService.add({
			firstName: this.signup.firstName,
			lastName: this.signup.lastName,
			email: this.signup.email,
			password: this.signup.password,
		}, (succ) => {
			this.OAuth.getAccessToken({
				username: this.signup.email,
				password: this.signup.password
			}).then((succ) => {
				this.$state.go('orb');

				this.$mdToast.show(this.$mdToast.simple()
				.textContent('Welcome to Orb, your account was successfully created! Enjoy yourself!')
				.hideDelay(5000)
				.position('top left'));

			});

		}, (errs) => {
			angular.forEach(errs.data, (err) => {
				if(err.param === 'user.firstName')
					this.form.signup.firstName.$setValidity('required', false);
				
				if(err.param === 'user.lastName')
					this.form.signup.firstName.$setValidity('required', false);

				if(err.param === 'user.email')
					this.form.signup.firstName.$setValidity('required', false);

				console.log(this.form.signup);

				if(err.param === 'user.password')
					this.form.signup.firstName.$setValidity('required', false);
			});

		});
	}

	setValidationErrors(errors) {
		angular.forEach(errors, function(error) {
			
		});

	}

}

export default SignController;