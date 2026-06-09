# WhatsApp AI Chat Assistant

A simple WhatsApp AI assistant built with Node.js, Express, Twilio WhatsApp, and OpenAI.

## Features

- Receives WhatsApp messages via Twilio webhook
- Uses OpenAI to generate AI responses
- Sends replies back through Twilio WhatsApp

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:

```bash
npm install
```

3. Configure your environment values:

```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

4. Expose your local server with a public URL (for example, using `ngrok`) and configure the Twilio WhatsApp webhook to point to:

```
https://your-public-url/whatsapp
```

5. Start the app:

```bash
npm start
```

## Deploy on Render

You can deploy this app to Render using `render.yaml` in the repository.

1. Connect your GitHub repository to Render.
2. Render will detect the `render.yaml` file and configure a Node web service.
3. Add the required environment variables in the Render dashboard:

```text
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER
OPENAI_API_KEY
```

4. Set the Twilio webhook to the Render service URL:

```
https://<your-render-service>.onrender.com/whatsapp
```

## Notes

- Replace `gpt-4o-mini` with another OpenAI model if needed.
- If you are not using Twilio, adapt the webhook and send-message logic for your WhatsApp provider.
