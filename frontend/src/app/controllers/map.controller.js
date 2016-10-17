class MapController {
	constructor($scope, $timeout, $rootScope, uiGmapGoogleMapApi, mapService, chatSocketService) {
		this.config = mapService.getDefaultConfig();
    this.chatSocketService = chatSocketService;
    this.$rootScope = $rootScope;
		
		//on leaving the page It clears the socket listenners for not replicate the calls when the page is accessed again
		$scope.$on('$destroy', function (event) {
		  chatSocketService.disconnect();
		});

		chatSocketService.on('chat:online:list', (usersMarkers) => {
        this.chatOnlineListEventHandler(usersMarkers);

        // After recepted all online users, this event handle all new users or position change
        chatSocketService.on('chat:position:update', (userMarker) => {
          this.chatPositionUpdateEventHandler(userMarker);
        });

        // Removes the user that left the chat
        chatSocketService.on('chat:signout', (outUserMarker) => {
          this.chatSignoutEventHandler(outUserMarker);
        });

        // When a user opens a new window to chat with me, It sends an invitation
        chatSocketService.on('chat:invitation:' + $rootScope.userInfo.email , (invitation) => {
          console.log(invitation);
        });

      });

      // Tells the server to send me the chat online users list (event catched above)
      chatSocketService.emit('chat:online:list', {});

	}

  //Event handlers
  chatSignoutEventHandler(outUserMarker) {
    this.markers = this.markers.filter((userMarker) => {
      return userMarker.email !== outUserMarker.email;
    });
  }

  chatPositionUpdateEventHandler(userMarker) {
    if(this.$rootScope.userInfo.email === userMarker.email) {
      this.config.center = userMarker.coords;
      userMarker.icon = {
        url: '/dist/images/pin.png'
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
          url: '/dist/images/pin.png'
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
    // Receive the new chat room identificator and opens the new chat window
    this.chatSocketService.on('chat:new', (newChat) => {
      this.$rootScope.$broadcast('panelController:newChat', newChat);
    });

    if(user.email !== this.$rootScope.userInfo.email)
      this.chatSocketService.emit('chat:new', [user]);

  }

}

export default MapController;