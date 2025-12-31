/* ================== GLOBAL ERROR DEBUG ================== */
window.onerror = function (msg, src, line, col) {
  alert(`JS ERROR:\n${msg}\nLine: ${line}`);
};

/* ================== API ================== */
const API_BASE = "https://itm-inventory-api.hiteshs.workers.dev";

/* ================== PAGINATION ================== */
let currentPage = 1;
const limit = 50;

/* ================== ELEMENTS ================== */
const loginModal = document.getElementById("loginModal");
const navTabs = document.getElementById("navTabs");
const loginError = document.getElementById("loginError");
const assetForm = document.getElementById("assetForm");

const role = document.getElementById("role");
const title = document.getElementById("title");
const name = document.getElementById("name");
const email = document.getElementById("email");
const batch = document.getElementById("batch");
const rollNo = document.getElementById("rollNo");
const studentLocation = document.getElementById("studentLocation");
const dept = document.getElementById("dept");
const designation = document.getElementById("designation");
const empId = document.getElementById("empId");
const empLocation = document.getElementById("empLocation");

const assetDesc = document.getElementById("assetDesc");
const asset_type = document.getElementById("asset_type");
const assetId = document.getElementById("assetId");
const purchase_date = document.getElementById("purchase_date");
const brand = document.getElementById("brand");
const model = document.getElementById("model");
const ram = document.getElementById("ram");
const processor = document.getElementById("processor");
const hdd = document.getElementById("hdd");
const remarks = document.getElementById("remarks");

const platform = document.getElementById("platform");
const macAddress = document.getElementById("macAddress");
const macField = document.getElementById("macField");

const studentFields = document.getElementById("studentFields");
const empFields = document.getElementById("empFields");

const statTotal = document.getElementById("statTotal");
const dashTable = document.getElementById("dashTable");
const recentList = document.getElementById("recentList");

const searchInput = document.getElementById("searchInput");
const filterRole = document.getElementById("filterRole");
const filterBatch = document.getElementById("filterBatch");

const roleChartCtx = document.getElementById("roleChart");
const batchChartCtx = document.getElementById("batchChart");

let roleChart = null;
let batchChart = null;
let editId = null;

/* ================== LOGIN ================== */
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  if (username.value === "admin" && password.value === "unix@2026") {
    loginModal.style.display = "none";
    navTabs.style.display = "flex";
    switchPage("entry");
  } else {
    loginError.style.display = "block";
  }
});

/* ================== PAGE SWITCH ================== */
function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`page-${page}`).classList.add("active");

  if (page === "entry") {
    navTabs.children[0].classList.add("active");
  } else {
    navTabs.children[1].classList.add("active");
    loadAssets(1);
  }
}

/* ================== FIELD TOGGLES ================== */
function toggleFields() {
  studentFields.style.display = role.value === "student" ? "block" : "none";
  empFields.style.display = role.value === "employee" ? "block" : "none";
}

function toggleMacField() {
  macField.style.display = platform.value === "apple" ? "block" : "none";
  if (platform.value !== "apple") macAddress.value = "";
}
platform.addEventListener("change", toggleMacField);

/* ================== FORM SUBMIT ================== */
assetForm.addEventListener("submit", async e => {
  e.preventDefault();
  const isEdit = editId !== null;

  const payload = {
    role: role.value,
    title: title.value,
    name: name.value,
    email: email.value,
    platform: platform.value,
    mac_address: platform.value === "apple" ? macAddress.value : "",
    batch: role.value === "student" ? batch.value : "",
    roll_no: role.value === "student" ? rollNo.value : "",
    department: role.value === "employee" ? dept.value : "",
    designation: role.value === "employee" ? designation.value : "",
    emp_id: role.value === "employee" ? empId.value : "",
    location: role.value === "student" ? studentLocation.value : empLocation.value,
    asset_desc: assetDesc.value,
    asset_type: asset_type.value,
    serial_no: assetId.value,
    purchase_date: purchase_date.value,
    brand: brand.value,
    model: model.value,
    ram: ram.value,
    processor: processor.value,
    storage: hdd.value,
    remarks: remarks.value
  };

  const res = await fetch(
    isEdit ? `${API_BASE}/assets/${editId}` : `${API_BASE}/assets`,
    {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  const result = await res.json();
  if (!result.success) return alert(result.error || "Operation failed");

  alert(isEdit ? "✅ Asset Updated" : "✅ Asset Added");

  editId = null;
  assetForm.reset();
  toggleFields();
  toggleMacField();
  document.getElementById("submitBtn").innerText = "Submit Entry";
  switchPage("dashboard");
});

/* ================== LOAD ASSETS ================== */
async function loadAssets(page = 1) {
  currentPage = page;

  const search = searchInput.value || "";
  const roleVal = filterRole.value || "";
  const batchVal = filterBatch.value || "";

  const res = await fetch(
    `${API_BASE}/assets?page=${page}&limit=${limit}&search=${search}&role=${roleVal}&batch=${batchVal}`
  );

  const result = await res.json();

  renderTable(result.data);
  renderStats(result.total);
  renderPagination(result.total);
  drawCharts(result.data);
}

/* ================== TABLE ================== */
function renderTable(data) {
  dashTable.innerHTML = "";
  recentList.innerHTML = "";

  data.slice(0, 5).forEach(d => {
    recentList.innerHTML += `<div>• ${d.name} (${d.asset_type})</div>`;
  });

  data.forEach(d => {
    dashTable.innerHTML += `
      <tr>
        <td>${d.name}</td>
        <td>${d.role}</td>
        <td>${d.asset_type}</td>
        <td>${d.serial_no}</td>
        <td>${d.platform || "-"}</td>
        <td>${d.mac_address || "-"}</td>
        <td>
          <button onclick="editAsset(${d.id})">✏️</button>
          <button onclick="deleteAsset(${d.id})">🗑</button>
        </td>
      </tr>
    `;
  });
}

/* ================== STATS ================== */
function renderStats(total) {
  statTotal.innerText = total;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);
  document.getElementById("pageInfo").innerText =
    `Showing ${start}–${end} of ${total}`;
}

/* ================== PAGINATION ================== */
function renderPagination(total) {
  const totalPages = Math.ceil(total / limit);
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  if (currentPage > 1) {
    container.innerHTML += `<button onclick="loadAssets(${currentPage - 1})">‹</button>`;
  }

  for (let i = Math.max(1, currentPage - 3); i <= Math.min(totalPages, currentPage + 3); i++) {
    container.innerHTML += `
      <button class="${i === currentPage ? "active" : ""}"
              onclick="loadAssets(${i})">${i}</button>`;
  }

  if (currentPage < totalPages) {
    container.innerHTML += `<button onclick="loadAssets(${currentPage + 1})">›</button>`;
  }
}

/* ================== EDIT / DELETE ================== */
async function deleteAsset(id) {
  if (!confirm("Delete this asset?")) return;
  await fetch(`${API_BASE}/assets/${id}`, { method: "DELETE" });
  loadAssets(currentPage);
}

async function editAsset(id) {
  const res = await fetch(`${API_BASE}/assets?page=1&limit=1&search=&role=&batch=`);
  const result = await res.json();
  const asset = result.data.find(a => a.id === id);
  if (!asset) return;

  editId = id;
  switchPage("entry");

  role.value = asset.role;
  toggleFields();

  title.value = asset.title || "";
  name.value = asset.name || "";
  email.value = asset.email || "";
  batch.value = asset.batch || "";
  rollNo.value = asset.roll_no || "";
  dept.value = asset.department || "";
  designation.value = asset.designation || "";
  empId.value = asset.emp_id || "";
  studentLocation.value = asset.location || "";
  empLocation.value = asset.location || "";

  platform.value = asset.platform || "";
  toggleMacField();
  macAddress.value = asset.mac_address || "";

  assetDesc.value = asset.asset_desc || "";
  asset_type.value = asset.asset_type || "";
  assetId.value = asset.serial_no || "";
  purchase_date.value = asset.purchase_date || "";
  brand.value = asset.brand || "";
  model.value = asset.model || "";
  ram.value = asset.ram || "";
  processor.value = asset.processor || "";
  hdd.value = asset.storage || "";
  remarks.value = asset.remarks || "";

  document.getElementById("submitBtn").innerText = "Update Entry";
}

/* ================== FILTER ================== */
function applyFilters() {
  loadAssets(1);
}

/* ================== CHARTS ================== */
function drawCharts(data) {
  roleChart?.destroy();
  batchChart?.destroy();

  const roleCount = {};
  const batchCount = {};

  data.forEach(d => {
    roleCount[d.role] = (roleCount[d.role] || 0) + 1;
    if (d.batch) batchCount[d.batch] = (batchCount[d.batch] || 0) + 1;
  });

  roleChart = new Chart(roleChartCtx, {
    type: "doughnut",
    data: { labels: Object.keys(roleCount), datasets: [{ data: Object.values(roleCount) }] }
  });

  batchChart = new Chart(batchChartCtx, {
    type: "bar",
    data: { labels: Object.keys(batchCount), datasets: [{ data: Object.values(batchCount) }] }
  });
}

/* ================== EXCEL ================== */
async function downloadExcel() {
  const res = await fetch(`${API_BASE}/assets?page=1&limit=100000`);
  const result = await res.json();

  const worksheet = XLSX.utils.json_to_sheet(result.data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

  XLSX.writeFile(workbook, "ITM_Inventory.xlsx");
}

/* ================== INIT ================== */
toggleFields();
toggleMacField();
