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
            return {"clue": item.definition, "answer": item.term}
        })
        
        const crosswordLayout = generateLayout(formattedCrosswordInput);

        const crosswordEntries = crosswordLayout.result.filter(word => {
            return word.orientation !== 'none'
        })

        const username = req.session.account.username
        const user = await req.models.User.findOne({username}) ; 
        const number = (user?.createdCrosswords?.length || 0) + 1;
        
        const entries = crosswordEntries.map((item) => {
        return {
                id: `${item.position}-${item.orientation}`,
                number: item.position,
                humanNumber: String(item.position),
                clue: item.clue.toUpperCase(),
                direction: item.orientation,
                length: item.answer.length,
                group: [`${item.position}-${item.orientation}`],
                position: {x: item.startx - 1, y: item.starty - 1},
                separatorLocations: {},
                solution: item.answer.toUpperCase()
            }
        })
        
        const crosswordData = {
            id: null,//MongoDB assign on save
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

    router.get('/user', async (req, res) => {
        try {
            const username = req.query.user

            const user = await req.models.User.findOne({'username': username}).populate('savedCrosswords')

            if (!user) {
                return res.status(200).json([]);
            } else {
                const previews = user.savedCrosswords.map(item => {
                    return {
                        title: item.name,
                        created_date: item.date,
                        _id: item._id
                    }
                })
                console.log(previews);
                res.status(200).json(previews);
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({status: "error", error: "error in /user"})
        }
    })    

    router.get('/:id', async (req, res) => {
        try {
            console.log("i made it to backend: " + req.params.id)
            const crossword = await req.models.Crossword.findById(req.params.id);
            console.log("i got a crossword? " + crossword)
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

export default router
