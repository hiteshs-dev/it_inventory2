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
    loadDashboard();
  } else {
    loginError.style.display = "block";
  }
});

/* ================== PAGE SWITCH ================== */
function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`page-${page}`).classList.add("active");

  if (page === "dashboard") loadDashboard();
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

  const url = editId ? `${API_BASE}/assets/${editId}` : `${API_BASE}/assets`;
  const method = editId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await res.json();
  if (!result.success) return alert("Operation failed");

  alert(editId ? "✅ Asset Updated" : "✅ Asset Added");

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
  const a = data.find(x => x.id === id);

  editId = id;

  role.value = a.role;
  toggleFields();

  title.value = a.title;
  name.value = a.name;
  email.value = a.email;
  batch.value = a.batch;
  rollNo.value = a.roll_no;
  dept.value = a.department;
  designation.value = a.designation;
  empId.value = a.emp_id;
  studentLocation.value = a.location;
  empLocation.value = a.location;

  platform.value = a.platform || "";
  toggleMacField();
  macAddress.value = a.mac_address || "";

  assetDesc.value = a.asset_desc;
  asset_type.value = a.asset_type;
  assetId.value = a.serial_no;
  purchase_date.value = a.purchase_date;
  brand.value = a.brand;
  model.value = a.model;
  ram.value = a.ram;
  processor.value = a.processor;
  hdd.value = a.storage;
  remarks.value = a.remarks;

  document.getElementById("submitBtn").innerText = "Update Asset";
}

/* ================== SEARCH ================== */
async function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const res = await fetch(`${API_BASE}/assets`);
  let data = await res.json();

  if (q) data = data.filter(d => d.name.toLowerCase().includes(q));
  renderDashboard(data);
}

/* ================== INIT ================== */
toggleFields();
toggleMacField();