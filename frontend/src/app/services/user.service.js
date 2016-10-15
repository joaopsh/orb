class userService {

	constructor($http, $resource, configs) {
		this.Resource = $resource(configs.apiUrl + '/user/:id', {}, {
			getByAccessToken: {
				method: 'GET',
				url: configs.apiUrl + '/user/accesstoken/:accessToken',
				params: {
					accessToken: '@accessToken',
				}
			}
		});

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

	getByAccessToken(accessToken, successCb, errorCb) {
		this.Resource.getByAccessToken({ accessToken: accessToken }, function(successResponse) {
			if(successCb)
				successCb(successResponse.user);

		} , function(errorResponse) {
			if(errorCb)
				errorCb(errorResponse);
		});
	}

}

export default userService;