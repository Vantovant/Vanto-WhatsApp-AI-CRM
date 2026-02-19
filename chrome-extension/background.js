// Supabase configuration
const SUPABASE_URL = 'https://nvifliqfgtxqmnkfkhhi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1tf2ICCTfnM7GKviG91LWA_lkeC1Fr3';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_CONTACT') {
    saveContact(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }

  if (request.type === 'GET_CONTACT') {
    getContact(request.phone)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.type === 'SAVE_NOTE') {
    saveNote(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Save contact to Supabase
async function saveContact(contactData) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save contact');
    }

    const data = await response.json();
    console.log('Contact saved:', data);
    return data;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
}

// Get contact by phone number
async function getContact(phoneNumber) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/contacts?phone_number=eq.${encodeURIComponent(phoneNumber)}`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
}

// Save note (would need to create a notes table)
async function saveNote(noteData) {
  // For now, just log it
  console.log('Note would be saved:', noteData);
  return { success: true };
}

console.log('Vanto CRM Background Script: Initialized');
