const API = "http://localhost:3001/api";

// ── State ─────────────────────────────────────────────────────────────────────
let allCases = [];
let selectedRating = "Incorrect";

// ── Boot ──────────────────────────────────────────────────────────────────────
window.onload = async () => {
  await loadAll();
};

async function loadAll() {
  await Promise.all([loadStats(), loadRecentTable(), loadHistory()]);
}

// ── Tab switching ─────────────────────────────────────────────────────────────
function showTab(name) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach((b) => {
    if (b.getAttribute("onclick").includes(name)) b.classList.add("active");
  });
}

// ── Stats ─────────────────────────────────────────────────────────────────────
async function loadStats() {
  try {
    const res = await fetch(`${API}/stats`);
    const json = await res.json();
    const s = json.data;

    document.getElementById("stats-cards").innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Total Logged</div>
        <div class="stat-value" style="color:#60a5fa">${s.total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Failures</div>
        <div class="stat-value" style="color:#f87171">${s.failures}</div>
        <div class="stat-sub">${s.failureRate}% of total</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Top Bug Type</div>
        <div class="stat-value" style="color:#c084fc;font-size:1.1rem;margin-top:4px">${s.topBugType}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Top Category</div>
        <div class="stat-value" style="color:#34d399;font-size:1.1rem;margin-top:4px">${s.topCategory}</div>
      </div>
    `;
  } catch (e) {
    document.getElementById("stats-cards").innerHTML =
      `<p style="color:#f87171">Could not load stats. Is the server running?</p>`;
  }
}

// ── Recent table (dashboard) ──────────────────────────────────────────────────
async function loadRecentTable() {
  try {
    const res = await fetch(`${API}/testcases`);
    const json = await res.json();
    allCases = json.data;
    document.getElementById("recent-table").innerHTML =
      buildTable(allCases.slice(0, 5));
  } catch (e) {
    document.getElementById("recent-table").innerHTML =
      `<p style="color:#f87171">Could not load test cases.</p>`;
  }
}

// ── History table ─────────────────────────────────────────────────────────────
async function loadHistory() {
  try {
    const res = await fetch(`${API}/testcases`);
    const json = await res.json();
    allCases = json.data;
    renderHistory();
  } catch (e) {
    document.getElementById("history-table").innerHTML =
      `<p style="color:#f87171">Could not load test cases.</p>`;
  }
}

function renderHistory() {
  const q = document.getElementById("search").value.toLowerCase();
  const bug = document.getElementById("filter-bug").value;
  const sev = document.getElementById("filter-sev").value;
  const cat = document.getElementById("filter-cat").value;

  const filtered = allCases.filter((c) => {
    if (q && !c.prompt.toLowerCase().includes(q) &&
        !c.response.toLowerCase().includes(q) &&
        !c.notes.toLowerCase().includes(q)) return false;
    if (bug && c.bugType !== bug) return false;
    if (sev && c.severity !== sev) return false;
    if (cat && c.category !== cat) return false;
    return true;
  });

  document.getElementById("history-count").textContent =
    `Showing ${filtered.length} of ${allCases.length} cases`;
  document.getElementById("history-table").innerHTML = buildTable(filtered);
}

// ── Build table HTML ──────────────────────────────────────────────────────────
function buildTable(cases) {
  if (!cases.length) {
    return `<div class="table-wrap"><div class="empty">No test cases found.</div></div>`;
  }

  const rows = cases.map((tc) => `
    <tr onclick="openModal('${tc.id}')">
      <td>${formatDate(tc.createdAt)}</td>
      <td class="td-prompt">${escape(tc.prompt)}</td>
      <td><span class="badge badge-bug">${tc.bugType}</span></td>
      <td><span class="badge ${sevClass(tc.severity)}">${tc.severity}</span></td>
      <td style="color:#94a3b8;font-size:0.8rem">${tc.category}</td>
    </tr>
  `).join("");

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Prompt</th>
            <th>Bug Type</th>
            <th>Severity</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(id) {
  const tc = allCases.find((c) => c.id === id);
  if (!tc) return;

  document.getElementById("modal-id").textContent = tc.id;

  const tags = tc.edgeCaseTags.length
    ? tc.edgeCaseTags.map((t) => `<span class="badge badge-tag">${t}</span>`).join("")
    : `<span style="color:#475569">None</span>`;

  document.getElementById("modal-body").innerHTML = `
    <div class="modal-row">
      <div class="modal-label">Prompt</div>
      <div class="modal-value">${escape(tc.prompt)}</div>
    </div>
    <div class="modal-row">
      <div class="modal-label">AI Response</div>
      <div class="modal-value mono">${escape(tc.response)}</div>
    </div>
    <div class="modal-grid">
      <div>
        <div class="modal-label">Category</div>
        <div class="modal-value">${tc.category}</div>
      </div>
      <div>
        <div class="modal-label">Bug Type</div>
        <div class="modal-value">${tc.bugType}</div>
      </div>
      <div>
        <div class="modal-label">Rating</div>
        <div class="modal-value">${tc.rating}</div>
      </div>
    </div>
    <div class="modal-row">
      <div class="modal-label">Severity</div>
      <div class="modal-value">
        <span class="badge ${sevClass(tc.severity)}">${tc.severity}</span>
      </div>
    </div>
    <div class="modal-row">
      <div class="modal-label">Edge Case Tags</div>
      <div class="modal-value">${tags}</div>
    </div>
    ${tc.notes ? `
    <div class="modal-row">
      <div class="modal-label">Notes</div>
      <div class="modal-value">${escape(tc.notes)}</div>
    </div>` : ""}
    <div class="modal-row">
      <div class="modal-label">Logged On</div>
      <div class="modal-value" style="color:#64748b;font-size:0.8rem">
        ${formatDate(tc.createdAt)}
      </div>
    </div>
  `;

  document.getElementById("modal").classList.add("open");
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
}

// ── Form ──────────────────────────────────────────────────────────────────────
function selectRating(btn) {
  document.querySelectorAll("#rating-group .pill").forEach((p) =>
    p.classList.remove("active")
  );
  btn.classList.add("active");
  selectedRating = btn.dataset.value;
}

function toggleTag(btn) {
  btn.classList.toggle("active");
}

async function submitForm() {
  const prompt = document.getElementById("f-prompt").value.trim();
  const response = document.getElementById("f-response").value.trim();
  const category = document.getElementById("f-category").value;
  const bugType = document.getElementById("f-bugtype").value;
  const severity = document.getElementById("f-severity").value;
  const notes = document.getElementById("f-notes").value.trim();

  const edgeCaseTags = [...document.querySelectorAll(".tag-pill.active")]
    .map((b) => b.textContent);

  // Validate
  let valid = true;
  if (!prompt) {
    document.getElementById("err-prompt").textContent = "Prompt is required";
    document.getElementById("f-prompt").classList.add("error");
    valid = false;
  } else {
    document.getElementById("err-prompt").textContent = "";
    document.getElementById("f-prompt").classList.remove("error");
  }

  if (!response) {
    document.getElementById("err-response").textContent = "AI Response is required";
    document.getElementById("f-response").classList.add("error");
    valid = false;
  } else {
    document.getElementById("err-response").textContent = "";
    document.getElementById("f-response").classList.remove("error");
  }

  if (!valid) return;

  const btn = document.querySelector(".btn-primary");
  btn.disabled = true;
  btn.textContent = "Saving…";

  try {
    const res = await fetch(`${API}/testcases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, response, category, bugType, severity, edgeCaseTags, notes, rating: selectedRating }),
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.message);

    // Success
    document.getElementById("form-success").style.display = "block";
    document.getElementById("form-error").style.display = "none";

    // Reset form
    document.getElementById("f-prompt").value = "";
    document.getElementById("f-response").value = "";
    document.getElementById("f-notes").value = "";
    document.querySelectorAll(".tag-pill").forEach((p) => p.classList.remove("active"));
    document.querySelectorAll("#rating-group .pill").forEach((p) => p.classList.remove("active"));
    document.querySelector("[data-value='Incorrect']").classList.add("active");
    selectedRating = "Incorrect";

    // Reload data and switch to history after 1.5 seconds
    await loadAll();
    setTimeout(() => {
      document.getElementById("form-success").style.display = "none";
      showTab("history");
    }, 1500);

  } catch (e) {
    document.getElementById("form-error").textContent =
      "Failed to save. Is the server running?";
    document.getElementById("form-error").style.display = "block";
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Test Case";
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function sevClass(sev) {
  return { Low: "badge-low", Medium: "badge-medium", High: "badge-high", Critical: "badge-critical" }[sev] || "";
}

function escape(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}