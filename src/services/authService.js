const jwt = require('jsonwebtoken');
const config = require('../configuration.js');
const appConstants = require('../appconstants.js');


/**
 * Used to generate JWT and verify user authorization.
 */
class authService{

	constructor(){

	}

	/**
	 * [verify Used to authorize and verify user]
	 * @param  {String} requestAuthHeader  [dot sepearted jwt token]
	 * @param  {Integer} requestUserRoleId [roleId of user with request]
	 * @return {Interger}         						 [whether user is authorized or not]
	 */
	verify( requestAuthHeader, requestUserRoleId ){
		
		try{
			const userssoToken = requestAuthHeader ;

			const verificationResult = jwt.verify(userssoToken, config.secret);
			
			const isRoleAuthorized = ( verificationResult.userInfoPayload.role === appConstants.rolesId[ requestUserRoleId ] ) ? 1 : 0;
			return isRoleAuthorized;
		}catch( error ){
			return error;
		}
		
	}

	/**
	 * [generateToken Used to generate unique token for each user]
	 * @param  {Object} userInfoPayload [Contains data related to user ]
	 * @return {Sting}                 				 [dot seperated json web token using secret fetched form config file]
	 */
	generateToken( userInfoPayload ){

	const token = jwt.sign( 
			{ userInfoPayload },
			config.secret,
			{ expiresIn: '24h'} // expires in 24 hours
		);
		return token;
	}

} 

module.exports = authService;	
