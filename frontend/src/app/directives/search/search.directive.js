import { default as Controller } from './search.controller'

class orbSearch {

	constructor() {
		this.scope = {};
		this.restrict = 'E'
		this.templateUrl =  '/dist/views/templates/search/search.template.html';
		this.controller = () => new Controller();
		this.controllerAs = 'search';
		this.link = function(scope, elem, attr) {
			

		};
		
	}

}

export default orbSearch;