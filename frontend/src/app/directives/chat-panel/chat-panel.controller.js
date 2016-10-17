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
			return chat.to.email === newChat.to.email;
		});

		if(!foundChat)
			this.chats.push(newChat);
	}
	
}

export default ChatPanelController;