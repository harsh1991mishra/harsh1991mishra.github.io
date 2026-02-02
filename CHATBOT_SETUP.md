# HarsH AI Chatbot Setup Guide

Your website now includes an interactive AI chatbot powered by modern language models. Follow this guide to set it up with your preferred AI provider.

## 🚀 Quick Start

1. **Open your website** locally or live at `https://harsh1991mishra.github.io`
2. Look for the **chatbot widget** in the bottom-right corner
3. Click **⚙️ Setup API** to configure your AI provider
4. Enter your API key and save
5. Start chatting!

---

## 📋 Supported AI Providers

### Option 1: OpenAI (Recommended) 🤖
**Best for:** GPT-4, GPT-3.5-turbo, advanced reasoning

**Setup:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key and paste it in the chatbot setup modal
5. Select "OpenAI" as the provider

**Pricing:** Free trial credits available; then pay-as-you-go (~$0.002-0.015 per message)

**Pro Tips:**
- Start with a free trial account to test
- Monitor usage in your OpenAI dashboard
- Set spending limits in your account settings

---

### Option 2: Hugging Face (Free Tier) 🤗
**Best for:** Free usage, no credit card required

**Setup:**
1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Sign up or log in
3. Create a new token (read access)
4. Copy the token and paste it in the chatbot setup modal
5. Select "Hugging Face" as the provider

**Pricing:** Free tier available; paid inference for higher usage

**Pro Tips:**
- Uses Mistral-7B open-source model
- No API costs, rate-limited for free tier
- Great for personal websites and low-traffic scenarios

---

### Option 3: Custom API Endpoint
**Best for:** Self-hosted models, enterprise APIs, Azure OpenAI

**Setup:**
1. Prepare your API endpoint (must support chat completions format)
2. Get your API key/token
3. In chatbot setup, select "Custom Endpoint"
4. Enter your endpoint URL (e.g., `https://your-api.com/v1/chat/completions`)
5. Paste your API key

**Expected Response Format:**
```json
{
  "response": "AI response text here"
}
```

---

## 🔒 Security Notes

✅ **Your API key is:**
- Stored locally in your browser's `localStorage`
- Only sent to your chosen AI provider
- Never stored on GitHub Pages servers
- Never transmitted to any third party

⚠️ **Important:**
- Your API key is visible in browser localStorage
- For public websites, consider using a backend proxy
- Never commit API keys to GitHub
- Rotate keys periodically for security

---

## 🎨 Customization

### Change the System Prompt
Edit `chatbot.js` to customize the AI's personality:

```javascript
getDefaultSystemPrompt() {
  return `You are HarsH, an AI assistant...
    // Edit this text to customize the chatbot's behavior
  `;
}
```

### Modify Colors & Styling
Edit the CSS in `index.html` under `/* Chatbot Styles */`:

```css
.chatbot-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  /* Modify colors to match your theme */
}
```

### Change Model
In the setup modal or by editing `chatbot.js`:

```javascript
model: 'gpt-4', // Change from gpt-3.5-turbo to gpt-4 (OpenAI)
```

---

## 🐛 Troubleshooting

### "Invalid API Key"
- Verify your key is correct (copy-paste carefully)
- Check you haven't exceeded API quota
- Ensure the key has permission for chat completions

### "No response from AI"
- Check your internet connection
- Verify the API provider is online
- Check browser console for CORS errors
- Some APIs may have rate limits

### Chatbot doesn't appear
- Clear browser cache: `Ctrl+Shift+Delete`
- Check that `chatbot.js` is in the root directory
- Open browser console for JavaScript errors

### CORS Errors
- This usually means the API provider is blocking requests
- For self-hosted APIs, ensure CORS headers are configured
- Some providers may require a backend proxy

---

## 📊 Usage Tips

- **Context Awareness:** The chatbot remembers the last 10 messages in your conversation
- **Responsive:** Mobile-friendly interface with full-screen chat on small devices
- **Dark Mode:** Chatbot automatically adapts to your site's dark mode
- **Error Handling:** Clear error messages if something goes wrong

---

## 🚀 Deployment Checklist

Before deploying:

- [ ] API key is configured in your local browser
- [ ] Chatbot appears in bottom-right corner
- [ ] You can send and receive messages
- [ ] Chatbot works in dark mode
- [ ] Mobile responsive (test on phone)
- [ ] API costs are within budget

**Deploy to GitHub Pages:**
```bash
git add .
git commit -m "Add AI chatbot to website"
git push origin main
```

---

## 💡 Performance Optimization

### For Large Traffic Sites:
1. Use a backend proxy to manage API keys
2. Implement rate limiting
3. Cache common responses
4. Consider using a lighter model (Mistral vs GPT-4)

### Code Size:
- Chatbot JS: ~15KB
- CSS styling: ~8KB
- Total: ~23KB additional load

---

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs/api-reference/chat/create)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [Chat Completions Format](https://platform.openai.com/docs/guides/gpt/chat-completions-api)

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error details
3. Verify API provider documentation
4. Contact Harsh for website-specific issues

---

**Built with ❤️ for harsh1991mishra.github.io**

Happy chatting! 🚀
