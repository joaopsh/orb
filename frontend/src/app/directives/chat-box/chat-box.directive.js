import { default as Controller } from './chat-box.controller'

class orbChatBox {
	constructor(chatSocketService) {
		this.scope = {
			panelMinimize:'&',
			roomId:'@',
			user:'=',
			chats: '='
		};
		this.restrict = 'E';
		this.templateUrl =  '/dist/views/templates/chat-box/chat-box.template.html';
		this.controller = () => new Controller();
		this.controllerAs = 'chatBox';
		this.link = (scope, elem, attr) => {
			scope.close = (event) => {
				event.stopPropagation();
				scope.chats = scope.chats.filter(function(chat) {
					return chat.invitedUser.email !== scope.user.email;
				});
			}

			scope.favorite = (event) => {
				event.stopPropagation();
			};

			scope.send = () => {
				var date = new Date;
				var hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
				var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();

				elem.find('.messages-box').prepend('<div class="me"><strong>'+ hours + ':' + minutes + ': </strong>'+ scope.message +'</div>');
				chatSocketService.emit('chat:message:send', {
					roomId: scope.roomId,
					text: scope.message
				});
				scope.message = '';
				elem[0].querySelector('#message-input').focus();
			}

		};
		
	}

}

export default orbChatBox;