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
  
  OAuthTokenProvider.configure({
    name: 'orbAuth',
    options: {
      secure: false
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

  //routes
  $urlRouterProvider.otherwise("/sign");

  $stateProvider
  .state('orb', {
    url: "/orb",
    resolve: {
      Auth: Authenticated
    },
    templateUrl: "dist/views/orb.html",
    controller: "OrbController"
  })
  .state('sign', {
    url: "/sign",
    resolve: {
      Auth: skipIfAuthenticated
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

var Authenticated = function ($q, $state, OAuth) {
  var defer = $q.defer();

  if(OAuth.isAuthenticated()) {
    defer.resolve();

  } else {
    $timeout(function () {
      $state.go('sign');
    });
    
    defer.reject();
  }

  return defer.promise;
}

export default orbConfig;