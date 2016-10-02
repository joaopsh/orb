class userService {

	constructor($resource, configs) {
		this.Resource = $resource(configs.apiUrl + '/user/:id');

	}

	add(user, successCb, errorCb) {
		this.Resource.save({ user: user }, function(successResponse) {
			if(successCb)
				successCb(successResponse);

		} , function(errorResponse) {
			if(errorCb)
				errorCb(errorResponse);

		});
	}

}

export default userService;