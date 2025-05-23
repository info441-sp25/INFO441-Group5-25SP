import express from 'express'
const router = express.Router()
import { generateLayout } from 'crossword-layout-generator';

router.post('/create', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            res.status(401).json({status: "error", error: "not logged in"})
            return
        }

        const crosswordInput = req.body.data.words
        const crosswordTitle = req.body.data.title
        
        const formattedCrosswordInput = crosswordInput.map(item => {
            return {"clue": item.definition, "answer": item.term}
        })
        
        const crosswordLayout = generateLayout(formattedCrosswordInput);
        console.log(crosswordLayout);

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


    //TODO: Save to MongoDB here or in seperate function
    //Include username, title, created_date, and layout (which is crosswordData)
    
        //send ID back
        res.status(200).json(crosswordData);
    } catch(err) {
        console.log("Error: ", err);
        res.status(500).json({status: "error", error: "error"})
    }
});


export default router
