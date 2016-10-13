class HeaderController {
	constructor($scope, $rootScope, $mdSidenav, $state, OAuth, OAuthToken) {
		this.$state = $state;
		this.OAuth = OAuth;
		this.OAuthToken = OAuthToken;

		$rootScope.toggleSidenav = (componentId) => {
			$mdSidenav(componentId).toggle();
		}
	}

	isState(name) {
		return this.$state.is(name);
	}

	isAuthenticated() {
		return this.OAuth.isAuthenticated();
	}

	logout() {
		this.OAuth.revokeToken().then(() => {
			this.$state.go('sign');
		});
		
	}

}

export default HeaderController;