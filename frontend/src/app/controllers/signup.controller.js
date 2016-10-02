class SignupController {

	constructor(userService, $http) {
		this.userService = userService;
		this.$http = $http;
	}

	submit() {
		this.$http.get('http://localhost:1500/user').then(function(res) {
			console.log(res.data);
		});

		// this.userService.add(this.user, function(succ) {

		// }, function(err) {

		// });
	}

}

export default SignupController;