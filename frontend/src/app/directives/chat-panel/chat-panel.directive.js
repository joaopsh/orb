import { default as Controller } from './chat-panel.controller'

class orbChatPanel {

	constructor() {
		this.scope = {};
		this.restrict = 'E'
		this.templateUrl =  '/dist/views/templates/chat-panel/chat-panel.template.html';
		this.controller = () => new Controller();
		this.controllerAs = 'chatPanel';
		this.link = function(scope, elem, attr) {
			
			scope.minimizeToggle = true;

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