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
	orb.directive('orbChatBox', ["$rootScope", "chatSocketService", function ($rootScope, chatSocketService) {
	  return new _chatBoxDirective2.default($rootScope, chatSocketService);
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
	      socket: socketInit
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

	var socketInit = function socketInit($rootScope, $q, chatSocketService) {
	  var deferred = $q.defer();

	  chatSocketService.connect().then(
	  //success
	  function () {
	    deferred.resolve();
	  },
	  //error
	  function (err) {
	    deferred.reject(err);
	  });

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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MapController = function () {
	  function MapController($scope, $timeout, $rootScope, uiGmapGoogleMapApi, mapService, chatSocketService) {
	    var _this = this;

	    _classCallCheck(this, MapController);

	    this.config = mapService.getDefaultConfig();
	    this.chatSocketService = chatSocketService;
	    this.$rootScope = $rootScope;
	    this.$scope = $scope;

	    //on leaving the page It clears the socket listenners for not replicate the calls when the page is accessed again
	    $scope.$on('$destroy', function (event) {
	      chatSocketService.disconnect();
	    });

	    $rootScope.$on('mapController:reconnect', function (event) {
	      _this.initEventsHandler();
	    });

	    this.initEventsHandler();
	  }

	  _createClass(MapController, [{
	    key: 'initEventsHandler',
	    value: function initEventsHandler() {
	      var _this2 = this;

	      if (!this.chatSocketService.socket.hasListeners('chat:online:list')) {
	        this.chatSocketService.socket.once('chat:online:list', function (usersMarkers) {
	          _this2.chatOnlineListEventHandler(usersMarkers);

	          // After recepted all online users, this event handle all new users or position change
	          if (!_this2.chatSocketService.socket.hasListeners('chat:position:update')) {
	            _this2.chatSocketService.on('chat:position:update', function (userMarker) {
	              _this2.chatPositionUpdateEventHandler(userMarker);
	            });
	          }

	          // Removes the user that left the chat
	          if (!_this2.chatSocketService.socket.hasListeners('chat:signout')) {
	            _this2.chatSocketService.on('chat:signout', function (outUserMarker) {
	              _this2.chatSignoutEventHandler(outUserMarker);
	            });
	          }

	          //Receives all user's messages
	          if (!_this2.chatSocketService.socket.hasListeners('chat:room')) {
	            _this2.chatSocketService.on('chat:room', function (newMessage) {
	              _this2.$rootScope.$broadcast('panelController:newMessage', newMessage);
	            });
	          }
	        });

	        // Tells the server to send me the chat online users list (event catched above)
	        this.chatSocketService.emit('chat:online:list', {});
	      }
	    }

	    //Event handlers

	  }, {
	    key: 'chatSignoutEventHandler',
	    value: function chatSignoutEventHandler(outUserMarker) {
	      var toRemove = this.markers.find(function (userMarker) {
	        return userMarker.id === outUserMarker.id;
	      });

	      this.markers.splice(this.markers.indexOf(toRemove), 1);
	    }
	  }, {
	    key: 'chatPositionUpdateEventHandler',
	    value: function chatPositionUpdateEventHandler(userMarker) {
	      if (this.$rootScope.userInfo.email === userMarker.email) {
	        this.config.center = userMarker.coords;
	        userMarker.icon = {
	          url: '/dist/images/pinme.png'
	        };
	      } else {
	        userMarker.icon = {
	          url: '/dist/images/pin.png'
	        };
	      }

	      var foundMarker = this.markers.find(function (elem) {
	        return elem.email === userMarker.email;
	      });

	      if (foundMarker) foundMarker.coords = userMarker.coords;else {
	        userMarker.events = {
	          click: this.newChatEventHandler.bind(this, {
	            id: userMarker.id,
	            email: userMarker.email,
	            firstName: userMarker.firstName,
	            lastName: userMarker.lastName
	          })
	        };

	        this.markers.push(userMarker);
	      }
	    }
	  }, {
	    key: 'chatOnlineListEventHandler',
	    value: function chatOnlineListEventHandler(usersMarkers) {
	      var _this3 = this;

	      this.markers = [];

	      angular.forEach(usersMarkers, function (userMarker) {
	        if (_this3.$rootScope.userInfo.email === userMarker.email) {
	          _this3.config.center = userMarker.coords;
	          userMarker.icon = {
	            url: '/dist/images/pinme.png'
	          };
	        } else {
	          userMarker.icon = {
	            url: '/dist/images/pin.png'
	          };
	        }

	        var foundMarker = _this3.markers.find(function (elem) {
	          return elem.email === userMarker.email;
	        });

	        if (foundMarker) foundMarker.coords = userMarker.coords;else {
	          userMarker.events = {
	            click: _this3.newChatEventHandler.bind(_this3, {
	              id: userMarker.id,
	              email: userMarker.email,
	              firstName: userMarker.firstName,
	              lastName: userMarker.lastName
	            })
	          };

	          _this3.markers.push(userMarker);
	        }
	      });
	    }
	  }, {
	    key: 'newChatEventHandler',
	    value: function newChatEventHandler(user) {
	      this.$rootScope.$broadcast('panelController:newChat', [user]);
	    }
	  }]);

	  return MapController;
	}();

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
						latitude: -22.1111,
						longitude: -50.1111
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
	  function chatSocketService($state, $rootScope, $q, $interval, $timeout, configs, OAuth, OAuthToken) {
	    _classCallCheck(this, chatSocketService);

	    this.$rootScope = $rootScope;
	    this.$state = $state;
	    this.$q = $q;
	    this.OAuthToken = OAuthToken;
	    this.OAuth = OAuth;
	    this.$interval = $interval;
	    this.configs = configs;
	    this.socket = undefined;
	    this.$timeout = $timeout;
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

	        _this.socket = io.connect(_this.configs.socketioUrl + _this.configs.chatNamespace, { reconnection: false });

	        //if successfully connection event
	        _this.socket.once('connect', function () {
	          //notify
	          console.log('socket::connected');

	          //Init the signout flag
	          _this.isSignout = false;

	          //authentication
	          _this.socket.emit('authentication', {
	            credentials: _this.OAuthToken.getToken()
	          });

	          //if successfully authentication event
	          _this.socket.once('authenticated', function () {
	            //notify
	            console.log('socket::authenticated');
	          });

	          //After all server events are registered and the user location has been sent to server, the chat is ready to use.
	          _this.socket.once('chat:ready', function () {
	            _this.positionWatcher().then(function (succ) {
	              _this.$interval.cancel(interval);

	              if (_this.$state.is('orb')) {
	                _this.$rootScope.$broadcast('mapController:reconnect');
	              }

	              deferred.resolve();

	              //notify
	              console.log('chat::ready');
	            }, function (err) {
	              deferred.reject(err);
	            });
	          });

	          //if failed authentication event
	          _this.socket.once('unauthorized', function (err) {
	            //notify
	            console.log('socket::unauthorized');

	            if (err.message === 'Expired access token.') {
	              _this.OAuth.getRefreshToken();
	            } else {
	              _this.$interval.cancel(interval);
	              deferred.reject(err);
	            }
	          });

	          _this.socket.once('disconnect', function () {
	            //clears the location watch because It'll need to instantly update the location when reconnected
	            navigator.geolocation.clearWatch(_this.$rootScope.watchPos);
	            _this.$rootScope.watchPos = undefined;

	            if (!_this.isSignout) {
	              _this.connect();
	            }

	            //notify
	            console.log('socket::disconnected');
	          });
	        });

	        if (intervalCounter === 5) {
	          _this.$interval.cancel(interval);
	          deferred.reject();
	        }
	      }, 3000);

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
	  }, {
	    key: 'positionWatcher',
	    value: function positionWatcher() {
	      var _this2 = this;

	      var deferred = this.$q.defer();

	      var lastLat = -999;
	      var lastLng = -999;
	      // 360 degrees multiplied by 100 meters (min. distance to update location)
	      // and divided by earth circunference (+- 40.075.000 meters (+- 40.075 km))
	      var minDistToUpdate = 360 * 100 / 40075000;

	      if (navigator.geolocation) {
	        if (this.$rootScope.watchPos) {
	          deferred.resolve();
	          return deferred.promise;
	        }

	        this.$rootScope.watchPos = navigator.geolocation.watchPosition(
	        //success
	        function (position) {
	          if (Math.abs(Math.abs(lastLat) - Math.abs(position.coords.latitude)) > minDistToUpdate || Math.abs(Math.abs(lastLng) - Math.abs(position.coords.longitude)) > minDistToUpdate || lastLat === -999) {

	            lastLat = position.coords.latitude;
	            lastLng = position.coords.longitude;

	            _this2.emit('chat:position:update', {
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
	        deferred.reject('Unable to use browser location.');
	      }

	      return deferred.promise;
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
		this.controller = function ($rootScope, $scope, chatSocketService) {
			return new _chatPanel2.default($rootScope, $scope, chatSocketService);
		};
		this.controllerAs = 'chatPanel';
		this.link = function (scope, elem, attr, chatPanel) {
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
		};
	};

	exports.default = orbChatPanel;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChatPanelController = function () {
		function ChatPanelController($rootScope, $scope, chatSocketService) {
			var _this = this;

			_classCallCheck(this, ChatPanelController);

			this.chats = [];
			this.$rootScope = $rootScope;
			this.chatSocketService = chatSocketService;
			this.$scope = $scope;

			$rootScope.$on('panelController:newChat', function (event, users) {
				_this.newChat(users);
			});

			// Called from MapController when a new message arrives
			$rootScope.$on('panelController:newMessage', function (event, newMessage) {
				_this.newMessage(newMessage);
			});
		}

		_createClass(ChatPanelController, [{
			key: 'newChat',
			value: function newChat(users) {
				var _this2 = this;

				//Verify if already exists a chat with the same users
				var foundChat = this.chats.some(function (chat) {
					return chat.members.every(function (member, index, array) {
						return users.some(function (user) {
							return (member.id === user.id || member.id === _this2.$rootScope.userInfo.id) && chat.members.length === users.length + 1;
						});
					});
				});

				var foundOwnUser = users.find(function (user) {
					return user.id === _this2.$rootScope.userInfo.id;
				});

				if (!foundChat && !foundOwnUser) {
					// Receive the new chat room identificator and opens the new chat window
					this.chatSocketService.socket.once('chat:new', function (newChat) {
						angular.forEach(newChat.messages, function (message) {
							message.time = _this2.getTime(message.timestamp);
						});

						_this2.$scope.$apply(function () {
							_this2.chats.push(newChat);
						});
					});

					this.chatSocketService.emit('chat:new', users);
				}
			}
		}, {
			key: 'newMessage',
			value: function newMessage(_newMessage) {
				var _this3 = this;

				var foundChat = this.chats.find(function (chat) {
					return chat.id === _newMessage.chat.id;
				});

				if (foundChat) {
					foundChat.messages.push({
						from: _newMessage.message.from,
						text: _newMessage.message.text,
						timestamp: _newMessage.message.timestamp,
						time: this.getTime(_newMessage.message.timestamp)
					});
				} else {
					angular.forEach(_newMessage.chat.messages, function (message) {
						message.time = _this3.getTime(message.timestamp);
					});

					this.chats.push(_newMessage.chat);
				}
			}
		}, {
			key: 'getTime',
			value: function getTime(timestamp) {
				//The time-zone offset is the difference, in minutes, between UTC and local time. The timesptamp object property is in milliseconds.
				var date = new Date(timestamp - new Date().getTimezoneOffset() * 60 * 1000);
				var hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
				var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();

				return hours + ':' + minutes;
			}
		}]);

		return ChatPanelController;
	}();

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

	var orbChatBox = function orbChatBox($rootScope, chatSocketService) {
		_classCallCheck(this, orbChatBox);

		this.scope = {
			panelMinimize: '&',
			chat: '=',
			chats: '='
		};
		this.restrict = 'E';
		this.templateUrl = '/dist/views/templates/chat-box/chat-box.template.html';
		this.controller = function () {
			return new _chatBox2.default();
		};
		this.controllerAs = 'chatBox';
		this.link = function (scope, elem, attr) {
			scope.roomMemberNames = '';

			angular.forEach(scope.chat.members, function (member, key) {
				if (member.email !== $rootScope.userInfo.email) {
					var lastNameSplit = member.lastName.split(' ');
					scope.roomMemberNames += member.firstName.split(' ')[0] + ' ' + lastNameSplit[lastNameSplit.length - 1];

					if (scope.chat.members.length > 2 && key !== scope.chat.members.length - 1) scope.roomMemberNames += ', ';
				}
			});

			//close button
			scope.close = function (event) {
				event.stopPropagation();

				scope.chats = scope.chats.filter(function (chat) {
					return chat.id !== scope.chat.id;
				});
			};

			//favorite button
			scope.favorite = function (event) {
				event.stopPropagation();
			};

			scope.isUserMessageFilter = function (message) {
				return message.from === $rootScope.userInfo.id;
			};

			//send message button
			scope.send = function () {
				if (scope.message.trim() !== '') {
					var date = new Date();
					var hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
					var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();

					chatSocketService.emit('chat:message:send', {
						chatId: scope.chat.id,
						text: scope.message
					});

					scope.message = '';
					elem[0].querySelector('#message-input').focus();
				}
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