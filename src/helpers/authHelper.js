const authService = require('../services/authService');

const authServiceObj = new authService();

/**
 * [requestAuthorization Used to verify if request user is authorize to access]
 * @param  {Object}   request [http request object]
 * @param  {Object}   reply   [http response object]
 * @param  {Function} done    [next function in lifecycle to execute]
 */
function requestAuthorization( request, reply, done ){
	
	const isValidRequest = authServiceObj.verify( request.headers.authorization, request.headers.roleid );

	if( isValidRequest == true )
		done();
	else{
		reply
		.code(401)
		.send({ "Message": 'Unauthorize-access' });
	}
	
}

/**
 * [generateToken used to generate jwt token for user]
 * @param  {Json object} userInfoPayload [User data with name and roleId]
 * @return {String}                 					[dot seperated jwt token]
 */
function generateToken( userInfoPayload ){
		const token = authServiceObj.generateToken( userInfoPayload )
		return token;
}	

module.exports = { requestAuthorization, generateToken }