class ChatPanelController {
	constructor($rootScope, $scope, chatSocketService) {
		this.chats = [];
		this.$rootScope = $rootScope;
		this.chatSocketService = chatSocketService;
		this.$scope = $scope;

		$rootScope.$on('panelController:newChat', (event, users) => {
			this.newChat(users);
		});

		// Called from MapController when a new message arrives
		$rootScope.$on('panelController:newMessage', (event, newMessage) => {
			this.newMessage(newMessage);
		});
	}

	newChat(users) {
		//Verify if already exists a chat with the same users
		var foundChat = this.chats.some((chat) => {
			return chat.members.every((member, index, array) => {
				return users.some((user) => {
					return (member.id === user.id || member.id === this.$rootScope.userInfo.id) && chat.members.length === users.length + 1;
				});
			});
		});

		var foundOwnUser = users.find((user) => {
			return user.id === this.$rootScope.userInfo.id;
		});

		if(!foundChat && !foundOwnUser) {
			// Receive the new chat room identificator and opens the new chat window
			this.chatSocketService.socket.once('chat:new', (newChat) => {
				angular.forEach(newChat.messages, (message) => {
					message.time = this.getTime(message.timestamp);
				});

				this.$scope.$apply(() => {
					this.chats.push(newChat);
				});
			});

			this.chatSocketService.emit('chat:new', users);
		}
			
	}

	newMessage(newMessage) {
		var foundChat = this.chats.find((chat) => {
			return chat.id === newMessage.chat.id;
		});

		if(foundChat) {
			foundChat.messages.push({
				from: newMessage.message.from,
				text: newMessage.message.text,
				timestamp: newMessage.message.timestamp,
				time: this.getTime(newMessage.message.timestamp)
			});
		} else {
			angular.forEach(newMessage.chat.messages, (message) => {
				message.time = this.getTime(message.timestamp);
			});

			this.chats.push(newMessage.chat);
		}
			
	}

	getTime(timestamp) {
		//The time-zone offset is the difference, in minutes, between UTC and local time. The timesptamp object property is in milliseconds.
		var date = new Date(timestamp - (new Date().getTimezoneOffset() * 60 * 1000));
		var hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
		var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();

		return hours + ':' + minutes;
	}
	
}

export default ChatPanelController;