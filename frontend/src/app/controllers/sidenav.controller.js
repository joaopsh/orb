import { default as AccountSettingsController } from './account-settings.controller';

class SidenavController {

	constructor($mdDialog) {
		this.$mdDialog = $mdDialog;

	}

	showAccountSettingsDialog() {

		this.$mdDialog.show({
	      controller: AccountSettingsController,
	      controllerAs: 'accountSettings', 
	      templateUrl: '/dist/views/dialogs/account-settings.template.html',
	      parent: angular.element(document.body),
	      clickOutsideToClose:true,
	      openFrom: '.info',
	      closeTo: '.info'

	    })
	    .then(function(answer) {

	      
	    }, function() {

	      
	    });

	}

}

export default SidenavController;