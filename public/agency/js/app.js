/* ============================================
   AGENCY DASHBOARD - Core App Logic
   Handles auth, page switching, and SEO tools
   ============================================ */

// ===========================================================
// GLOBAL STATE
// ===========================================================
let currentUser = null;
let creditStatus = null; // { creditsUsed, monthlyLimit, creditsRemaining, isUnlimited }

// ===========================================================
// AUTHENTICATION
// ===========================================================

async function checkSession() {
  try {
    const res = await fetch('/api/agency/session', { credentials: 'same-origin' });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        currentUser = data.user;
        return true;
      }
    }
  } catch (e) {
    console.warn('Session check failed:', e);
  }
  currentUser = null;
  return false;
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  errEl.style.display = 'none';

  if (!email || !password) {
    errEl.textContent = 'Please enter both email and password.';
    errEl.style.display = 'block';
    return;
  }

  btn.innerHTML = '<span class="loading-spinner"></span> Signing in...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/agency/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      currentUser = data.user;
      onLoginSuccess();
    } else {
      errEl.textContent = data.error || 'Invalid credentials.';
      errEl.style.display = 'block';
    }
  } catch (e) {
    errEl.textContent = 'Connection error. Please try again.';
    errEl.style.display = 'block';
  }

  btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
  btn.disabled = false;
}

async function doLogout() {
  try {
    await fetch('/api/agency/logout', { method: 'POST', credentials: 'same-origin' });
  } catch (e) { /* ignore */ }
  currentUser = null;
  document.getElementById('loginOverlay').style.display = 'flex';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
}

function handleSessionExpired() {
  currentUser = null;
  document.getElementById('loginOverlay').style.display = 'flex';
  const errEl = document.getElementById('loginError');
  errEl.textContent = 'Session expired. Please sign in again.';
  errEl.style.display = 'block';
}

function onLoginSuccess() {
  document.getElementById('loginOverlay').style.display = 'none';

  // Update user info in sidebar
  if (currentUser) {
    const initials = (currentUser.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('userName').textContent = currentUser.name || currentUser.email;
    const roleLabels = { 'superadmin': 'Super Admin', 'admin': 'Admin', 'user': 'User' };
    document.getElementById('userRole').textContent = roleLabels[currentUser.role] || 'User';

    // Show Super Admin section if applicable
    if (currentUser.role === 'superadmin') {
      document.getElementById('superAdminSection').style.display = 'block';
    } else {
      document.getElementById('superAdminSection').style.display = 'none';
    }

    // Update welcome message
    const firstName = (currentUser.name || 'User').split(' ')[0];
    const welcomeEl = document.querySelector('#page-overview .dash-page-header h2');
    if (welcomeEl) welcomeEl.innerHTML = `Welcome back, ${escHTML(firstName)} &#9883;`;
  }

  // Load credit status
  loadCreditStatus();

  // Test API connection and update status
  testApiConnectionSilent();

  // Load overview data
  setTimeout(loadOverviewKPIs, 500);
  setTimeout(initOverviewCharts, 300);
}

// ===========================================================
// CREDIT SYSTEM
// ===========================================================

async function loadCreditStatus() {
  try {
    const res = await fetch('/api/agency/credits/status', { credentials: 'same-origin' });
    if (res.ok) {
      creditStatus = await res.json();
      updateCreditBadge();
    }
  } catch (e) {
    console.warn('Failed to load credit status:', e);
  }
}

function onCreditBadgeClick() {
  // Only superadmins can navigate to the admin panel from the credit badge
  if (currentUser && currentUser.role === 'superadmin') {
    switchPage('super-admin', null);
  }
}

function updateCreditBadge() {
  const badge = document.getElementById('creditBadge');
  const badgeText = document.getElementById('creditBadgeText');
  if (!badge || !badgeText) return;

  if (!creditStatus) {
    badge.style.display = 'none';
    return;
  }

  badge.style.display = 'block';
  badge.style.cursor = (currentUser && currentUser.role === 'superadmin') ? 'pointer' : 'default';

  if (creditStatus.isUnlimited) {
    badgeText.textContent = 'Unlimited';
    badge.querySelector('.api-status').style.background = 'rgba(245,158,11,0.1)';
    badge.querySelector('.api-status').style.color = 'var(--accent-gold)';
    badge.title = 'Super Admin - Unlimited';
    return;
  }

  const remaining = creditStatus.creditsRemaining;
  const limit = creditStatus.monthlyLimit;
  const pct = limit > 0 ? (remaining / limit) * 100 : 0;

  badgeText.textContent = `$${remaining} / $${limit}`;
  badge.title = `$${remaining} of $${limit} remaining this month`;

  const statusEl = badge.querySelector('.api-status');
  if (pct <= 10) {
    statusEl.style.background = 'rgba(239,68,68,0.1)';
    statusEl.style.color = 'var(--accent-red)';
  } else if (pct <= 25) {
    statusEl.style.background = 'rgba(245,158,11,0.1)';
    statusEl.style.color = 'var(--accent-gold)';
  } else {
    statusEl.style.background = 'rgba(59,130,246,0.1)';
    statusEl.style.color = 'var(--accent-blue)';
  }
}

/**
 * Use credits for a tool action. Returns true if credits were deducted
 * (or user is unlimited). Returns false and shows error if insufficient.
 */
async function useCredits(toolId) {
  try {
    const res = await fetch('/api/agency/credits/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ tool: toolId })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Update local credit status
      if (!data.isUnlimited) {
        creditStatus = {
          creditsUsed: data.creditsUsed,
          monthlyLimit: data.monthlyLimit,
          creditsRemaining: data.creditsRemaining,
          isUnlimited: false,
        };
      }
      updateCreditBadge();
      return true;
    }

    if (res.status === 402) {
      // Insufficient credits
      const resetDate = data.resetDate ? new Date(data.resetDate).toLocaleDateString() : 'the 1st of next month';
      showCreditError(
        `Insufficient funds. This tool costs $${data.cost}, ` +
        `but you only have $${data.creditsRemaining} remaining ($${data.creditsUsed}/$${data.monthlyLimit} used). ` +
        `Budget resets on ${resetDate}.`
      );
      return false;
    }

    if (res.status === 401) {
      handleSessionExpired();
      return false;
    }

    console.warn('Credit use failed:', data.error);
    return true; // Allow on unexpected errors to not block users
  } catch (e) {
    console.warn('Credit check failed:', e);
    return true; // Allow on network errors to not block users
  }
}

function showCreditError(message) {
  // Create a temporary toast notification
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed; top:80px; right:24px; z-index:10000; background:var(--bg-card); border:1px solid var(--accent-red); border-radius:var(--radius-sm); padding:20px 24px; max-width:400px; box-shadow:0 8px 32px rgba(0,0,0,0.3); animation:slideIn 0.3s ease;';
  toast.innerHTML = `
    <div style="display:flex; align-items:start; gap:12px;">
      <i class="fas fa-dollar-sign" style="color:var(--accent-red); font-size:1.25rem; margin-top:2px;"></i>
      <div>
        <strong style="color:var(--accent-red); display:block; margin-bottom:4px;">Insufficient Funds</strong>
        <span style="color:var(--text-secondary); font-size:0.85rem;">${escHTML(message)}</span>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem; padding:0; margin-left:8px;">&times;</button>
    </div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 8000);
}

// ===========================================================
// SETUP - Seed super admin on first load
// ===========================================================

async function ensureSetup() {
  try {
    const res = await fetch('/api/setup', { method: 'POST' });
    // Silently ensures super admin exists
  } catch (e) {
    // Setup endpoint might not be available in production
  }
}

// ===========================================================
// PAGE SWITCHING
// ===========================================================

function switchPage(pageId, linkElement) {
  document.querySelectorAll('.dash-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (linkElement) linkElement.classList.add('active');

  const titles = {
    'overview':'Overview','keyword-research':'Keyword Research','backlinks':'Backlink Analyzer',
    'domain-analysis':'Domain Analysis','serp-tracker':'SERP Tracker','competitors':'Competitor Analysis',
    'site-audit':'Site Audit','aeo':'AEO Optimization','content-silos':'Content Silos',
    'clients':'Clients','reports':'Reports','leads':'Leads & Funnel',
    'paid-ads':'Paid Advertising','tv-ads':'TV / CTV Ads','tracking':'Tracking Pixels',
    'expenses':'Real-Time Expenses','integrations':'Integrations','settings':'Settings',
    'super-admin':'Super Admin','website-builder':'Website Builder','marketing-builder':'Marketing Site Builder'
  };
  document.getElementById('pageTitle').textContent = titles[pageId] || pageId;
  document.getElementById('sidebar').classList.remove('open');

  setTimeout(() => {
    if (pageId === 'overview') { initOverviewCharts(); loadOverviewKPIs(); }
    if (pageId === 'expenses') loadExpenseDfsBalance();
    if (pageId === 'settings') loadSettingsPage();
    if (pageId === 'integrations') updateIntegrationStatuses();
    if (pageId === 'super-admin') loadSuperAdminPage();
  }, 100);
}

// ===========================================================
// API STATUS
// ===========================================================

function updateAPIStatusUI(connected, balance) {
  const sidebarEl = document.getElementById('apiStatusSidebar');
  const topEl = document.getElementById('apiStatusTop');

  if (connected) {
    const html = `<span class="api-status api-connected"><i class="fas fa-circle" style="font-size:6px;"></i> API Connected</span>`;
    sidebarEl.innerHTML = html;
    topEl.innerHTML = html;
  } else {
    const html = `<span class="api-status api-disconnected"><i class="fas fa-circle" style="font-size:6px;"></i> API Not Connected</span>`;
    sidebarEl.innerHTML = html;
    topEl.innerHTML = html;
  }
}

async function testApiConnectionSilent() {
  try {
    const result = await dfs.testConnection();
    if (result.success) {
      dfs.setConnected(true);
      updateAPIStatusUI(true, result.balance);
    } else {
      dfs.setConnected(false);
      updateAPIStatusUI(false);
    }
  } catch (e) {
    dfs.setConnected(false);
    updateAPIStatusUI(false);
  }
}

async function testApiConnection() {
  const resultEl = document.getElementById('settingsApiResult');
  resultEl.innerHTML = '<span class="loading-spinner"></span> Testing connection...';

  try {
    const result = await dfs.testConnection();
    if (result.success) {
      dfs.setConnected(true);
      resultEl.innerHTML = `<span class="text-green"><i class="fas fa-check-circle"></i> Connected! Balance: $${result.balance || 'N/A'}</span>`;
      updateAPIStatusUI(true, result.balance);
    } else {
      dfs.setConnected(false);
      resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${result.error || 'Connection failed'}</span>`;
      updateAPIStatusUI(false);
    }
  } catch (e) {
    resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${e.message}</span>`;
  }
}

// Settings page
function loadSettingsPage() {
  const statusEl = document.getElementById('settingsApiStatus');
  if (dfs.isConnected()) {
    statusEl.innerHTML = '<span class="api-status api-connected"><i class="fas fa-check-circle"></i> Connected</span>';
  } else {
    statusEl.innerHTML = '<span class="api-status api-disconnected"><i class="fas fa-times-circle"></i> Not Connected</span>';
  }
}

function updateIntegrationStatuses() {
  const el = document.getElementById('intDfsStatus');
  if (dfs.isConnected()) {
    el.className = 'integration-status status-active';
    el.textContent = 'Connected';
  } else {
    el.className = 'integration-status status-inactive';
    el.textContent = 'Not Connected';
  }
}

// ===========================================================
// SUPER ADMIN FUNCTIONS
// ===========================================================

async function loadSuperAdminPage() {
  if (!currentUser || currentUser.role !== 'superadmin') return;

  // Load current API credentials status
  try {
    const res = await fetch('/api/agency/admin/global-settings', { credentials: 'same-origin' });
    if (res.ok) {
      const settings = await res.json();
      const apiCreds = settings.find(s => s.key === 'seo_api_credentials');
      const statusEl = document.getElementById('saApiStatus');
      const modalStatusEl = document.getElementById('saApiModalStatus');
      if (apiCreds && apiCreds.login) {
        const badge = `<span class="api-status api-connected"><i class="fas fa-check-circle"></i> API credentials configured (${escHTML(apiCreds.login)})</span>`;
        statusEl.innerHTML = badge;
        if (modalStatusEl) modalStatusEl.innerHTML = badge;
        document.getElementById('saApiLogin').value = apiCreds.login;
        // Don't show the masked password in the field — leave blank for re-entry
      } else {
        const badge = '<span class="api-status api-disconnected"><i class="fas fa-exclamation-triangle"></i> No API credentials configured</span>';
        statusEl.innerHTML = badge;
        if (modalStatusEl) modalStatusEl.innerHTML = badge;
      }
    }
  } catch (e) {
    console.warn('Failed to load global settings:', e);
  }

  // Load user list, credit config, and failed attempts
  loadUserList();
  loadCreditConfig();
  loadFailedAttempts();
}

// ---- SEO API Modal open/close ----
function openSeoApiModal() {
  document.getElementById('seoApiModal').style.display = 'flex';
  document.getElementById('saApiResult').innerHTML = '';
}
function closeSeoApiModal() {
  document.getElementById('seoApiModal').style.display = 'none';
}
// Close modal on overlay click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('seoApiModal');
  if (modal && e.target === modal) closeSeoApiModal();
});
// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('seoApiModal');
    if (modal && modal.style.display !== 'none') closeSeoApiModal();
  }
});

async function saveSeoApiCredentials() {
  const login = document.getElementById('saApiLogin').value.trim();
  const password = document.getElementById('saApiPassword').value.trim();
  const resultEl = document.getElementById('saApiResult');

  if (!login) {
    resultEl.innerHTML = '<span class="text-red">API login is required.</span>';
    return;
  }

  // If password is empty, only update login (keep existing password)
  const payload = { key: 'seo_api_credentials', login };
  if (password) payload.password = password;

  resultEl.innerHTML = '<span class="loading-spinner"></span> Saving...';

  try {
    const res = await fetch('/api/agency/admin/global-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      resultEl.innerHTML = '<span class="text-green"><i class="fas fa-check-circle"></i> Credentials saved successfully!</span>';
      const badge = `<span class="api-status api-connected"><i class="fas fa-check-circle"></i> API credentials configured (${escHTML(login)})</span>`;
      document.getElementById('saApiStatus').innerHTML = badge;
      const modalStatusEl = document.getElementById('saApiModalStatus');
      if (modalStatusEl) modalStatusEl.innerHTML = badge;
      document.getElementById('saApiPassword').value = '';
    } else {
      const data = await res.json();
      resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${data.error || 'Failed to save'}</span>`;
    }
  } catch (e) {
    resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${e.message}</span>`;
  }
}

async function testSeoApiCredentials() {
  const resultEl = document.getElementById('saApiResult');
  resultEl.innerHTML = '<span class="loading-spinner"></span> Testing connection...';

  try {
    const result = await dfs.testConnection();
    if (result.success) {
      dfs.setConnected(true);
      resultEl.innerHTML = `<span class="text-green"><i class="fas fa-check-circle"></i> Connected! Balance: $${result.balance || 'N/A'}</span>`;
      updateAPIStatusUI(true, result.balance);
    } else {
      dfs.setConnected(false);
      resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${result.error || 'Connection failed'}</span>`;
      updateAPIStatusUI(false);
    }
  } catch (e) {
    resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${e.message}</span>`;
  }
}

async function createNewUser() {
  const name = document.getElementById('saNewUserName').value.trim();
  const email = document.getElementById('saNewUserEmail').value.trim();
  const password = document.getElementById('saNewUserPassword').value.trim();
  const role = document.getElementById('saNewUserRole').value;
  const resultEl = document.getElementById('saNewUserResult');

  if (!name || !email || !password) {
    resultEl.innerHTML = '<span class="text-red">Name, email, and password are required.</span>';
    return;
  }
  if (password.length < 8) {
    resultEl.innerHTML = '<span class="text-red">Password must be at least 8 characters.</span>';
    return;
  }

  resultEl.innerHTML = '<span class="loading-spinner"></span> Creating user...';

  const creditsInput = document.getElementById('saNewUserCredits').value.trim();
  const payload = { name, email, password, role };
  if (creditsInput) payload.monthlyCredits = parseInt(creditsInput);

  try {
    const res = await fetch('/api/agency/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      resultEl.innerHTML = `<span class="text-green"><i class="fas fa-check-circle"></i> User created: ${escHTML(data.user.email)} (${data.user.role})</span>`;
      document.getElementById('saNewUserName').value = '';
      document.getElementById('saNewUserEmail').value = '';
      document.getElementById('saNewUserPassword').value = '';
      document.getElementById('saNewUserRole').value = 'user';
      document.getElementById('saNewUserCredits').value = '';
      // Refresh user list
      loadUserList();
    } else {
      resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${data.error || 'Failed to create user'}</span>`;
    }
  } catch (e) {
    resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${e.message}</span>`;
  }
}

async function loadUserList() {
  const el = document.getElementById('saUserList');
  if (!el) return;

  el.innerHTML = '<div class="results-loading"><div class="loading-spinner"></div><br>Loading users...</div>';

  try {
    const res = await fetch('/api/agency/admin/create-user', { credentials: 'same-origin' });
    if (!res.ok) {
      el.innerHTML = '<div class="results-empty" style="color:var(--accent-red);">Failed to load users.</div>';
      return;
    }

    const users = await res.json();
    if (!users || users.length === 0) {
      el.innerHTML = '<div class="results-empty">No users found.</div>';
      return;
    }

    const roleBadges = { 'superadmin': 'badge-gold', 'admin': '', 'user': '' };

    el.innerHTML = `<table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>$ Used</th><th>Monthly $ Limit</th><th>Created</th><th>Actions</th></tr></thead><tbody>${
      users.map(u => {
        const isUnlimited = u.isUnlimited || u.role === 'superadmin';
        const used = u.creditsUsed || 0;
        const limit = u.effectiveMonthlyCredits || 100;
        const remaining = limit - used;
        const pct = limit > 0 ? (remaining / limit) * 100 : 0;
        const creditColor = isUnlimited ? 'var(--accent-gold)' : pct <= 10 ? 'var(--accent-red)' : pct <= 25 ? 'var(--accent-gold)' : 'var(--accent-green)';

        return `<tr>
        <td><strong style="color:var(--text-primary);">${escHTML(u.name || '-')}</strong></td>
        <td style="color:var(--text-secondary);">${escHTML(u.email)}</td>
        <td><span class="badge ${roleBadges[u.role] || ''}" style="font-size:0.7rem; ${u.role === 'superadmin' ? '' : u.role === 'admin' ? 'background:rgba(59,130,246,0.1); border-color:rgba(59,130,246,0.2); color:var(--accent-blue);' : ''}">${(u.role || 'user').toUpperCase()}</span></td>
        <td style="font-weight:600; color:${creditColor};">${isUnlimited ? '<i class="fas fa-infinity"></i>' : `$${used} / $${limit}`}</td>
        <td>${isUnlimited ? '<span style="color:var(--accent-gold); font-size:0.85rem;">Unlimited</span>' : `<input type="number" class="form-input" value="${u.monthlyCredits || ''}" placeholder="${limit}" min="1" max="10000" style="width:80px; padding:4px 8px; font-size:0.85rem; text-align:center;" onchange="updateUserCredits('${escHTML(u.email)}', this.value)">`}</td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
        <td style="white-space:nowrap;">${u.email !== currentUser.email ? `${!isUnlimited ? `<button class="btn btn-sm btn-outline" onclick="resetUserCredits('${escHTML(u.email)}')" title="Reset usage to $0" style="margin-right:4px;"><i class="fas fa-redo" style="font-size:0.7rem;"></i></button>` : ''}<button class="btn btn-sm btn-outline" onclick="deleteUser('${escHTML(u.email)}')" style="color:var(--accent-red); border-color:var(--accent-red);"><i class="fas fa-trash"></i></button>` : '<span class="text-muted" style="font-size:0.75rem;">You</span>'}</td>
      </tr>`;
      }).join('')
    }</tbody></table>`;
  } catch (e) {
    el.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

async function deleteUser(email) {
  if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;

  try {
    const res = await fetch('/api/agency/admin/create-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      loadUserList();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete user');
    }
  } catch (e) {
    alert(e.message);
  }
}

// ===========================================================
// SUPER ADMIN — CREDIT CONFIGURATION
// ===========================================================

async function loadCreditConfig() {
  const tableEl = document.getElementById('saCreditCostTable');
  if (!tableEl) return;

  try {
    const res = await fetch('/api/agency/admin/credit-config', { credentials: 'same-origin' });
    if (!res.ok) {
      tableEl.innerHTML = '<div class="results-empty" style="color:var(--accent-red);">Failed to load dollar budget config.</div>';
      return;
    }

    const config = await res.json();
    document.getElementById('saDefaultMonthlyCredits').value = config.defaultMonthlyCredits || 100;

    const costs = config.costs || config.defaults;
    const labels = config.labels || {};
    const defaults = config.defaults || {};

    let html = '<table class="data-table"><thead><tr><th>Tool</th><th>$ Cost</th><th>Default</th></tr></thead><tbody>';
    for (const [toolId, label] of Object.entries(labels)) {
      const currentCost = costs[toolId] ?? defaults[toolId] ?? 0;
      const defaultCost = defaults[toolId] ?? 0;
      html += `<tr>
        <td><strong style="color:var(--text-primary);">${escHTML(label)}</strong><br><small style="color:var(--text-muted);">${escHTML(toolId)}</small></td>
        <td><input type="number" class="form-input" data-tool-id="${escHTML(toolId)}" value="${currentCost}" min="0" max="10000" style="width:80px; text-align:center; font-weight:600;"></td>
        <td style="color:var(--text-muted);">$${defaultCost}</td>
      </tr>`;
    }
    html += '</tbody></table>';
    tableEl.innerHTML = html;
  } catch (e) {
    tableEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

async function saveCreditConfig() {
  const resultEl = document.getElementById('saCreditConfigResult');
  const defaultMonthlyCredits = parseInt(document.getElementById('saDefaultMonthlyCredits').value);

  if (isNaN(defaultMonthlyCredits) || defaultMonthlyCredits < 1 || defaultMonthlyCredits > 10000) {
    resultEl.innerHTML = '<span class="text-red">Default monthly dollar budget must be between $1 and $10,000.</span>';
    return;
  }

  // Collect all tool costs from inputs
  const costInputs = document.querySelectorAll('#saCreditCostTable input[data-tool-id]');
  const costs = {};
  for (const input of costInputs) {
    const toolId = input.getAttribute('data-tool-id');
    const val = parseInt(input.value);
    if (isNaN(val) || val < 0 || val > 10000) {
      resultEl.innerHTML = `<span class="text-red">Invalid cost for ${toolId}: must be 0-10000.</span>`;
      return;
    }
    costs[toolId] = val;
  }

  resultEl.innerHTML = '<span class="loading-spinner"></span> Saving...';

  try {
    const res = await fetch('/api/agency/admin/credit-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ defaultMonthlyCredits, costs })
    });

    if (res.ok) {
      resultEl.innerHTML = '<span class="text-green"><i class="fas fa-check-circle"></i> Dollar configuration saved!</span>';
    } else {
      const data = await res.json();
      resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${data.error || 'Failed to save'}</span>`;
    }
  } catch (e) {
    resultEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${e.message}</span>`;
  }
}

async function resetCreditConfigToDefaults() {
  if (!confirm('Reset all dollar costs to defaults? This will overwrite your custom values.')) return;
  const resultEl = document.getElementById('saCreditConfigResult');
  resultEl.innerHTML = '<span class="loading-spinner"></span> Resetting...';

  try {
    // Fetch defaults from API
    const getRes = await fetch('/api/agency/admin/credit-config', { credentials: 'same-origin' });
    if (!getRes.ok) throw new Error('Failed to fetch defaults');
    const config = await getRes.json();

    const res = await fetch('/api/agency/admin/credit-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ defaultMonthlyCredits: 100, costs: config.defaults })
    });

    if (res.ok) {
      resultEl.innerHTML = '<span class="text-green"><i class="fas fa-check-circle"></i> Reset to defaults!</span>';
      loadCreditConfig();
    }
  } catch (e) {
    resultEl.innerHTML = `<span class="text-red">${e.message}</span>`;
  }
}

async function updateUserCredits(email, newLimit) {
  try {
    const res = await fetch('/api/agency/admin/create-user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email, monthlyCredits: newLimit })
    });

    if (res.ok) {
      loadUserList();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to update dollar limit');
    }
  } catch (e) {
    alert(e.message);
  }
}

async function resetUserCredits(email) {
  if (!confirm(`Reset dollar usage for ${email}? Their usage this month will be set to $0.`)) return;

  try {
    const res = await fetch('/api/agency/admin/create-user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email, resetCredits: true })
    });

    if (res.ok) {
      loadUserList();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to reset dollar usage');
    }
  } catch (e) {
    alert(e.message);
  }
}

// ===========================================================
// KEYWORD RESEARCH TOOLS
// ===========================================================

function switchKWTab(tab, btn) {
  document.querySelectorAll('#page-keyword-research .tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('kw-tab-' + tab).classList.add('active');
  document.querySelectorAll('#page-keyword-research .tab-nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function checkAPI() {
  if (!dfs.isConnected()) {
    return '<div class="results-empty" style="border:2px dashed var(--accent-red); border-radius:var(--radius-sm); padding:40px;"><i class="fas fa-plug" style="font-size:2rem; color:var(--accent-red); margin-bottom:12px; display:block;"></i><strong>SEO API Not Connected</strong><br><br>Go to <a href="#" onclick="switchPage(\'settings\', null); return false;">Settings</a> to check API status, or contact your administrator.</div>';
  }
  return null;
}

function showLoading(el, msg) {
  el.innerHTML = `<div class="results-loading"><div class="loading-spinner"></div><br>${msg || 'Fetching live data...'}</div>`;
}

function renderKeywordTable(keywords, tableId) {
  if (!keywords || keywords.length === 0) {
    return '<div class="results-empty">No results found. Try a different keyword.</div>';
  }

  return `<table class="data-table" id="${tableId || ''}">
    <thead><tr>
      <th>Keyword</th><th>Volume</th><th>CPC</th><th>Competition</th><th>Difficulty</th><th>SERP Features</th><th>Opportunity</th>
    </tr></thead>
    <tbody>${keywords.map(kw => `<tr>
      <td><strong style="color:var(--text-primary);">${escHTML(kw.keyword)}</strong></td>
      <td>${(kw.searchVolume || 0).toLocaleString()}</td>
      <td>$${(kw.cpc || 0).toFixed(2)}</td>
      <td>${DataForSEOClient.getCompetitionBadge(kw.competitionLevel || 'N/A')}</td>
      <td>${DataForSEOClient.getDifficultyBadge(kw.keywordDifficulty)}</td>
      <td style="font-size:0.75rem; color:var(--text-muted); max-width:150px; overflow:hidden; text-overflow:ellipsis;">${(kw.serpFeatures || []).slice(0, 3).join(', ') || '-'}</td>
      <td>${DataForSEOClient.getOpportunityScore(kw.searchVolume || 0, kw.competition || 0, kw.keywordDifficulty)}</td>
    </tr>`).join('')}</tbody></table>`;
}

async function runKeywordSuggestions() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('kwSuggestionsResults');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const keyword = document.getElementById('kwSeedInput').value.trim();
  if (!keyword) { document.getElementById('kwSeedInput').focus(); return; }

  if (!(await useCredits('keyword_suggestions'))) return;

  const location = parseInt(document.getElementById('kwLocationSelect').value);
  const limit = parseInt(document.getElementById('kwLimitSelect').value);

  showLoading(resultsEl, `Researching "${keyword}"...`);
  try {
    const data = await dfs.getKeywordSuggestions(keyword, location, 'en', limit);
    resultsEl.innerHTML = `<p style="margin-bottom:16px; color:var(--text-secondary);"><strong>${data.totalCount?.toLocaleString() || 0}</strong> total keywords found for "<strong>${escHTML(keyword)}</strong>"</p>` + renderKeywordTable(data.keywords, 'kwResultsTable');
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle"></i> ${escHTML(e.message)}</div>`;
  }
}

async function runRelatedKeywords() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('kwRelatedResults');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const keyword = document.getElementById('kwRelatedInput').value.trim();
  if (!keyword) return;

  if (!(await useCredits('related_keywords'))) return;

  showLoading(resultsEl);
  try {
    const data = await dfs.getRelatedKeywords(keyword);
    resultsEl.innerHTML = renderKeywordTable(data.keywords, 'kwRelatedTable');
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

async function runKeywordQuestions() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('kwQuestionsResults');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const keyword = document.getElementById('kwQuestionsInput').value.trim();
  if (!keyword) return;

  if (!(await useCredits('keyword_questions'))) return;

  showLoading(resultsEl, `Finding questions about "${keyword}"...`);
  try {
    const data = await dfs.getKeywordQuestions(keyword);
    resultsEl.innerHTML = renderKeywordTable(data.keywords, 'kwQuestionsTable');
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

async function runVolumeCheck() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('kwVolumeResults');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const raw = document.getElementById('kwVolumeInput').value.trim();
  const keywords = raw.split('\n').map(k => k.trim()).filter(k => k);
  if (keywords.length === 0) return;

  if (!(await useCredits('volume_check'))) return;

  showLoading(resultsEl, `Getting volume for ${keywords.length} keywords...`);
  try {
    const data = await dfs.getSearchVolume(keywords);
    resultsEl.innerHTML = `<table class="data-table"><thead><tr><th>Keyword</th><th>Volume</th><th>CPC</th><th>Competition</th></tr></thead><tbody>${
      (data.keywords || []).map(kw => `<tr><td><strong style="color:var(--text-primary);">${escHTML(kw.keyword)}</strong></td><td>${(kw.searchVolume || 0).toLocaleString()}</td><td>$${(kw.cpc || 0).toFixed(2)}</td><td>${DataForSEOClient.getCompetitionBadge(kw.competitionLevel)}</td></tr>`).join('')
    }</tbody></table>`;
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

async function runDifficultyCheck() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('kwDifficultyResults');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const raw = document.getElementById('kwDifficultyInput').value.trim();
  const keywords = raw.split('\n').map(k => k.trim()).filter(k => k);
  if (keywords.length === 0) return;

  if (!(await useCredits('difficulty_check'))) return;

  showLoading(resultsEl);
  try {
    const data = await dfs.getKeywordDifficulty(keywords);
    resultsEl.innerHTML = `<table class="data-table"><thead><tr><th>Keyword</th><th>Difficulty</th><th>Volume</th><th>Verdict</th></tr></thead><tbody>${
      (data.keywords || []).map(kw => {
        const d = kw.difficulty || 0;
        const verdict = d <= 20 ? '<span class="text-green">Easy Win</span>' : d <= 40 ? '<span class="text-green">Doable</span>' : d <= 60 ? '<span class="text-gold">Moderate</span>' : '<span class="text-red">Hard</span>';
        return `<tr><td><strong style="color:var(--text-primary);">${escHTML(kw.keyword)}</strong></td><td>${DataForSEOClient.getDifficultyBadge(d)}</td><td>${(kw.searchVolume || 0).toLocaleString()}</td><td>${verdict}</td></tr>`;
      }).join('')
    }</tbody></table>`;
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

async function runKeywordGap() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('kwGapResults');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const your = document.getElementById('kwGapYourDomain').value.trim();
  const comp = document.getElementById('kwGapCompDomain').value.trim();
  if (!your || !comp) return;

  if (!(await useCredits('keyword_gap'))) return;

  showLoading(resultsEl, `Comparing ${your} vs ${comp}...`);
  try {
    const data = await dfs.getKeywordGap(your, [comp]);
    resultsEl.innerHTML = `<table class="data-table"><thead><tr><th>Keyword</th><th>Volume</th><th>CPC</th></tr></thead><tbody>${
      (data.keywords || []).map(kw => `<tr><td><strong style="color:var(--text-primary);">${escHTML(kw.keyword)}</strong></td><td>${(kw.searchVolume || 0).toLocaleString()}</td><td>$${(kw.cpc || 0).toFixed(2)}</td></tr>`).join('')
    }</tbody></table>`;
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

// ===========================================================
// BACKLINK ANALYZER
// ===========================================================

function switchBLTab(tab, btn) {
  document.querySelectorAll('#page-backlinks .tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('bl-tab-' + tab).classList.add('active');
  document.querySelectorAll('#page-backlinks .tab-nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

async function runBacklinkAnalysis() {
  const notConnected = checkAPI();
  if (notConnected) { document.getElementById('blSummaryKPIs').style.display = 'none'; return; }

  const domain = document.getElementById('blDomainInput').value.trim();
  if (!domain) return;

  if (!(await useCredits('backlink_analysis'))) return;

  const kpiEl = document.getElementById('blSummaryKPIs');
  const tabNav = document.getElementById('blTabNav');
  const blCard = document.getElementById('blBacklinksCard');
  const blResults = document.getElementById('blBacklinksResults');
  const domCard = document.getElementById('blDomainsCard');
  const domResults = document.getElementById('blDomainsResults');

  kpiEl.style.display = 'grid';
  tabNav.style.display = 'flex';
  blCard.style.display = 'block';
  domCard.style.display = 'block';

  ['blTotalLinks','blRefDomains','blDomainRank','blBrokenLinks'].forEach(id => {
    document.getElementById(id).innerHTML = '<span class="loading-spinner"></span>';
  });
  showLoading(blResults);
  showLoading(domResults);

  try {
    const [summary, backlinks, refDomains] = await Promise.all([
      dfs.getBacklinkSummary(domain),
      dfs.getBacklinks(domain, 100),
      dfs.getReferringDomains(domain, 100)
    ]);

    if (!summary.success && !backlinks.success && !refDomains.success) {
      const errMsg = summary.error || backlinks.error || refDomains.error || 'No data returned';
      document.getElementById('blTotalLinks').textContent = '-';
      document.getElementById('blRefDomains').textContent = '-';
      document.getElementById('blDomainRank').textContent = '-';
      document.getElementById('blBrokenLinks').textContent = '-';
      document.getElementById('blBacklinksCount').textContent = '';
      blResults.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-bottom:8px; display:block;"></i><strong>Backlink Analysis Failed</strong><br><br>${escHTML(errMsg)}<br><small style="color:var(--text-muted); margin-top:8px; display:block;">This can happen if the domain is very new or has no indexed backlinks.</small></div>`;
      domResults.innerHTML = '';
      return;
    }

    document.getElementById('blTotalLinks').textContent = summary.success ? (summary.backlinks || 0).toLocaleString() : '-';
    document.getElementById('blRefDomains').textContent = summary.success ? (summary.referringDomains || 0).toLocaleString() : '-';
    document.getElementById('blDomainRank').textContent = summary.success ? (summary.rank || '0') : '-';
    document.getElementById('blBrokenLinks').textContent = summary.success ? (summary.brokenBacklinks || 0).toLocaleString() : '-';
    document.getElementById('blBacklinksCount').textContent = backlinks.success ? `${(backlinks.total || 0).toLocaleString()} total` : '0 total';

    if (backlinks.success && backlinks.backlinks && backlinks.backlinks.length > 0) {
      blResults.innerHTML = `<table class="data-table" id="blResultsTable"><thead><tr><th>Source Page</th><th>Anchor</th><th>DR</th><th>Type</th><th>First Seen</th></tr></thead><tbody>${
        backlinks.backlinks.map(bl => `<tr>
          <td><div class="truncate"><a href="${escHTML(bl.urlFrom)}" target="_blank" style="font-size:0.85rem;">${escHTML(bl.urlFrom)}</a></div><div style="font-size:0.75rem; color:var(--text-muted);">${escHTML(bl.domainFrom)}</div></td>
          <td style="max-width:150px; overflow:hidden; text-overflow:ellipsis;">${escHTML(bl.anchor)}</td>
          <td><strong>${bl.domainFromRank}</strong></td>
          <td>${bl.dofollow ? '<span class="backlink-dofollow">DoFollow</span>' : '<span class="backlink-nofollow">NoFollow</span>'}</td>
          <td style="font-size:0.8rem; color:var(--text-muted);">${bl.firstSeen ? new Date(bl.firstSeen).toLocaleDateString() : '-'}</td>
        </tr>`).join('')
      }</tbody></table>`;
    } else {
      blResults.innerHTML = `<div class="results-empty">No backlinks found for <strong>${escHTML(domain)}</strong>.</div>`;
    }

    if (refDomains.success && refDomains.domains && refDomains.domains.length > 0) {
      domResults.innerHTML = `<table class="data-table"><thead><tr><th>Domain</th><th>Rank</th><th>Backlinks</th><th>First Seen</th></tr></thead><tbody>${
        refDomains.domains.map(d => `<tr>
          <td><strong style="color:var(--text-primary);">${escHTML(d.domain)}</strong></td>
          <td><strong>${d.rank}</strong></td>
          <td>${d.backlinks}</td>
          <td style="font-size:0.8rem; color:var(--text-muted);">${d.firstSeen ? new Date(d.firstSeen).toLocaleDateString() : '-'}</td>
        </tr>`).join('')
      }</tbody></table>`;
    } else {
      domResults.innerHTML = `<div class="results-empty">No referring domains found for <strong>${escHTML(domain)}</strong>.</div>`;
    }

  } catch (e) {
    blResults.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-bottom:8px; display:block;"></i>${escHTML(e.message)}</div>`;
  }
}

// ===========================================================
// DOMAIN ANALYSIS
// ===========================================================

async function runDomainAnalysis() {
  const notConnected = checkAPI();
  if (notConnected) { document.getElementById('daResults').innerHTML = notConnected; document.getElementById('daResults').style.display = 'block'; return; }

  const domain = document.getElementById('daDomainInput').value.trim();
  if (!domain) return;

  if (!(await useCredits('domain_analysis'))) return;

  const resultsEl = document.getElementById('daResults');
  resultsEl.style.display = 'block';
  ['daOrgTraffic','daOrgKeywords','daTrafficCost','daPaidKeywords'].forEach(id => {
    document.getElementById(id).innerHTML = '<span class="loading-spinner"></span>';
  });
  const kwResults = document.getElementById('daKeywordsResults');
  showLoading(kwResults);

  try {
    const [rank, keywords] = await Promise.all([
      dfs.getDomainRank(domain),
      dfs.getDomainOrganicKeywords(domain, 2840, 'en', 100)
    ]);

    if (!rank.success && !keywords.success) {
      const errMsg = rank.error || keywords.error || 'No data returned';
      ['daOrgTraffic','daOrgKeywords','daTrafficCost','daPaidKeywords'].forEach(id => {
        document.getElementById(id).textContent = '-';
      });
      kwResults.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-bottom:8px; display:block;"></i><strong>Domain Analysis Failed</strong><br><br>${escHTML(errMsg)}</div>`;
      return;
    }

    if (rank.success) {
      document.getElementById('daOrgTraffic').textContent = DataForSEOClient.formatNumber(rank.organicTraffic || 0);
      document.getElementById('daOrgKeywords').textContent = DataForSEOClient.formatNumber(rank.organicKeywords || 0);
      document.getElementById('daTrafficCost').textContent = '$' + DataForSEOClient.formatNumber(rank.organicCost || 0);
      document.getElementById('daPaidKeywords').textContent = DataForSEOClient.formatNumber(rank.paidKeywords || 0);
    } else {
      ['daOrgTraffic','daOrgKeywords','daTrafficCost','daPaidKeywords'].forEach(id => {
        document.getElementById(id).textContent = '-';
      });
    }

    if (keywords.success && keywords.keywords && keywords.keywords.length > 0) {
      kwResults.innerHTML = `<table class="data-table" id="daKeywordsTable"><thead><tr><th>Keyword</th><th>Position</th><th>Volume</th><th>CPC</th><th>Traffic Est.</th><th>URL</th></tr></thead><tbody>${
        keywords.keywords.map(kw => `<tr>
          <td><strong style="color:var(--text-primary);">${escHTML(kw.keyword)}</strong></td>
          <td><span class="serp-pos ${kw.position <= 3 ? 'serp-pos-top' : kw.position <= 10 ? 'serp-pos-mid' : 'serp-pos-low'}">${kw.position}</span></td>
          <td>${(kw.searchVolume || 0).toLocaleString()}</td>
          <td>$${(kw.cpc || 0).toFixed(2)}</td>
          <td>${DataForSEOClient.formatNumber(kw.trafficEstimate || 0)}</td>
          <td class="truncate" style="font-size:0.8rem; color:var(--text-muted);">${escHTML(kw.url)}</td>
        </tr>`).join('')
      }</tbody></table>`;
    } else {
      kwResults.innerHTML = `<div class="results-empty">No organic keywords found for <strong>${escHTML(domain)}</strong>.</div>`;
    }
  } catch (e) {
    ['daOrgTraffic','daOrgKeywords','daTrafficCost','daPaidKeywords'].forEach(id => {
      document.getElementById(id).textContent = '-';
    });
    kwResults.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-bottom:8px; display:block;"></i>${escHTML(e.message)}</div>`;
  }
}

// ===========================================================
// SERP TRACKER
// ===========================================================

async function runSERPCheck() {
  const notConnected = checkAPI();
  if (notConnected) { document.getElementById('serpResults').innerHTML = notConnected; document.getElementById('serpResultsCard').style.display = 'block'; return; }

  const keyword = document.getElementById('serpKeywordInput').value.trim();
  if (!keyword) return;

  if (!(await useCredits('serp_check'))) return;

  const location = parseInt(document.getElementById('serpLocationSelect').value);

  const kpiEl = document.getElementById('serpFeaturesKPIs');
  const card = document.getElementById('serpResultsCard');
  const resultsEl = document.getElementById('serpResults');

  kpiEl.style.display = 'grid';
  card.style.display = 'block';
  ['serpFS','serpPAA','serpTotal'].forEach(id => document.getElementById(id).innerHTML = '<span class="loading-spinner"></span>');
  showLoading(resultsEl, `Checking SERP for "${keyword}"...`);

  try {
    const data = await dfs.getSERPResults(keyword, location, 'en', 20);

    document.getElementById('serpFS').innerHTML = data.featuredSnippet ? '<span class="text-green">Yes</span>' : '<span class="text-muted">No</span>';
    document.getElementById('serpPAA').innerHTML = data.peopleAlsoAsk?.length > 0 ? `<span class="text-green">${data.peopleAlsoAsk.length}</span>` : '<span class="text-muted">None</span>';
    document.getElementById('serpTotal').textContent = (data.totalResults || 0).toLocaleString();

    let html = '';
    if (data.featuredSnippet) {
      html += `<div class="serp-item" style="border-left:4px solid var(--accent-gold); margin-bottom:16px;">
        <div style="font-size:0.75rem; color:var(--accent-gold); font-weight:600; margin-bottom:4px;"><i class="fas fa-star"></i> FEATURED SNIPPET</div>
        <div class="serp-item-title">${escHTML(data.featuredSnippet.title || '')}</div>
        <div class="serp-item-desc">${escHTML(data.featuredSnippet.description || '')}</div>
      </div>`;
    }

    html += (data.items || []).map((item, i) => `
      <div class="serp-item" style="display:flex; align-items:start;">
        <span class="serp-pos ${item.position <= 3 ? 'serp-pos-top' : item.position <= 10 ? 'serp-pos-mid' : 'serp-pos-low'}">${item.position}</span>
        <div style="flex:1; min-width:0;">
          <div class="serp-item-url">${escHTML(item.url)}</div>
          <div class="serp-item-title">${escHTML(item.title)}</div>
          <div class="serp-item-desc">${escHTML(item.description)}</div>
        </div>
      </div>
    `).join('');

    resultsEl.innerHTML = html || '<div class="results-empty">No organic results found.</div>';
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

// ===========================================================
// COMPETITOR ANALYSIS
// ===========================================================

async function runCompetitorAnalysis() {
  const notConnected = checkAPI();
  if (notConnected) { document.getElementById('compResults').innerHTML = notConnected; document.getElementById('compResultsCard').style.display = 'block'; return; }

  const domain = document.getElementById('compDomainInput').value.trim();
  if (!domain) return;

  if (!(await useCredits('competitor_analysis'))) return;

  const card = document.getElementById('compResultsCard');
  const resultsEl = document.getElementById('compResults');
  card.style.display = 'block';
  showLoading(resultsEl, `Finding competitors for ${domain}...`);

  try {
    const data = await dfs.getCompetitors(domain);

    if (!data.success) {
      resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-bottom:8px; display:block;"></i><strong>Competitor Analysis Failed</strong><br><br>${escHTML(data.error || 'No data returned')}</div>`;
      return;
    }

    if (data.competitors && data.competitors.length > 0) {
      resultsEl.innerHTML = `<table class="data-table"><thead><tr><th>Competitor</th><th>Common Keywords</th><th>Organic Traffic</th><th>Organic Keywords</th><th>Avg Position</th></tr></thead><tbody>${
        data.competitors.map(c => `<tr>
          <td><strong style="color:var(--text-primary);">${escHTML(c.domain)}</strong></td>
          <td>${c.intersections?.toLocaleString() || 0}</td>
          <td>${DataForSEOClient.formatNumber(c.organicTraffic || 0)}</td>
          <td>${DataForSEOClient.formatNumber(c.organicKeywords || 0)}</td>
          <td>${(c.avgPosition || 0).toFixed(1)}</td>
        </tr>`).join('')
      }</tbody></table>`;
    } else {
      resultsEl.innerHTML = `<div class="results-empty">No competitors found for <strong>${escHTML(domain)}</strong>.</div>`;
    }
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-bottom:8px; display:block;"></i>${escHTML(e.message)}</div>`;
  }
}

// ===========================================================
// SITE AUDIT — Auto-Polling
// ===========================================================

let auditPollTimer = null;
let auditPollTaskId = null;

async function runSiteAudit() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('auditResults');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const url = document.getElementById('auditUrlInput').value.trim();
  if (!url) return;

  if (!(await useCredits('site_audit'))) return;

  const maxPages = parseInt(document.getElementById('auditDepth').value);

  stopAuditPolling();
  showLoading(resultsEl, `Starting crawl of ${url} (up to ${maxPages} pages)...`);

  try {
    const result = await dfs.startOnPageAudit(url, maxPages);
    if (result.success) {
      resultsEl.innerHTML = `<div class="chart-card" id="auditStatusCard" style="border-color:var(--accent-blue);">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <div class="loading-spinner" id="auditSpinner" style="width:24px;height:24px;border-width:3px;"></div>
          <div>
            <h4 style="margin:0;" id="auditStatusTitle"><i class="fas fa-satellite-dish" style="color:var(--accent-blue);"></i> Crawl In Progress...</h4>
            <p style="color:var(--text-muted); font-size:0.85rem; margin:4px 0 0;">Task ID: <code class="mono">${result.taskId}</code></p>
          </div>
        </div>
        <div id="auditProgressBar" style="margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
            <span style="color:var(--text-secondary);" id="auditProgressLabel">Starting crawl...</span>
            <span style="color:var(--text-muted);" id="auditProgressPct">0%</span>
          </div>
          <div style="background:var(--bg-input); border-radius:100px; height:8px; overflow:hidden;">
            <div id="auditProgressFill" style="background:var(--accent-blue); height:100%; border-radius:100px; width:0%; transition:width 0.5s ease;"></div>
          </div>
        </div>
        <div id="auditProgressDetails" style="background:var(--bg-input); border-radius:var(--radius-sm); padding:16px; font-size:0.85rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
            <div><strong style="color:var(--text-muted);">Status</strong><br><span id="auditStatStatus" style="color:var(--accent-blue);">Starting...</span></div>
            <div><strong style="color:var(--text-muted);">Pages Crawled</strong><br><span id="auditStatCrawled">0</span></div>
            <div><strong style="color:var(--text-muted);">Total Found</strong><br><span id="auditStatTotal">--</span></div>
          </div>
        </div>
        <div style="margin-top:12px; display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline" onclick="stopAuditPolling()" id="auditStopBtn"><i class="fas fa-stop"></i> Stop Polling</button>
        </div>
        <div id="auditProgressResult" style="margin-top:16px;"></div>
      </div>`;

      auditPollTaskId = result.taskId;
      auditPollTimer = setInterval(() => checkAuditProgress(result.taskId), 5000);
      setTimeout(() => checkAuditProgress(result.taskId), 3000);
    }
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

function stopAuditPolling() {
  if (auditPollTimer) {
    clearInterval(auditPollTimer);
    auditPollTimer = null;
  }
  auditPollTaskId = null;
  const stopBtn = document.getElementById('auditStopBtn');
  if (stopBtn) stopBtn.innerHTML = '<i class="fas fa-check"></i> Polling Stopped';
}

async function checkAuditProgress(taskId) {
  const el = document.getElementById('auditProgressResult');
  const statusEl = document.getElementById('auditStatStatus');
  const crawledEl = document.getElementById('auditStatCrawled');
  const totalEl = document.getElementById('auditStatTotal');
  const pctEl = document.getElementById('auditProgressPct');
  const fillEl = document.getElementById('auditProgressFill');
  const labelEl = document.getElementById('auditProgressLabel');
  const spinnerEl = document.getElementById('auditSpinner');
  const titleEl = document.getElementById('auditStatusTitle');
  const cardEl = document.getElementById('auditStatusCard');

  if (!el || !statusEl) { stopAuditPolling(); return; }

  try {
    const summary = await dfs.getOnPageSummary(taskId);
    if (summary.success) {
      const crawled = summary.pagesCrawled || 0;
      const total = summary.pagesCount || 0;
      const progress = total > 0 ? Math.round((crawled / total) * 100) : 0;
      const isFinished = summary.crawlProgress === 'finished';

      statusEl.textContent = summary.crawlProgress || 'crawling';
      statusEl.style.color = isFinished ? 'var(--accent-green)' : 'var(--accent-blue)';
      crawledEl.textContent = crawled.toLocaleString();
      totalEl.textContent = total > 0 ? total.toLocaleString() : '--';

      if (total > 0) {
        pctEl.textContent = progress + '%';
        fillEl.style.width = progress + '%';
        fillEl.style.background = isFinished ? 'var(--accent-green)' : 'var(--accent-blue)';
        labelEl.textContent = isFinished ? 'Crawl complete!' : `Crawling... ${crawled} of ${total} pages`;
      } else {
        labelEl.textContent = 'Crawl starting — discovering pages...';
      }

      if (isFinished) {
        stopAuditPolling();
        if (cardEl) cardEl.style.borderColor = 'var(--accent-green)';
        if (spinnerEl) spinnerEl.style.display = 'none';
        if (titleEl) titleEl.innerHTML = '<i class="fas fa-check-circle" style="color:var(--accent-green);"></i> Audit Complete';
        const stopBtn = document.getElementById('auditStopBtn');
        if (stopBtn) stopBtn.style.display = 'none';

        el.innerHTML = '<div style="margin-top:8px;"><span class="loading-spinner"></span> Loading detailed results...</div>';
        try {
          const pages = await dfs.getOnPagePages(taskId, 50);
          if (pages.success && pages.pages.length > 0) {
            const errorPages = pages.pages.filter(p => p.statusCode >= 400).length;
            const slowPages = pages.pages.filter(p => p.loadTime && p.loadTime > 3000).length;
            const noTitle = pages.pages.filter(p => !p.title).length;
            const noDesc = pages.pages.filter(p => !p.description).length;
            const noAlt = pages.pages.reduce((sum, p) => sum + (p.imagesWithoutAlt || 0), 0);

            el.innerHTML = `
              <div style="margin-top:16px; display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:8px;">
                <div style="background:${errorPages > 0 ? 'rgba(239,68,68,0.1)' : 'var(--bg-input)'}; border-radius:var(--radius-sm); padding:12px; text-align:center;">
                  <div style="font-size:0.75rem; color:var(--text-muted);">Error Pages (4xx/5xx)</div>
                  <div style="font-size:1.25rem; font-weight:700; color:${errorPages > 0 ? 'var(--accent-red)' : 'var(--accent-green)'};">${errorPages}</div>
                </div>
                <div style="background:${slowPages > 0 ? 'rgba(245,158,11,0.1)' : 'var(--bg-input)'}; border-radius:var(--radius-sm); padding:12px; text-align:center;">
                  <div style="font-size:0.75rem; color:var(--text-muted);">Slow Pages (>3s)</div>
                  <div style="font-size:1.25rem; font-weight:700; color:${slowPages > 0 ? 'var(--accent-gold)' : 'var(--accent-green)'};">${slowPages}</div>
                </div>
                <div style="background:${noTitle > 0 ? 'rgba(245,158,11,0.1)' : 'var(--bg-input)'}; border-radius:var(--radius-sm); padding:12px; text-align:center;">
                  <div style="font-size:0.75rem; color:var(--text-muted);">Missing Titles</div>
                  <div style="font-size:1.25rem; font-weight:700; color:${noTitle > 0 ? 'var(--accent-gold)' : 'var(--accent-green)'};">${noTitle}</div>
                </div>
                <div style="background:${noDesc > 0 ? 'rgba(245,158,11,0.1)' : 'var(--bg-input)'}; border-radius:var(--radius-sm); padding:12px; text-align:center;">
                  <div style="font-size:0.75rem; color:var(--text-muted);">Missing Descriptions</div>
                  <div style="font-size:1.25rem; font-weight:700; color:${noDesc > 0 ? 'var(--accent-gold)' : 'var(--accent-green)'};">${noDesc}</div>
                </div>
                <div style="background:${noAlt > 0 ? 'rgba(245,158,11,0.1)' : 'var(--bg-input)'}; border-radius:var(--radius-sm); padding:12px; text-align:center;">
                  <div style="font-size:0.75rem; color:var(--text-muted);">Images Missing Alt</div>
                  <div style="font-size:1.25rem; font-weight:700; color:${noAlt > 0 ? 'var(--accent-gold)' : 'var(--accent-green)'};">${noAlt}</div>
                </div>
              </div>
              <div style="margin-top:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <h4>Crawled Pages (${pages.pages.length})</h4>
                  <button class="btn btn-sm btn-outline" onclick="exportTableCSV('auditPagesTable')"><i class="fas fa-download"></i> CSV</button>
                </div>
                <table class="data-table" id="auditPagesTable"><thead><tr><th>URL</th><th>Status</th><th>Title</th><th>Words</th><th>Links (Int/Ext)</th><th>Images (No Alt)</th><th>Load Time</th></tr></thead><tbody>${
                  pages.pages.map(p => `<tr>
                    <td class="truncate" style="max-width:200px;"><a href="${escHTML(p.url)}" target="_blank" style="font-size:0.8rem;">${escHTML(p.url)}</a></td>
                    <td>${p.statusCode === 200 ? '<span class="text-green">200</span>' : p.statusCode === 301 ? '<span class="text-gold">301</span>' : `<span class="text-red">${p.statusCode}</span>`}</td>
                    <td class="truncate" style="max-width:180px;">${escHTML(p.title) || '<span class="text-red">Missing!</span>'}</td>
                    <td>${p.wordCount.toLocaleString()}</td>
                    <td>${p.internalLinks || 0} / ${p.externalLinks || 0}</td>
                    <td>${p.imagesWithoutAlt ? `<span class="text-gold">${p.imagesWithoutAlt}</span>` : '<span class="text-green">0</span>'}</td>
                    <td>${p.loadTime ? ((p.loadTime / 1000).toFixed(2) + 's') : '-'}</td>
                  </tr>`).join('')
                }</tbody></table>
              </div>`;
          } else {
            el.innerHTML = '<div class="results-empty" style="margin-top:16px;">Crawl finished but no page data available.</div>';
          }
        } catch (pageErr) {
          el.innerHTML = `<div style="margin-top:16px; color:var(--accent-red);"><i class="fas fa-exclamation-triangle"></i> ${escHTML(pageErr.message)}</div>`;
        }
      }
    }
  } catch (e) {
    if (el) el.innerHTML = `<div style="color:var(--accent-gold); font-size:0.85rem; margin-top:8px;"><i class="fas fa-exclamation-triangle"></i> Poll error: ${escHTML(e.message)} — retrying...</div>`;
  }
}

async function runInstantAnalysis() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('instantResults');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const url = document.getElementById('instantUrlInput').value.trim();
  if (!url) return;

  if (!(await useCredits('instant_analysis'))) return;

  showLoading(resultsEl, `Analyzing ${url}...`);

  try {
    const data = await dfs.analyzeContent(url);
    if (data.success) {
      resultsEl.innerHTML = `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-top:16px;">
        <div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:16px;"><strong>Title</strong><br><span style="color:var(--text-secondary); font-size:0.85rem;">${escHTML(data.title)}</span></div>
        <div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:16px;"><strong>H1 Tags</strong><br><span style="color:var(--text-secondary); font-size:0.85rem;">${(data.h1 || []).map(h => escHTML(h)).join(', ') || 'None'}</span></div>
        <div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:16px;"><strong>Word Count</strong><br><span style="font-size:1.25rem; font-weight:700; color:var(--accent-blue);">${data.wordCount}</span></div>
        <div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:16px;"><strong>Internal Links</strong><br><span style="font-size:1.25rem; font-weight:700; color:var(--accent-green);">${data.internalLinks}</span></div>
        <div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:16px;"><strong>External Links</strong><br><span style="font-size:1.25rem; font-weight:700; color:var(--accent-gold);">${data.externalLinks}</span></div>
        <div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:16px;"><strong>H2 Tags</strong><br><span style="color:var(--text-secondary); font-size:0.85rem;">${data.h2?.length || 0} found</span></div>
      </div>
      <div style="margin-top:12px; background:var(--bg-input); border-radius:var(--radius-sm); padding:16px;">
        <strong>Meta Description</strong><br><span style="color:var(--text-secondary); font-size:0.85rem;">${escHTML(data.description) || '<span class="text-red">Missing!</span>'}</span>
      </div>`;
    } else {
      resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-bottom:8px; display:block;"></i><strong>Could not analyze this page.</strong>${data.error ? '<br><br>' + escHTML(data.error) : ''}</div>`;
    }
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

// ===========================================================
// AEO OPTIMIZATION
// ===========================================================

async function runAEOAnalysis() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('aeoResults');
  const checklistEl = document.getElementById('aeoChecklist');
  const kpiEl = document.getElementById('aeoKPIs');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const domain = document.getElementById('aeoDomainInput').value.trim();
  const keywordsRaw = document.getElementById('aeoKeywordsInput').value.trim();
  if (!domain) { document.getElementById('aeoDomainInput').focus(); return; }

  if (!(await useCredits('aeo_analysis'))) return;

  const keywords = keywordsRaw ? keywordsRaw.split(',').map(k => k.trim()).filter(k => k).slice(0, 10) : [];

  kpiEl.style.display = 'grid';
  ['aeoScore','aeoSnippets','aeoPAA','aeoSerpFeatures'].forEach(id => {
    document.getElementById(id).innerHTML = '<span class="loading-spinner"></span>';
  });
  showLoading(resultsEl, `Analyzing AEO readiness for ${domain}...`);
  checklistEl.innerHTML = '';

  try {
    const [orgKeywords] = await Promise.all([
      dfs.getDomainOrganicKeywords(domain, 2840, 'en', 50)
    ]);

    const checkKeywords = keywords.length > 0 ? keywords.slice(0, 5) : (orgKeywords.keywords || []).slice(0, 5).map(k => k.keyword);

    let snippetCount = 0, paaCount = 0, totalSerpFeatures = 0;
    let serpDetails = [];

    if (checkKeywords.length > 0) {
      const serpPromises = checkKeywords.map(kw => dfs.getSERPResults(kw, 2840, 'en', 20).catch(() => null));
      const serpResults = await Promise.all(serpPromises);

      serpResults.forEach((sr, i) => {
        if (!sr) return;
        const hasSnippet = sr.featuredSnippet ? 1 : 0;
        const paaItems = sr.peopleAlsoAsk?.length || 0;
        snippetCount += hasSnippet;
        paaCount += paaItems;
        const featureTypes = new Set();
        if (sr.featuredSnippet) featureTypes.add('featured_snippet');
        if (paaItems > 0) featureTypes.add('people_also_ask');
        totalSerpFeatures += featureTypes.size;

        const domainClean = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
        const domainInResults = (sr.items || []).find(item => (item.url || '').includes(domainClean));

        serpDetails.push({
          keyword: checkKeywords[i], hasSnippet, paaCount: paaItems,
          featuredSnippet: sr.featuredSnippet,
          position: domainInResults ? domainInResults.position : null,
          paaQuestions: sr.peopleAlsoAsk?.slice(0, 3) || []
        });
      });
    }

    let pageAnalysis = null;
    try {
      const domainUrl = domain.startsWith('http') ? domain : `https://${domain}`;
      pageAnalysis = await dfs.analyzeContent(domainUrl);
    } catch (e) { /* ignore */ }

    // Calculate AEO Score
    let aeoScore = 0, scoreBreakdown = [];
    const snippetScore = Math.min(snippetCount * 10, 25);
    aeoScore += snippetScore;
    scoreBreakdown.push({ label: 'Featured Snippets', score: snippetScore, max: 25, detail: `${snippetCount} of ${checkKeywords.length} keywords` });

    const paaScore = Math.min(Math.round((paaCount / Math.max(checkKeywords.length, 1)) * 20), 20);
    aeoScore += paaScore;
    scoreBreakdown.push({ label: 'People Also Ask', score: paaScore, max: 20, detail: `${paaCount} PAA appearances` });

    let contentScore = 0;
    if (pageAnalysis && pageAnalysis.success) {
      if (pageAnalysis.wordCount > 1000) contentScore += 8;
      else if (pageAnalysis.wordCount > 500) contentScore += 4;
      if (pageAnalysis.h1 && pageAnalysis.h1.length > 0) contentScore += 4;
      if (pageAnalysis.h2 && pageAnalysis.h2.length >= 3) contentScore += 4;
      if (pageAnalysis.description) contentScore += 4;
    }
    aeoScore += contentScore;
    scoreBreakdown.push({ label: 'Content Structure', score: contentScore, max: 20, detail: pageAnalysis?.success ? `${pageAnalysis.wordCount} words, ${(pageAnalysis.h2 || []).length} H2s` : 'Could not analyze' });

    const orgCount = orgKeywords.keywords?.length || 0;
    const orgScore = Math.min(Math.round((orgCount / 50) * 20), 20);
    aeoScore += orgScore;
    scoreBreakdown.push({ label: 'Organic Keyword Coverage', score: orgScore, max: 20, detail: `${orgCount} organic keywords` });

    let schemaScore = 0;
    if (pageAnalysis && pageAnalysis.success && pageAnalysis.hasSchemaMarkup) schemaScore += 15;
    aeoScore += schemaScore;
    scoreBreakdown.push({ label: 'Schema/Structured Data', score: schemaScore, max: 15, detail: schemaScore > 0 ? 'Detected' : 'Not detected on homepage' });

    const scoreColor = aeoScore >= 70 ? 'var(--accent-green)' : aeoScore >= 40 ? 'var(--accent-gold)' : 'var(--accent-red)';
    document.getElementById('aeoScore').innerHTML = `<span style="color:${scoreColor};">${aeoScore}/100</span>`;
    document.getElementById('aeoSnippets').textContent = snippetCount;
    document.getElementById('aeoPAA').textContent = paaCount;
    document.getElementById('aeoSerpFeatures').textContent = totalSerpFeatures;

    let html = `<div class="chart-card" style="margin-top:24px; border-color:${scoreColor};">
      <h4 style="margin-bottom:16px;"><i class="fas fa-chart-pie" style="color:${scoreColor};"></i> AEO Score Breakdown — ${domain}</h4>
      <div style="display:grid; gap:12px;">
        ${scoreBreakdown.map(item => {
          const pct = Math.round((item.score / item.max) * 100);
          const barColor = pct >= 70 ? 'var(--accent-green)' : pct >= 40 ? 'var(--accent-gold)' : 'var(--accent-red)';
          return `<div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <strong>${item.label}</strong><span style="font-weight:700; color:${barColor};">${item.score}/${item.max}</span>
            </div>
            <div style="background:var(--bg-card); border-radius:100px; height:6px; overflow:hidden;">
              <div style="background:${barColor}; height:100%; width:${pct}%; border-radius:100px; transition:width 0.5s ease;"></div>
            </div>
            <small style="color:var(--text-muted); margin-top:4px; display:block;">${item.detail}</small>
          </div>`;
        }).join('')}
      </div>
    </div>`;

    if (serpDetails.length > 0) {
      html += `<div class="chart-card" style="margin-top:24px;">
        <h4 style="margin-bottom:16px;"><i class="fas fa-ranking-star" style="color:var(--accent-blue);"></i> SERP Feature Analysis by Keyword</h4>
        <table class="data-table"><thead><tr><th>Keyword</th><th>Your Position</th><th>Featured Snippet</th><th>PAA Count</th><th>Opportunity</th></tr></thead><tbody>${
          serpDetails.map(sd => {
            const posHtml = sd.position ? `<span class="serp-pos ${sd.position <= 3 ? 'serp-pos-top' : sd.position <= 10 ? 'serp-pos-mid' : 'serp-pos-low'}">${sd.position}</span>` : '<span class="text-muted">Not ranked</span>';
            const snippetHtml = sd.hasSnippet ? '<span class="text-green"><i class="fas fa-star"></i> Yes</span>' : '<span class="text-muted">No</span>';
            const opp = (!sd.position || sd.position > 10) && sd.hasSnippet ? '<span class="badge badge-gold" style="font-size:0.7rem;">GOLDEN</span>' : sd.paaCount > 0 ? '<span class="badge" style="font-size:0.7rem; background:rgba(16,185,129,0.1); border-color:rgba(16,185,129,0.2); color:var(--accent-green);">PAA TARGET</span>' : '<span class="badge" style="font-size:0.7rem;">MONITOR</span>';
            return `<tr><td><strong style="color:var(--text-primary);">${escHTML(sd.keyword)}</strong></td><td>${posHtml}</td><td>${snippetHtml}</td><td>${sd.paaCount}</td><td>${opp}</td></tr>`;
          }).join('')
        }</tbody></table>
      </div>`;
    }

    resultsEl.innerHTML = html;

    // Checklist
    const checks = [
      { label: 'FAQ Schema Markup', desc: 'Structured FAQ data for Google & AI engines', done: schemaScore > 0 },
      { label: 'Conversational Content', desc: 'Q&A formatted content for AI referencing', done: (pageAnalysis?.h2?.length || 0) >= 3 && (pageAnalysis?.wordCount || 0) >= 800 },
      { label: 'Featured Snippet Targeting', desc: `${snippetCount} of ${checkKeywords.length} keywords have featured snippets`, done: snippetCount > 0 },
      { label: 'People Also Ask Coverage', desc: `${paaCount} PAA appearances across analyzed keywords`, done: paaCount > 0 },
      { label: 'Meta Description Optimization', desc: 'All pages have optimized meta descriptions', done: pageAnalysis?.description ? true : false },
      { label: 'Content Depth (>1000 words)', desc: 'Long-form content for authority and AI extraction', done: (pageAnalysis?.wordCount || 0) >= 1000 },
      { label: 'Internal Linking Structure', desc: 'Strong internal links for crawlability and silo authority', done: (pageAnalysis?.internalLinks || 0) >= 5 },
      { label: 'H-tag Hierarchy', desc: 'Proper H1 > H2 > H3 structure for content parsing', done: (pageAnalysis?.h1?.length || 0) > 0 && (pageAnalysis?.h2?.length || 0) > 0 },
    ];

    let checklistHTML = `<div class="chart-card" style="margin-top:24px;">
      <h4 style="margin-bottom:16px;"><i class="fas fa-list-check" style="color:var(--accent-green);"></i> AEO Actionable Checklist</h4>
      <div style="display:grid; gap:12px;">`;
    checks.forEach(c => {
      const icon = c.done ? '<i class="fas fa-check-circle" style="color:var(--accent-green); font-size:1.25rem;"></i>' : '<i class="fas fa-exclamation-triangle" style="color:var(--accent-gold); font-size:1.25rem;"></i>';
      const status = c.done ? '<span class="status status-active">Pass</span>' : '<span class="status status-pending">Needs Work</span>';
      checklistHTML += `<div style="display:flex; align-items:center; gap:16px; padding:16px; background:var(--bg-input); border-radius:var(--radius-sm);">${icon}<div style="flex:1;"><strong>${c.label}</strong><br><small style="color:var(--text-muted);">${c.desc}</small></div>${status}</div>`;
    });
    checklistHTML += '</div></div>';
    checklistEl.innerHTML = checklistHTML;

  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle"></i> ${escHTML(e.message)}</div>`;
    kpiEl.style.display = 'none';
  }
}

// ===========================================================
// CONTENT SILOS
// ===========================================================

let siloPollTimer = null;

async function runSiloAnalysis() {
  const notConnected = checkAPI();
  const resultsEl = document.getElementById('siloResults');
  const kpiEl = document.getElementById('siloKPIs');
  if (notConnected) { resultsEl.innerHTML = notConnected; return; }

  const domain = document.getElementById('siloDomainInput').value.trim();
  if (!domain) { document.getElementById('siloDomainInput').focus(); return; }

  if (!(await useCredits('content_silos'))) return;

  const maxPages = parseInt(document.getElementById('siloDepth').value);

  kpiEl.style.display = 'grid';
  ['siloCount','siloPages','siloAvgLinks','siloOrphans'].forEach(id => {
    document.getElementById(id).innerHTML = '<span class="loading-spinner"></span>';
  });
  showLoading(resultsEl, `Starting crawl of ${domain} to map content silos (up to ${maxPages} pages)...`);

  try {
    const domainUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const audit = await dfs.startOnPageAudit(domainUrl, maxPages);

    if (audit.success) {
      resultsEl.innerHTML = `<div class="chart-card" id="siloStatusCard" style="border-color:var(--accent-blue);">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <div class="loading-spinner" id="siloSpinner" style="width:24px;height:24px;border-width:3px;"></div>
          <div>
            <h4 style="margin:0;" id="siloStatusTitle"><i class="fas fa-satellite-dish" style="color:var(--accent-blue);"></i> Crawling site for silo mapping...</h4>
            <p style="color:var(--text-muted); font-size:0.85rem; margin:4px 0 0;">Task ID: <code class="mono">${audit.taskId}</code></p>
          </div>
        </div>
        <div id="siloProgressBar">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
            <span style="color:var(--text-secondary);" id="siloProgressLabel">Starting crawl...</span>
            <span style="color:var(--text-muted);" id="siloProgressPct">0%</span>
          </div>
          <div style="background:var(--bg-input); border-radius:100px; height:8px; overflow:hidden;">
            <div id="siloProgressFill" style="background:var(--accent-green); height:100%; border-radius:100px; width:0%; transition:width 0.5s ease;"></div>
          </div>
        </div>
      </div>`;

      siloPollTimer = setInterval(() => checkSiloProgress(audit.taskId, domain), 5000);
      setTimeout(() => checkSiloProgress(audit.taskId, domain), 3000);
    }
  } catch (e) {
    resultsEl.innerHTML = `<div class="results-empty" style="color:var(--accent-red);"><i class="fas fa-exclamation-triangle"></i> ${escHTML(e.message)}</div>`;
    kpiEl.style.display = 'none';
  }
}

async function checkSiloProgress(taskId, domain) {
  const labelEl = document.getElementById('siloProgressLabel');
  const pctEl = document.getElementById('siloProgressPct');
  const fillEl = document.getElementById('siloProgressFill');

  if (!labelEl) { clearInterval(siloPollTimer); siloPollTimer = null; return; }

  try {
    const summary = await dfs.getOnPageSummary(taskId);
    if (!summary.success) return;

    const crawled = summary.pagesCrawled || 0;
    const total = summary.pagesCount || 0;
    const progress = total > 0 ? Math.round((crawled / total) * 100) : 0;

    if (total > 0) {
      pctEl.textContent = progress + '%';
      fillEl.style.width = progress + '%';
      labelEl.textContent = `Crawling... ${crawled} of ${total} pages`;
    } else {
      labelEl.textContent = 'Discovering pages...';
    }

    if (summary.crawlProgress === 'finished') {
      clearInterval(siloPollTimer);
      siloPollTimer = null;
      labelEl.textContent = 'Crawl complete! Building silo map...';
      pctEl.textContent = '100%';
      fillEl.style.width = '100%';

      const pages = await dfs.getOnPagePages(taskId, 250);
      if (pages.success && pages.pages.length > 0) {
        buildSiloVisualization(pages.pages, domain);
      } else {
        document.getElementById('siloResults').innerHTML = '<div class="results-empty">Crawl finished but no pages found.</div>';
      }
    }
  } catch (e) { /* Transient error, keep polling */ }
}

function buildSiloVisualization(pages, domain) {
  const resultsEl = document.getElementById('siloResults');
  const silos = {};
  let orphanCount = 0, totalInternalLinks = 0;

  pages.forEach(page => {
    try {
      const url = new URL(page.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const siloName = pathParts.length > 0 ? '/' + pathParts[0] : '/';

      if (!silos[siloName]) silos[siloName] = { name: siloName, pages: [], totalWords: 0, totalInternalLinks: 0 };
      silos[siloName].pages.push({ url: page.url, path: url.pathname, title: page.title || '(No title)', wordCount: page.wordCount || 0, internalLinks: page.internalLinks || 0, externalLinks: page.externalLinks || 0, statusCode: page.statusCode, depth: pathParts.length });
      silos[siloName].totalWords += page.wordCount || 0;
      silos[siloName].totalInternalLinks += page.internalLinks || 0;
      totalInternalLinks += page.internalLinks || 0;
      if ((page.internalLinks || 0) === 0) orphanCount++;
    } catch (e) { }
  });

  const sortedSilos = Object.values(silos).sort((a, b) => b.pages.length - a.pages.length);
  const avgLinks = pages.length > 0 ? Math.round(totalInternalLinks / pages.length) : 0;

  document.getElementById('siloCount').textContent = sortedSilos.length;
  document.getElementById('siloPages').textContent = pages.length;
  document.getElementById('siloAvgLinks').textContent = avgLinks;
  document.getElementById('siloOrphans').textContent = orphanCount;

  const colors = ['var(--accent-blue)', 'var(--accent-gold)', 'var(--accent-green)', 'var(--accent-purple)', 'var(--accent-red)', 'var(--accent-cyan)', '#ec4899', '#f97316'];

  let html = `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:24px; margin-top:24px;">`;
  sortedSilos.forEach((silo, i) => {
    const color = colors[i % colors.length];
    const pillar = silo.pages.filter(p => p.depth <= 1);
    const supporting = silo.pages.filter(p => p.depth === 2);
    const deep = silo.pages.filter(p => p.depth >= 3);

    html += `<div class="card" style="border-left:4px solid ${color};">
      <div style="display:flex; justify-content:space-between; align-items:start;">
        <div><h4 style="color:${color}; margin-bottom:4px;">SILO: ${escHTML(silo.name)}</h4><p style="color:var(--text-muted); font-size:0.85rem;">${silo.pages.length} pages &bull; ${silo.totalWords.toLocaleString()} total words</p></div>
        <span style="font-size:0.75rem; padding:4px 8px; border-radius:4px; background:rgba(255,255,255,0.05); color:var(--text-muted);">${silo.totalInternalLinks} int. links</span>
      </div>
      <div style="padding-left:16px; border-left:2px solid var(--border-color); margin-top:12px; max-height:300px; overflow-y:auto;">`;
    pillar.forEach(p => { html += `<div style="padding:6px 0; font-weight:600;"><a href="${escHTML(p.url)}" target="_blank" style="color:${color}; font-size:0.85rem;">${escHTML(p.path)}</a><span style="font-size:0.75rem; color:var(--text-muted); margin-left:8px;">${p.wordCount}w</span></div>`; });
    supporting.forEach(p => { html += `<div style="padding:3px 0 3px 16px; font-size:0.85rem; color:var(--text-secondary);">&#8627; <a href="${escHTML(p.url)}" target="_blank" style="color:var(--text-secondary); font-size:0.82rem;">${escHTML(p.path)}</a><span style="font-size:0.7rem; color:var(--text-muted); margin-left:4px;">${p.wordCount}w</span></div>`; });
    if (deep.length > 0) {
      html += `<div style="padding:6px 0 4px 32px; font-size:0.8rem; color:var(--text-muted);">Tier 3: ${deep.length} deep page${deep.length > 1 ? 's' : ''}</div>`;
      deep.slice(0, 3).forEach(p => { html += `<div style="padding:2px 0 2px 40px; font-size:0.8rem; color:var(--text-muted);">&#8627; <a href="${escHTML(p.url)}" target="_blank" style="color:var(--text-muted); font-size:0.78rem;">${escHTML(p.path)}</a></div>`; });
      if (deep.length > 3) html += `<div style="padding:2px 0 2px 40px; font-size:0.75rem; color:var(--text-muted);">... and ${deep.length - 3} more</div>`;
    }
    html += `</div><div style="margin-top:12px; font-size:0.8rem;">${silo.totalInternalLinks > 0 ? '<span class="text-green"><i class="fas fa-link"></i> Internal links found</span>' : '<span class="text-red"><i class="fas fa-unlink"></i> Weak internal linking</span>'}</div></div>`;
  });
  html += '</div>';

  html += `<div class="chart-card" style="margin-top:24px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h4><i class="fas fa-list" style="color:var(--accent-blue);"></i> All Crawled Pages (${pages.length})</h4>
      <button class="btn btn-sm btn-outline" onclick="exportTableCSV('siloPagesTable')"><i class="fas fa-download"></i> CSV</button>
    </div>
    <table class="data-table" id="siloPagesTable"><thead><tr><th>URL</th><th>Title</th><th>Status</th><th>Words</th><th>Int. Links</th><th>Ext. Links</th></tr></thead><tbody>${
      pages.sort((a, b) => (b.internalLinks || 0) - (a.internalLinks || 0)).map(p => `<tr>
        <td class="truncate" style="max-width:220px;"><a href="${escHTML(p.url)}" target="_blank" style="font-size:0.8rem;">${escHTML(p.url)}</a></td>
        <td class="truncate" style="max-width:180px;">${escHTML(p.title) || '<span class="text-red">Missing</span>'}</td>
        <td>${p.statusCode === 200 ? '<span class="text-green">200</span>' : `<span class="text-red">${p.statusCode}</span>`}</td>
        <td>${(p.wordCount || 0).toLocaleString()}</td>
        <td>${p.internalLinks || 0}</td>
        <td>${p.externalLinks || 0}</td>
      </tr>`).join('')
    }</tbody></table>
  </div>`;

  resultsEl.innerHTML = html;
}

// ===========================================================
// OVERVIEW — Live KPIs
// ===========================================================

async function loadOverviewKPIs() {
  if (!dfs.isConnected()) return;
  if (!(await useCredits('overview_kpis'))) return;

  const brandUrl = document.querySelector('#page-settings input[type="url"]');
  let domain = brandUrl ? brandUrl.value.trim() : 'jeff-cline.com';
  domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  if (!domain) return;

  ['ovOrgTraffic','ovOrgKeywords','ovTrafficCost','ovBacklinks','ovRefDomains','ovDomainRank'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<span class="loading-spinner"></span>';
  });

  try {
    const [rank, blSummary] = await Promise.all([
      dfs.getDomainRank(domain).catch(() => null),
      dfs.getBacklinkSummary(domain).catch(() => null)
    ]);

    if (rank && rank.success !== false) {
      document.getElementById('ovOrgTraffic').textContent = DataForSEOClient.formatNumber(rank.organicTraffic || 0);
      document.getElementById('ovOrgTrafficSub').innerHTML = `<span style="color:var(--accent-green);">${domain}</span>`;
      document.getElementById('ovOrgKeywords').textContent = DataForSEOClient.formatNumber(rank.organicKeywords || 0);
      document.getElementById('ovOrgKeywordsSub').innerHTML = `<span style="color:var(--accent-green);">ranking in Google</span>`;
      document.getElementById('ovTrafficCost').textContent = '$' + DataForSEOClient.formatNumber(rank.organicCost || 0);
      document.getElementById('ovTrafficCostSub').innerHTML = `<span style="color:var(--accent-green);">estimated value</span>`;
    } else {
      ['ovOrgTraffic','ovOrgKeywords','ovTrafficCost'].forEach(id => {
        document.getElementById(id).innerHTML = '<span class="text-muted" style="font-size:0.85rem;">No data</span>';
      });
    }

    if (blSummary && blSummary.success !== false) {
      document.getElementById('ovBacklinks').textContent = DataForSEOClient.formatNumber(blSummary.backlinks || 0);
      document.getElementById('ovBacklinksSub').innerHTML = `<span style="color:var(--accent-green);">total backlinks</span>`;
      document.getElementById('ovRefDomains').textContent = DataForSEOClient.formatNumber(blSummary.referringDomains || 0);
      document.getElementById('ovRefDomainsSub').innerHTML = `<span style="color:var(--accent-green);">unique domains</span>`;
      document.getElementById('ovDomainRank').textContent = blSummary.rank || '0';
      document.getElementById('ovDomainRankSub').innerHTML = `<span style="color:var(--accent-green);">domain rank</span>`;
    } else {
      ['ovBacklinks','ovRefDomains','ovDomainRank'].forEach(id => {
        document.getElementById(id).innerHTML = '<span class="text-muted" style="font-size:0.85rem;">No data</span>';
      });
    }
  } catch (e) {
    console.warn('Overview KPI load error:', e);
  }
}

// ===========================================================
// EXPENSES — API Balance
// ===========================================================

async function loadExpenseDfsBalance() {
  if (!dfs.isConnected()) return;
  const kpiEl = document.getElementById('expenseDfsKPIs');
  const balEl = document.getElementById('expDfsBalance');
  if (!kpiEl || !balEl) return;
  kpiEl.style.display = 'grid';
  balEl.innerHTML = '<span class="loading-spinner"></span>';
  try {
    const result = await dfs.testConnection();
    if (result.success) {
      balEl.textContent = '$' + (parseFloat(result.balance) || 0).toFixed(2);
    } else {
      balEl.innerHTML = '<span class="text-muted" style="font-size:0.85rem;">Error</span>';
    }
  } catch (e) {
    balEl.innerHTML = '<span class="text-muted" style="font-size:0.85rem;">Error</span>';
  }
}

// ===========================================================
// WEBSITE BUILDER
// ===========================================================

async function runWebsiteBuilder() {
  const websiteUrl = document.getElementById('wbWebsiteUrl').value.trim();
  const websiteName = document.getElementById('wbWebsiteName').value.trim();
  const keyword1 = document.getElementById('wbKeyword1').value.trim();
  const keyword2 = document.getElementById('wbKeyword2').value.trim();
  const keyword3 = document.getElementById('wbKeyword3').value.trim();
  const businessContext = document.getElementById('wbBusinessContext').value.trim();
  const phoneNumber = document.getElementById('wbPhoneNumber').value.trim();

  const statusEl = document.getElementById('wbStatus');
  const resultsEl = document.getElementById('wbResults');

  if (!websiteUrl || !websiteName || !keyword1 || !keyword2 || !keyword3 || !businessContext) {
    statusEl.innerHTML = '<span class="text-red"><i class="fas fa-exclamation-triangle"></i> Please fill in all required fields.</span>';
    return;
  }

  const formData = { websiteUrl, websiteName, keyword1, keyword2, keyword3, businessContext, phoneNumber };

  // Check credits
  const btn = document.getElementById('wbSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="loading-spinner"></span> Checking credits...';
  statusEl.innerHTML = '';
  resultsEl.innerHTML = '';

  try {
    const creditRes = await fetch('/api/agency/credits/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ tool: 'website_builder' })
    });

    const creditData = await creditRes.json();

    if (creditRes.status === 402) {
      // Insufficient credits — save failed attempt
      try {
        await fetch('/api/agency/credits/use', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ tool: 'log_failed_attempt' })
        }).catch(() => {});

        // Save the failed attempt directly
        await fetch('/api/agency/admin/failed-attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            tool: 'website_builder',
            formData,
            userEmail: currentUser?.email,
            userName: currentUser?.name
          })
        }).catch(() => {});
      } catch (e) { /* best effort */ }

      const resetDate = creditData.resetDate ? new Date(creditData.resetDate).toLocaleDateString() : 'the 1st of next month';
      showCreditError(
        `Insufficient funds. This tool costs $${creditData.cost}, ` +
        `but you only have $${creditData.creditsRemaining} remaining ($${creditData.creditsUsed}/$${creditData.monthlyLimit} used). ` +
        `Budget resets on ${resetDate}.`
      );
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Build Optimized Website';
      return;
    }

    if (creditRes.status === 401) {
      handleSessionExpired();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Build Optimized Website';
      return;
    }

    if (!creditRes.ok || !creditData.success) {
      // Allow on unexpected errors
    } else {
      // Update credit badge
      if (!creditData.isUnlimited) {
        creditStatus = {
          creditsUsed: creditData.creditsUsed,
          monthlyLimit: creditData.monthlyLimit,
          creditsRemaining: creditData.creditsRemaining,
          isUnlimited: false,
        };
        updateCreditBadge();
      }
    }
  } catch (e) {
    // Allow on network errors
  }

  // Now call the website builder API
  btn.innerHTML = '<span class="loading-spinner"></span> Building your site... (this may take 1-2 minutes)';
  statusEl.innerHTML = '<div style="padding:16px; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.2); border-radius:var(--radius-sm); color:var(--accent-gold);"><i class="fas fa-cog fa-spin"></i> Analyzing keywords, generating content architecture, and building pages. This typically takes 1-2 minutes...</div>';

  try {
    const res = await fetch('/api/one-click-demo-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      statusEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> ${escHTML(data.error || 'Something went wrong')}</span>`;
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Build Optimized Website';
      return;
    }

    statusEl.innerHTML = `<div style="padding:16px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); border-radius:var(--radius-sm); color:var(--accent-green);"><i class="fas fa-check-circle"></i> Demo site built with <strong>${data.totalPages} pages</strong>!</div>`;

    let linksHtml = '<div class="chart-card" style="margin-top:24px; border-color:var(--accent-green);"><h4 style="margin-bottom:16px;"><i class="fas fa-link" style="color:var(--accent-green);"></i> Your Demo Site Links</h4><div style="display:grid; gap:12px;">';
    (data.keywords || []).forEach((kw, i) => {
      const url = data.demoUrls?.[i] || `/d/${data.keywordSlugs?.[i]}`;
      linksHtml += `<div style="display:flex; align-items:center; gap:12px; padding:12px; background:var(--bg-input); border-radius:var(--radius-sm);">
        <div class="card-icon card-icon-gold" style="width:36px;height:36px;font-size:0.8rem;"><i class="fas fa-file-code"></i></div>
        <div style="flex:1;"><strong>${escHTML(kw)}</strong><br><a href="${escHTML(url)}" target="_blank" style="font-size:0.85rem; color:var(--accent-blue);">${escHTML(url)}</a></div>
        <a href="${escHTML(url)}" target="_blank" class="btn btn-sm btn-primary"><i class="fas fa-external-link-alt"></i> View</a>
      </div>`;
    });
    linksHtml += '</div></div>';
    resultsEl.innerHTML = linksHtml;

  } catch (e) {
    statusEl.innerHTML = `<span class="text-red"><i class="fas fa-times-circle"></i> Network error: ${escHTML(e.message)}</span>`;
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Build Optimized Website';
}

// ===========================================================
// MARKETING SITE BUILDER
// ===========================================================

async function handleMarketingBuild() {
  const success = await useCredits('website_builder');
  if (success) {
    window.open('/one-click-demo', '_blank');
  } else {
    const modal = document.getElementById('insufficientCreditsModal');
    if (modal) modal.style.display = 'flex';
  }
}

// ===========================================================
// FAILED ATTEMPTS (Super Admin)
// ===========================================================

async function loadFailedAttempts() {
  const el = document.getElementById('saFailedAttempts');
  if (!el) return;

  el.innerHTML = '<div class="results-loading"><div class="loading-spinner"></div><br>Loading failed attempts...</div>';

  try {
    const res = await fetch('/api/agency/admin/failed-attempts', { credentials: 'same-origin' });
    if (!res.ok) {
      el.innerHTML = '<div class="results-empty" style="color:var(--accent-red);">Failed to load.</div>';
      return;
    }

    const attempts = await res.json();
    if (!attempts || attempts.length === 0) {
      el.innerHTML = '<div class="results-empty">No failed attempts recorded. 🎉</div>';
      return;
    }

    el.innerHTML = `<table class="data-table"><thead><tr><th>Time</th><th>User</th><th>Tool</th><th>Details</th></tr></thead><tbody>${
      attempts.map(a => `<tr>
        <td style="font-size:0.8rem; color:var(--text-muted); white-space:nowrap;">${a.timestamp ? new Date(a.timestamp).toLocaleString() : '-'}</td>
        <td><strong style="color:var(--text-primary);">${escHTML(a.userName || '-')}</strong><br><small style="color:var(--text-muted);">${escHTML(a.userEmail || '-')}</small></td>
        <td><span class="badge badge-gold" style="font-size:0.7rem;">${escHTML(a.tool || '-')}</span></td>
        <td style="font-size:0.8rem; color:var(--text-secondary); max-width:300px; overflow:hidden; text-overflow:ellipsis;">${a.formData ? escHTML(JSON.stringify(a.formData).substring(0, 100)) + '...' : '-'}</td>
      </tr>`).join('')
    }</tbody></table>`;
  } catch (e) {
    el.innerHTML = `<div class="results-empty" style="color:var(--accent-red);">${escHTML(e.message)}</div>`;
  }
}

// ===========================================================
// UTILITIES
// ===========================================================

function escHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function copyPixelCode() {
  const code = document.querySelector('.pixel-code pre')?.textContent;
  if (code) {
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.querySelector('.copy-btn');
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 2000);
    });
  }
}

function exportTableCSV(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = table.querySelectorAll('tr');
  let csv = '';
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    const rowData = Array.from(cells).map(cell => '"' + cell.textContent.replace(/"/g, '""').trim() + '"');
    csv += rowData.join(',') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = tableId + '_export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ===========================================================
// INIT
// ===========================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Ensure super admin exists
  await ensureSetup();

  // Check if user is already logged in
  const isAuthenticated = await checkSession();

  if (isAuthenticated) {
    onLoginSuccess();
  } else {
    // Show login overlay (already visible by default)
    document.getElementById('loginOverlay').style.display = 'flex';
    updateAPIStatusUI(false);
  }

  // Enter key bindings
  const enterBindings = [
    { input: 'loginPassword', action: doLogin },
    { input: 'kwSeedInput', action: runKeywordSuggestions },
    { input: 'kwRelatedInput', action: runRelatedKeywords },
    { input: 'kwQuestionsInput', action: runKeywordQuestions },
    { input: 'kwDifficultyInput', action: runDifficultyCheck },
    { input: 'kwGapCompDomain', action: runKeywordGap },
    { input: 'blDomainInput', action: runBacklinkAnalysis },
    { input: 'daDomainInput', action: runDomainAnalysis },
    { input: 'serpKeywordInput', action: runSERPCheck },
    { input: 'compDomainInput', action: runCompetitorAnalysis },
    { input: 'auditUrlInput', action: runSiteAudit },
    { input: 'instantUrlInput', action: runInstantAnalysis },
    { input: 'aeoDomainInput', action: runAEOAnalysis },
    { input: 'aeoKeywordsInput', action: runAEOAnalysis },
    { input: 'siloDomainInput', action: runSiloAnalysis },
  ];

  enterBindings.forEach(({ input, action }) => {
    const el = document.getElementById(input);
    if (el && action) {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          action();
        }
      });
    }
  });

  // Login: Enter on email moves to password
  const loginEmail = document.getElementById('loginEmail');
  if (loginEmail) {
    loginEmail.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('loginPassword')?.focus();
      }
    });
  }
});
