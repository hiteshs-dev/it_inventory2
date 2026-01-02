/* ================== GLOBAL ERROR DEBUG ================== */
window.onerror = function (msg, src, line) {
  alert(`JS ERROR:\n${msg}\nLine: ${line}`);
};

/* ================== API ================== */
const API_BASE = "https://itm-inventory-api.hiteshs.workers.dev";

/* ================== PAGINATION ================== */
let currentPage = 1;
const limit = 50;

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

let editId = null;

/* ================== FIELD TOGGLES ================== */
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
    location:
      role.value === "student" ? studentLocation.value : empLocation.value,

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

    /* WARRANTY */
    warranty_months: warrantyMonths.value,
    warranty_pending: warrantyPending.value,
    warranty_info: warrantyInfo.value,

    /* VERIFICATION */
    verified_by: verifiedBy.value,
    verification_date: verificationDate.value,

    /* ACCOUNTING */
    shop_origin: shopOrigin.value,
    purchase_price: purchasePrice.value
  };

  const url = editId
    ? `${API_BASE}/assets/${editId}`
    : `${API_BASE}/assets`;

  const method = editId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await res.json();
  if (!result.success) {
    alert(result.error || "Operation failed");
    return;
  }

  alert(editId ? "✅ Asset Updated" : "✅ Asset Added");

  editId = null;
  assetForm.reset();
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
  renderTable(result.data);
  renderPagination(result.total);
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
  const totalPages = Math.ceil(total / limit);

  for (let i = 1; i <= totalPages; i++) {
    if (i <= 100) {
      pagination.innerHTML += `
        <button class="${i === currentPage ? "active" : ""}"
                onclick="loadAssets(${i})">${i}</button>
      `;
    }
  }
}

/* ================== EDIT ================== */
async function editAsset(id) {
  const res = await fetch(`${API_BASE}/assets/${id}`);
  const asset = await res.json();

  editId = id;

  Object.keys(asset).forEach(k => {
    if (document.getElementById(k)) {
      document.getElementById(k).value = asset[k] || "";
    }
  });

  toggleMacField();
}

/* ================== DELETE ================== */
async function deleteAsset(id) {
  if (!confirm("Delete this asset?")) return;
  await fetch(`${API_BASE}/assets/${id}`, { method: "DELETE" });
  loadAssets(currentPage);
}

/* ================== FILTER ================== */
function applyFilters() {
  loadAssets(1);
}

/* ================== INIT ================== */
toggleMacField();
loadAssets(1);