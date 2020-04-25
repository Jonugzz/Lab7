let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let uuid = require("uuid");

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
	return res.status(200).json(post);
});

app.get("/bookmark", (req,res,next) => {
	let a = req.query.title;
	
	if(!a) {
		res.statusMessage = "Missing title field in params";
		return res.status(406).json({message : "Missing title field in params", status : 406});
	}
	
	for (let i = 0; i < post.length; i++) {
		if (a == post[i].title){
			return res.status(200).json({message : "Post found", status : 200, post : post[i] });
		}
	}
	
	res.statusMessage = "Title not found in the list.";

	return res.status( 404 ).json({
		message : "Title not found in the list.",
		status : 404
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
				desc: desc,
				url: u,
				rating: rating
	};
	
	post.push(newPost);
	
	return res.status(201).json({message : "Post added", status : 201, post : newPost });
});

app.delete("/bookmark/:id", (req, res, next) => {
	let reqID = req.params.id;
	
	for (let i = 0; i < post.length; i++) {
		if (reqID == post[i].id){
			return res.status(200).json({message : "Post deleted", status : 200 });
		}
	}
	
	res.statusMessage = "ID not found in the list.";

	return res.status( 404 ).json({
		message : "Post not found",
		status : 404
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
	
	for (let i = 0; i < post.length; i++) {
		if (rId == post[i].id){
			let upd = post[i];
			let keys = Object.keys(req.body);
			keys.forEach(key => {
				upd[key] = req.body[key];
			});
			post[i] = upd;
			return res.status(202).json({message : "Post updated", status : 202, post : upd });
		}
	}
	
	res.statusMessage = "ID not found in the list.";

	return res.status( 404 ).json({
		message : "Post not found",
		status : 404
	});	
});

app.listen( "8080", () => {
	console.log("App is running on port 8080");
});