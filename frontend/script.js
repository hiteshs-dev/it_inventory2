/* ================== GLOBAL ERROR DEBUG ================== */
window.onerror = function (msg, src, line, col) {
  alert("JS ERROR:\n" + msg + "\nLine: " + line + "\nColumn: " + col);
};

/* ================== API ================== */
const API_BASE = "https://itm-inventory-api.hiteshs.workers.dev";

/* ================== ELEMENT BINDINGS ================== */
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
const statStudents = document.getElementById("statStudents");
const statEmployees = document.getElementById("statEmployees");
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
    loadDashboard();
  }
}

/* ================== ROLE / PLATFORM TOGGLE ================== */
function toggleFields() {
  studentFields.style.display = role.value === "student" ? "block" : "none";
  empFields.style.display = role.value === "employee" ? "block" : "none";
}

function toggleMacField() {
  macField.style.display = platform.value === "apple" ? "block" : "none";
  if (platform.value !== "apple") macAddress.value = "";
}
platform.addEventListener("change", toggleMacField);

/* ================== FORM SUBMIT (ADD / UPDATE) ================== */
assetForm.addEventListener("submit", async e => {
  e.preventDefault();

  const isEdit = !!editId;

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

  const url = isEdit
    ? `${API_BASE}/assets/${editId}`
    : `${API_BASE}/assets`;

  const method = isEdit ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await res.json();
  if (!result.success) return alert("Operation failed");

  alert(isEdit ? "✅ Asset Updated" : "✅ Asset Added");

  editId = null;
  assetForm.reset();
  toggleFields();
  toggleMacField();
  document.getElementById("submitBtn").innerText = "Submit Entry";
  loadDashboard();
});

/* ================== DASHBOARD ================== */
async function loadDashboard() {
  const res = await fetch(`${API_BASE}/assets`);
  const data = await res.json();
  renderDashboard(data);
}

function renderDashboard(data) {
  statTotal.innerText = data.length;
  statStudents.innerText = data.filter(d => d.role === "student").length;
  statEmployees.innerText = data.filter(d => d.role === "employee").length;

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

  drawCharts(data);
}

/* ================== EDIT / DELETE ================== */
async function deleteAsset(id) {
  if (!confirm("Delete this asset?")) return;

  const res = await fetch(`${API_BASE}/assets/${id}`, { method: "DELETE" });
  const result = await res.json();

  if (!result.success) return alert("Delete failed");
  loadDashboard();
}

async function editAsset(id) {
  const res = await fetch(`${API_BASE}/assets`);
  const data = await res.json();
  const asset = data.find(a => a.id === id);
  if (!asset) return;

  editId = id;
  switchPage("entry");

  role.value = asset.role;
  toggleFields();

  title.value = asset.title;
  name.value = asset.name;
  email.value = asset.email;
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

  assetDesc.value = asset.asset_desc;
  asset_type.value = asset.asset_type;
  assetId.value = asset.serial_no;
  purchase_date.value = asset.purchase_date;
  brand.value = asset.brand;
  model.value = asset.model;
  ram.value = asset.ram;
  processor.value = asset.processor;
  hdd.value = asset.storage;
  remarks.value = asset.remarks;

  document.getElementById("submitBtn").innerText = "Update Entry";
}

/* ================== SEARCH & FILTER ================== */
async function applyFilters() {
  const q = (searchInput.value || "").toLowerCase();
  const roleVal = filterRole.value;
  const batchVal = filterBatch.value;

  const res = await fetch(`${API_BASE}/assets`);
  let data = await res.json();

  if (q) {
    data = data.filter(d =>
      (d.name || "").toLowerCase().includes(q) ||
      (d.serial_no || "").toLowerCase().includes(q) ||
      (d.asset_type || "").toLowerCase().includes(q)
    );
  }

  if (roleVal !== "all") data = data.filter(d => d.role === roleVal);
  if (batchVal !== "all") data = data.filter(d => d.batch === batchVal);

  renderDashboard(data);
}

/* ================== CHARTS ================== */
function drawCharts(data) {
  if (!roleChartCtx || !batchChartCtx) return;

  const roleCount = {};
  const batchCount = {};

  data.forEach(d => {
    roleCount[d.role] = (roleCount[d.role] || 0) + 1;
    if (d.batch) batchCount[d.batch] = (batchCount[d.batch] || 0) + 1;
  });

  roleChart?.destroy();
  batchChart?.destroy();

  roleChart = new Chart(roleChartCtx, {
    type: "doughnut",
    data: {
      labels: Object.keys(roleCount),
      datasets: [{ data: Object.values(roleCount) }]
    }
  });

  batchChart = new Chart(batchChartCtx, {
    type: "bar",
    data: {
      labels: Object.keys(batchCount),
      datasets: [{ data: Object.values(batchCount) }]
    }
  });
}

/* ================== EXCEL DOWNLOAD (DASHBOARD) ================== */
async function downloadExcel() {
  const res = await fetch(`${API_BASE}/assets`);
  let data = await res.json();

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

  XLSX.writeFile(workbook, "ITM_Inventory.xlsx");
}

/* ================== SPECIFIC CSV DOWNLOAD ================== */
async function downloadSpecific(role, batch) {
  let url = `${API_BASE}/export?role=${role}`;
  if (batch && batch !== "all") url += `&batch=${batch}`;

  const res = await fetch(url);
  const blob = await res.blob();

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${role}_${batch || "all"}_assets.csv`;
  link.click();
}

/* ================== INIT ================== */
toggleFields();
toggleMacField();