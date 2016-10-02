class AccountSettingsController {

	constructor($mdDialog) {
		this.$mdDialog = $mdDialog;

	}

	imageUpload(file, errFile) {
		this.file = file;
	}

	cancel() {
		this.$mdDialog.cancel();
	}

}

export default AccountSettingsController;