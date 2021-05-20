
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash")
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Remote MongoDB
// mongoose.connect('mongodb+srv://admin:admin123@cluster0.b1201.mongodb.net/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Local mongoDB
mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})


const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


//*******************Request to all articles*********************** */

app.route("/articles")
    .get((req, res) => {

        Article.find(function (err, foundArticles) {
            if (!err) {
                // res.render("articles", { postsAll: foundArticles });
                res.send(foundArticles)
            } else {
                console.log(err);
            }
        });

    })
    .post((req, res) => {

        console.log(req.body.title)
        console.log(req.body.content);

        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });


        article.save(function (err) {
            if (!err) {
                res.redirect("/articles");
            } else {
                console.log(err);
            }
        });

    })
    .delete((req, res) => {

        Article.deleteMany(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Succesfully deleted the document")
                res.redirect("/articles");

            }
        });

    });

//*****************Request to specifik article************************ */

app.route("/articles/:articleTitle")

    .get((req, res) => {

        Article.findOne({ title: req.params.articleTitle }, function (err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                res.send(foundPost);

            }
        });
    })

    //Update article by title
    .put((req, res) => {

        console.log(req.params.articleTitle, req.body.title, req.body.content)
        Article.updateOne(
            { title: req.params.articleTitle },
            {
                title: req.body.title,
                content: req.body.content
            },
            function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send("done");
                }
            })
    })

    //Update title or content by request
    .patch((req, res) => {

        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send("done");
                }
            })
    }
    )

    .delete((req, res) => {

        Article.deleteOne({ title: req.params.articleTitle }, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send("done");
            }
        });

    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on ${PORT}`));