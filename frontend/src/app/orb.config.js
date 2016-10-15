function orbConfig(
  $locationProvider
, $stateProvider
, $urlRouterProvider
, $mdThemingProvider
, $httpProvider
, OAuthProvider
, OAuthTokenProvider
, uiGmapGoogleMapApiProvider) {
  //$locationProvider.html5Mode(true);
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 365);

  OAuthTokenProvider.configure({
    name: 'orbAuth',
    options: {
      secure: false,
      expires: expireDate
    }
  });

  OAuthProvider.configure({
      baseUrl: 'http://localhost:1500',
      clientId: 'T7jyYE1VWfIOus0X',
      clientSecret: '3i4go2tlBbyMnoRW9NUoVaTlPg7GrfsX',
      grantPath: '/oauth/token',
      revokePath: '/oauth/revoke'
  });

	uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBMaQ5VLbug_gC8le3UCV_R0blPsNhY0ds',
    });

  $urlRouterProvider.otherwise('/sign');

  //routes
  $stateProvider
  .state('default', {
    url: "/",
    resolve: {
      auth: skipIfAuthenticated,
    },
    templateUrl: "dist/views/sign.html",
    controller: "SignController"
  })
  .state('orb', {
    url: "/orb",
    resolve: {
      auth: Authenticated,
      init: initialization,
    },
    templateUrl: "dist/views/orb.html",
    controller: "OrbController"
  })
  .state('sign', {
    url: "/sign",
    resolve: {
      auth: skipIfAuthenticated
    },
    templateUrl: "dist/views/sign.html",
    controller: "SignController"
  })
  .state('about', {
    url: "/about",
    templateUrl: "dist/views/about.html",
  });
}

//routes helper
var skipIfAuthenticated = function ($q, OAuth) {
  var defer = $q.defer();

  if(OAuth.isAuthenticated()) {
    defer.reject();

  } else {
    defer.resolve();

  }

  return defer.promise;
}

var Authenticated = function ($rootScope, $q, $state, OAuth, OAuthToken, userService) {
  var deferred = $q.defer();

  if(OAuth.isAuthenticated()) {
    if(!$rootScope.userInfo) {
      userService.getByAccessToken(OAuthToken.getToken().access_token, (user) => {
        $rootScope.userInfo = user;
        deferred.resolve();

      }, (err) => {
        deferred.reject(err);
      });
    } else {
      deferred.resolve();
    }

  } else {
    $timeout(function () {
      $state.go('sign');
    });
    
    deferred.reject();
  }

  return deferred.promise;
}

var initialization = function($rootScope, $q, chatSocketService) {
  var deferred = $q.defer();

  chatSocketService.connect().then(
    //success
    () => {
      locationWatcher($rootScope, $q, chatSocketService).then(
        //success
        () => {
          deferred.resolve();
        },
        //error
        (err) => {
          deferred.reject(err);
        }
      );
    },
    //error
    (err) => {
      deferred.reject(err);
    }
  );

  return deferred.promise;
}

var locationWatcher = function($rootScope, $q, chatSocketService) {
  var deferred = $q.defer();

  var lastLat = -999;
  var lastLng = -999;
  // 360 degrees multiplied by 100 meters (min. distance to update location)
  // and divided by earth circunference (+- 40.075.000 meters (+- 40.075 km))
  const minDistToUpdate = 360 * 100 / 40075000;
   
  if (navigator.geolocation) {
    if($rootScope.watchPos) {
      deferred.resolve();
      return deferred.promise;
    }

    $rootScope.watchPos = navigator.geolocation.watchPosition(
      //success
      (position) => {
        if(Math.abs(Math.abs(lastLat) - Math.abs(position.coords.latitude)) > minDistToUpdate
          || Math.abs(Math.abs(lastLng) - Math.abs(position.coords.longitude)) > minDistToUpdate
          || lastLat === -999) {

            lastLat = position.coords.latitude;
            lastLng = position.coords.longitude;

            chatSocketService.emit('chat:position:update', {
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
    deferred.reject();
  }

  return deferred.promise;
}

export default orbConfig;