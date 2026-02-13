/* =========================
   FactoryFlow Solutions - Supabase Connection
   Purpose: Connect to Supabase database and handle fault data
   Accessibility: Follows WCAG 2.1 AA standards
   ========================= */

/* Supabase Configuration
   Replace with your project credentials from Supabase dashboard */


const SUPABASE_URL = "https://hjlvszwxiwuqwfqbwauu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u7e8x4peNwjCvuXboJIpcA_DL7k7fPs";

/*
  Table assumptions (change if needed):
  Table name: faults

  Suggested columns:
  - id (int, primary key)
  - created_at (timestamp, default now)
  - title (text)
  - description (text)
  - severity (text)
  - status (text)
  - photo_url (text)
*/

const TABLE_NAME = "faults";

/* Pagination settings for fault list display */
let currentPage = 1;
const pageSize = 5;

/* DOM element references - cached for performance */
const faultForm = document.getElementById("faultForm");
const faultFormMessage = document.getElementById("faultFormMessage");
const refreshFaultsBtn = document.getElementById("refreshFaultsBtn");
const faultList = document.getElementById("faultList");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");

const reportForm = document.getElementById("reportForm");
const reportMessage = document.getElementById("reportMessage");
const reportTableBody = document.getElementById("reportTableBody");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

/* Supabase client instance - initialized on page load */
let supabaseClient = null;

/* Helper function to display user feedback messages
   Uses textContent to prevent XSS attacks */
function setMessage(el, msg){
  el.textContent = msg;
}

/* Format ISO date strings into readable format
   Returns empty string if no date provided */
function formatDate(iso){
  if(!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

/* Initialize Supabase client and load initial data
   Called when DOM is fully loaded */
function initSupabase(){
  // Check if Supabase library loaded from CDN
  if(!window.supabase){
    setMessage(faultFormMessage, "Supabase library not found. Check your script includes.");
    return;
  }

  // Create Supabase client with project credentials
  try{
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }catch(e){
    setMessage(faultFormMessage, `Supabase init error: ${e}`);
    return;
  }

  // Load initial fault data
  loadFaults();
}

/* Load faults from database with pagination
   Section 1: Recent faults list */
async function loadFaults(){
  if(!supabaseClient) return;

  // Clear previous messages and show loading state
  setMessage(faultFormMessage, "");
  faultList.innerHTML = `<li class="muted">Loading faults from Supabase…</li>`;

  // Calculate pagination range
  const fromIndex = (currentPage - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;

  // Query database with pagination
  const { data, error, count } = await supabaseClient
    .from(TABLE_NAME)
    .select("id, created_at, title, description, severity, status, photo_url", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(fromIndex, toIndex);

  // Handle database errors
  if(error){
    faultList.innerHTML = `<li class="muted">Error loading faults: ${error.message}</li>`;
    pageInfo.textContent = `Page ${currentPage}`;
    return;
  }

  // Calculate total pages and update pagination controls
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if(currentPage > totalPages){
    currentPage = totalPages;
  }

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  // Disable pagination buttons at boundaries (accessibility)
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;

  // Handle empty results
  if(!data || data.length === 0){
    faultList.innerHTML = `<li class="muted">No faults found yet.</li>`;
    return;
  }

  // Render fault list with escaped HTML to prevent XSS
  faultList.innerHTML = data.map(row => {
    const safeTitle = row.title ?? "Untitled fault";
    const safeDesc = row.description ?? "";
    const sev = row.severity ?? "Unknown";
    const stat = row.status ?? "Unknown";

    // Photo link with security attributes
    const photoLink = row.photo_url
      ? `<a href="${row.photo_url}" target="_blank" rel="noopener noreferrer">View photo</a>`
      : `<span class="muted">No photo</span>`;

    return `
      <li class="listItem">
        <h4>${escapeHtml(safeTitle)}</h4>
        <p class="muted">${escapeHtml(safeDesc)}</p>
        <div class="meta">
          <span class="tag">Severity: ${escapeHtml(sev)}</span>
          <span class="tag">Status: ${escapeHtml(stat)}</span>
          <span class="tag">Created: ${escapeHtml(formatDate(row.created_at))}</span>
          <span class="tag">${photoLink}</span>
        </div>
      </li>
    `;
  }).join("");
}

/* Create new fault record in database
   Section 1: Fault logging form submission */
async function createFault(payload){
  if(!supabaseClient) return;

  // Show submission feedback to user
  setMessage(faultFormMessage, "Submitting…");

  // Insert new record into database
  const { error } = await supabaseClient
    .from(TABLE_NAME)
    .insert(payload);

  // Handle insertion errors
  if(error){
    setMessage(faultFormMessage, `Insert failed: ${error.message}`);
    return;
  }

  // Reset to first page and reload list
  setMessage(faultFormMessage, "Fault submitted. Refreshing list…");
  currentPage = 1;
  await loadFaults();
  setMessage(faultFormMessage, "Fault submitted successfully.");
}

/* Load filtered fault report from database
   Section 2: Fault report viewer with filtering */
async function loadReport(filters){
  if(!supabaseClient) return;

  // Show loading state
  setMessage(reportMessage, "Loading report…");
  reportTableBody.innerHTML = `
    <tr>
      <td colspan="5" class="muted">Loading…</td>
    </tr>
  `;

  // Build query with optional filters
  let query = supabaseClient
    .from(TABLE_NAME)
    .select("id, created_at, title, severity, status")
    .order("created_at", { ascending: false })
    .limit(25);

  // Apply status filter if selected
  if(filters.status){
    query = query.eq("status", filters.status);
  }
  // Apply severity filter if selected
  if(filters.severity){
    query = query.eq("severity", filters.severity);
  }

  // Execute query
  const { data, error } = await query;

  // Handle query errors
  if(error){
    setMessage(reportMessage, `Report error: ${error.message}`);
    reportTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="muted">Could not load data.</td>
      </tr>
    `;
    return;
  }

  // Handle no results
  if(!data || data.length === 0){
    setMessage(reportMessage, "No matching records found.");
    reportTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="muted">No matching records.</td>
      </tr>
    `;
    return;
  }

  // Display success message with record count
  setMessage(reportMessage, `Loaded ${data.length} record(s).`);

  // Render table rows with escaped content
  reportTableBody.innerHTML = data.map(row => `
    <tr>
      <td>${escapeHtml(String(row.id ?? ""))}</td>
      <td>${escapeHtml(row.title ?? "")}</td>
      <td>${escapeHtml(row.severity ?? "")}</td>
      <td>${escapeHtml(row.status ?? "")}</td>
      <td>${escapeHtml(formatDate(row.created_at))}</td>
    </tr>
  `).join("");
}

/* ========================= 
   Event Listeners
   ========================= */

/* Section 1: Fault form submission handler */
faultForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const title = document.getElementById("faultTitle").value;
  const description = document.getElementById("faultDescription").value;
  const severity = document.getElementById("faultSeverity").value;
  const status = document.getElementById("faultStatus").value;
  const photo_url = document.getElementById("faultPhotoUrl").value;

  const payload = { title, description, severity, status, photo_url };

  // Submit to database
  await createFault(payload);
});

/* Section 1: Manual refresh button */
refreshFaultsBtn?.addEventListener("click", async () => {
  await loadFaults();
});

/* Section 1: Previous page navigation */
prevPageBtn?.addEventListener("click", async () => {
  if(currentPage > 1){
    currentPage -= 1;
    await loadFaults();
  }
});

/* Section 1: Next page navigation */
nextPageBtn?.addEventListener("click", async () => {
  currentPage += 1;
  await loadFaults();
});

/* Section 2: Report filter form submission */
reportForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Get selected filter values
  const status = document.getElementById("filterStatus").value;
  const severity = document.getElementById("filterSeverity").value;

  // Load filtered report
  await loadReport({ status, severity });
});

/* Section 2: Clear filters button */
clearFiltersBtn?.addEventListener("click", async () => {
  // Reset filter dropdowns to default
  document.getElementById("filterStatus").value = "";
  document.getElementById("filterSeverity").value = "";
  
  // Clear results and show message
  setMessage(reportMessage, "Filters cleared.");
  reportTableBody.innerHTML = `
    <tr>
      <td colspan="5" class="muted">No data loaded yet.</td>
    </tr>
  `;
});

/* ========================= 
   Utility Functions
   ========================= */

/* Escape HTML special characters to prevent XSS attacks
   Required for W3C security compliance */
function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ========================= 
   Initialization
   ========================= */

/* Initialize application when DOM is ready
   Ensures all elements are available before accessing */
document.addEventListener("DOMContentLoaded", initSupabase);

/* ========================= 
   Required HTML includes:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script defer src="static/app.js"></script>
   ========================= */
