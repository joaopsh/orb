class chatSocketService {
  constructor($state, $rootScope, $q, $interval, configs, OAuth, OAuthToken) {
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$q = $q;
    this.OAuthToken = OAuthToken;
    this.OAuth = OAuth;
    this.$interval = $interval;
    this.configs = configs;
    this.socket = undefined;

  }

  connect() {
    var deferred = this.$q.defer();

    if(this.socket && this.socket.connected){
      deferred.resolve();
      return deferred.promise;
    }
      
    var intervalCounter = 0;

    var interval = this.$interval(() => {
      intervalCounter++;

      this.socket = io.connect(this.configs.socketioUrl + this.configs.chatNamespace, { reconnection: false });

      //if successfully connection event
      this.socket.on('connect', () => {
        //notify
        console.log('socket::connected');

        //Init the signout flag
        this.isSignout = false;

        //authentication
        this.socket.emit('authentication', { 
          credentials: this.OAuthToken.getToken()
        });

        //if successfully authentication event
        this.socket.on('authenticated', () => {
          //notify
          console.log('socket::authenticated');
        });

        //After all server events are registered and the user location has been sent to server, the chat is ready to use.
        this.socket.on('chat:ready', () => {
          this.positionWatcher().then(
            (succ) => {
              this.$interval.cancel(interval);
              deferred.resolve();

              //notify
              console.log('chat::ready');
            },
            (err) => {
              deferred.reject(err);
            });

        });

        //if failed authentication event
        this.socket.on('unauthorized', (err) => {
          //notify
          console.log('socket::unauthorized');

          if(err.message === 'Expired access token.') {
            this.OAuth.getRefreshToken();
          } else {
            this.$interval.cancel(interval);
            deferred.reject(err);
          }
        });

        this.socket.on('disconnect', () => {
          //clears the location watch because It'll need to instantly update the location when reconnected
          navigator.geolocation.clearWatch(this.$rootScope.watchPos);
          this.$rootScope.watchPos = undefined;

          if(!this.isSignout) {
            this.connect();
          }

          //notify
          console.log('socket::disconnected');
        });

      });

      if(intervalCounter === 5) {
        this.$interval.cancel(interval);
        deferred.reject();
      }
      
    }, 2000);

    return deferred.promise;
  }

  disconnect() {
    this.isSignout = true;
    this.socket.disconnect();
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

  positionWatcher() {
    var deferred = this.$q.defer();

    var lastLat = -999;
    var lastLng = -999;
    // 360 degrees multiplied by 100 meters (min. distance to update location)
    // and divided by earth circunference (+- 40.075.000 meters (+- 40.075 km))
    const minDistToUpdate = 360 * 100 / 40075000;
    
    if (navigator.geolocation) {
      if(this.$rootScope.watchPos) {
        deferred.resolve();
        return deferred.promise;
      }

      this.$rootScope.watchPos = navigator.geolocation.watchPosition(
        //success
        (position) => {
          if(Math.abs(Math.abs(lastLat) - Math.abs(position.coords.latitude)) > minDistToUpdate
            || Math.abs(Math.abs(lastLng) - Math.abs(position.coords.longitude)) > minDistToUpdate
            || lastLat === -999) {

              lastLat = position.coords.latitude;
              lastLng = position.coords.longitude;

              this.emit('chat:position:update', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });

            }
          
          deferred.resolve();
        },
        //error
        (err) => {
          deferred.reject(err);
        },
        //options
        {
          enableHighAccuracy: true,
          maximumAge: 0
        }
      );

    } else {
      deferred.reject('Unable to use browser location.');
    }

    return deferred.promise;
  }

}

export default chatSocketService;