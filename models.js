import mongoose from 'mongoose';

const models = {}

console.log("Trying to connect to MongoDB");

await mongoose.connect(process.env.MONGODB_URI)

console.log("Connected to MongoDB");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    createdCrosswords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crossword' }],
    savedCrosswords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crossword' }],
})

models.User = mongoose.model('Users', userSchema)

const crosswordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creator: {
        name: { type: String, required: true },
        webUrl: { type: String }
    },
    date: { type: Date, default: Date.now },
    webPublicationDate: { type: Date, default: Date.now },
    entries: [{
        id: String,
        number: Number,
        humanNumber: String,
        clue: String,
        direction: String,
        length: Number,
        group: [String],
        position: {
            x: Number,
            y: Number
        },
        separatorLocations: { type: Map, of: Object },
        solution: String
    }],
    solutionAvailable: { type: Boolean, default: true },
    dateSolutionAvailable: { type: Date, default: Date.now },
    dimensions: {
        cols: { type: Number, required: true },
        rows: { type: Number, required: true }
    },
    crosswordType: { type: String, default: 'quick' },
    pdf: { type: String },
    isPublic: { type: Boolean, default: false }
})

models.Crossword = mongoose.model('Crossword', crosswordSchema)

console.log("Models created");

export default models;