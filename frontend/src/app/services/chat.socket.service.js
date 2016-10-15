class chatSocketService {
  constructor($rootScope, $q, $interval, configs, OAuth, OAuthToken) {
    this.$rootScope = $rootScope;
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

      this.socket = io.connect(this.configs.socketioUrl + this.configs.chatNamespace, { reconnection: false, 'forceNew': true });

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

        //After all server events are registered and the chat is ready to use.
        this.socket.on('chat:ready', () => {
          //notify
          console.log('chat::ready');

          this.$interval.cancel(interval);
          deferred.resolve();
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
          if(!this.socket.connected && !this.isSignout) {
            //notify
            console.log('socket::disconnected');

            this.connect();
          } else if(this.isSignout) {
            console.log('socket::disconnected(signout)');
          }
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

}

export default chatSocketService;