var express = require("express");
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');

router.get('/', function(req,res){
    res.render('index');
})

var db = require('../models')
// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.startribune.com/sports").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $(".tease.is-split").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
        .children('h3')
        .children('a')
        .text();
        result.link = $(this)
            .children('h3')
            .children('a')
          .attr("href");

          result.imageURL = $(this)
          .children('figure')
          .children('a')
          .children('.tease-photo-img')
          .children('img')
        .attr("src");
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.redirect("/Articles");
  });
});

// Route for getting all Articles from the db
router.get("/Articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        console.log(require('util').inspect(dbArticle))
        res.render("index", {articles: dbArticle});
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


module.exports = router;