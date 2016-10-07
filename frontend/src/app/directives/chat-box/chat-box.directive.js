import { default as Controller } from './chat-box.controller'

class orbChatBox {
	constructor(chatSocketService) {
		this.scope = {
			panelMinimize:'&'
		};
		this.restrict = 'E';
		this.templateUrl =  '/dist/views/templates/chat-box/chat-box.template.html';
		this.controller = Controller;
		this.controllerAs = 'chatBox';
		this.link = function(scope, elem, attr) {
			scope.close = (event) => {
				event.stopPropagation();
			}

			scope.favorite = (event) => {
				event.stopPropagation();
			};

			scope.send = () => {
				chatSocketService.emit('myfront', scope.message);
				scope.message = '';
				elem[0].querySelector('#message-input').focus();
			}

			chatSocketService.on('tweet', function(tweet) {
				console.log(tweet);
			});

		};
		
	}

}

export default orbChatBox;