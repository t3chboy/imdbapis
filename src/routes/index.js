const authHelpers = require('../helpers/authHelper.js')
const movieController = require('../controllers/movieController');
const appConstants = require('../appconstants');
const searchController = require('../controllers/searchController');


const searchControllerObj = new searchController();
const movieControllerObj = new movieController();	
	
/**
 * [routes List of all routes application listens on]
 * @type {Array}
 */
const routes = [
  {
	method: 'POST',
	url: '/movie',
	beforeHandler : function( request, reply, done ) {
		authHelpers.requestAuthorization( request, reply, done  );// helps to authorize request
	},
	handler: function(request, reply){
		try{
		movieControllerObj.create( request.body ).then(data => {
			reply.code(201).send({'message':data});
		},err =>{ 
			reply.code(400).send(err);
		});
	}catch( error ){
		reply.code(500).send(error);
	}
	}	
},
  {
	method: 'PUT',
	url: '/movie/:id',
	beforeHandler : function( request, reply, done ) {
		authHelpers.requestAuthorization( request, reply, done  );
	},
	handler: function(request, reply){
		try{
		movieControllerObj.update( request.params,request.body ).then(data => {
			reply.send({'message':data});
		},err =>{ 
			reply.code(400).send(err);
		});
	}catch( error ){
		reply.code(500).send(error);
	}
	}	
},
{
	method : 'DELETE',
	url: '/movie/:id',
	beforeHandler : function( request, reply, done ) {
		authHelpers.requestAuthorization( request, reply, done  );
	},
	handler: function(request, reply){
		try{
		movieControllerObj.delete( request.params ).then(data => {
			reply.send({'message':data});
		},err =>{ 
			reply.code(400).send(err);
		});
	}catch( error ){
		reply.code(500).send(error);
	}
	}

},
{ //for signup we are not using promises as we dont have blocking io operation here, in future we should use promises
	method: 'POST',
	url: '/signup',
	handler: function (request, reply) {

			const userInfoPayload = {
				name : request.body.name,
				role : appConstants.rolesId[request.body.roleId]
			}

			const userAccessToken = authHelpers.generateToken( userInfoPayload );//helps to generate jwt token for future verification
			
			reply.code(201).send(
				{ 
					message: 'Welcome to imdb, kindly use the provided ssoToken for further communication.',
					ssoToken : userAccessToken
				 }
			);
	}

},
//Both serach routes are kept out of auth validation as they are open to non registered users also.
{
	method: 'GET',
	url: '/search',
	handler : function( request, reply ){
		try{
		searchControllerObj.basicsearch( request.query ).then(data => {
			reply.send({'data':data});
		},err =>{ 
			reply.code(400).send(err);
		});
	}catch( error ){
		reply.code(500).send(error);
	}
	}
},
{
	method: 'GET',
	url: '/search/advance',
	schema: {
		querystring: {
	      movie_name: { type: 'string' },
	      release_year: { type: 'integer' }
	    }
	},    
	handler : function( request, reply ){
		try{
		searchControllerObj.advancesearch( request.query ).then(data => {
			if( data.length > 0 )
				reply.send({'data':data});
			else{
				reply.code(404).send("Seems your too high, kindly re-check your filters!!!!");
			}
		},err =>{ 
			reply.code(400).send(err);
		});
	}catch( error ){
		reply.code(500).send(error);
	}
	}
},
{
	method: 'GET',
	url: '/',
	handler: function (request, reply) {
			
			const userInfoPayload = {
				name : "kaushil",
				role : "user"
			}
			const userAccessToken = authHelpers.generateToken( userInfoPayload );
			
			reply.send(
				{ 
					message: 'Welcome to imdb',
					ssoToken : userAccessToken
				 }
			 );
	}
}

]

module.exports = routes;