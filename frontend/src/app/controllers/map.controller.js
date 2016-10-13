class MapController {

	constructor($timeout, $rootScope, uiGmapGoogleMapApi, mapService, chatSocketService) {
		this.default = {
			center: {}
		};
		
		mapService.getDefaultConfigs().then((configs) => {
			this.default = configs;
		});

		this.options = mapService.getOptions();

		chatSocketService.on('chat:onlineUsers', (users) => {
			this.markers = users;
			
		});

		chatSocketService.on('chat:user:signin', (user) => {
			this.markers.push(user);
		});

		chatSocketService.on('chat:user:signout', (user) => {
			this.markers = this.markers.filter(function(marker) {
				return marker.email !== user.email;
			});
		});

		if(!chatSocketService.isReady()) {
			chatSocketService.on('ready', function() {
				chatSocketService.emit('chat:onlineUsers:get');
			});
		} else {
			chatSocketService.emit('chat:onlineUsers:get');
		}
		
	}

}

export default MapController;