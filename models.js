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
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    grid: { type: Array, required: true },
    clues: { type: Array, required: true },
    solutions: { type: Array, required: true },
    isPublic: { type: Boolean, default: false }
})

models.Crossword = mongoose.model('Crossword', crosswordSchema)

console.log("Models created");

export default models;