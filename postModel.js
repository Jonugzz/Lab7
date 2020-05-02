const mongoose = require('mongoose');


const postCollectionSchema = mongoose.Schema({
	id : {
		type : String,
		required : true
	},
	title : {
		type : String,
		required : true
	},
	description : {
		type : String,
		required : true
	},
	url : {
		type : String,
		required : true
	},
	rating : {
		type : Number,
		required : true
	}
});

const postCollection = mongoose.model( 'posts', postCollectionSchema );

const Posts = {
	createPost : function( newPost ){
		return postCollection
				.create( newPost )
				.then( createdPost => {
					return createdPost;
				})
				.catch( err => {
					return err;
				});
	},
	getAllPosts : function(){
		return postCollection
		.find()
		.then( allPosts => {
			return allPosts;
		})
		.catch( err => {
			return err;
		});
	},
	getPostsBy : function( t ){
		return postCollection
		.find({title : t})
		.then( postsT => {
			return postsT;
		})
		.catch( err => {
			return err;
		});
	},
	modifyPost : function( v , body){
		return postCollection
		.updateOne({id : v}, {$set:body})
		.then( postUp => {
			return postUp;
		})
		.catch( err => {
			return err;
		});
	},
	deletePost : function( x ){
		return postCollection
		.remove({id : x})
		.then( res => {
			return res;
		})
		.catch( err => {
			return err;
		});
	}
}	

module.exports = { Posts };