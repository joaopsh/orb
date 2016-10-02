class SearchController {

	constructor($timeout, $q) {
		this.$timeout = $timeout;
		this.$q = $q;

		var self = this;

	    self.simulateQuery = false;
	    self.isDisabled    = false;

	    this.loadAll = function() {
	      var repos = [
	        {
	          'name'      : 'Angular 1',
	          'url'       : 'https://github.com/angular/angular.js',
	          'watchers'  : '3,623',
	          'forks'     : '16,175',
	        },
	        {
	          'name'      : 'Angular 2',
	          'url'       : 'https://github.com/angular/angular',
	          'watchers'  : '469',
	          'forks'     : '760',
	        },
	        {
	          'name'      : 'Angular Material',
	          'url'       : 'https://github.com/angular/material',
	          'watchers'  : '727',
	          'forks'     : '1,241',
	        },
	        {
	          'name'      : 'Bower Material',
	          'url'       : 'https://github.com/angular/bower-material',
	          'watchers'  : '42',
	          'forks'     : '84',
	        },
	        {
	          'name'      : 'Material Start',
	          'url'       : 'https://github.com/angular/material-start',
	          'watchers'  : '81',
	          'forks'     : '303',
	        }
	      ];
	      return repos.map( function (repo) {
	        repo.value = repo.name.toLowerCase();
	        return repo;
	      });
	    }

	    this.searchTextChange = function(text) {
	      //$log.info('Text changed to ' + text);
	    }

	    this.selectedItemChange = function(item) {
	      //$log.info('Item changed to ' + JSON.stringify(item));
	    }

	    this.createFilterFor = function(query) {
	      var lowercaseQuery = angular.lowercase(query);

	      return function filterFn(item) {
	        return (item.value.indexOf(lowercaseQuery) === 0);
	      };

	    }

	    this.querySearch = function(query) {
	      var results = query ? self.repos.filter( this.createFilterFor(query) ) : self.repos,
	          deferred;
	      if (self.simulateQuery) {
	        deferred = $q.defer();
	        this.$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
	        return deferred.promise;
	      } else {
	        return results;
	      }
	    }
	    

	    self.repos         = this.loadAll();
	    self.querySearch   = this.querySearch;
	    self.selectedItemChange = this.selectedItemChange;
	    self.searchTextChange   = this.searchTextChange;
		
	}

	

}

export default SearchController;