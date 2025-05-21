import express from 'express'
const router = express.Router()
import { generateLayout } from 'crossword-layout-generator';

//TODO: Fix potential bugs/edge cases
router.post('/create', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            console.log("Session:", req.session);
            res.status(401).json({status: "error", error: "not logged in"})
            return
        }
        //Inputted information from user
        const crosswordInput = req.body.data.words
        const crosswordTitle = req.body.data.title
        
        //Formats data to match backend package
        const formattedCrosswordInput = crosswordInput.map(item => {
            return {"clue": item.definition, "answer": item.term}
        })
        
        //Generates a crossword layout using backend package
        const crosswordLayout = generateLayout(formattedCrosswordInput);
        
        const username = req.session.account.username
        const user = await req.models.User.findOne({username}); 
        const number = (user?.createdCrosswords?.length || 0) + 1;
        
        //Creates a formatted data prop for front end 
        const entries = crosswordLayout.result.map((item) => {
        return {
                id: `${item.position}-${item.orientation}`,
                number: item.position,
                humanNumber: String(item.position),
                clue: item.clue.toUpperCase(),
                direction: item.orientation,
                length: item.answer.length,
                group: [`${item.position}-${item.orientation}`],
                position: {x: item.startx, y: item.starty},
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
            entries,
            solutionAvailable: true,
            dateSolutionAvailable: Date.now(),
            dimensions: {
                cols: crosswordLayout.cols,
                rows: crosswordLayout.rows
            },
            crosswordType: 'quick',
            pdf: null,
    }

    //TODO: Save to MongoDB here or in seperate function
    //Include username, title, created_date, and layout (which is crosswordData)
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
    
    //Sends data to use as prop for front end
    res.status(200).json(crosswordData);
    } catch(err) {
        console.log("Error: ", err);
        res.status(500).json({status: "error", error: "error"})
    }
});


export default router
