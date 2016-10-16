class mapService {
	constructor($q) {
		this.$q = $q;
	}

	getDefaultConfig() {
		return { 
			center: { 
				latitude: -22.1111,
				longitude: -50.1111
			},
			zoom: 16,
			options: {
				mapTypeControl: false,
				streetViewControl: false,
				zoomControl: false,
				styles: [{"featureType":"road","stylers":[{"hue":"#5e00ff"},{"saturation":-79}]},{"featureType":"poi","stylers":[{"visibility": "off"},{"saturation":-78},{"hue":"#6600ff"},{"lightness":-47},{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"lightness":22}]},{"featureType":"landscape","stylers":[{"hue":"#6600ff"},{"saturation":-11}]},{},{},{"featureType":"water","stylers":[{"saturation":-65},{"hue":"#1900ff"},{"lightness":8}]},{"featureType":"road.local","stylers":[{"weight":1.3},{"lightness":30}]},{"featureType":"transit","stylers":[{"visibility":"off"},{"hue":"#5e00ff"},{"saturation":-16}]},{"featureType":"transit.line","stylers":[{"saturation":-72}]},{}]
			}
		};
	}
	
}

export default mapService;