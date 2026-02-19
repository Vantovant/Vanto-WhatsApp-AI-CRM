# Vanto WhatsApp CRM Chrome Extension

This Chrome extension integrates your Vanto CRM directly into WhatsApp Web, allowing you to manage contacts, add notes, and track activities without leaving WhatsApp.

## 🚀 Features

- **CRM Sidebar** - Access your CRM data directly in WhatsApp Web
- **Auto Contact Detection** - Automatically detects the active chat and shows contact info
- **Quick Save** - Save WhatsApp contacts to Supabase CRM with one click
- **Lead Management** - Set lead type, temperature, and other CRM fields
- **Notes & Activity** - Add notes and track activity for each contact
- **Real-time Sync** - All data syncs to your Supabase database

## 📦 Installation

### Step 1: Prepare Icons (Optional - for better appearance)

The extension uses placeholder icons. For better appearance, replace the icon files with proper PNG images:

1. Create 3 PNG icons with sizes: 16x16, 48x48, and 128x128
2. Name them: `icon16.png`, `icon48.png`, `icon128.png`
3. Place them in the `chrome-extension` folder

Or use any online tool to generate icons from the included `icon.svg` file.

### Step 2: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `chrome-extension` folder from this project
5. The extension should now appear in your extensions list

### Step 3: Use the Extension

1. Navigate to [https://web.whatsapp.com](https://web.whatsapp.com)
2. Log in to WhatsApp Web
3. You'll see a **Vanto CRM sidebar** appear on the right side
4. Click the toggle button (≡) to expand/collapse the sidebar
5. Select any chat to see contact information
6. Fill in CRM fields and click **"Save to CRM"** to sync with Supabase

## 🎨 How It Works

### Architecture

```
WhatsApp Web
    ↓
Content Script (content.js)
    ↓ Extracts contact info
Sidebar UI (styles.css)
    ↓ User fills CRM data
Background Script (background.js)
    ↓ API calls
Supabase Database
```

### Key Components

1. **content.js** - Injects the sidebar into WhatsApp Web and monitors active chats
2. **background.js** - Handles Supabase API calls (save/fetch contacts)
3. **styles.css** - Beautiful dark-themed UI for the sidebar
4. **popup.html** - Extension popup when clicking the icon

## 🔧 Configuration

The extension is pre-configured with your Supabase credentials:
- **URL**: `https://nvifliqfgtxqmnkfkhhi.supabase.co`
- **API Key**: Already set in `background.js`

To change these, edit the constants in `background.js`:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

## 📝 Features Breakdown

### Contact Tab
- Displays active WhatsApp contact name and phone
- Lead Type selector (Prospect, Registered, Purchase, etc.)
- Temperature selector (Hot, Warm, Cold)
- Email input field
- Save to CRM button

### Notes Tab
- Add notes about the contact
- View all previous notes
- Timestamps for each note

### Activity Tab
- Track all interactions
- View activity history
- Automatic logging

## ⚠️ Important Notes

### Terms of Service
- This extension is for **personal/testing use only**
- WhatsApp's Terms of Service may prohibit automated data extraction
- For production use, consider using the official WhatsApp Business API

### Limitations
- Only works on WhatsApp Web (not mobile app)
- May break if WhatsApp updates their UI
- Contact detection relies on WhatsApp's DOM structure

### Privacy
- All data is stored in YOUR Supabase database
- No third-party data sharing
- Extension only runs on web.whatsapp.com

## 🐛 Troubleshooting

**Sidebar not appearing?**
- Refresh WhatsApp Web
- Check if extension is enabled in `chrome://extensions/`
- Check browser console for errors (F12)

**Can't save contacts?**
- Verify Supabase credentials in `background.js`
- Check if `contacts` table exists in Supabase
- Check browser console for error messages

**Contact info not detected?**
- Make sure you've selected a chat in WhatsApp
- Some contact names may not be detected properly
- Try clicking on a different chat

## 🔄 Next Steps

After testing this Chrome extension, you can:
1. Move to **Option 3**: Integrate with third-party services (Twilio, Wati, etc.)
2. Build a **WhatsApp Business API** integration for production
3. Add more features (message templates, bulk messaging, etc.)

## 📞 Support

For issues or questions:
1. Check the browser console (F12) for errors
2. Review the Supabase logs
3. Test the CRM dashboard at `http://localhost:3000`

---

**Built with ❤️ for testing WhatsApp + Vanto CRM integration**
