/* ================== GLOBAL ERROR DEBUG ================== */
window.onerror = function (msg, src, line) {
  alert(`JS ERROR:\n${msg}\nLine: ${line}`);
};

/* ================== API ================== */
const API_BASE = "https://itm-inventory-api.hiteshs.workers.dev";

/* ================== PAGINATION ================== */
let currentPage = 1;
const limit = 50;

/* ================== LOGIN ================== */
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const username = document.getElementById("username");
const password = document.getElementById("password");
const navTabs = document.getElementById("navTabs");

/* ================== ELEMENTS ================== */
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

const studentFields = document.getElementById("studentFields");
const empFields = document.getElementById("empFields");

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

/* ===== Platform / MAC ===== */
const platform = document.getElementById("platform");
const macAddress = document.getElementById("macAddress");
const macField = document.getElementById("macField");

/* ===== Warranty ===== */
const warrantyMonths = document.getElementById("warrantyMonths");
const warrantyPending = document.getElementById("warrantyPending");
const warrantyInfo = document.getElementById("warrantyInfo");

/* ===== Verification ===== */
const verifiedBy = document.getElementById("verifiedBy");
const verificationDate = document.getElementById("verificationDate");

/* ===== Accounting ===== */
const shopOrigin = document.getElementById("shopOrigin");
const purchasePrice = document.getElementById("purchasePrice");

/* ===== Dashboard ===== */
const dashTable = document.getElementById("dashTable");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const filterRole = document.getElementById("filterRole");
const filterBatch = document.getElementById("filterBatch");
const pageInfo = document.getElementById("pageInfo");

let editId = null;

/* ================== LOGIN HANDLER ================== */
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  if (username.value === "admin" && password.value === "unix@2026") {
    loginModal.style.display = "none";
    navTabs.style.display = "flex";
    loadAssets(1);
  } else {
    loginError.style.display = "block";
  }
});

/* ================== FIELD TOGGLES ================== */
function toggleFields() {
  studentFields.style.display = role.value === "student" ? "block" : "none";
  empFields.style.display = role.value === "employee" ? "block" : "none";
}
role.addEventListener("change", toggleFields);

function toggleMacField() {
  macField.style.display = platform.value === "apple" ? "block" : "none";
  if (platform.value !== "apple") macAddress.value = "";
}
platform.addEventListener("change", toggleMacField);

/* ================== WARRANTY ================== */
function calculateWarrantyPending() {
  if (!purchase_date.value || !warrantyMonths.value) return;

  const start = new Date(purchase_date.value);
  const now = new Date();

  const used =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  warrantyPending.value = Math.max(
    parseInt(warrantyMonths.value) - used,
    0
  );
}
purchase_date.addEventListener("change", calculateWarrantyPending);
warrantyMonths.addEventListener("input", calculateWarrantyPending);

/* ================== FORM SUBMIT ================== */
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
    location: role.value === "student" ? studentLocation.value : empLocation.value,

    asset_desc: assetDesc.value,
    asset_type: asset_type.value,
    serial_no: assetId.value,
    purchase_date: purchase_date.value,

    platform: platform.value,
    mac_address: platform.value === "apple" ? macAddress.value : "",

    brand: brand.value,
    model: model.value,
    ram: ram.value,
    processor: processor.value,
    storage: hdd.value,
    remarks: remarks.value,

    warranty_months: warrantyMonths.value,
    warranty_pending: warrantyPending.value,
    warranty_info: warrantyInfo.value,

    verified_by: verifiedBy.value,
    verification_date: verificationDate.value,

    shop_origin: shopOrigin.value,
    purchase_price: purchasePrice.value
  };

  const res = await fetch(
    editId ? `${API_BASE}/assets/${editId}` : `${API_BASE}/assets`,
    {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  const result = await res.json();
  if (!result.success) return alert(result.error || "Failed");

  alert(editId ? "Updated" : "Added");
  editId = null;
  assetForm.reset();
  toggleFields();
  toggleMacField();
  loadAssets(1);
});

/* ================== LOAD ASSETS ================== */
async function loadAssets(page = 1) {
  currentPage = page;

  const res = await fetch(
    `${API_BASE}/assets?page=${page}&limit=${limit}&search=${searchInput.value}&role=${filterRole.value}&batch=${filterBatch.value}`
  );

  const result = await res.json();
  if (!result.data) return;

  renderTable(result.data);
  renderPagination(result.total);
  renderPageInfo(result.total);
}

/* ================== TABLE ================== */
function renderTable(data) {
  dashTable.innerHTML = "";
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
  pagination.innerHTML = "";
  const pages = Math.ceil(total / limit);

  if (currentPage > 1)
    pagination.innerHTML += `<button onclick="loadAssets(${currentPage - 1})">‹</button>`;

  for (let i = Math.max(1, currentPage - 3); i <= Math.min(pages, currentPage + 3); i++) {
    pagination.innerHTML += `
      <button class="${i === currentPage ? "active" : ""}"
              onclick="loadAssets(${i})">${i}</button>`;
  }

  if (currentPage < pages)
    pagination.innerHTML += `<button onclick="loadAssets(${currentPage + 1})">›</button>`;
}

function renderPageInfo(total) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);
  pageInfo.innerText = `Showing ${start}–${end} of ${total}`;
}

/* ================== EDIT / DELETE ================== */
async function editAsset(id) {
  const res = await fetch(`${API_BASE}/assets?page=1&limit=10000`);
  const result = await res.json();
  const asset = result.data.find(a => a.id === id);
  if (!asset) return;

  editId = id;
  Object.keys(asset).forEach(k => {
    if (document.getElementById(k)) document.getElementById(k).value = asset[k] || "";
  });

  toggleFields();
  toggleMacField();
}

async function deleteAsset(id) {
  if (!confirm("Delete asset?")) return;
  await fetch(`${API_BASE}/assets/${id}`, { method: "DELETE" });
  loadAssets(currentPage);
}

function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`page-${page}`).classList.add("active");

  if (page === "dashboard") loadAssets(1);
}


/* ================== FILTER ================== */
function applyFilters() {
  loadAssets(1);
}

/* ================== INIT ================== */
toggleFields();
toggleMacField();