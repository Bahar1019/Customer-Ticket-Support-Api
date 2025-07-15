const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const Ticket = require('./models/Ticket');

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const processTicket = async () => {
    console.log('Worker running: Checking for new tickets...');

    try {
        // 1. Find a 'New' ticket and atomically update its status to 'Processing'
        // This 'locks' the ticket so other workers don't pick it up.
        const ticket = await Ticket.findOneAndUpdate(
            { status: 'New' },
            { $set: { status: 'Processing' } },
            { new: true } // Return the updated document
        );

        // If no new ticket was found, just return.
        if (!ticket) {
            console.log('No new tickets to process.');
            return;
        }

        console.log(`Processing ticket: ${ticket._id}`);

        // 2. Engineer the AI Prompt
        const prompt = `
            Analyze the following support ticket and return a JSON object with two keys: "category" and "priority".

            Available categories are: "Technical Issue", "Billing Inquiry", "Account Management", "General Question".
            Available priorities are: "Low", "Medium", "High".

            Ticket Title: "${ticket.title}"
            Ticket Description: "${ticket.description}"

            Based on the content, determine the most appropriate category and priority. For example, if the user mentions they can't log in or something is broken, the priority should be High. If they have a simple question, it should be Low. Billing issues are typically Medium or High.

            Return ONLY the JSON object.
        `;

        // 3. Call the AI API
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || '';

        // 4. Parse the AI response and update the ticket
        try {
            const { category, priority } = JSON.parse(aiResponse);

            // Update the ticket with the AI's analysis and set status to 'Open'
            await Ticket.findByIdAndUpdate(ticket._id, {
                $set: {
                    category: category || 'General Question', // Fallback value
                    priority: priority || 'Medium', // Fallback value
                    status: 'Open',
                },
            });
            console.log(`Successfully triaged ticket ${ticket._id}: Category - ${category}, Priority - ${priority}`);

        } catch (parseError) {
            console.error(`Failed to parse AI response for ticket ${ticket._id}:`, parseError);
            // Revert status to 'New' so it can be picked up again
            await Ticket.findByIdAndUpdate(ticket._id, { $set: { status: 'New' } });
        }

    } catch (error) {
        console.error('Error in worker process:', error);
    }
};

module.exports = { processTicket };