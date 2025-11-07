// Import required packages
const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config(); // Loads .env file variables
const cors = require('cors');

// --- Configuration ---

// Setup OpenAI Client with API key from .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Define the port the server will run on
const PORT = 5000;

// --- API Endpoint ---

/**
 * Main API endpoint for generating AI content.
 */
app.post('/api/generate', async (req, res) => {
    
    try {
        // Get the prompt from the request body
        const { userPrompt } = req.body; 

        // Define the AI's role 
       const systemPrompt = `
                            You are an expert LinkedIn copywriter and social media strategist. 
                            Your tone is professional, insightful, and engaging.
                            Your task is to write a LinkedIn post based on the topic the user provides.

                            Follow these rules strictly:
                            1.  **Start with a strong hook** to grab attention.
                            2.  Keep the post concise and easy to read (around 100-150 words).
                            3.  Use 1-2 relevant emojis to add visual appeal.
                            4.  End the post with 3-5 relevant hashtags.
                            5.  Write the post in the **same language** as the user's topic.
                            `;
        // Call the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
        });

        // Get the AI's response text
        const aiResponse = completion.choices[0].message.content;

        // Send the response back to the client
        res.json({ 
            message: aiResponse 
        });

    } catch (error) {
        // Error handling
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ 
            error: "Something went wrong on the server. Please try again." 
        });
    }
});

// --- Start Server ---

// Start the server and listen for requests
app.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
});