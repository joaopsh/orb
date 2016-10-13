class MapController {

	constructor($timeout, $rootScope, uiGmapGoogleMapApi, mapService, chatSocketService) {
		this.default = mapService.getDefaultConfigs();
		this.options = mapService.getOptions();

		chatSocketService.on('hello', (message) => {
			console.log(message);
			
		});

	}

}

export default MapController;