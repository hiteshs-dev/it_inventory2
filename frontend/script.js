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

/* ===== WARRANTY ===== */
const warrantyMonths = document.getElementById("warrantyMonths");
const warrantyPending = document.getElementById("warrantyPending");
const warrantyInfo = document.getElementById("warrantyInfo");

/* ===== VERIFICATION ===== */
const verifiedBy = document.getElementById("verifiedBy");
const verificationDate = document.getElementById("verificationDate");

/* ===== ACCOUNTING ===== */
const purchaseOrigin = document.getElementById("purchaseOrigin");
const purchasePrice = document.getElementById("purchasePrice");

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

  if (page === "dashboard") loadAssets(1);
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

/* ================== WARRANTY CALC ================== */
function calculateWarrantyPending() {
  if (!purchase_date.value || !warrantyMonths.value) return;

  const start = new Date(purchase_date.value);
  const now = new Date();

  const monthsUsed =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  warrantyPending.value = Math.max(
    parseInt(warrantyMonths.value) - monthsUsed,
    0
  );
}

purchase_date.addEventListener("change", calculateWarrantyPending);
warrantyMonths.addEventListener("input", calculateWarrantyPending);

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
    remarks: remarks.value,

    warranty_months: warrantyMonths.value || 0,
    warranty_pending_months: warrantyPending.value || 0,
    warranty_info: warrantyInfo.value || "",

    verified_by: verifiedBy.value || "",
    verification_date: verificationDate.value || "",

    purchase_origin: purchaseOrigin.value || "",
    purchase_price: purchasePrice.value || 0
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

  alert(isEdit ? "Asset Updated" : "Asset Added");

  editId = null;
  assetForm.reset();
  toggleFields();
  toggleMacField();
  switchPage("dashboard");
});

/* ================== LOAD ASSETS ================== */
async function loadAssets(page = 1) {
  currentPage = page;

  const res = await fetch(
    `${API_BASE}/assets?page=${page}&limit=${limit}`
  );

  const result = await res.json();
  renderTable(result.data);
  renderPagination(result.total);
  statTotal.innerText = result.total;
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

/* ================== PAGINATION ================== */
function renderPagination(total) {
  const totalPages = Math.ceil(total / limit);
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    container.innerHTML += `
      <button class="${i === currentPage ? "active" : ""}"
        onclick="loadAssets(${i})">${i}</button>
    `;
  }
}

/* ================== EDIT / DELETE ================== */
async function deleteAsset(id) {
  if (!confirm("Delete this asset?")) return;
  await fetch(`${API_BASE}/assets/${id}`, { method: "DELETE" });
  loadAssets(currentPage);
}

async function editAsset(id) {
  const res = await fetch(`${API_BASE}/assets?page=1&limit=100000`);
  const result = await res.json();
  const asset = result.data.find(a => a.id === id);
  if (!asset) return;

  editId = id;
  switchPage("entry");

  Object.keys(asset).forEach(k => {
    if (document.getElementById(k)) {
      document.getElementById(k).value = asset[k] || "";
    }
  });

  toggleFields();
  toggleMacField();
}

/* ================== INIT ================== */
toggleFields();
toggleMacField();
