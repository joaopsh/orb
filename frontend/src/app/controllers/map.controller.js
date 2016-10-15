class MapController {
	constructor($scope, $timeout, $rootScope, uiGmapGoogleMapApi, mapService, chatSocketService) {
		this.config = mapService.getDefaultConfig();
		
		//on leaving the page It clears the socket listenners for not replicate the calls when the page is accessed again
		$scope.$on('$destroy', function (event) {
			chatSocketService.socket.removeAllListeners();
		});

		chatSocketService.on('chat:online:list', (users) => {
        this.markers = [];

        angular.forEach(users, (user) => {
          if($rootScope.userInfo.email === user.email)
            this.config.center = user.coords;
          
          var foundMarker = this.markers.find((elem) => {
            return elem.email === user.email;
          });

          if(foundMarker)
            foundMarker.coords = user.coords;
          else {
            this.markers.push(user);
          }
        });

        // After recept all online users, this event handle all new users or position change
        chatSocketService.on('chat:position:update', (data) => {
          if($rootScope.userInfo.email === data.email)
            this.config.center = data.coords;
          
          var foundMarker = this.markers.find((elem) => {
            return elem.email === data.email;
          });

          if(foundMarker)
            foundMarker.coords = data.coords;
          else {
            this.markers.push(data);
          }
        });

        // Removes the user that left the chat
        chatSocketService.on('chat:signout', (outUser) => {
          this.markers = this.markers.filter((user) => {
            return user.email !== outUser.email;
          });
        });

      });

      // Tells the server to send me the chat online users list (event catched above)
      chatSocketService.emit('chat:online:list', {});

	}

}

export default MapController;