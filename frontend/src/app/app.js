import { default as orbConfig } from './orb.config';

//controllers import
import { default as HeaderController } from './controllers/header.controller';
import { default as OrbController } from './controllers/orb.controller';
import { default as MapController } from './controllers/map.controller';
import { default as SignController } from './controllers/sign.controller';
import { default as SidenavController } from './controllers/sidenav.controller';

//services import
import { default as orbService } from './services/orb.service';
import { default as mapService } from './services/map.service';
import { default as userService } from './services/user.service';
import { default as chatSocketService } from './services/chat.socket.service';

//directives import
import { default as contactListDirective } from './directives/contact-list/contact-list.directive.js';
import { default as chatPanelDirective } from './directives/chat-panel/chat-panel.directive.js';
import { default as chatBoxDirective } from './directives/chat-box/chat-box.directive.js';
import { default as searchDirective } from './directives/search/search.directive.js';
import { default as passwordCheckDirective } from './directives/password-check/password-check.directive.js';

//orb module
var orb = angular.module('app.orb', [
  'ui.router'
, 'angular-oauth2'
, 'ngResource'
, 'ngMaterial'
, 'ngMessages'
, 'ngLetterAvatar'
, 'uiGmapgoogle-maps'
, 'ngAnimate'
, 'ngFileUpload'
]);

//globals
orb.constant('configs', {
	apiUrl: 'http://localhost:1200',
  chatNamespace: '/chat'
});

//services register
orb.service('orbService', orbService);
orb.service('mapService', mapService);
orb.service('userService', userService);
orb.service('chatSocketService', chatSocketService);

//controllers register
orb.controller('HeaderController', HeaderController);
orb.controller('OrbController', OrbController);
orb.controller('MapController', MapController);
orb.controller('SignController', SignController);
orb.controller('SidenavController', SidenavController);

//directives register
orb.directive('orbContactList', () => new contactListDirective());
orb.directive('orbChatPanel', () => new chatPanelDirective());
orb.directive('orbChatBox', (chatSocketService) => new chatBoxDirective(chatSocketService));
orb.directive('orbSearch', () => new searchDirective());
orb.directive('passwordCheck', () => new passwordCheckDirective());

//initialization configs
orb.run(['$rootScope', '$window', '$state', 'OAuth', function($rootScope, $window, $state, OAuth) {
    $rootScope.$on('oauth:error', function(event, rejection) {
      if (rejection.headers('WWW-Authenticate') && rejection.headers('WWW-Authenticate').indexOf('invalid_grant') > -1) {
        return;
      }

      if (rejection.headers('WWW-Authenticate') && rejection.headers('WWW-Authenticate').indexOf('invalid_token') > -1) {
        return OAuth.getRefreshToken();
      }

      return $state.go('sign');
    });
}]);

orb.config(orbConfig);

//app module
var app = angular.module('app', ['app.orb']);