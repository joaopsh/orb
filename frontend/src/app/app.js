import { default as orbConfig } from './orb.config';

//controllers import
import { default as HeaderController } from './controllers/header.controller';
import { default as HomeController } from './controllers/home.controller';
import { default as MapController } from './controllers/map.controller';
import { default as SigninController } from './controllers/signin.controller';
import { default as SignupController } from './controllers/signup.controller';
import { default as SidenavController } from './controllers/sidenav.controller';

//services import
import { default as homeService } from './services/home.service';
import { default as mapService } from './services/map.service';
import { default as signinService } from './services/signin.service';
import { default as signupService } from './services/signup.service';
import { default as userService } from './services/user.service';

//directives import
import { default as contactListDirective } from './directives/contact-list/contact-list.directive.js';
import { default as chatPanelDirective } from './directives/chat-panel/chat-panel.directive.js';
import { default as chatBoxDirective } from './directives/chat-box/chat-box.directive.js';
import { default as searchDirective } from './directives/search/search.directive.js';

//orb module
var orb = angular.module('app.orb', [
  'ui.router'
, 'angular-oauth2'
, 'ngResource'
, 'ngMaterial'
, 'ngLetterAvatar'
, 'uiGmapgoogle-maps'
, 'ngAnimate'
, 'ngFileUpload'
]);

//globals
orb.constant('configs', {
	apiUrl: 'http://localhost:1500'
});

//services register
orb.service('homeService', homeService);
orb.service('mapService', mapService);
orb.service('signinService', signinService);
orb.service('signupService', signupService);
orb.service('userService', userService);

//controllers register
orb.controller('HeaderController', HeaderController);
orb.controller('HomeController', HomeController);
orb.controller('MapController', MapController);
orb.controller('SigninController', SigninController);
orb.controller('SignupController', SignupController);
orb.controller('SidenavController', SidenavController);

//directives register
orb.directive('orbContactList', () => new contactListDirective());
orb.directive('orbChatPanel', () => new chatPanelDirective());
orb.directive('orbChatBox', () => new chatBoxDirective());
orb.directive('orbSearch', () => new searchDirective());

//initialization configs
orb.run(['$rootScope', '$window', 'OAuth', function($rootScope, $window, OAuth) {
    $rootScope.$on('oauth:error', function(event, rejection) {
      if (rejection.headers('WWW-Authenticate') && rejection.headers('WWW-Authenticate').indexOf('invalid_grant') > -1) {
        return;
      }

      if (rejection.headers('WWW-Authenticate') && rejection.headers('WWW-Authenticate').indexOf('invalid_token') > -1) {
        return OAuth.getRefreshToken();
      }

      return $window.location.href = '/login?error_reason=' + rejection.data.error;
    });
}]);

orb.config(orbConfig);

//app module
var app = angular.module('app', ['app.orb']);