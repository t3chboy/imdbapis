/**
 * [mysqlService mysql service]
 * @type {[type]}
 */
const mysqlService = require('../services/mysql_service');

/**
 * [squel used for writing sql queries using expression in better format]
 * @type {[type]}
 */
const squel = require('squel');

class searchModel{
	
	constructor(){

	}

	/**
	 * [search Used to serach movie data]
	 * @param  {request query json object} requestQuery [search keywords entered by user]
	 * @param  {String} searchType   [type of search]
	 * @return {[type]}              [description]
	 */
	search( requestQuery, searchType ){

		return new Promise( (resolve, reject)  =>{

			let preparedSqlStatement = this.querybuilder( requestQuery, searchType );
			this.searchall( preparedSqlStatement )
			.then( data =>{
				resolve( data ); 
			},err => {
				reject( err );
			}).catch( err => {
				reject( err );
			});


		});	
	}

	/**
	 * [querybuilder build simple sql query applying different filters]
	 * @param  {json object} requestQuery [description]
	 * @param  {string} searchType   [description]
	 * @return {[type]}              [description]
	 */
	querybuilder( requestQuery, searchType ){

		const defualtListSize = 10;
		const defualtOffsetPoistion = 0;

		const sqlfetchrowsLimit = requestQuery.listsize || defualtListSize ;
		const sqlNewOffesetPosition = requestQuery.offset || defualtOffsetPoistion;

		

		switch ( searchType ) {
			case "basic":
			default:

				let moviesSqlObj = squel.expr();
				let moviesGenreSqlObj = squel.expr();

				const queryStrings = requestQuery.q.split(" ");
				queryStrings.forEach(function( searchString ){
					moviesSqlObj.or("name like ? ","%"+searchString+"%");
					moviesSqlObj.or("director_name like ? ","%"+searchString+"%");
					moviesSqlObj.or("year like ? ","%"+searchString+"%");
					
					moviesGenreSqlObj.or("genre like ? ","%"+searchString+"%");
				});

			
				let basicselectStatement =squel.select()
				.field("id")
				.field("name")
				.field("year")
				.from( squel.select() 
				.field("id")
				.field("name")
				.field("year")
				.from("movies")
				.where( moviesSqlObj ) 
				.union(
					squel.select()
					.field("id")
					.field("name")
					.field("year")
					.from("movies","ms")
					.join("movies_genres","mg" , "ms.id = mg.movie_id")
					.where( moviesGenreSqlObj )
				)
				, "moviedata")
				.limit( sqlfetchrowsLimit )
				.offset( sqlNewOffesetPosition )
				.toString();

				return basicselectStatement;
				break;
				case "advance":
					
					let moviesSqlObj1 = squel.expr();
					let moviesGenreSqlObj1 = squel.expr();
					let advanceSelectStatement = "";

					if( requestQuery.movie_name )
						moviesSqlObj1 = this.searchBymovie( requestQuery.movie_name, moviesSqlObj1 );

					if( requestQuery.director_name )
						moviesSqlObj1 =this.searchBydirector( requestQuery.director_name, moviesSqlObj1 );

					if( requestQuery.release_year && ( !isNaN(+requestQuery.release_year) ) )
						moviesSqlObj1 =this.searchByYear(requestQuery.release_year, moviesSqlObj1 );

					if( requestQuery.genre ){
						moviesGenreSqlObj1 =this.searchBygenre(requestQuery.genre, moviesGenreSqlObj1 );

						advanceSelectStatement =squel.select()
							.field("id")
							.field("name")
							.field("year")
							.from(
								 squel.select() 
								.field("id")
								.field("name")
								.field("year")
								.from("movies")
								.where( moviesSqlObj1 )
							.union(
								squel.select()
								.field("id")
								.field("name")
								.field("year")
								.from("movies","ms")
								.join("movies_genres","mg" , "ms.id = mg.movie_id")
								.where( moviesGenreSqlObj1 )
								), "moviedata"
							)
							.limit( sqlfetchrowsLimit )
							.offset( sqlNewOffesetPosition )
							.toString();

					}else{

							advanceSelectStatement =squel.select()
								.field("id")
								.field("name")
								.field("year")
								.from("movies" , "moviedata")
								.where( moviesSqlObj1 )
								.limit( sqlfetchrowsLimit )
								.offset( sqlNewOffesetPosition )
								.toString();
					}
				return advanceSelectStatement;
				break;
		}

		
		
	}


	searchBymovie( requestQuery, sqlqueryObj ){

		const queryStrings = (parseInt( requestQuery.search('/\s/') ) >= 0 ) ? requestQuery.split(" ") : [ requestQuery ] ;
		queryStrings.forEach(function( searchString ){
			sqlqueryObj.and("name like ? ","%"+searchString+"%");					
		});		

		return sqlqueryObj;
	}

	searchByYear( requestQuery, sqlqueryObj  ){

		const queryStrings = (parseInt( requestQuery.toString().search('/\s/') ) >= 0 ) ? requestQuery.split(" ") : [ requestQuery ] ;
		queryStrings.forEach(function( searchString ){
			sqlqueryObj.and("year like ? ","%"+searchString+"%");					
		});		

		return sqlqueryObj;
	}

	searchBydirector( requestQuery, sqlqueryObj ){

		const queryStrings = (parseInt( requestQuery.search('/\s/') ) >= 0 ) ? requestQuery.split(" ") : [ requestQuery ] ;
		queryStrings.forEach(function( searchString ){
			sqlqueryObj.and("director_name like ? ","%"+searchString+"%");					
		});		

		return sqlqueryObj;

	}

	searchByGenre( requestQuery, sqlqueryObj ){

		const queryStrings = (parseInt( requestQuery.search('/\s/') ) >= 0 ) ? requestQuery.split(" ") : [ requestQuery ] ;
		queryStrings.forEach(function( searchString ){
			sqlqueryObj.and("genre like ? ","%"+searchString+"%");					
		});		

		return sqlqueryObj;

	}


	searchall( sqlSelectStatement ){

		return new Promise( (resolve,reject) =>{

			mysqlService.getConnection((err, connection)=>{

			connection.query( sqlSelectStatement , ( error , results, fields )=>{
				
				if (error) {
					return reject([error.code , error.errno, error.sqlMessage]);
				};

				if( results.length > 0 ){
						connection.release();
						return resolve(results);
				}else{
						return resolve([]);
				}
			
			})	
		});//end of mysql connection
		
		});

	}
	
}
module.exports  = searchModel;