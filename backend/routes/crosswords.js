import express from 'express'
const router = express.Router()
import { generateLayout } from 'crossword-layout-generator';

router.post('/create', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            console.log("Session:", req.session);
            res.status(401).json({status: "error", error: "not logged in"})
            return
        }

        const crosswordInput = req.body.data.words
        const crosswordTitle = req.body.data.title
        
        const formattedCrosswordInput = crosswordInput.map(item => {
            console.log(item)
            return {"clue": item.definition, "answer": item.term}
        })
        
        const crosswordLayout = generateLayout(formattedCrosswordInput);

        const crosswordEntries = crosswordLayout.result.filter(word => {
            return word.orientation !== 'none'
        })

        const filteredEntries = crosswordLayout.result.filter(word => {
            return word.orientation == 'none'
        }).map(word => {
            return word.answer
        })

        if(crosswordLayout.result.length == filteredEntries.length) {
            res.status(401).json({status: "error", error: "all words were filtered"})
            return
        }

        const username = req.session.account.username
        const user = await req.models.User.findOne({username}) ; 
        const number = (user?.createdCrosswords?.length || 0) + 1;
        
        const entries = crosswordEntries.map((item) => {
            return {
                id: `${item.position}-${item.orientation}`,
                number: item.position,
                humanNumber: String(item.position),
                clue: item.clue,
                direction: item.orientation,
                length: item.answer.length,
                group: [`${item.position}-${item.orientation}`],
                position: {x: item.startx - 1, y: item.starty - 1},
                separatorLocations: {},
                solution: item.answer.toUpperCase()
            }
        })
        
        const crosswordData = {
            id: null,
            number: number,
            name: crosswordTitle,
            creator: {
                name: username,
                webUrl: null
            },
            date: Date.now(),
            webPublicationDate: Date.now(),
            entries: entries,
            solutionAvailable: true,
            dateSolutionAvailable: Date.now(),
            dimensions: {
                cols: crosswordLayout.cols,
                rows: crosswordLayout.rows,
            },
            crosswordType: 'quick',
            pdf: null,
            filteredEntries: filteredEntries
        }

        const newCrossword = new req.models.Crossword({
            name: crosswordTitle,
            creator: {
                name: username,
                webUrl: null
            },
            date: Date.now(),
            webPublicationDate: Date.now(),
            entries: entries,
            solutionAvailable: true,
            dateSolutionAvailable: Date.now(),
            dimensions: {
                cols: crosswordLayout.cols,
                rows: crosswordLayout.rows
            },
            crosswordType: 'quick',
            pdf: null,
            isPublic: false
        });

        await newCrossword.save();

        await req.models.User.findOneAndUpdate(
            { username: username },
            { $push: { createdCrosswords: newCrossword._id } }
        );

        crosswordData.id = newCrossword._id;
        
        console.log(crosswordData.filteredEntries);
        res.status(200).json(crosswordData);
    } catch(err) {
        console.log("Error: ", err);
        res.status(500).json({status: "error", error: "error"})
    }
});

router.get('/', async (req, res) => {
    try {
        const crosswords = await req.models.Crossword.find({ isPublic: true });
        res.status(200).json(crosswords);
    } catch(err) {
        console.log("Error fetching crosswords:", err);
        res.status(500).json({status: "error", error: "error fetching crosswords"});
    }
});

router.get('/created/:username', async (req, res) => {
    try {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({status: "error", error: "username parameter required"});
        }

        const user = await req.models.User.findOne({'username': username});

        if (!user) {
            return res.status(200).json([]);
        }

        const crosswords = await req.models.Crossword.find({
            _id: { $in: user.createdCrosswords }
        }).sort({ date: -1 });

        const data = crosswords.map(item => {
            return {
                title: item.name,
                created_date: item.date,
                _id: item._id,
                isPublic: item.isPublic,
                creator: item.creator.name
            }
        });

        res.status(200).json(data);
    } catch(err) {
        console.log(err);
        res.status(500).json({status: "error", error: "error in /created"});
    }
});

router.get('/saved/:username', async (req, res) => {
    try {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({status: "error", error: "username parameter required"});
        }

        const user = await req.models.User.findOne({'username': username});

        if (!user) {
            return res.status(200).json([]);
        }

        const crosswords = await req.models.Crossword.find({
            _id: { $in: user.savedCrosswords }
        }).sort({ date: -1 });

        const data = crosswords.map(item => {
            return {
                title: item.name,
                created_date: item.date,
                _id: item._id,
                isPublic: item.isPublic,
                creator: item.creator.name
            }
        });

        res.status(200).json(data);
    } catch(err) {
        console.log(err);
        res.status(500).json({status: "error", error: "error in /saved"});
    }
});

router.get('/search/:search', async(req, res) => {
    console.log("im in search", req.params.search);
    try {
        const search = req.params.search;
        console.log(search);
        const crosswords = await req.models.Crossword.find({name: { $regex: search, $options: 'i' }}).sort({ date: -1 });;

        if (!crosswords) {
            return res.status(200).json([]);
        }

        const data = crosswords.map(item => {
            return {
                title: item.name,
                created_date: item.date,
                _id: item._id,
                creator: item.creator.name
            }
        });

        res.status(200).json(data);
    } catch(err) {
        console.log("Error in /search:", err);
        res.status(500).json({status: "error", error: "error searching crossword"});
    }
})

router.get('/:id', async (req, res) => {
    try {
        const crossword = await req.models.Crossword.findById(req.params.id);
        if (!crossword) {
            res.status(404).json({status: "error", error: "crossword not found"});
            return;
        }
        res.status(200).json(crossword);
    } catch(err) {
        console.log("Error fetching crossword:", err);
        res.status(500).json({status: "error", error: "error fetching crossword"});
    }
});

// DELETE /crosswords/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const user = req.session.account?.username;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: No session user' });
    }

    try {
        const crossword = await req.models.Crossword.findById(id);
        if (!crossword) {
            return res.status(404).json({ message: 'Crossword not found' });
        }

        if (crossword.creator.name !== user) {
            return res.status(403).json({ message: 'Forbidden: You do not own this crossword' });
        }

        await req.models.Crossword.findByIdAndDelete(id);

        await req.models.User.updateOne(
            { username: user },
            { $pull: { createdCrosswords: id } }
        );

        res.status(200).json({ message: 'Crossword deleted successfully' });
    } catch (err) {
        console.error('Error deleting crossword:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router
