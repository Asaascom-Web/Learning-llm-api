# AI Chat Application - Educational Project

A beautiful, GitHub-inspired AI chat application built with HTML, CSS, and JavaScript. Perfect for teaching students about LLM API integration!

## 🌟 Features

- **Modern GitHub-inspired UI** with dark theme
- **Glowing effects** and animated particles background
- **Free LLM API integration** (multiple options provided)
- **Responsive design** optimized for programmers
- **Real-time chat interface**
- **Syntax highlighting** for code blocks
- **Clean, well-commented code** for educational purposes

## 🚀 Getting Started

### Option 1: Groq API (Recommended - Fast & Free)

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy your API key
6. Open `script.js` and replace `'YOUR_API_KEY_HERE'` with your key

**Benefits:**
- Very fast inference
- Generous free tier
- Multiple models available (Llama 3, Mixtral, etc.)
- No credit card required

### Option 2: Hugging Face Inference API

1. Visit [Hugging Face](https://huggingface.co/)
2. Create a free account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy your token
6. In `script.js`, update the API configuration to use Hugging Face

**Benefits:**
- Thousands of models available
- Free tier available
- Great for experimentation

### Option 3: OpenRouter (Multiple Models)

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for free
3. Get your API key from the dashboard
4. Some models are completely free

## 📁 Project Structure

```
AI/
├── index.html          # Main HTML structure
├── styles.css          # GitHub-inspired styling
├── script.js           # Chat logic and API integration
├── particles.js        # Particle animation system
└── README.md           # This file
```

## 🎯 How It Works

### 1. **Frontend (HTML)**
- Simple, semantic HTML structure
- Chat container with message display area
- Input field for user messages
- Settings panel for API configuration

### 2. **Styling (CSS)**
- GitHub-inspired color scheme
- Glowing effects using CSS filters and animations
- Smooth transitions and hover effects
- Particle canvas background

### 3. **Chat Logic (JavaScript)**
- Captures user input
- Sends requests to LLM API
- Displays responses in real-time
- Handles errors gracefully

### 4. **API Integration**
The application uses the Fetch API to communicate with LLM services:

```javascript
// Basic structure
fetch(API_ENDPOINT, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: chatHistory,
    model: selectedModel
  })
})
```

## 🎓 Teaching Points

### For Students:

1. **API Basics**: Learn how to make HTTP requests to external services
2. **Async/Await**: Understanding asynchronous JavaScript
3. **DOM Manipulation**: Dynamically updating the page
4. **Event Handling**: Responding to user interactions
5. **Error Handling**: Managing API failures gracefully
6. **CSS Animations**: Creating engaging visual effects
7. **Canvas API**: Drawing particle animations

## 🔧 Configuration

You can easily switch between different APIs by modifying the configuration in `script.js`:

```javascript
const CONFIG = {
  API_KEY: 'your-api-key-here',
  API_ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
  MODEL: 'llama-3.1-8b-instant'
};
```

## 🎨 Customization

- **Colors**: Modify CSS variables in `styles.css`
- **Particles**: Adjust particle count and behavior in `particles.js`
- **Models**: Change the LLM model in `script.js`
- **UI Layout**: Modify HTML structure in `index.html`

## 🌐 Running the Application

1. Simply open `index.html` in a modern web browser
2. No build process or server required!
3. Enter your API key in the settings
4. Start chatting!

## 📝 Important Notes

- **API Keys**: Never commit API keys to version control
- **Rate Limits**: Free tiers have usage limits
- **CORS**: Some APIs may require a backend proxy for production
- **Security**: In production, API calls should go through your backend

## 🆘 Troubleshooting

- **CORS Errors**: Try a different API or set up a simple backend proxy
- **API Key Invalid**: Double-check your key and ensure it's active
- **No Response**: Check browser console for error messages
- **Slow Responses**: Try a different model or API provider

## 📚 Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Hugging Face API Docs](https://huggingface.co/docs/api-inference)
- [MDN Web Docs](https://developer.mozilla.org/)
- [OpenRouter Docs](https://openrouter.ai/docs)

## 🤝 Contributing

This is an educational project! Feel free to:
- Experiment with different APIs
- Improve the UI/UX
- Add new features (voice input, file uploads, etc.)
- Optimize the code

## 📄 License

This project is free to use for educational purposes.

---

**Happy Learning! 🚀**

