// server.js (backend)
const express = require('express');
const twilio = require('twilio');
const app = express();

app.use(express.json());

app.post('/api/send-sms', async (req, res) => {
    const { to, message } = req.body;

    const client = twilio('YOUR_TWILIO_SID', 'YOUR_TWILIO_AUTH_TOKEN');
    try {
        await client.messages.create({
            body: message,
            from: '+1234567890', // Your Twilio number
            to: to
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('SMS server running on port 3000'));
