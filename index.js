require('dotenv').config();
const routes = require('./src/routes/');

const fastify = require('fastify')({
	logger : true
});

routes.forEach((route, index) => {
 fastify.route(route)
})


const startServer = async () => {
	try{
		await fastify.listen( 3000 );
		fastify.log.info(`Server listening on ${fastify.server.address().port}`)
	}catch( err ){
		fastify.log.error(err);
		process.exit(1);
	}
}

startServer();