const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function addPostFech( t, d, u, r ){
    let url = '/bookmarks';

    let data = {
        title : t,
        description : d,
		url : u,
		rating : Number(r)
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
			results.innerHTML = "request successful";
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchBookmarks(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let bkm = document.querySelector( '.listB' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            bkm.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
				bkm.innerHTML += `<div> ${JSON.stringify(responseJSON[i],null,' ')} </div>`;
            }
        })
        .catch( err => {
            bkm.innerHTML = `<div> ${err.message} </div>`;
        });
    
}

function deletePostFech( d ){
    let url = '/bookmark/' + `${d}`;

    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
			results.innerHTML = "request successful";
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function updatePostFech( id, ndata ){
    let url = '/bookmark/' + `${id}`;


    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( ndata )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
			results.innerHTML = "request successful";
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getPostFech( t ){
    let url = '/bookmark?title=' + `${t}`;


    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
        },
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = JSON.stringify(responseJSON);
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchAddPostForm(){
    let postForm = document.querySelector( '.add-post-form' );

    postForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let tA = document.getElementById( 'titleAD' ).value;
        let dA = document.getElementById( 'descriptionAD' ).value;
		let uA = document.getElementById( 'urlAD' ).value;
		let rA = document.getElementById( 'ratingAD' ).value;

        addPostFech( tA, dA, uA, rA );
    });
}

function watchDeletePostForm(){
    let postForm = document.querySelector( '.delete-post-form' );

    postForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let del = document.getElementById( 'idDel' ).value;

		deletePostFech( del );
    });
}

function watchUpdatePostForm(){
    let postForm = document.querySelector( '.update-post-form' );

    postForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
		
		let idVal = document.getElementById( 'updateID' ).value;
		
		let tU = document.getElementById( 'titleUP' ).value;
        let dU = document.getElementById( 'descriptionUP' ).value;
		let uU = document.getElementById( 'urlUP' ).value;
		let rU = document.getElementById( 'ratingUP' ).value;
		
		let valUp = {
			id : idVal,
			title : tU,
			description : dU,
			url : uU,
			rating : rU
		}
		
		if (tU == ""){
			delete valUp.title;
		}
		if (dU == ""){
			delete valUp.description;
		}
		if (uU == ""){
			delete valUp.url;
		}
		if (rU == ""){
			delete valUp.rating;
		}

		updatePostFech( idVal, valUp );
    });
}

function watchGetPostForm(){
    let postForm = document.querySelector( '.getBytitle-post-form' );

    postForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let gt = document.getElementById( 'titleGet' ).value;

		getPostFech( gt );
    });
}


function init(){
    fetchBookmarks();
    watchAddPostForm();
	watchDeletePostForm();
	watchUpdatePostForm();
	watchGetPostForm();
}

init();