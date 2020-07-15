const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema and model
const vocabDeckSchema = new Schema({
    deck: String,
    deckImg: String,
    words: [{word: String, id: Number, wordImg: String}]
}, { collection: 'VocabDeck' })

const VocabDeck = mongoose.model('VocabDeck', vocabDeckSchema);

module.exports = VocabDeck;