const searchModel = require('../models/searchModel');

class searchController{
	constructor(){
		this._searchModelObj = new searchModel();
	}

	basicsearch( requestQuery ){

		return new Promise((resolve, reject) =>{
			this._searchModelObj.search( requestQuery, 'basic' )
			.then((data)=>{
				return resolve( data );
			}, err =>{
				return reject( err );
			}).catch( (err ) =>{
				return reject( err );
			});
		});
		
	}

	advancesearch( requestQuery ){

		return new Promise((resolve, reject) =>{
			this._searchModelObj.search( requestQuery , 'advance' )
			.then((data)=>{
				return resolve( data );
			}, err =>{
				return reject( err );
			}).catch( (err ) =>{
				return reject( err );
			});
		});
		
	}

}

module.exports = searchController;