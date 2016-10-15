class HeaderController {
	constructor($scope, $rootScope, $mdSidenav, $state, OAuth, OAuthToken, chatSocketService) {
		this.$state = $state;
		this.$rootScope = $rootScope;
		this.OAuth = OAuth;
		this.chatSocketService = chatSocketService;
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
			navigator.geolocation.clearWatch(this.$rootScope.watchPos);
			this.$rootScope.watchPos = undefined;
			this.chatSocketService.disconnect();
			this.$state.go('sign');
		});
		
	}

}

export default HeaderController;