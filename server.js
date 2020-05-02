let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let uuid = require("uuid");
let { Posts } = require("./postModel");
const mongoose = require('mongoose');

let app = express();
let jsonParser = bodyParser.json();

const apiKey = "2abbf7c3-245b-404f-9473-ade729ed4653";

app.use( express.static("public") );

app.use( morgan("dev") );

function validateKey( req , res, next){
	if ( !req.headers.authorization ){
		res.statusMessage = "Unauthorized request. Please send the API key";
		return res.status(401).end();
	}

	if ( req.headers.authorization !== `Bearer ${apiKey}` ){
		res.statusMessage = "Unauthorized request. Invalid Key";
		return res.status(401).end();
	}
	
	next();
}

app.use( validateKey );

let post = [{
				id: uuid.v4(),
				title: "FirstPost",
				description: "This is the first post of the page",
				url: "firstpost.com",
				rating: 3
			},
			{
				id: uuid.v4(),
				title: "SecondPost",
				description: "This is the second post of the page",
				url: "secodpost.com",
				rating: 4
			}
			];
			

app.get("/bookmarks", (req,res,next) => {
	console.log("Getting all posts");
	
	Posts
		.getAllPosts()
		.then( result => {
			return res.status(200).json( result );
		});
});

app.get("/bookmark", (req,res,next) => {
	let a = req.query.title;
	
	if(!a) {
		res.statusMessage = "Missing title field in params";
		return res.status(406).json({message : "Missing title field in params", status : 406});
	}
	
	
	Posts
		.getPostsBy( a )
		.then( result => {
			return res.status(201).json( result );
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB. Try again later";
			return res.status(500).end();
		});
	

});

app.post("/bookmarks", jsonParser, (req,res,next) => {
	let title = req.body.title;
	let	desc = req.body.description;
	let	u = req.body.url;
	let	rating = req.body.rating;
	
	if (!title || !desc || !u || !rating) {
		res.statusMessage = "Missing field in body";
		return res.status(406).json({message : "Missing field in body", status : 406 });
	}
	
	let newPost = {
				id : uuid.v4(),
				title: title,
				description: desc,
				url: u,
				rating: rating
	};
	
	Posts
		.createPost( newPost )
		.then( result => {
			return res.status(201).json( result );
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB. Try again later";
			return res.status(500).end();
		});
});

app.delete("/bookmark/:id", (req, res, next) => {
	let reqID = req.params.id;
	
	Posts
		.deletePost( reqID )
		.then( result => {
			return res.status(201).json( result );
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB. Try again later";
			return res.status(500).end();
		});
});

app.patch("/bookmark/:id", jsonParser, (req,res,next) => {
	let rId = req.params.id;
	let brId = req.body.id;
	
	if( !brId) {
		res.statusMessage = "Missing ID in body";
		return res.status(406).json({message : "Missing ID in body", status : 406});
	}
	
	if ( rId !== brId) {
		res.statusMessage = "The id sent in the params doesn't match the body id";
		return res.status(409).json({message : "The id sent in the params doesn't match the body id", status : 409});
	}
	
	Posts
		.modifyPost( rId, req.body )
		.then( result => {
			return res.status(202).json( result );
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB. Try again later";
			return res.status(500).end();
		});
	
});

app.listen( "8080", () => {
	console.log("App is running on port 8080");
	
	new Promise( (resolve, reject) => {
		mongoose.connect( 'mongodb://localhost/bookmarksdb', { useNewUrlParser: true, useUnifiedTopology: true }, ( err ) => { 
			if( err ){
				reject( err );
			}
			else{
				console.log("bookmarksdb connected successfully");
				return resolve();
			}
		})
	})
	.catch( err => {
		mongoose.disconnect();
		console.log( err );
	})
	
});
