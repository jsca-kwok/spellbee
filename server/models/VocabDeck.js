const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema and model
const vocabDeckSchema = new Schema({
    deck: String,
    deckImg: String,
    id: String,
    userId: String,
    words: [{word: String, wordId: String, wordImg: String}]
}, { collection: 'VocabDeck' })

const VocabDeck = mongoose.model('VocabDeck', vocabDeckSchema);

module.exports = VocabDeck;