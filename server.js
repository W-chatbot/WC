import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Twilio from 'twilio';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER,
  OPENAI_API_KEY,
  PORT = 3000,
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER || !OPENAI_API_KEY) {
  console.error('Missing required environment variables. Check .env file.');
  process.exit(1);
}

const twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Generate an AI reply to the incoming WhatsApp message.
 */
async function generateReply(messageText) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a friendly AI assistant for WhatsApp users.' },
      { role: 'user', content: messageText },
    ],
    temperature: 0.8,
    max_tokens: 250,
  });

  return response.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response right now.';
}

/**
 * Webhook route for Twilio WhatsApp inbound messages.
 */
app.post('/whatsapp', async (req, res) => {
  try {
    const incomingMessage = req.body.Body;
    const fromNumber = req.body.From;

    if (!incomingMessage || !fromNumber) {
      return res.status(400).send('Missing required Twilio fields');
    }

    const aiReply = await generateReply(incomingMessage);

    await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: fromNumber,
      body: aiReply,
    });

    res.type('text/xml').send('<Response></Response>');
  } catch (error) {
    console.error('Incoming message error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('WhatsApp AI Chat Assistant is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
