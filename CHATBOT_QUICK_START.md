🚀 **QUICK START: Make Your Chatbot Work**

## ✅ What's Already Done:
- ✓ Chatbot widget added to your website (bottom-right corner)
- ✓ Setup modal integrated
- ✓ API support for OpenAI, Hugging Face, and custom endpoints
- ✓ Dark mode support
- ✓ Mobile responsive
- ✓ All files deployed

## 🔧 3 Simple Steps to Activate:

### Step 1: Open Your Website
- Local: Open `index.html` in your browser
- Live: https://harsh1991mishra.github.io

### Step 2: Click the ⚙️ Setup API Button
- Look for the chatbot widget in the **bottom-right corner**
- Click **⚙️ Setup API** in the chatbot footer
- A modal will appear

### Step 3: Add Your API Key
Choose ONE of these options:

**Option A: OpenAI (Recommended)**
1. Go to: https://platform.openai.com/api-keys
2. Create a new API key (get free trial credits)
3. Select "OpenAI" in the setup modal
4. Paste your **NEW** API key (generate fresh, don't reuse exposed ones)
5. Click "Save Configuration"
6. Start chatting!

**Option B: Hugging Face (Free)**
1. Go to: https://huggingface.co/settings/tokens
2. Create a read token
3. Select "Hugging Face" in the setup modal
4. Paste your token
5. Click "Save Configuration"

### Step 4: Test It Out
- Type a message in the chat input
- Press Enter or click the arrow button
- Wait for the AI response!

---

## 🎯 Test Messages to Try:

```
"Who is Harsh Mishra?"
"What technologies do you work with?"
"Tell me about Data Analytics"
"What AI/ML projects have you done?"
```

---

## 🐛 Troubleshooting:

**Q: Chatbot doesn't appear**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+F5)
- Check browser console (F12) for errors

**Q: Setup modal won't open**
- Make sure you have JavaScript enabled
- Try a different browser
- Check console for errors

**Q: "Invalid API Key" error**
- Verify the key is correct
- Make sure you're using a NEW key (not the exposed one)
- Check the API provider is online

**Q: No response from AI**
- Check internet connection
- Verify API key is active
- Check that you haven't exceeded API quotas
- Look at browser console (F12) for CORS errors

**Q: "Please configure your API key first"**
- Click ⚙️ Setup API
- Add your API key
- Make sure to click "Save Configuration"

---

## 💾 How It Works:

1. **API Key Storage**: Saved in your browser's `localStorage` (not sent anywhere)
2. **Messages**: Sent directly to your chosen AI provider
3. **Conversation History**: Kept for context (last 10 messages)
4. **Security**: Your data never touches GitHub or any third party

---

## 📊 Expected Behavior:

✅ **Success:**
- Chatbot appears in bottom-right
- Setup modal opens when you click ⚙️
- You can enter API key
- Messages are sent and responses appear

🔄 **Processing:**
- Send button shows "⏳" while waiting
- Typing indicator (●●●) appears while AI is thinking
- Response appears in chat bubble

❌ **Errors:**
- Clear error message appears in chat
- Try again with correct API key

---

## 🚀 Next Steps After Testing:

1. **Deploy to GitHub Pages:**
   ```bash
   git add .
   git commit -m "Activate chatbot - API key configured in browser"
   git push origin main
   ```

2. **Share Your Website:**
   - https://harsh1991mishra.github.io
   - Visitors can add their own API keys to use the chatbot

3. **Customize (Optional):**
   - Edit `chatbot.js` to change the system prompt
   - Adjust colors and styling in `index.html`
   - Modify model or temperature settings

---

## 🔐 Security Reminder:

✅ DO:
- Store API keys in browser localStorage
- Have each user enter their own key
- Use environment variables for production backends

❌ DON'T:
- Commit API keys to GitHub
- Share keys publicly
- Use the exposed key (revoke it immediately)

---

**Your chatbot is ready! 🎉**

Just add your API key through the setup modal and start chatting!
