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
      socket: socketInit,
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

var socketInit = function($rootScope, $q, chatSocketService) {
  var deferred = $q.defer();

  chatSocketService.connect().then(
    //success
    () => {
      deferred.resolve();
    },
    //error
    (err) => {
      deferred.reject(err);
    }
  );

  return deferred.promise;
}

export default orbConfig;