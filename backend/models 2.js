import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const models = {}

console.log("Trying to connect to MongoDB");
try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    username: String,
    createdCrosswords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crossword' }],
    savedCrosswords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crossword' }],
})

models.User = mongoose.model('Users', userSchema)

const crosswordSchema = new mongoose.Schema({
    name: String,
    creator: {
        name: String,
        webUrl: String,
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
        cols: Number,
        rows: Number,
    },
    crosswordType: { type: String, default: 'quick' },
    pdf: String,
    isPublic: { type: Boolean, default: false }
})

models.Crossword = mongoose.model('Crossword', crosswordSchema)

console.log("Models created");

export default models;