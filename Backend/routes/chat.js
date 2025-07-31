import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIAPIResponse from '../utils/openai.js';

const router=express.Router();

//test
router.post('/test', async (req, res) => {
    try{
        const thread=new Thread({
            threadId: "xyz2",
            title: "Testing New Thread2"
        });
        const response = await thread.save();
        res.send(response);
    }catch(err){
        console.error(err);
        res.status(500).send('Failed to save in DB');
    }
});

//to display all the threads in the sidebar
//sorted by updatedAt in descending order so that the most recently updated threads appear first
router.get('/thread', async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        // Sort threads by updatedAt in descending order
        // This will ensure the most recently updated threads appear first
        res.json(threads);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch threads');
    }
})

//To display messages of a specific thread
router.get('/thread/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            return res.status(404).json({error: 'Thread not found'});
        }
        res.json(thread.messages); // Return only the messages of the thread
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to fetch thread'});
    }
})

//To delete a specific thread
router.delete('/thread/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try {
        const deleteThread= await Thread.findOneAndDelete({ threadId });

        if (!deleteThread) {
            return res.status(404).json({error: 'Thread not found'});
        }

        res.json({message: 'Thread deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to delete thread'});
    }
})

//For new message 
router.post('/chat', async (req,res)=>{
    const {threadId, message} = req.body;
    
    if(!threadId || !message){
        return res.status(400).json({error: 'Thread ID and message are required'});
    }

    try{
        let thread= await Thread.findOne({ threadId });

        if(!thread){
            //create a new thread as it doesn't exist
            thread=new Thread({
                threadId,
                title: message,
                messages: [{
                    role: 'user',
                    content: message
                }]
            });
        }else{
            //if thread exists, push the new message to the messages array
            thread.messages.push({
                role: 'user',
                content: message
            });
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({
            role: 'assistant',
            content: assistantReply
        });
        thread.updatedAt = Date.now(); // Update the updatedAt field
        await thread.save();

        res.json({reply: assistantReply});  // Return the updated thread with the new message to frontend

    }catch(err){
        console.error(err);
        return res.status(500).json({error: 'Failed to save message'});
    }
})

export default router;