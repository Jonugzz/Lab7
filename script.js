$(document).ready(function() {

// Start your code from here

var temas = ["dog", "cat", "frog", "lion", "tiger", "turtle", "bird"];


function popButtons(arrayT, classT, placeh){

    $(placeh).empty();

    for(var i= 0; i<temas.length; i++)
    {
        var a = $("<button>");
        a.addClass(classT);
        a.attr("data-type", arrayT[i]);
        a.text(arrayT[i]);

        $(placeh).append(a);

    }

}

$("#animal-buttons").on("click", ".animal-button", function(){
    $("#animals").empty();
    var srch = $(this).attr("data-type");
    var queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + srch + "&api_key=Too65YYZOegbvo5ie8AL6kG4Nv0WQ8G0&limit=10";

    $.ajax({url:queryUrl})
    .then(function(response){

        var results = response.data;

        for (var i = 0; i <results.length; i++) {


            var animalDiv = $("<div class=\"animal-item\">");
            var rating = results[i].rating
            var p = $("<p>").text("Rating: "+ rating)
    
            var animated = results[i].images.fixed_height.url
            var still = results[i].images.fixed_height_still.url
    
            var animalImage = $("<img>")
            animalImage.attr("src",still)
            animalImage.attr("data-still",still)
            animalImage.attr("data-animate",animated)
            animalImage.attr("data-isAnimated","false")
            animalImage.addClass("animal-image")
    
            animalDiv.append(p)
            animalDiv.append(animalImage)
    
            $("#animals").append(animalDiv)
    
        }
    });

});

$("div").on("click", ".animal-item", function(){

        var state = $(this).find("img").attr("data-isanimated");

        if(state === "false"){
            $(this).find("img").attr("src", $(this).find("img").attr("data-animate"));
            $(this).find("img").attr("data-isAnimated","true");
        }
        else{
            $(this).find("img").attr("src", $(this).find("img").attr("data-still"));
            $(this).find("img").attr("data-isAnimated","false");
        }
});

popButtons(temas, "animal-button", "#animal-buttons");

var newT = $("#animal-input");

$("#add-animal").on("click", function(event){
    event.preventDefault();
    if(newT.val() != ""){
        temas.push(newT.val());
        popButtons(temas, "animal-button", "#animal-buttons");
    }
    newT.val("");   
});


});


