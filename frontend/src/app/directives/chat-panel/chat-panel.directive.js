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

			scope.chats = [{
				roomId: 'a1as5as4a5',
				user: {
					firstName: 'Maria',
					lastName: 'Silva',
					email: 'msilva@live.com'
				}
			},
			{
				roomId: 'defe8f7ef',
				user: {
					firstName: 'Romarilda',
					lastName: 'Zenato',
					email: 'romailda@live.com'
				}
			}];

		};
		
	}

}

export default orbChatPanel;