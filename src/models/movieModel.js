/**
 * [mysqlService Mysql service]
 * @type {[type]}
 */
const mysqlService = require('../services/mysql_service');

/**
 * [movieGernesModel Movie genre Object]
 * @type {[type]}
 */
const movieGernesModel = require('./movieGenresModel');

/**
  [movieModel used for movie related operation with data store]
 */
class movieModel {
	constructor() {
		this._movieGernesModelObj = new movieGernesModel();
	}

	/**
	 * [create Create New movie]
	 * @param  {Json} requestParams [Key value pairs of movie data]
	 * @return {[type]}             [Success or Fail message]
	 */
	create( requestParams ){

		return new Promise((resolve,reject)=>{
			try{
			const movieData = [ requestParams.name, requestParams.year, requestParams.rank, requestParams.director ];

			const insertQuery = "INSERT INTO movies ( name, year, rank, director_name ) values ( ? , ? , ? , ?  ) ";
			
			mysqlService.query( insertQuery , movieData , ( error , results, fields )=>{
				
				if (error) {
					reject([error.code , error.errno, error.sqlMessage]);
					return;
				};

				if (results.affectedRows == 1) {
					this._movieGernesModelObj.create( requestParams.genre, results.insertId )
					.then(() => {
						resolve(true);
						return;
					},err => {
						reject( err );
						return;
					})
					.catch( err => {
						reject(err);
						return;
					})
				}
				
			})	
		}catch(error){
			reject( error );
			return;
		}	

		});

	}

	/**
	 * [delete movie and genre data]
	 * @param  {Integer} movieId [movie data to delete]
	 */
	delete(movieId) {
		let self = this;
		let movieDeleteStatus = 0;
		let genreDeleteStatus = 0;
		let isMovieExists = 0;
		let isMovieGenreExists = 0;
		return new Promise((resolve, reject) => {
			try{
			self.exists(movieId)
				.then(()=>{
					isMovieExists = 1;

					return self.deleteData(movieId)
				})
				.then(data => {
					movieDeleteStatus = data;
				}, error => {
					isMovieExists = 0;
					throw new Error("movie not exists");
				}).then(() =>{
					return self.genreExists(movieId);
				}).then(() =>{
					isMovieGenreExists = 1;
					return this._movieGernesModelObj.deleteData(movieId)
				},err =>{
					isMovieGenreExists = 0;
					throw new Error("Movie genre not exists");
				}).then((data) =>{
					genreDeleteStatus = data;
					return true;
				}).then(() =>{

					if( isMovieExists == 0 && isMovieGenreExists == 0 ){
						return reject("No Movie Data Found");
					}

					if( ( movieDeleteStatus && genreDeleteStatus) || ( isMovieExists == 0 && isMovieGenreExists == 1 && genreDeleteStatus  ) ){
						return resolve(true);
					}else{
						return reject("Something went wrong, Please try again");
					}
				}).catch( err => {
					reject( err );
					return ;
				})
			}catch( error ){
				reject( error );
				return ;
			}	
			});		
}		

	/**
	 * [update update movie data]
	 * @param  {Integer} movieId      		  		[movie id to update]
	 * @param  {request json} requestParams [movie data to update]
	 */
	update(movieId,requestParams){

		let self = this;
		let movieUpdateStatus = 0;
		let genreUpdateStatus = 0;
		return new Promise((resolve,reject)=>{
			try{
			self.exists(movieId)
				.then(()=>{
					return self.updateData(movieId,requestParams);
				}, err =>{
					throw new Error('Movie Not found');
				})
				.then(() =>{
					movieUpdateStatus  =1;
				}).then(() =>{
					return this._movieGernesModelObj.deleteData(movieId)
				}).then(()=>{
					return this._movieGernesModelObj.create(requestParams.genre, movieId)	
				}, err =>{
					throw new Error(err);
				}).then((data) =>{
					genreUpdateStatus = data;
					return true;
				}).then(() =>{
					if( ( movieUpdateStatus && genreUpdateStatus) ){
						return resolve(true);
					}else{
						return reject(false);
					}
				}).catch(err =>{
					reject(err);
					return;
				})
			}catch(error ){
				reject(error  );
				return;
			}

		});

	}

	updateData(movieId,requestParams){

		return new Promise((resolve,reject)=>{
			let updateData = {
				name : requestParams.name,
				director_name : requestParams.director,
				year : requestParams.year,
				rank : requestParams.rank
			}
			

			let whereClause = { id : movieId  }
			let updateQuery = "UPDATE movies set ? where ? ";

			mysqlService.query( updateQuery , [ updateData , whereClause ], ( error, results ) =>{

				if (error) {
					return reject([error.code , error.errno, error.sqlMessage]);
				};
				if (results.affectedRows == 1) {
					return resolve(true);
				}
			})

		});

	}

	deleteData( movieId ) {

		return new Promise((resolve, reject) => {
			let deleteRowId = movieId ;

			let deleteQuery = "delete from movies where id = ? ";
			mysqlService.query(deleteQuery, deleteRowId, (error, results) => {
			
				if (error) {
					return reject([error.code , error.errno, error.sqlMessage]);
				};
				if (results.affectedRows == 1) {
					return resolve('Movie Deleted successfully.');
				}
			});
		});

	}

	exists( movieId ) {

		return new Promise((resolve, reject) => {
			let selectQuery = "select id from movies where id= ?  ";
				mysqlService.query(selectQuery, movieId , (error, results, fields) => {
					if (error) {
						return reject([error.code , error.errno, error.sqlMessage]);
					} else if (results.length == 0) {
						return reject(false);
					} else {
						return resolve(true);
					}
				});
			});
	}

	genreExists( movieId ){

		return new Promise( (resolve, reject) => {
			let selectQuery = "select movie_id from movies_genres where movie_id = ?";
			mysqlService.query( selectQuery, movieId, ( error, results, fields ) => {
				if( error ){
					return reject([error.code,error.errno,error.sqlMessage]);
				}else if( results.length == 0 ){
					return reject(false);
				}else{
					return resolve(true);
				}
			})
		});
	}

}
module.exports = movieModel;