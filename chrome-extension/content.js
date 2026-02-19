// Wait for WhatsApp Web to load
function waitForWhatsApp() {
  const observer = new MutationObserver((mutations, obs) => {
    const whatsappMain = document.querySelector('#app');
    if (whatsappMain) {
      obs.disconnect();
      injectCRMSidebar();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Inject the CRM sidebar
function injectCRMSidebar() {
  console.log('Vanto CRM: Injecting sidebar...');

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'vanto-crm-sidebar';
  sidebar.className = 'vanto-sidebar collapsed';

  sidebar.innerHTML = `
    <div class="vanto-sidebar-header">
      <div class="vanto-logo">
        <div class="vanto-logo-icon">V</div>
        <span class="vanto-logo-text">Vanto CRM</span>
      </div>
      <button class="vanto-toggle" id="vanto-toggle">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="vanto-sidebar-content">
      <div class="vanto-tabs">
        <button class="vanto-tab active" data-tab="contact">Contact Info</button>
        <button class="vanto-tab" data-tab="notes">Notes</button>
        <button class="vanto-tab" data-tab="activity">Activity</button>
      </div>

      <div class="vanto-tab-content" id="contact-tab">
        <div class="vanto-contact-info">
          <div class="vanto-contact-avatar">
            <div class="vanto-avatar-placeholder">?</div>
          </div>
          <h3 class="vanto-contact-name" id="contact-name">Select a chat</h3>
          <p class="vanto-contact-phone" id="contact-phone">-</p>
        </div>

        <div class="vanto-section">
          <h4>Lead Information</h4>
          <div class="vanto-field">
            <label>Lead Type</label>
            <select id="lead-type" class="vanto-select">
              <option value="">Select type</option>
              <option value="Prospect">Prospect</option>
              <option value="Registered_Nopurchase">Registered - No Purchase</option>
              <option value="Purchase_Nostatus">Purchase - No Status</option>
              <option value="Purchase_Status">Purchase - Status</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div class="vanto-field">
            <label>Temperature</label>
            <select id="lead-temperature" class="vanto-select">
              <option value="">Select temperature</option>
              <option value="Hot">🔥 Hot</option>
              <option value="Warm">☀️ Warm</option>
              <option value="Cold">❄️ Cold</option>
            </select>
          </div>
          <div class="vanto-field">
            <label>Email</label>
            <input type="email" id="contact-email" class="vanto-input" placeholder="email@example.com" />
          </div>
        </div>

        <button class="vanto-btn vanto-btn-primary" id="save-contact">
          Save to CRM
        </button>
      </div>

      <div class="vanto-tab-content hidden" id="notes-tab">
        <div class="vanto-section">
          <textarea id="contact-notes" class="vanto-textarea" placeholder="Add notes about this contact..." rows="6"></textarea>
          <button class="vanto-btn vanto-btn-primary" id="save-note">Add Note</button>
        </div>
        <div class="vanto-notes-list" id="notes-list">
          <p class="vanto-empty">No notes yet</p>
        </div>
      </div>

      <div class="vanto-tab-content hidden" id="activity-tab">
        <div class="vanto-activity-list" id="activity-list">
          <p class="vanto-empty">No activity yet</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(sidebar);

  // Add toggle functionality
  const toggleBtn = document.getElementById('vanto-toggle');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Tab switching
  const tabs = document.querySelectorAll('.vanto-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabName = tab.dataset.tab;
      document.querySelectorAll('.vanto-tab-content').forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    });
  });

  // Detect active chat
  observeActiveChat();

  // Save contact button
  document.getElementById('save-contact').addEventListener('click', saveContactToSupabase);

  console.log('Vanto CRM: Sidebar injected successfully!');
}

// Observe when user clicks on a chat
function observeActiveChat() {
  const observer = new MutationObserver(() => {
    updateContactInfo();
  });

  // Watch for changes in the chat area
  const chatArea = document.querySelector('#app');
  if (chatArea) {
    observer.observe(chatArea, {
      childList: true,
      subtree: true
    });
  }

  // Initial update
  setTimeout(updateContactInfo, 1000);
}

// Extract contact info from active WhatsApp chat
function updateContactInfo() {
  try {
    // Try to get contact name from header
    const nameElement = document.querySelector('header [title]');
    if (!nameElement) return;

    const contactName = nameElement.getAttribute('title') || nameElement.textContent;

    // Try to get phone number (this is tricky in WhatsApp Web)
    const phoneElement = document.querySelector('header span[dir="auto"]');
    const phone = phoneElement ? phoneElement.textContent : 'Unknown';

    // Update sidebar
    document.getElementById('contact-name').textContent = contactName;
    document.getElementById('contact-phone').textContent = phone;

    console.log('Vanto CRM: Active contact:', contactName, phone);
  } catch (error) {
    console.error('Vanto CRM: Error updating contact info', error);
  }
}

// Save contact to Supabase
async function saveContactToSupabase() {
  const contactName = document.getElementById('contact-name').textContent;
  const contactPhone = document.getElementById('contact-phone').textContent;
  const leadType = document.getElementById('lead-type').value;
  const temperature = document.getElementById('lead-temperature').value;
  const email = document.getElementById('contact-email').value;

  if (contactName === 'Select a chat') {
    alert('Please select a chat first');
    return;
  }

  const contactData = {
    full_name: contactName,
    phone_number: contactPhone,
    email_address: email,
    lead_type: leadType || 'Prospect',
    lead_temperature: temperature || 'Cold',
    date_captured: new Date().toISOString()
  };

  // Send to background script
  chrome.runtime.sendMessage({
    type: 'SAVE_CONTACT',
    data: contactData
  }, (response) => {
    if (response.success) {
      alert('✅ Contact saved to CRM!');
    } else {
      alert('❌ Error saving contact: ' + response.error);
    }
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForWhatsApp);
} else {
  waitForWhatsApp();
}
