# Matrix Terminal Chat Interface

A Matrix movie-inspired terminal chat interface that connects to your n8n chatbot workflow via secure webhook integration.

## 🎯 Features

- **Matrix-style Terminal UI** with falling text background animation
- **Real-time Chat Interface** with typing animations and message persistence
- **n8n Webhook Integration** with secure environment variable handling
- **Responsive Design** that works on desktop and mobile
- **Clean Sessions** - starts fresh each time you open the interface

## 🚀 Live Demo

Visit the deployed application: [https://claude-code-test-gamma.vercel.app](https://claude-code-test-gamma.vercel.app)

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Vercel Serverless Functions (Node.js)
- **Deployment**: Vercel
- **Version Control**: Git/GitHub
- **Integration**: n8n Webhooks

## 📦 Project Structure

```
├── api/
│   └── config.js          # Vercel serverless function for configuration
├── index.html             # Main HTML structure
├── script.js              # Chat functionality and Matrix effects
├── styles.css             # Matrix-themed styling
├── vercel.json            # Vercel deployment configuration
├── .gitignore             # Git ignore rules
├── CLAUDE.md              # Claude Code project instructions
└── README.md              # Project documentation
```

## 🔧 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cth9191/claude-code-test.git
   cd claude-code-test
   ```

2. **Start a local server**:
   ```bash
   # Using Python (if available)
   python3 -m http.server 8000

   # Using Node.js (if available)
   npx serve .

   # Using any other local server
   ```

3. **Open your browser**:
   Navigate to `http://localhost:8000`

**Note**: In local development, the webhook URL is hardcoded as a fallback. In production, it's loaded securely from environment variables.

## 🌐 Deployment

### Automatic Deployment
This project is set up for automatic deployment to Vercel whenever you push to the `master` branch.

### Manual Deployment
If you want to deploy to your own Vercel account:

1. **Fork this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository

3. **Set Environment Variables**:
   In your Vercel dashboard, add:
   - `N8N_WEBHOOK_URL` = `your_n8n_webhook_url`

4. **Deploy**: Vercel will automatically build and deploy your application

## 🔐 Security

- **No Exposed Secrets**: Webhook URLs are stored as encrypted environment variables
- **Secure API**: Configuration is served via Vercel serverless functions
- **CORS Enabled**: Proper cross-origin handling for API requests
- **Production Ready**: Different configurations for local vs production environments

## 🔗 n8n Integration

This chat interface expects n8n webhook responses in the following JSON format:

```json
[
  {
    "text": "Your bot response message here"
  }
]
```

### Setting up n8n:
1. Create a webhook node in your n8n workflow
2. Set the webhook method to `GET`
3. Configure your workflow to return responses in the expected format
4. Use the webhook URL as the `N8N_WEBHOOK_URL` environment variable

## 🎨 Customization

### Colors
The Matrix theme colors can be modified in `styles.css`:
```css
:root {
    --matrix-blue: #0080ff;
    --matrix-bright-blue: #00bfff;
    --matrix-dim-blue: #0066cc;
    --matrix-dark: #000011;
}
```

### Matrix Effects
- Falling text animation speed and characters can be modified in `script.js`
- Background refresh rate and column density are configurable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎬 Inspiration

Inspired by the iconic Matrix movie terminal interfaces and designed for modern web applications with secure webhook integrations.

---

**Built with ❤️ using Claude Code**