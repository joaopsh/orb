import { default as Controller } from './contact-list.controller'

class orbContactList {

	constructor() {
		this.scope = {};
		this.restrict = 'E'
		this.templateUrl =  '/dist/views/templates/contact-list/contact-list.template.html';
		this.controller = () => new Controller();
		this.controllerAs = 'contactList';
		this.link = function(scope, elem, attr) {
			

		};
		
	}

}

export default orbContactList;