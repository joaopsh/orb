class chatSocketService {
  constructor($q, $interval, configs, OAuth, OAuthToken) {
    this.$q = $q;
    this.OAuthToken = OAuthToken;
    this.OAuth = OAuth;
    this.$interval = $interval;
    this.configs = configs;
    this.socket = undefined;

  }

  connect() {
    var deferred = this.$q.defer();

    if(this.socket && this.socket.connected)
      return true;

    var intervalCounter = 0;

    var interval = this.$interval(() => {
      intervalCounter++;

      this.socket = io.connect(this.configs.socketioUrl + this.configs.chatNamespace, { reconnection: false });

      //if successfully connection event
      this.socket.on('connect', () => {
        //notify
        console.log('socket::connected');

        //authentication
        this.socket.emit('authentication', { 
          credentials: this.OAuthToken.getToken()
        });

        //if successfully authentication event
        this.socket.on('authenticated', () => {
          //notify
          console.log('socket::authenticated');

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
          if(!this.socket.connected) {
            //notify
            console.log('socket::disconnected');

            this.$interval.cancel(interval);
            deferred.reject();
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