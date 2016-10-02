import { default as Controller } from './chat-box.controller'

class orbChatBox {

	constructor() {
		this.scope = {
			panelMinimize:'&'

		};
		this.restrict = 'E'
		this.templateUrl =  '/dist/views/templates/chat-box/chat-box.template.html';
		this.controller = () => new Controller();
		this.controllerAs = 'chatBox';
		this.link = function(scope, elem, attr) {
			

			scope.close = (event) => {
				event.stopPropagation();

				console.log('close fired!');
			}


			scope.favorite = (event) => {
				event.stopPropagation();
				console.log('favorite fired!');
			};

		};
		
	}

}

export default orbChatBox;