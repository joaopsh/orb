class chatSocketService {
  constructor($rootScope, $state, configs, OAuth, OAuthToken) {
    this.$rootScope = $rootScope;
    this.tryRefresh = true;
    this.socket = io.connect(configs.apiUrl + configs.chatNamespace);

    this.socket.on('connect', () => {
      
      this.socket.emit('authentication', { 
        auth: OAuthToken.getToken()
      });
      
      this.socket.on('authenticated', () => {
        console.log('socket::authenticated');
      });

      this.socket.on('unauthorized', (err) => {
        if(this.tryRefresh) {
          OAuth.getRefreshToken().then(() => {
            console.log('socket::refreshed');
            this.socket.emit('authentication', { auth: OAuthToken.getToken() });
          });

          tryRefresh = false;
        }
        
      });

    });

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