class HeaderController {
	constructor($scope, $rootScope, $mdSidenav, $state) {
		this.$state = $state;

		$rootScope.toggleSidenav = (componentId) => {
			$mdSidenav(componentId).toggle();
		}
	}

	isState(name) {
		return this.$state.is(name);
	}

}

export default HeaderController;