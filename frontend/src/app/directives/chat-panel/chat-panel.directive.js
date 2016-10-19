import { default as Controller } from './chat-panel.controller'

class orbChatPanel {
	constructor() {
		this.scope = {};
		this.restrict = 'E'
		this.templateUrl =  '/dist/views/templates/chat-panel/chat-panel.template.html';
		this.controller = ($rootScope, $scope, chatSocketService) => new Controller($rootScope, $scope, chatSocketService);
		this.controllerAs = 'chatPanel';
		this.link = function(scope, elem, attr, chatPanel) {
			scope.minimizeToggle = true;

			//minimize and maxmize the panel bar on clicking the chat box header
			scope.minimize = () => {
				if(scope.minimizeToggle) {
					elem.find('.chat-panel').addClass('minimized');
					scope.minimizeToggle = !scope.minimizeToggle;
				} else {
					elem.find('.chat-panel').removeClass('minimized');
					scope.minimizeToggle = !scope.minimizeToggle;
				}

			}

		};
		
	}

}

export default orbChatPanel;