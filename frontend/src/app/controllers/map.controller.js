class MapController {
	constructor($scope, $timeout, $rootScope, uiGmapGoogleMapApi, mapService, chatSocketService) {
		this.config = mapService.getDefaultConfig();
    this.chatSocketService = chatSocketService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
		
		//on leaving the page It clears the socket listenners for not replicate the calls when the page is accessed again
		$scope.$on('$destroy', function (event) {
		  chatSocketService.disconnect();
		});

    $rootScope.$on('mapController:reconnect', (event) => {
      this.initEventsHandler();
		});

		this.initEventsHandler();

	}

  initEventsHandler() {
    if(!this.chatSocketService.socket.hasListeners('chat:online:list')){
      this.chatSocketService.socket.once('chat:online:list', (usersMarkers) => {
        this.chatOnlineListEventHandler(usersMarkers);

        // After recepted all online users, this event handle all new users or position change
        if(!this.chatSocketService.socket.hasListeners('chat:position:update')){
          this.chatSocketService.on('chat:position:update', (userMarker) => {
            this.chatPositionUpdateEventHandler(userMarker);
          });
        }
        
        // Removes the user that left the chat
        if(!this.chatSocketService.socket.hasListeners('chat:signout')){
          this.chatSocketService.on('chat:signout', (outUserMarker) => {
            this.chatSignoutEventHandler(outUserMarker);
          });
        }
        
        //Receives all user's messages
        if(!this.chatSocketService.socket.hasListeners('chat:room')) {
          this.chatSocketService.on('chat:room', (newMessage) => {
            this.$rootScope.$broadcast('panelController:newMessage', newMessage);
          });
        }

      });

      // Tells the server to send me the chat online users list (event catched above)
      this.chatSocketService.emit('chat:online:list', {});
    }
  }

  //Event handlers
  chatSignoutEventHandler(outUserMarker) {
    var toRemove = this.markers.find((userMarker) => {
        return userMarker.id === outUserMarker.id;
      });

    this.markers.splice(this.markers.indexOf(toRemove), 1);
  }

  chatPositionUpdateEventHandler(userMarker) {
    if(this.$rootScope.userInfo.email === userMarker.email) {
      this.config.center = userMarker.coords;
      userMarker.icon = {
        url: '/dist/images/pinme.png'
      };
      
    } else {
      userMarker.icon = {
        url: '/dist/images/pin.png'
      };
    }
    
    var foundMarker = this.markers.find((elem) => {
      return elem.email === userMarker.email;
    });

    if(foundMarker)
      foundMarker.coords = userMarker.coords;
    else {
      userMarker.events = {
        click: this.newChatEventHandler.bind(this, {
            id: userMarker.id,
            email: userMarker.email,
            firstName: userMarker.firstName,
            lastName: userMarker.lastName
          })
      }

      this.markers.push(userMarker);
    }
  }

  chatOnlineListEventHandler(usersMarkers) {
    this.markers = [];

    angular.forEach(usersMarkers, (userMarker) => {
      if(this.$rootScope.userInfo.email === userMarker.email) {
        this.config.center = userMarker.coords;
        userMarker.icon = {
          url: '/dist/images/pinme.png'
        };
        
      } else {
        userMarker.icon = {
          url: '/dist/images/pin.png'
        };
      }
        
      var foundMarker = this.markers.find((elem) => {
        return elem.email === userMarker.email;
      });

      if(foundMarker)
        foundMarker.coords = userMarker.coords;
      else {
        userMarker.events = {
          click: this.newChatEventHandler.bind(this, {
            id: userMarker.id,
            email: userMarker.email,
            firstName: userMarker.firstName,
            lastName: userMarker.lastName
          })
        }

        this.markers.push(userMarker);
      }
    });

  }

  newChatEventHandler(user) {
    this.$rootScope.$broadcast('panelController:newChat', [user]);
  }

}

export default MapController;