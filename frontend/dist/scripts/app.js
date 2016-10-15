/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _orb = __webpack_require__(2);

	var _orb2 = _interopRequireDefault(_orb);

	var _header = __webpack_require__(3);

	var _header2 = _interopRequireDefault(_header);

	var _orb3 = __webpack_require__(4);

	var _orb4 = _interopRequireDefault(_orb3);

	var _map = __webpack_require__(5);

	var _map2 = _interopRequireDefault(_map);

	var _sign = __webpack_require__(6);

	var _sign2 = _interopRequireDefault(_sign);

	var _sidenav = __webpack_require__(7);

	var _sidenav2 = _interopRequireDefault(_sidenav);

	var _orb5 = __webpack_require__(9);

	var _orb6 = _interopRequireDefault(_orb5);

	var _map3 = __webpack_require__(10);

	var _map4 = _interopRequireDefault(_map3);

	var _user = __webpack_require__(11);

	var _user2 = _interopRequireDefault(_user);

	var _chatSocket = __webpack_require__(12);

	var _chatSocket2 = _interopRequireDefault(_chatSocket);

	var _chatPanel = __webpack_require__(13);

	var _chatPanel2 = _interopRequireDefault(_chatPanel);

	var _chatBox = __webpack_require__(14);

	var _chatBox2 = _interopRequireDefault(_chatBox);

	var _contactListDirective = __webpack_require__(15);

	var _contactListDirective2 = _interopRequireDefault(_contactListDirective);

	var _chatPanelDirective = __webpack_require__(17);

	var _chatPanelDirective2 = _interopRequireDefault(_chatPanelDirective);

	var _chatBoxDirective = __webpack_require__(19);

	var _chatBoxDirective2 = _interopRequireDefault(_chatBoxDirective);

	var _searchDirective = __webpack_require__(21);

	var _searchDirective2 = _interopRequireDefault(_searchDirective);

	var _passwordCheckDirective = __webpack_require__(23);

	var _passwordCheckDirective2 = _interopRequireDefault(_passwordCheckDirective);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//orb module


	//controllers import
	var orb = angular.module('app.orb', ['ui.router', 'angular-oauth2', 'ngResource', 'ngMaterial', 'ngMessages', 'ngLetterAvatar', 'uiGmapgoogle-maps', 'ngAnimate', 'ngFileUpload']);

	//global consts


	//directives import


	//services import
	orb.constant('configs', {
	  apiUrl: 'http://localhost:1500',
	  socketioUrl: 'http://localhost:1200',
	  chatNamespace: '/chat',
	  mapNamespace: '/map'
	});

	//services register
	orb.service('orbService', _orb6.default);
	orb.service('mapService', _map4.default);
	orb.service('userService', _user2.default);
	orb.service('chatSocketService', _chatSocket2.default);
	orb.service('chatPanelService', _chatPanel2.default);
	orb.service('chatBoxService', _chatBox2.default);

	//controllers register
	orb.controller('HeaderController', _header2.default);
	orb.controller('OrbController', _orb4.default);
	orb.controller('MapController', _map2.default);
	orb.controller('SignController', _sign2.default);
	orb.controller('SidenavController', _sidenav2.default);

	//directives register
	orb.directive('orbContactList', function () {
	  return new _contactListDirective2.default();
	});
	orb.directive('orbChatPanel', function () {
	  return new _chatPanelDirective2.default();
	});
	orb.directive('orbChatBox', ["chatSocketService", function (chatSocketService) {
	  return new _chatBoxDirective2.default(chatSocketService);
	}]);
	orb.directive('orbSearch', function () {
	  return new _searchDirective2.default();
	});
	orb.directive('passwordCheck', function () {
	  return new _passwordCheckDirective2.default();
	});

	//initialization configs
	orb.run(['$rootScope', '$window', '$state', 'OAuth', function ($rootScope, $window, $state, OAuth) {
	  $rootScope.$on('oauth:error', function (event, rejection) {
	    if (rejection.headers('WWW-Authenticate') && rejection.headers('WWW-Authenticate').indexOf('invalid_grant') > -1) {
	      return;
	    }

	    if (rejection.headers('WWW-Authenticate') && rejection.headers('WWW-Authenticate').indexOf('invalid_token') > -1) {
	      return OAuth.getRefreshToken();
	    }

	    return $state.go('sign');
	  });
	}]);

	orb.config(_orb2.default);

	//app module
	var app = angular.module('app', ['app.orb']);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function orbConfig($locationProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider, OAuthProvider, OAuthTokenProvider, uiGmapGoogleMapApiProvider) {
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
	    key: 'AIzaSyBMaQ5VLbug_gC8le3UCV_R0blPsNhY0ds'
	  });

	  $urlRouterProvider.otherwise('/sign');

	  //routes
	  $stateProvider.state('default', {
	    url: "/",
	    resolve: {
	      auth: skipIfAuthenticated
	    },
	    templateUrl: "dist/views/sign.html",
	    controller: "SignController"
	  }).state('orb', {
	    url: "/orb",
	    resolve: {
	      auth: Authenticated,
	      init: initialization
	    },
	    templateUrl: "dist/views/orb.html",
	    controller: "OrbController"
	  }).state('sign', {
	    url: "/sign",
	    resolve: {
	      auth: skipIfAuthenticated
	    },
	    templateUrl: "dist/views/sign.html",
	    controller: "SignController"
	  }).state('about', {
	    url: "/about",
	    templateUrl: "dist/views/about.html"
	  });
	}

	//routes helper
	var skipIfAuthenticated = function skipIfAuthenticated($q, OAuth) {
	  var defer = $q.defer();

	  if (OAuth.isAuthenticated()) {
	    defer.reject();
	  } else {
	    defer.resolve();
	  }

	  return defer.promise;
	};

	var Authenticated = function Authenticated($rootScope, $q, $state, OAuth, OAuthToken, userService) {
	  var deferred = $q.defer();

	  if (OAuth.isAuthenticated()) {
	    if (!$rootScope.userInfo) {
	      userService.getByAccessToken(OAuthToken.getToken().access_token, function (user) {
	        $rootScope.userInfo = user;
	        deferred.resolve();
	      }, function (err) {
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
	};

	var initialization = function initialization($rootScope, $q, chatSocketService) {
	  var deferred = $q.defer();

	  chatSocketService.connect().then(
	  //success
	  function () {
	    locationWatcher($rootScope, $q, chatSocketService).then(
	    //success
	    function () {
	      deferred.resolve();
	    },
	    //error
	    function (err) {
	      deferred.reject(err);
	    });
	  },
	  //error
	  function (err) {
	    deferred.reject(err);
	  });

	  return deferred.promise;
	};

	var locationWatcher = function locationWatcher($rootScope, $q, chatSocketService) {
	  var deferred = $q.defer();

	  var lastLat = -999;
	  var lastLng = -999;
	  // 360 degrees multiplied by 100 meters (min. distance to update location)
	  // and divided by earth circunference (+- 40.075.000 meters (+- 40.075 km))
	  var minDistToUpdate = 360 * 100 / 40075000;

	  if (navigator.geolocation) {
	    if ($rootScope.watchPos) {
	      deferred.resolve();
	      return deferred.promise;
	    }

	    $rootScope.watchPos = navigator.geolocation.watchPosition(
	    //success
	    function (position) {
	      if (Math.abs(Math.abs(lastLat) - Math.abs(position.coords.latitude)) > minDistToUpdate || Math.abs(Math.abs(lastLng) - Math.abs(position.coords.longitude)) > minDistToUpdate || lastLat === -999) {

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
	    function (err) {
	      deferred.reject(err);
	    },
	    //options
	    {
	      enableHighAccuracy: true,
	      maximumAge: 0
	    });
	  } else {
	    deferred.reject();
	  }

	  return deferred.promise;
	};

	exports.default = orbConfig;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HeaderController = function () {
		function HeaderController($scope, $rootScope, $mdSidenav, $state, OAuth, OAuthToken, chatSocketService) {
			_classCallCheck(this, HeaderController);

			this.$state = $state;
			this.$rootScope = $rootScope;
			this.OAuth = OAuth;
			this.chatSocketService = chatSocketService;
			this.OAuthToken = OAuthToken;

			$rootScope.toggleSidenav = function (componentId) {
				$mdSidenav(componentId).toggle();
			};
		}

		_createClass(HeaderController, [{
			key: 'isState',
			value: function isState(name) {
				return this.$state.is(name);
			}
		}, {
			key: 'isAuthenticated',
			value: function isAuthenticated() {
				return this.OAuth.isAuthenticated();
			}
		}, {
			key: 'logout',
			value: function logout() {
				var _this = this;

				this.OAuth.revokeToken().then(function () {
					navigator.geolocation.clearWatch(_this.$rootScope.watchPos);
					_this.$rootScope.watchPos = undefined;
					_this.chatSocketService.disconnect();
					_this.$state.go('sign');
				});
			}
		}]);

		return HeaderController;
	}();

	exports.default = HeaderController;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OrbController = function OrbController() {
		_classCallCheck(this, OrbController);
	};

	exports.default = OrbController;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MapController = function MapController($scope, $timeout, $rootScope, uiGmapGoogleMapApi, mapService, chatSocketService) {
	  var _this = this;

	  _classCallCheck(this, MapController);

	  this.config = mapService.getDefaultConfig();

	  //on leaving the page It clears the socket listenners for not replicate the calls when the page is accessed again
	  $scope.$on('$destroy', function (event) {
	    chatSocketService.socket.removeAllListeners();
	  });

	  chatSocketService.on('chat:online:list', function (users) {
	    _this.markers = [];

	    angular.forEach(users, function (user) {
	      if ($rootScope.userInfo.email === user.email) _this.config.center = user.coords;

	      var foundMarker = _this.markers.find(function (elem) {
	        return elem.email === user.email;
	      });

	      if (foundMarker) foundMarker.coords = user.coords;else {
	        _this.markers.push(user);
	      }
	    });

	    // After recept all online users, this event handle all new users or position change
	    chatSocketService.on('chat:position:update', function (data) {
	      if ($rootScope.userInfo.email === data.email) _this.config.center = data.coords;

	      var foundMarker = _this.markers.find(function (elem) {
	        return elem.email === data.email;
	      });

	      if (foundMarker) foundMarker.coords = data.coords;else {
	        _this.markers.push(data);
	      }
	    });

	    // Removes the user that left the chat
	    chatSocketService.on('chat:signout', function (outUser) {
	      _this.markers = _this.markers.filter(function (user) {
	        return user.email !== outUser.email;
	      });
	    });
	  });

	  // Tells the server to send me the chat online users list (event catched above)
	  chatSocketService.emit('chat:online:list', {});
	};

	exports.default = MapController;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SignController = function () {
		function SignController($mdToast, $resource, $cookies, $state, configs, userService, OAuth) {
			_classCallCheck(this, SignController);

			this.$cookies = $cookies;
			this.$mdToast = $mdToast;
			this.$state = $state;
			this.OAuth = OAuth;
			this.Client = $resource(configs.apiUrl + '/client/:id');
			this.userService = userService;
		}

		_createClass(SignController, [{
			key: 'signinSubmit',
			value: function signinSubmit() {
				var _this = this;

				this.OAuth.getAccessToken({
					username: this.signin.email,
					password: this.signin.password
				}).then(function () {
					_this.$state.go('orb');
				}, function (err) {
					_this.form.signin.email.$setValidity("emailPassInvalid", false);
					_this.form.signin.password.$setValidity("emailPassInvalid", false);
				});
			}
		}, {
			key: 'signupSubmit',
			value: function signupSubmit() {
				var _this2 = this;

				this.userService.add({
					firstName: this.signup.firstName,
					lastName: this.signup.lastName,
					email: this.signup.email,
					password: this.signup.password
				}, function (succ) {
					_this2.OAuth.getAccessToken({
						username: _this2.signup.email,
						password: _this2.signup.password
					}).then(function (succ) {
						_this2.$state.go('orb');

						_this2.$mdToast.show(_this2.$mdToast.simple().textContent('Welcome to Orb, your account was successfully created! Enjoy yourself!').hideDelay(5000).position('top left'));
					});
				}, function (errs) {
					angular.forEach(errs.data, function (err) {
						if (err.param === 'user.firstName') _this2.form.signup.firstName.$setValidity('required', false);

						if (err.param === 'user.lastName') _this2.form.signup.firstName.$setValidity('required', false);

						if (err.param === 'user.email') _this2.form.signup.firstName.$setValidity('required', false);

						if (err.param === 'user.password') _this2.form.signup.firstName.$setValidity('required', false);
					});
				});
			}
		}, {
			key: 'setValidationErrors',
			value: function setValidationErrors(errors) {
				angular.forEach(errors, function (error) {});
			}
		}]);

		return SignController;
	}();

	exports.default = SignController;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _accountSettings = __webpack_require__(8);

	var _accountSettings2 = _interopRequireDefault(_accountSettings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SidenavController = function () {
		function SidenavController($mdDialog) {
			_classCallCheck(this, SidenavController);

			this.$mdDialog = $mdDialog;
		}

		_createClass(SidenavController, [{
			key: 'showAccountSettingsDialog',
			value: function showAccountSettingsDialog() {

				this.$mdDialog.show({
					controller: _accountSettings2.default,
					controllerAs: 'accountSettings',
					templateUrl: '/dist/views/dialogs/account-settings.template.html',
					parent: angular.element(document.body),
					clickOutsideToClose: true,
					openFrom: '.info',
					closeTo: '.info'

				}).then(function (answer) {}, function () {});
			}
		}]);

		return SidenavController;
	}();

	exports.default = SidenavController;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AccountSettingsController = function () {
		function AccountSettingsController($mdDialog) {
			_classCallCheck(this, AccountSettingsController);

			this.$mdDialog = $mdDialog;
		}

		_createClass(AccountSettingsController, [{
			key: "imageUpload",
			value: function imageUpload(file, errFile) {
				this.file = file;
			}
		}, {
			key: "cancel",
			value: function cancel() {
				this.$mdDialog.cancel();
			}
		}]);

		return AccountSettingsController;
	}();

	exports.default = AccountSettingsController;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var orbService = function orbService() {
		_classCallCheck(this, orbService);
	};

	exports.default = orbService;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var mapService = function () {
		function mapService($q) {
			_classCallCheck(this, mapService);

			this.$q = $q;
		}

		_createClass(mapService, [{
			key: "getDefaultConfig",
			value: function getDefaultConfig() {
				return {
					center: {
						latitude: -22.3416412,
						longitude: -43.102957
					},
					zoom: 16,
					options: {
						mapTypeControl: false,
						streetViewControl: false,
						zoomControl: false,
						styles: [{ "featureType": "road", "stylers": [{ "hue": "#5e00ff" }, { "saturation": -79 }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }, { "saturation": -78 }, { "hue": "#6600ff" }, { "lightness": -47 }, { "visibility": "off" }] }, { "featureType": "road.local", "stylers": [{ "lightness": 22 }] }, { "featureType": "landscape", "stylers": [{ "hue": "#6600ff" }, { "saturation": -11 }] }, {}, {}, { "featureType": "water", "stylers": [{ "saturation": -65 }, { "hue": "#1900ff" }, { "lightness": 8 }] }, { "featureType": "road.local", "stylers": [{ "weight": 1.3 }, { "lightness": 30 }] }, { "featureType": "transit", "stylers": [{ "visibility": "off" }, { "hue": "#5e00ff" }, { "saturation": -16 }] }, { "featureType": "transit.line", "stylers": [{ "saturation": -72 }] }, {}]
					}
				};
			}
		}]);

		return mapService;
	}();

	exports.default = mapService;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var userService = function () {
		function userService($http, $resource, configs) {
			_classCallCheck(this, userService);

			this.Resource = $resource(configs.apiUrl + '/user/:id', {}, {
				getByAccessToken: {
					method: 'GET',
					url: configs.apiUrl + '/user/accesstoken/:accessToken',
					params: {
						accessToken: '@accessToken'
					}
				}
			});
		}

		_createClass(userService, [{
			key: 'add',
			value: function add(user, successCb, errorCb) {
				this.Resource.save({ user: user }, function (successResponse) {
					if (successCb) successCb(successResponse);
				}, function (errorResponse) {
					if (errorCb) errorCb(errorResponse);
				});
			}
		}, {
			key: 'getByAccessToken',
			value: function getByAccessToken(accessToken, successCb, errorCb) {
				this.Resource.getByAccessToken({ accessToken: accessToken }, function (successResponse) {
					if (successCb) successCb(successResponse.user);
				}, function (errorResponse) {
					if (errorCb) errorCb(errorResponse);
				});
			}
		}]);

		return userService;
	}();

	exports.default = userService;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var chatSocketService = function () {
	  function chatSocketService($rootScope, $q, $interval, configs, OAuth, OAuthToken) {
	    _classCallCheck(this, chatSocketService);

	    this.$rootScope = $rootScope;
	    this.$q = $q;
	    this.OAuthToken = OAuthToken;
	    this.OAuth = OAuth;
	    this.$interval = $interval;
	    this.configs = configs;
	    this.socket = undefined;
	  }

	  _createClass(chatSocketService, [{
	    key: 'connect',
	    value: function connect() {
	      var _this = this;

	      var deferred = this.$q.defer();

	      if (this.socket && this.socket.connected) {
	        deferred.resolve();
	        return deferred.promise;
	      }

	      var intervalCounter = 0;

	      var interval = this.$interval(function () {
	        intervalCounter++;

	        _this.socket = io.connect(_this.configs.socketioUrl + _this.configs.chatNamespace, { reconnection: false, 'forceNew': true });

	        //if successfully connection event
	        _this.socket.on('connect', function () {
	          //notify
	          console.log('socket::connected');

	          //Init the signout flag
	          _this.isSignout = false;

	          //authentication
	          _this.socket.emit('authentication', {
	            credentials: _this.OAuthToken.getToken()
	          });

	          //if successfully authentication event
	          _this.socket.on('authenticated', function () {
	            //notify
	            console.log('socket::authenticated');
	          });

	          //After all server events are registered and the chat is ready to use.
	          _this.socket.on('chat:ready', function () {
	            //notify
	            console.log('chat::ready');

	            _this.$interval.cancel(interval);
	            deferred.resolve();
	          });

	          //if failed authentication event
	          _this.socket.on('unauthorized', function (err) {
	            //notify
	            console.log('socket::unauthorized');

	            if (err.message === 'Expired access token.') {
	              _this.OAuth.getRefreshToken();
	            } else {
	              _this.$interval.cancel(interval);
	              deferred.reject(err);
	            }
	          });

	          _this.socket.on('disconnect', function () {
	            if (!_this.socket.connected && !_this.isSignout) {
	              //notify
	              console.log('socket::disconnected');

	              _this.connect();
	            } else if (_this.isSignout) {
	              console.log('socket::disconnected(signout)');
	            }
	          });
	        });

	        if (intervalCounter === 5) {
	          _this.$interval.cancel(interval);
	          deferred.reject();
	        }
	      }, 2000);

	      return deferred.promise;
	    }
	  }, {
	    key: 'disconnect',
	    value: function disconnect() {
	      this.isSignout = true;
	      this.socket.disconnect();
	    }
	  }, {
	    key: 'on',
	    value: function on(eventName, callback) {
	      var self = this;

	      this.socket.on(eventName, function () {
	        var args = arguments;
	        self.$rootScope.$apply(function () {
	          callback.apply(self.socket, args);
	        });
	      });
	    }
	  }, {
	    key: 'emit',
	    value: function emit(eventName, data, callback) {
	      var self = this;

	      this.socket.emit(eventName, data, function () {
	        var args = arguments;
	        self.$rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(self.socket, args);
	          }
	        });
	      });
	    }
	  }]);

	  return chatSocketService;
	}();

	exports.default = chatSocketService;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var chatPanelService = function chatPanelService() {
		_classCallCheck(this, chatPanelService);
	};

	exports.default = chatPanelService;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var chatBoxService = function chatBoxService() {
		_classCallCheck(this, chatBoxService);
	};

	exports.default = chatBoxService;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _contactList = __webpack_require__(16);

	var _contactList2 = _interopRequireDefault(_contactList);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var orbContactList = function orbContactList() {
		_classCallCheck(this, orbContactList);

		this.scope = {};
		this.restrict = 'E';
		this.templateUrl = '/dist/views/templates/contact-list/contact-list.template.html';
		this.controller = function () {
			return new _contactList2.default();
		};
		this.controllerAs = 'contactList';
		this.link = function (scope, elem, attr) {};
	};

	exports.default = orbContactList;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ContactListController = function ContactListController() {
		_classCallCheck(this, ContactListController);

		this.contacts = [{
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'João Pedro',
			lastMessage: {
				date: '2016-09-07',
				message: 'Boa noite, durma bem! :)'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Maria Silva',
			lastMessage: {
				date: '2016-09-07',
				message: 'Tudo bem, até...'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Pedro Henrique',
			lastMessage: {
				date: '2016-09-07',
				message: 'Vlw, abraço!'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'João Pedro',
			lastMessage: {
				date: '2016-09-07',
				message: 'Boa noite, durma bem! :)'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Maria Silva',
			lastMessage: {
				date: '2016-09-07',
				message: 'Tudo bem, até...'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Pedro Henrique',
			lastMessage: {
				date: '2016-09-07',
				message: 'Vlw, abraço!'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'João Pedro',
			lastMessage: {
				date: '2016-09-07',
				message: 'Boa noite, durma bem! :)'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Maria Silva',
			lastMessage: {
				date: '2016-09-07',
				message: 'Tudo bem, até...'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Pedro Henrique',
			lastMessage: {
				date: '2016-09-07',
				message: 'Vlw, abraço!'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'João Pedro',
			lastMessage: {
				date: '2016-09-07',
				message: 'Boa noite, durma bem! :)'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Maria Silva',
			lastMessage: {
				date: '2016-09-07',
				message: 'Tudo bem, até...'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Pedro Henrique',
			lastMessage: {
				date: '2016-09-07',
				message: 'Vlw, abraço!'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'João Pedro',
			lastMessage: {
				date: '2016-09-07',
				message: 'Boa noite, durma bem! :)'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Maria Silva',
			lastMessage: {
				date: '2016-09-07',
				message: 'Tudo bem, até...'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Pedro Henrique',
			lastMessage: {
				date: '2016-09-07',
				message: 'Vlw, abraço!'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'João Pedro',
			lastMessage: {
				date: '2016-09-07',
				message: 'Boa noite, durma bem! :)'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Maria Silva',
			lastMessage: {
				date: '2016-09-07',
				message: 'Tudo bem, até...'
			}

		}, {
			avatar: 'http://cdn-9chat-fun.9cache.com/static/dist/web2/images/avatar-default.png',
			name: 'Pedro Henrique',
			lastMessage: {
				date: '2016-09-07',
				message: 'Vlw, abraço!'
			}

		}];
	};

	exports.default = ContactListController;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _chatPanel = __webpack_require__(18);

	var _chatPanel2 = _interopRequireDefault(_chatPanel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var orbChatPanel = function orbChatPanel() {
		_classCallCheck(this, orbChatPanel);

		this.scope = {};
		this.restrict = 'E';
		this.templateUrl = '/dist/views/templates/chat-panel/chat-panel.template.html';
		this.controller = function () {
			return new _chatPanel2.default();
		};
		this.controllerAs = 'chatPanel';
		this.link = function (scope, elem, attr) {
			scope.minimizeToggle = true;

			//minimize and maxmize the panel bar on clicking the chat box header
			scope.minimize = function () {
				if (scope.minimizeToggle) {
					elem.find('.chat-panel').addClass('minimized');
					scope.minimizeToggle = !scope.minimizeToggle;
				} else {
					elem.find('.chat-panel').removeClass('minimized');
					scope.minimizeToggle = !scope.minimizeToggle;
				}
			};

			scope.chats = [{
				roomId: 'a1as5as4a5',
				user: {
					firstName: 'Maria',
					lastName: 'Silva',
					email: 'msilva@live.com'
				}
			}, {
				roomId: 'defe8f7ef',
				user: {
					firstName: 'Romarilda',
					lastName: 'Zenato',
					email: 'romailda@live.com'
				}
			}];
		};
	};

	exports.default = orbChatPanel;

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChatPanelController = function ChatPanelController() {
		_classCallCheck(this, ChatPanelController);
	};

	exports.default = ChatPanelController;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _chatBox = __webpack_require__(20);

	var _chatBox2 = _interopRequireDefault(_chatBox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var orbChatBox = function orbChatBox(chatSocketService) {
		_classCallCheck(this, orbChatBox);

		this.scope = {
			panelMinimize: '&',
			roomUid: '@',
			user: '='
		};
		this.restrict = 'E';
		this.templateUrl = '/dist/views/templates/chat-box/chat-box.template.html';
		this.controller = _chatBox2.default;
		this.controllerAs = 'chatBox';
		this.link = function (scope, elem, attr) {

			scope.close = function (event) {
				event.stopPropagation();
			};

			scope.favorite = function (event) {
				event.stopPropagation();
			};

			scope.send = function () {
				var date = new Date();
				var hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
				var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();

				elem.find('.messages-box').prepend('<div class="me"><strong>' + hours + ':' + minutes + ': </strong>' + scope.message + '</div>');
				chatSocketService.emit('chat:message:send', {
					roomUid: scope.roomUid,
					text: scope.message
				});
				scope.message = '';
				elem[0].querySelector('#message-input').focus();
			};
		};
	};

	exports.default = orbChatBox;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChatBoxController = function ChatBoxController() {
		_classCallCheck(this, ChatBoxController);
	};

	exports.default = ChatBoxController;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _search = __webpack_require__(22);

	var _search2 = _interopRequireDefault(_search);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var orbSearch = function orbSearch() {
		_classCallCheck(this, orbSearch);

		this.scope = {};
		this.restrict = 'E';
		this.templateUrl = '/dist/views/templates/search/search.template.html';
		this.controller = function () {
			return new _search2.default();
		};
		this.controllerAs = 'search';
		this.link = function (scope, elem, attr) {};
	};

	exports.default = orbSearch;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SearchController = function SearchController($timeout, $q) {
		_classCallCheck(this, SearchController);

		this.$timeout = $timeout;
		this.$q = $q;

		var self = this;

		self.simulateQuery = false;
		self.isDisabled = false;

		this.loadAll = function () {
			var repos = [{
				'name': 'Angular 1',
				'url': 'https://github.com/angular/angular.js',
				'watchers': '3,623',
				'forks': '16,175'
			}, {
				'name': 'Angular 2',
				'url': 'https://github.com/angular/angular',
				'watchers': '469',
				'forks': '760'
			}, {
				'name': 'Angular Material',
				'url': 'https://github.com/angular/material',
				'watchers': '727',
				'forks': '1,241'
			}, {
				'name': 'Bower Material',
				'url': 'https://github.com/angular/bower-material',
				'watchers': '42',
				'forks': '84'
			}, {
				'name': 'Material Start',
				'url': 'https://github.com/angular/material-start',
				'watchers': '81',
				'forks': '303'
			}];
			return repos.map(function (repo) {
				repo.value = repo.name.toLowerCase();
				return repo;
			});
		};

		this.searchTextChange = function (text) {
			//$log.info('Text changed to ' + text);
		};

		this.selectedItemChange = function (item) {
			//$log.info('Item changed to ' + JSON.stringify(item));
		};

		this.createFilterFor = function (query) {
			var lowercaseQuery = angular.lowercase(query);

			return function filterFn(item) {
				return item.value.indexOf(lowercaseQuery) === 0;
			};
		};

		this.querySearch = function (query) {
			var results = query ? self.repos.filter(this.createFilterFor(query)) : self.repos,
			    deferred;
			if (self.simulateQuery) {
				deferred = $q.defer();
				this.$timeout(function () {
					deferred.resolve(results);
				}, Math.random() * 1000, false);
				return deferred.promise;
			} else {
				return results;
			}
		};

		self.repos = this.loadAll();
		self.querySearch = this.querySearch;
		self.selectedItemChange = this.selectedItemChange;
		self.searchTextChange = this.searchTextChange;
	};

	exports.default = SearchController;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var passwordCheck = function passwordCheck() {
	  _classCallCheck(this, passwordCheck);

	  this.require = 'ngModel';
	  this.link = function (scope, elem, attrs, ctrl) {
	    var firstPassword = '#' + attrs.passwordCheck;
	    elem.add(firstPassword).on('keyup', function () {
	      scope.$apply(function () {
	        var v = elem.val() === $(firstPassword).val();
	        ctrl.$setValidity('passwordMatch', v);
	      });
	    });
	  };
	};

	exports.default = passwordCheck;

/***/ }
/******/ ]);