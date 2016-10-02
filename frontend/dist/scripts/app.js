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

	var _home = __webpack_require__(4);

	var _home2 = _interopRequireDefault(_home);

	var _map = __webpack_require__(5);

	var _map2 = _interopRequireDefault(_map);

	var _signin = __webpack_require__(6);

	var _signin2 = _interopRequireDefault(_signin);

	var _signup = __webpack_require__(7);

	var _signup2 = _interopRequireDefault(_signup);

	var _sidenav = __webpack_require__(8);

	var _sidenav2 = _interopRequireDefault(_sidenav);

	var _home3 = __webpack_require__(10);

	var _home4 = _interopRequireDefault(_home3);

	var _map3 = __webpack_require__(11);

	var _map4 = _interopRequireDefault(_map3);

	var _signin3 = __webpack_require__(12);

	var _signin4 = _interopRequireDefault(_signin3);

	var _signup3 = __webpack_require__(13);

	var _signup4 = _interopRequireDefault(_signup3);

	var _user = __webpack_require__(14);

	var _user2 = _interopRequireDefault(_user);

	var _contactListDirective = __webpack_require__(15);

	var _contactListDirective2 = _interopRequireDefault(_contactListDirective);

	var _chatPanelDirective = __webpack_require__(17);

	var _chatPanelDirective2 = _interopRequireDefault(_chatPanelDirective);

	var _chatBoxDirective = __webpack_require__(19);

	var _chatBoxDirective2 = _interopRequireDefault(_chatBoxDirective);

	var _searchDirective = __webpack_require__(21);

	var _searchDirective2 = _interopRequireDefault(_searchDirective);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//orb module


	//directives import
	var orb = angular.module('app.orb', ['ui.router', 'angular-oauth2', 'ngResource', 'ngMaterial', 'ngLetterAvatar', 'uiGmapgoogle-maps', 'ngAnimate', 'ngFileUpload']);

	//globals


	//services import


	//controllers import
	orb.constant('configs', {
	  apiUrl: 'http://localhost:1500'
	});

	//services register
	orb.service('homeService', _home4.default);
	orb.service('mapService', _map4.default);
	orb.service('signinService', _signin4.default);
	orb.service('signupService', _signup4.default);
	orb.service('userService', _user2.default);

	//controllers register
	orb.controller('HeaderController', _header2.default);
	orb.controller('HomeController', _home2.default);
	orb.controller('MapController', _map2.default);
	orb.controller('SigninController', _signin2.default);
	orb.controller('SignupController', _signup2.default);
	orb.controller('SidenavController', _sidenav2.default);

	//directives register
	orb.directive('orbContactList', function () {
	  return new _contactListDirective2.default();
	});
	orb.directive('orbChatPanel', function () {
	  return new _chatPanelDirective2.default();
	});
	orb.directive('orbChatBox', function () {
	  return new _chatBoxDirective2.default();
	});
	orb.directive('orbSearch', function () {
	  return new _searchDirective2.default();
	});

	//initialization configs
	orb.run(['$rootScope', '$window', 'OAuth', function ($rootScope, $window, OAuth) {
	  $rootScope.$on('oauth:error', function (event, rejection) {
	    if (rejection.headers('WWW-Authenticate') && rejection.headers('WWW-Authenticate').indexOf('invalid_grant') > -1) {
	      return;
	    }

	    if (rejection.headers('WWW-Authenticate') && rejection.headers('WWW-Authenticate').indexOf('invalid_token') > -1) {
	      return OAuth.getRefreshToken();
	    }

	    return $window.location.href = '/login?error_reason=' + rejection.data.error;
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
	    key: 'AIzaSyBMaQ5VLbug_gC8le3UCV_R0blPsNhY0ds'
	  });

	  //routes
	  $urlRouterProvider.otherwise("/home");

	  $stateProvider.state('home', {
	    url: "/home",
	    templateUrl: "dist/views/home/home.html",
	    controller: "HomeController"
	  });
	}

	exports.default = orbConfig;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HeaderController = function HeaderController($scope, $rootScope, $mdSidenav) {
		_classCallCheck(this, HeaderController);

		$rootScope.toggleSidenav = function (componentId) {
			$mdSidenav(componentId).toggle();
		};
	};

	exports.default = HeaderController;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HomeController = function HomeController() {
		_classCallCheck(this, HomeController);
	};

	exports.default = HomeController;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MapController = function MapController(uiGmapGoogleMapApi, mapService) {
		_classCallCheck(this, MapController);

		this.default = mapService.getDefaultConfigs();
		this.options = mapService.getOptions();
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

	var SigninController = function () {
		function SigninController($resource, $cookies, configs, OAuth) {
			_classCallCheck(this, SigninController);

			this.OAuth = OAuth;
			this.Client = $resource(configs.apiUrl + '/client/:id');
			this.$cookies = $cookies;
		}

		_createClass(SigninController, [{
			key: 'submit',
			value: function submit() {
				this.OAuth.getAccessToken({
					username: this.user.email,
					password: this.user.password
				}).then(function (res) {});
			}
		}]);

		return SigninController;
	}();

	exports.default = SigninController;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SignupController = function () {
		function SignupController(userService, $http) {
			_classCallCheck(this, SignupController);

			this.userService = userService;
			this.$http = $http;
		}

		_createClass(SignupController, [{
			key: 'submit',
			value: function submit() {
				this.$http.get('http://localhost:1500/user').then(function (res) {
					console.log(res.data);
				});

				// this.userService.add(this.user, function(succ) {

				// }, function(err) {

				// });
			}
		}]);

		return SignupController;
	}();

	exports.default = SignupController;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _accountSettings = __webpack_require__(9);

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
/* 9 */
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
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var homeService = function homeService() {
		_classCallCheck(this, homeService);
	};

	exports.default = homeService;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var mapService = function () {
		function mapService(uiGmapGoogleMapApi) {
			_classCallCheck(this, mapService);

			this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
		}

		_createClass(mapService, [{
			key: "getDefaultConfigs",
			value: function getDefaultConfigs() {
				return {
					center: {
						latitude: -22.3345175,
						longitude: -43.130345
					},
					zoom: 16
				};
			}
		}, {
			key: "getOptions",
			value: function getOptions() {
				return {
					mapTypeControl: false,
					streetViewControl: false,
					zoomControl: false,
					styles: [{ "featureType": "road", "stylers": [{ "hue": "#5e00ff" }, { "saturation": -79 }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }, { "saturation": -78 }, { "hue": "#6600ff" }, { "lightness": -47 }, { "visibility": "off" }] }, { "featureType": "road.local", "stylers": [{ "lightness": 22 }] }, { "featureType": "landscape", "stylers": [{ "hue": "#6600ff" }, { "saturation": -11 }] }, {}, {}, { "featureType": "water", "stylers": [{ "saturation": -65 }, { "hue": "#1900ff" }, { "lightness": 8 }] }, { "featureType": "road.local", "stylers": [{ "weight": 1.3 }, { "lightness": 30 }] }, { "featureType": "transit", "stylers": [{ "visibility": "off" }, { "hue": "#5e00ff" }, { "saturation": -16 }] }, { "featureType": "transit.line", "stylers": [{ "saturation": -72 }] }, {}]
				};
			}
		}]);

		return mapService;
	}();

	exports.default = mapService;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var signinService = function signinService() {
		_classCallCheck(this, signinService);
	};

	exports.default = signinService;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var signupService = function signupService() {
		_classCallCheck(this, signupService);
	};

	exports.default = signupService;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var userService = function () {
		function userService($resource, configs) {
			_classCallCheck(this, userService);

			this.Resource = $resource(configs.apiUrl + '/user/:id');
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
		}]);

		return userService;
	}();

	exports.default = userService;

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

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChatPanelDirectiveController = function ChatPanelDirectiveController() {
		_classCallCheck(this, ChatPanelDirectiveController);
	};

	exports.default = ChatPanelDirectiveController;

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

	var orbChatBox = function orbChatBox() {
		_classCallCheck(this, orbChatBox);

		this.scope = {
			panelMinimize: '&'

		};
		this.restrict = 'E';
		this.templateUrl = '/dist/views/templates/chat-box/chat-box.template.html';
		this.controller = function () {
			return new _chatBox2.default();
		};
		this.controllerAs = 'chatBox';
		this.link = function (scope, elem, attr) {

			scope.close = function (event) {
				event.stopPropagation();

				console.log('close fired!');
			};

			scope.favorite = function (event) {
				event.stopPropagation();
				console.log('favorite fired!');
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

/***/ }
/******/ ]);