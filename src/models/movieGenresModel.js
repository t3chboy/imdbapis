/**
 * [mysqlService description]
 * @type {[type]}
 */
const mysqlService = require('../services/mysql_service');

/**
  * [movieGernesModel Used for movie genre related DB opreations]
 */
class movieGernesModel{
	
	constructor(){
	}

	/**
	 * [create Create Genres for Movie Data]
	 * @param  {Json} bodyParams [Key value pair for genre Data]
	 * @param  {Number} movieId  [movie for which genre will be created]
	 * @return {[type]}          [Success or Fail Message]
	 */
	create( bodyParams, movieId ){

		return new Promise((resolve,reject)=>{
			this.createGenres( movieId, bodyParams )
			.then(data =>{
				return resolve(data); 
			})
			.catch(error => {
				return reject(error);
			});
		});
		
	}

	createGenres( movieId, bodyParams ){

		return new Promise((resolve,reject)=>{

			let genresData = [];
			if( bodyParams.length >= 1 ){
				
				for( let eachParam of bodyParams ){
					genresData.push([ parseInt(movieId), eachParam ]);	
				}
			}

			const insertQuery = "INSERT INTO movies_genres ( movie_id, genre ) values  ?  ";
			
			mysqlService.query( insertQuery , [genresData]  , ( error , results, fields )=>{
				
				if (error) {
					return reject([error.code , error.errno, error.sqlMessage]);
				};

				if (results.affectedRows > 0) {
					return resolve('Created successfully.');
				}
			});
		});
	}

	update(  movieId, bodyParams ){
		return new Promise((resolve,reject)=>{

			this.updateGenre( movieId, bodyParams )
			.then(data =>{
				return resolve(data); 
			})
			.catch(error => {
				return reject(error);
			});
		});

	} 

	updateGenre( movieId, bodyParams  ){

		return new Promise( (resolve, reject) =>{
			let genreDataArray = [];
		
			bodyParams.forEach( function(genreData ){
				 genreDataArray.push([ parseInt(movieId), genreData ]);	
			});

			const insertQuery = "UPDATE  movies_genres ( movieId, genre ) values  ?  ";
			mysqlService.query( insertQuery , [ genreDataArray ]  , ( error , results, fields )=>{
				
				if (error) {
					return reject([error.code , error.errno, error.sqlMessage]);
				};

				if (results.affectedRows > 0) {
					return resolve(true);
				}
			})
		});

	}

	deleteData( movieId ){

		return new Promise(( resolve, reject ) => {

			const deleteQuery = " delete from movies_genres where movie_id = ? ";

			mysqlService.query( deleteQuery , movieId , ( error, results,  fields ) => {
				if( error ){
					return reject([error.code , error.errno, error.sqlMessage]);
				};

				if (results.affectedRows > 0) {
					return resolve('Deleted successfully.');
				}
			});
		});
	}
}
module.exports = movieGernesModel;
