class ChatPanelController {
	constructor($scope) {
		this.chats = [];

		// Called from MapController when a user click on a map pin to initiate a chat
		$scope.$on('panelController:newChat', (event, newChat) => {
			this.newChat(newChat);
		});
	}

	newChat(newChat) {
		var foundChat = this.chats.find(function(chat){
			return chat.email === newChat.email;
		});

		if(!foundChat)
			this.chats.push(newChat);
	}

	removeChat() {
		var args = Array.prototype.slice.call(arguments);

		this.chats = this.chats.filter(function(chat) {
			return chat.email !== email;
		});
	}

}

export default ChatPanelController;