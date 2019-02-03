/**
 * [movieModelClass Class for DB movie table]
 * @type {[type]}
 */
const movieModelClass = require('../models/movieModel');

class movieController {
	
	constructor() {
		this._movieModelObj = new movieModelClass();
	}
	

	/**
	 * [create Create new Movie]
	 * @param  {Json} requestParams [key value pairs with movie data]
	 * @return {[type]}             [success or error message]
	 */
	create( requestParams ){
		return new Promise((resolve,reject)=>{
			this._movieModelObj.create( requestParams )
			.then( data =>{
				return resolve("Movie Created successfully");
			},err => {
				return reject(err);
			})
			.catch( err => {
				return reject(err);
			})
		})
	}

	/**
	 * [updateMovie]
	 * @param  {Json} requestParams [key value pairs with movie data]
	 * @return {[type]}             [success or error message]
	 */
	update( requestParams, bodyParams ){
		return new Promise((resolve,reject)=>{
			this._movieModelObj.update( requestParams.id, bodyParams  )
			.then( data =>{
				return resolve("Movie Updated successfully");
			},err => {
				return reject(err);
			})
			.catch( err => {
				return reject(err);
			})
		})
	}

	/**
	 * [delete  Movie]
	 * @param  {Json} requestParams [movie id]
	 * @return {[type]}             [success or error message]
	 */
	delete( requestParams ){
		return new Promise((resolve,reject)=>{
			this._movieModelObj.delete( requestParams.id )
			.then( data =>{
				return resolve("Movie deleted successfully");
			},err => {
				return reject(err);
			})
			.catch( err => {
				return reject(err);
			})


		})
	}
}

module.exports = movieController;