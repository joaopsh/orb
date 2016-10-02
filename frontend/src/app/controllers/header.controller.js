class HeaderController {

	constructor($scope, $rootScope, $mdSidenav) {

		$rootScope.toggleSidenav = (componentId) => {
			$mdSidenav(componentId).toggle();
		}

	}

}

export default HeaderController;