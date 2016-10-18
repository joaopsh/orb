import { default as Controller } from './chat-box.controller'

class orbChatBox {
	constructor($rootScope, chatSocketService) {
		this.scope = {
			panelMinimize:'&',
			roomId:'@',
			chat:'=',
			chats: '='
		};
		this.restrict = 'E';
		this.templateUrl =  '/dist/views/templates/chat-box/chat-box.template.html';
		this.controller = () => new Controller();
		this.controllerAs = 'chatBox';
		this.link = (scope, elem, attr) => {
			scope.roomMemberNames = '';

			angular.forEach(scope.chat.members, (member, key) => {
				if(member.email !== $rootScope.userInfo.email) {
					var lastNameSplit =  member.lastName.split(' ');
					scope.roomMemberNames += member.firstName.split(' ')[0] + ' ' + lastNameSplit[lastNameSplit.length - 1];

					if(scope.chat.members.length > 2 && key !== scope.chat.members.length - 1) 
						scope.roomMemberNames += ', ';
				}
			});

			//close button
			scope.close = (event) => {
				event.stopPropagation();

				scope.chats = scope.chats.filter(function(chat) {
					return chat.roomId !== scope.chat.roomId;
				});
			}

			//favorite button
			scope.favorite = (event) => {
				event.stopPropagation();
			};

			scope.isUserMessageFilter = function(message) {
				return message.from === $rootScope.userInfo.id;
			}

			//send message button
			scope.send = () => {
				if(scope.message.trim() !== '') {
					var date = new Date;
					var hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
					var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();

					chatSocketService.emit('chat:message:send', {
						roomId: scope.chat.roomId,
						text: scope.message
					});

					scope.message = '';
					elem[0].querySelector('#message-input').focus();

				}

			}

		};
		
	}

}

export default orbChatBox;