class MapController {

	constructor(uiGmapGoogleMapApi, mapService) {
		this.default = mapService.getDefaultConfigs();
		this.options = mapService.getOptions();

	}

}

export default MapController;