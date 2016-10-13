class chatSocketService {
  constructor($rootScope, $state, $mdToast, configs, OAuth, OAuthToken) {
    this.$rootScope = $rootScope;
    this.tryRefresh = true;
    this.ready = false;
    
    this.socket = io.connect(configs.socketioUrl + configs.chatNamespace, { 'force new connection': true, reconnection: true });

    this.socket.on('connect', () => {;
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {

          this.socket.emit('authentication', { 
            auth: OAuthToken.getToken(),
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          });
          
          this.socket.on('authenticated', () => {
            console.log('socket::authenticated');
          });

          this.socket.on('disconnect', () => {
            this.ready = false;
            this.tryRefresh = true;
            console.log('socket::disconnected');
          });

          this.socket.on('ready', () => {
            this.ready = true;
            console.log('socket::ready');
          });

          this.socket.on('unauthorized', (err) => {
            if(this.tryRefresh) {
              OAuth.getRefreshToken().then(() => {
                this.socket = io.connect(configs.socketioUrl + configs.chatNamespace, { 'force new connection': true, reconnection: true });
                this.socket.emit('authentication', { 
                  auth: OAuthToken.getToken(),
                  coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                  }
                });

                console.log('socket::refreshed');
              });

              this.tryRefresh = false;
            }
            
          });

        });

      } else {
        $mdToast.show(this.$mdToast.simple()
				.textContent('Sorry, Orb will not work. Your browser doesn\'t support geolocation, please, update It.')
				.hideDelay(1000 * 15)
				.position('top left'));
      }

    });

  }

  disconnect() {
    this.socket.disconnect();
    this.tryRefresh = true;
    this.ready = false;
  }

  isReady() {
    return this.ready;
  }

  on (eventName, callback) {
    let self = this;

    this.socket.on(eventName, function() {  
      let args = arguments;
      self.$rootScope.$apply(function() {
        callback.apply(self.socket, args);
      });
    });

  }

  emit (eventName, data, callback) {
    let self = this;

    this.socket.emit(eventName, data, function() {
        let args = arguments;
        self.$rootScope.$apply(function() {
          if (callback) {
            callback.apply(self.socket, args);
          }
        });
      });

  }

}

export default chatSocketService;