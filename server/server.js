const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const VocabDeck = require('./models/VocabDeck');

// connect to mongodb
mongoose.connect('mongodb+srv://jessica:Kwok2776348@cluster0.c2nld.mongodb.net/spellbee?retryWrites=true&w=majority', 
{ useNewUrlParser: true });

mongoose.connection.once('open', () => console.log('mongoDB connected'))
.on('error', () => {console.log('mongodb connection error')});

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// find and read all vocab decks
app.get('/vocabulary', (_req, res) => {
    VocabDeck.find().exec(function(err, decks) {
        if (err) {
            console.log(err);
        } 
        res.status(200).send(decks);
    })
})

// add new vocabulary deck
app.post('/vocabulary', (req, res) => {
    VocabDeck.create({
        deck: req.body.deck,
        deckImg: req.body.deckImg,
        words: req.body.words,
        id: req.body.id
    }, function(err, deck) {
        if (err) {
            console.log(err);
        } 
        res.status(200).send(deck);
    })
})

// delete specified deck
app.delete('/vocabulary', (req, res) => {
    VocabDeck.deleteOne({ id: req.body.id }, function (err) {
        if (err) {
            console.log(err);
        }
        res.status(200).send(req.body)
    })
})

// update specified deck
app.put('/vocabulary', (req, res) => {
    VocabDeck.updateOne({ deck: req.body.deck }, {deckImg: req.body.deckImg }, { words: req.body.words } , function(err) {
        if (err) {
            console.log(err);
        }
    })
    res.status(200).send(req.body);
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})