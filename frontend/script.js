/* ================== GLOBAL ERROR DEBUG ================== */
window.onerror = function (msg, src, line, col, err) {
  alert(
    "JS ERROR:\n" +
    msg +
    "\nLine: " + line +
    "\nColumn: " + col
  );
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

/* ================== LOGIN ================== */
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "unix@2026") {
    loginModal.style.display = "none";
    navTabs.style.display = "flex";
    loadDashboard();
  } else {
    loginError.style.display = "block";
  }
});

function logout() {
  location.reload();
}

/* ================== PAGE SWITCH ================== */
function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${page}`).classList.add("active");
}

/* ================== ROLE TOGGLE ================== */
function toggleFields() {
  if (role.value === "student") {
    studentFields.style.display = "block";
    empFields.style.display = "none";
  } else {
    studentFields.style.display = "none";
    empFields.style.display = "block";
  }
}

/* ================== SUBMIT FORM ================== */
assetForm.addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    role: role.value,
    title: title.value,
    name: name.value,
    email: email.value,
    batch: role.value === "student" ? batch.value : "",
    roll_no: role.value === "student" ? rollNo.value : "",
    department: role.value === "employee" ? dept.value : "",
    designation: role.value === "employee" ? designation.value : "",
    emp_id: role.value === "employee" ? empId.value : "",
    location:
      role.value === "student"
        ? studentLocation.value
        : empLocation.value,
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

  try {
    const res = await fetch(`${API_BASE}/assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      alert("API ERROR:\n" + JSON.stringify(result));
      return;
    }

    alert("✅ Asset Added Successfully");
    assetForm.reset();
    toggleFields();
    loadDashboard();

  } catch (err) {
    alert("❌ FETCH ERROR:\n" + err.message);
  }
});

/* ================== LOAD DASHBOARD ================== */
async function loadDashboard() {
  const res = await fetch(`${API_BASE}/assets`);
  const data = await res.json();
  renderDashboard(data);
}

/* ================== RENDER DASHBOARD ================== */
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
        <td>
          <button onclick="editAsset(${d.id})">✏️</button>
          <button onclick="deleteAsset(${d.id})">🗑</button>
        </td>
      </tr>
    `;
  });

  drawCharts(data);
}

/* ================== CHARTS ================== */
function drawCharts(data) {
  const roleCount = {};
  const batchCount = {};

  data.forEach(d => {
    roleCount[d.role] = (roleCount[d.role] || 0) + 1;
    if (d.batch) batchCount[d.batch] = (batchCount[d.batch] || 0) + 1;
  });

  if (roleChart) roleChart.destroy();
  if (batchChart) batchChart.destroy();

  roleChart = new Chart(roleChartCtx, {
    type: "doughnut",
    data: {
      labels: Object.keys(roleCount),
      datasets: [{
        data: Object.values(roleCount),
        backgroundColor: ["#2563eb", "#9333ea"]
      }]
    }
  });

  batchChart = new Chart(batchChartCtx, {
    type: "bar",
    data: {
      labels: Object.keys(batchCount),
      datasets: [{
        label: "Assets",
        data: Object.values(batchCount),
        backgroundColor: "#2563eb"
      }]
    }
  });
}

/* ================== SEARCH / FILTER ================== */
async function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const roleVal = filterRole.value;
  const batchVal = filterBatch.value;

  const res = await fetch(`${API_BASE}/assets`);
  let data = await res.json();

  if (q) {
    data = data.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.serial_no.toLowerCase().includes(q)
    );
  }

  if (roleVal !== "all") {
    data = data.filter(d => d.role === roleVal);
  }

  if (batchVal !== "all") {
    data = data.filter(d => d.batch === batchVal);
  }

  renderDashboard(data);
}

/* ================== DELETE (API REQUIRED) ================== */
async function deleteAsset(id) {
  alert("Delete API not added yet");
}

/* ================== EDIT (UI ONLY) ================== */
async function editAsset(id) {
  alert("Edit API not added yet");
}

/* ================== INIT ================== */
toggleFields();
