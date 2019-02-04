## RESTFul APIs for imdb movie module.
![NodeJS](https://img.shields.io/badge/Powered%20by-NODEJS-brightgreen.svg?longCache=true&style=for-the-badge)
[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)]()

Problem 1: Movie Data Collection (RESTful apis, only backend)

Write API:
- create/update/delete Movie Data Collection.
  - [x] POST to create movie
  - [x] PUT to update movie.
  - [x] DELETE to soft delete movie.

- create/update/delete Movie Genre Data Collection.
  - [x] POST to create Movie Genre.
  - [x] PUT to update MOvie Genre.
  - [x] DELETE to soft delete MOvie Genre.

- Search For Movie Data
  - [x] GET for basic search for movie data.
  - [x] GET for advance search for movie data using filters.
  
- Signup api to generate JWT token for api authorization.
  - [x] GET for generating token.
  
 ## Technical Details : 

#### Tech Stack
    NodeJs
    Mysql
    
#### Modules Used
    "dotenv": "^6.2.0",
    "fastify": "^1.13.4",
    "jsonwebtoken": "^8.4.0",
    "mysql": "^2.16.0",
    "nodemon": "^1.18.9",
    "squel": "^5.12.2"
 
#### Setup
    - Get all the node dependencies installed.
#### Database setup
    - Get Mysql installed.
    - Create database - imdb
    - Update .env file with db credential
    - Import imdbapis.sql to database. 
#### APIs Documentation and Usage
- [API DOCUMENTATION](https://web.postman.co/collections/3407371-2ab7ebbe-5912-446b-9a00-189cbba01b25?workspace=1c19cb98-1557-437e-8e52-4e601596a792
)
- Import `imdb.postman_collection.json` collection in postman to run the APIs. 

#### Use Application
- [x] Browse to root folder of app via terminal.
- [x] Type `node start` to start the application.
- [x] Hit the APIs from postman collection imported ealier.

#### Check ERROR logs
  - All logs are printed on the terminal itself since its inbuilt funtionality in fastify framework itself.
  
  #### Developer Notes
- For scalability and to handle huge traffic we can use In Memory database like Redis.
- Here we are using Mysql RDBMS, for which we are using connection pooling technic, so that we can cache and resuse connections.  Current pool size = 100.
- Folder Structure
  1. Controller - All Rest based controllers which get the request from routes and pass it to models.
  2. Models - All Models are related to each controller and they perfome database realted operations.
  3. Routes - Contains `indes.js` file which contains handles for all http request based on http methods.
  4. Services - All the services which can be used acrossed application are stored here eg : mysql, logger.
  5. Node_modules : Conatins 3rd party modules installed via npm.
  6. Fastify : Nodejs based framework.
  7. jsonwebtoken : Used to generate and verify auth tokens.
  8. .env : Contains enviorment specific data and included in git ignore.
  9. squel : A flexible and powerful SQL query string builder for Javascript.
  10. mysql : Mysql connector for Nodejs.

## More Problem Statements :
Since We had requirment to handle traffic approx ~15M Apis
  So we used fastify framework, as its fast low overhead web framework, for Node.js.
  [Fastify Benchmarks](https://www.fastify.io/benchmarks/).
  
  - Fastify uses [fast-json-stringify](https://github.com/fastify/fast-json-stringify) to double the throughput of the rendering of JSON.
  
  - Fastify uses [find-my-way](https://github.com/delvedor/find-my-way) to reduce the routing by a factor of 10 compared to alternatives.

##For Scaling this monolithic app we can consider below implmentation :

  - We can also use `Redis` for data storage since movie data doesnt change once created frequently and this help reduce DB calls.
  
  - We can also store data using `ElasticSearch` based on `genres`, since its inverted index helps to fetch data more faster than using Mysql Joins.
  
  - We can use `microservice` based architecture to scale our application X times, since we are using fastify framework it can easly used to convert this app into micro service architecture.Mircoservice will also help to scale any individual module X times as per requirment for eg :
    1. While runnning marketting campaign for a particular movie or genre.
    2. Release of a particular movie. 
  
  - Major bottle neck would be Mysql joins, so for this based on time period we can store early data in elasticseacrh or Redis depending on product requirment, 
  eg: 
  - Collecting all Freedom fighting movies in single document during Independenace Day.
  - Collecting all Animation and children movies in single document during vaccations.
  
  - We can also have front end `cache controls` using response headers for GET request with cache timeouts.
  
  - We should also store and study users made `GET search` request, so we can apply ML/AI on this activities and provide more user preferred and personalize recommendation.
###### Things to watch out !!!!
[How and Why Fastify So FAST!!!](https://thenewstack.io/introducing-fastify-speedy-node-js-web-framework/)

  
    
