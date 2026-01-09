/* ================== GLOBAL ERROR DEBUG ================== */
window.onerror = function (msg, src, line) {
  alert(`JS ERROR:\n${msg}\nLine: ${line}`);
};

/* ================== dashboard ================== */
let dashboardData = [];
let roleChartInstance = null;
let batchChartInstance = null;


/* ================== API ================== */
const API_BASE = "https://itm-inventory-api.hiteshs.workers.dev";

/* ================== CAMPUS → AREA MASTER ================== */

const campusAreas = {
  "KHR.Campus": [
    "1StoreRoom.Basement",
    "AcadAdmin.F2",
    "Accounts.F0",
    "Administration.F0",
    "Admission Counselor.GF",
    "Admissions.Basement",
    "Auditorium.Big",
    "Auditorium.Mini",
    "BoardRoom.F1",
    "BoardRoom.F1.IFM",
    "BoardRoom.F3",
    "CIO.Office.F2",
    "CR.Admin.F2.30",
    "CR.Basement.27",
    "CR.Basement.28",
    "CR.Basement.29",
    "CR.F0.01 {1C1,1C2,1C5}",
    "CR.F0.02 {2C1,2C2,2C3}",
    "CR.F0.03 {3C1,3C2,3C5}",
    "CR.F1.04 {4C1,4C2,4C3}",
    "CR.F1.05 {5C2,5C3,5C5}",
    "CR.F1.06 {6C1,6C2,6C5}",
    "CR.F2.07 {2fc163+33,2fc162+5,2fc164+22}",
    "CR.F2.08 {2fc264+22,2fc263+33,2fc262+5}",
    "CR.F2.09 {2fc363+33,2fc362+5,2fc364+2}",
    "CR.F3.10 {1001+1,1002+22}",
    "CR.F3.11 {1101}",
    "CR.F4.12",
    "CR.F4.13 {433}",
    "CR.F4.14",
    "CR.F4.15 {414}",
    "CR.F5.16",
    "CR.F5.17",
    "CR.F5.18",
    "CR.F5.19",
    "CR.F5.20",
    "CR.IFM.F0.26",
    "CR.IFM.F1.22 {405,406,407}",
    "CR.IFM.F1.23",
    "CR.IFM.F1.24",
    "CR.IFM.F1.25",
    "CR.IFM.F2.21",
    "Canteen",
    "ComplianceOffice.F2",
    "DeanOffice.F1",
    "DirectorOffice.F1",
    "EEC.Office.F2",
    "ERPDept.F1",
    "ETPL-ISA.F2.AdminBlock",
    "Elec.Panel.Room",
    "Examinations.F0",
    "Faculty.F1.HOD",
    "Faculty.F1.IFMBlock",
    "Faculty.F2.AdminBlock",
    "Faculty.F2.CanteenBlock",
    "Faculty.F2.Lshape",
    "HRDept.F0",
    "Hostel.Boys.Rooms",
    "Hostel.Girls.Rooms",
    "Hostel.ServerRoom",
    "Hostel.WaitingRoom",
    "Hostel.WardenOffice",
    "Lab.IFM.F1",
    "Lab.PGDM.F0",
    "Library.Corridor.F3",
    "Library.F0.IFM",
    "Library.F3",
    "Library.F4",
    "Placements.F4",
    "RegistrarOffice.F0",
    "Security.MainGate",
    "Security.Parking",
    "ServerRoom.F1 (Canteen Block)",
    "ServerRoom.F2 (Admin Block)",
    "ServerRoom.F3 (Classroom Block)",
    "StationaryShop",
    "Talewind.Basement"
  ],

  "CORP.Office": [
    "Accounts.Dept",
    "Admin.Dept",
    "Business.Development",
    "CSRTeam",
    "Compliance.Dept",
    "Digital.Marketing",
    "EEC.Dept",
    "ETPL",
    "HR.Dept",
    "ISA.Dept",
    "Management",
    "Marketing.Dept",
    "Meeting Room - 1",
    "Operations.Dept",
    "Project.Dept",
    "Reception",
    "ServerRoom",
    "Special.Initiatives.Dept",
    "StoreRoom",
    "Talewind.Dept",
    "Technical.Training",
    "Trust.Office",
    "VideoConferencing.Room",
    "WebTeam"
  ],

  "RPR.Campus": [
    "Accounts",
    "Admin",
    "Admissions",
    "Architecture",
    "Badminton Academy",
    "BioSciences Dept",
    "City Office",
    "ETPL / ISA",
    "Engineering",
    "HR.Dept",
    "LifeSciences",
    "Management",
    "Marketing Corp",
    "Registrar.Office",
    "Server Room",
    "Store Room",
    "Talewind",
    "VC.Office",
    "VideoConferencing.Room"
  ],

  "VAD.Campus": [
    "ACPC HelpCenter",
    "Academics Team",
    "AdminOffice",
    "Applied Sciences",
    "BS Lab",
    "City.Office",
    "Engineering",
    "FONLab (Nursing)",
    "Faculty - Allied Sciences",
    "Faculty - Engg - Civil",
    "Faculty - Engg - Communication",
    "Faculty - Engg - Computer Science",
    "Faculty - Engg - Electrical & Electronics",
    "Faculty - Engg - Mechanical",
    "Faculty - Engg - Mechatronics",
    "Faculty - Humanities",
    "Faculty - IC",
    "Faculty - IHTM",
    "Faculty - MLT",
    "Faculty - Management",
    "Faculty - Nursing",
    "HealthSciences",
    "ISA",
    "Lab1 (Engg-Windows)",
    "Lab2 (Engg-Linux)",
    "Lab3 (Mgmt)",
    "Library",
    "Make.in.India.lab",
    "Management",
    "Marketing Team",
    "MechatronicsLab (Engg)",
    "Operations",
    "Presentation.Desktop",
    "Registrar",
    "ServerRoom",
    "Special Initiatives",
    "Staff.Engineering",
    "Staff.HealthSciences",
    "Staff.RA",
    "StoreRoom",
    "Talewind",
    "Training & Placement",
    "VideoConferencing.Room"
  ],

  "ADH.Campus": [
    "Accounts.Dept",
    "Admin Office",
    "CAD Lab.F2",
    "CR-00.F0",
    "CR-01.F1",
    "CR-02.F1",
    "CR-03.F1",
    "CR-04.F1",
    "Counsellor.F0",
    "Director Cabin",
    "Faculty",
    "Library.F1",
    "Media Lab.F0",
    "Operations Dept",
    "Principal Cabin",
    "Reception.F0",
    "ServerRoom",
    "Store Room",
    "UG.Mktg Office"
  ],

  "VIZ.Campus": [
    "Admin Office",
    "Faculty",
    "HOD",
    "Mech. Sim Lab",
    "Principal Office",
    "Store Room"
  ],

  "SRS.Campus": [
    "AdminOffice",
    "Director Office",
    "FacultyArea",
    "ISATeam",
    "Lab",
    "Library",
    "Marketing",
    "NWIT Lab",
    "Placements",
    "ServerRoom",
    "Special Initiatives",
    "StoreRoom",
    "VUE Test center"
  ],

  "WAR.Campus": [
    "AdminOffice",
    "ClassRoom.Juniors.Fin",
    "ClassRoom.Juniors.Mkt",
    "ClassRoom.Seniors.Fin",
    "ClassRoom.Seniors.Mkt",
    "FacultyArea",
    "ITLab",
    "Library",
    "MarketingOffice",
    "OldBuilding",
    "PlacementsOffice",
    "SeminarHall",
    "ServerRoom",
    "StoreRoom"
  ],

  "Scrap.ITMGroup": [
    "BSEL",
    "Bengaluru",
    "Chennai",
    "Corporate",
    "Dombivli",
    "Hyderabad",
    "Kharghar",
    "Nagpur",
    "Nerul",
    "Oshiwara",
    "Panvel",
    "Raipur",
    "Sion",
    "Vadodara",
    "Vizag",
    "Warangal"
  ],

  "PanIndia.ISA.Offices": [
    "AndhraPradesh",
    "Bengaluru",
    "Chandigarh",
    "Delhi NCR",
    "Gujarat",
    "Guwahati",
    "Hubli",
    "Jaipur",
    "Jodhpur",
    "Kolkata",
    "Lucknow",
    "Mumbai",
    "Nagpur",
    "Noida",
    "Patna",
    "Pune",
    "Raipur",
    "Ranchi",
    "TamilNadu",
    "Telangana",
    "WestBengal"
  ],

  "PanIndia.PG.Mktg": [
    "AP",
    "Assam-Guwahati",
    "BIH-Patna",
    "GUJ-Ahmedabad",
    "KA-Bengaluru",
    "MH-Nagpur",
    "MH-Nashik",
    "MH-Pune",
    "MP-Indore",
    "Mumbai",
    "Mumbai-Kharghar",
    "Mumbai-Nerul",
    "Mumbai-Platinum",
    "NCR-Delhi",
    "NCR-Noida",
    "Raj-Jaipur",
    "TN-Chennai",
    "TS-Hyderabad",
    "TS-Warangal",
    "UP-Lucknow",
    "WB-Kolkata"
  ],

  "PanIndia.EEC.Centers": [
    "Ahmedabad",
    "Bengaluru",
    "Chennai",
    "Dombivli",
    "Hyderabad",
    "Kandivali",
    "Kharghar",
    "Nashik",
    "Nerul",
    "New Delhi",
    "Noida",
    "Pune",
    "Sion",
    "Thane",
    "Vasai",
    "Vashi",
    "VileParle"
  ],

  "BAN.Campus": [
    "AdminArea",
    "EECDept",
    "ISADept",
    "ISALab",
    "MarketingDept",
    "PGDMDept",
    "ServerRoom",
    "StoreRoom"
  ],

  "UnKnown.ITM": [
    "Corporate",
    "Kharghar",
    "Nerul"
  ],

  "Trust.Office": [
    "Chembur"
  ],

  "MakeInIndia.Labs": [
    "Corporate.Office",
    "Raipur",
    "Vadodara",
    "Vijayawada"
  ],

  "PanIndia.UG.Mktg": [
    "Andheri",
    "Delhi",
    "Maharashtra",
    "Nerul",
    "Oshiwara",
    "Panvel",
    "Raipur",
    "UP.Lucknow",
    "Vadodara"
  ],

  "PanIndia.TSA.Offices": [
    "Raipur",
    "Vadodara",
    "Vijayawada"
  ],

  "SNeyecare": [
    "Panvel",
    "Warangal"
  ]
};

/* ================== download ================== */

function downloadSpecific(role, batch) {
  const url = `${API_BASE}/export?role=${role}&batch=${batch}`;
  window.open(url, "_blank");
}

async function downloadBatch(batch) {
  const res = await fetch(`/api/assets?batch=${batch}&limit=10000`);
  const result = await res.json();

  if (!result.data || !result.data.length) {
    alert("No data found for batch " + batch);
    return;
  }

  const ws = XLSX.utils.json_to_sheet(result.data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Batch_${batch}`);

  XLSX.writeFile(wb, `Batch_${batch}.xlsx`);
}

/* ================== PAGINATION ================== */
let currentPage = 1;
const limit = 50;
let editId = null;

/* ================== LOGIN ================== */
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const username = document.getElementById("username");
const password = document.getElementById("password");
const navTabs = document.getElementById("navTabs");

/* ================== FORM ELEMENTS ================== */
const assetForm = document.getElementById("assetForm");

const role = document.getElementById("role");
const title = document.getElementById("title");
const nameField = document.getElementById("name");
const email = document.getElementById("email");

const batch = document.getElementById("batch");
const rollNo = document.getElementById("rollNo");

const dept = document.getElementById("dept");
const designation = document.getElementById("designation");
const empId = document.getElementById("empId");

const studentFields = document.getElementById("studentFields");
const empFields = document.getElementById("empFields");

const assetDesc = document.getElementById("assetDesc");
const assetType = document.getElementById("asset_type");
const assetId = document.getElementById("assetId");
const purchaseDate = document.getElementById("purchase_date");

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
const verificationremarks = document.getElementById("verificationremarks");

/* ===== Accounting ===== */
const shopOrigin = document.getElementById("shopOrigin");
const assetPrice = document.getElementById("asset_price");

/* ===== Dashboard (SAFE) ===== */
const dashTable = document.getElementById("dashTable");
const pagination = document.getElementById("pagination");
const pageInfo = document.getElementById("pageInfo");

const searchInput = document.getElementById("searchInput") || { value: "" };
const filterRole = document.getElementById("filterRole") || { value: "all" };
const filterBatch = document.getElementById("filterBatch") || { value: "all" };

const campusSelect = document.getElementById("campus");
const areaRoomSelect = document.getElementById("areaRoom");

function toggleFields() {
  const role = document.getElementById("role");
  const studentFields = document.getElementById("studentFields");
  const empFields = document.getElementById("empFields");

  if (!role || !studentFields || !empFields) return;

  studentFields.style.display = role.value === "student" ? "block" : "none";
  empFields.style.display = role.value === "employee" ? "block" : "none";
}

function toggleMacField() {
  const platform = document.getElementById("platform");
  const macField = document.getElementById("macField");
  const macAddress = document.getElementById("macAddress");

  if (!macField) return;
  macField.style.display = "block"; // ✅ ALWAYS SHOW
}

/* ===== dashboard render ===== */
function renderStats(data) {
  const total = data.length;
  const students = data.filter(d => d.role === "student").length;
  const employees = data.filter(d => d.role === "employee").length;

  document.getElementById("statTotal").innerText = total;
  document.getElementById("statStudents").innerText = students;
  document.getElementById("statEmployees").innerText = employees;
}

function renderRoleChart(data) {
  const ctx = document.getElementById("roleChart");
  if (!ctx) return;

  const counts = { student: 0, employee: 0 };
  data.forEach(d => counts[d.role]++);

  if (roleChartInstance) roleChartInstance.destroy();

  roleChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Students", "Employees"],
      datasets: [{
        data: [counts.student, counts.employee]
      }]
    },
    options: {
      responsive: true
    }
  });
}

/* ===== Recent ===== */
function renderRecent(data) {
  const recentList = document.getElementById("recentList");
  if (!recentList) return;

  recentList.innerHTML = "";
  data
    .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0,5)
    .forEach(d => {
      recentList.innerHTML += `
        <div class="recent-item">
          ${d.name} — ${d.asset_type} (${d.serial_no})
        </div>`;
    });
}

function initApp() {

  /* ===== FIELD TOGGLES ===== */
  if (role) {
    role.addEventListener("change", toggleFields);
    toggleFields(); // initial state
  }

  if (platform) {
    platform.addEventListener("change", toggleMacField);
    toggleMacField(); // initial state
  }

  /* ===== LOGIN ===== */
  const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user === "admin" && pass === "unix@2026") {
      document.getElementById("loginModal").style.display = "none";
      document.getElementById("navTabs").style.display = "flex";
      switchPage("entry");     // open Data Entry page
      loadAssets(1);           // load dashboard data
    } else {
      document.getElementById("loginError").style.display = "block";
    }
  });
}

  /* ================== DOWNLOAD ================== */
  const download2026Btn = document.getElementById("download2026");
  if (download2026Btn) {
    download2026Btn.addEventListener("click", () => {
      downloadBatch("2026");
    });
  }

  const download2027Btn = document.getElementById("download2027");
  if (download2027Btn) {
    download2027Btn.addEventListener("click", () => {
      downloadBatch("2027");
    });
  }

  /* ================== WARRANTY ================== */
  function calculateWarrantyPending() {
    if (!purchaseDate?.value || !warrantyMonths?.value) return;

    const start = new Date(purchaseDate.value);
    const now = new Date();

    const used =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());

    warrantyPending.value = Math.max(
      Number(warrantyMonths.value) - used,
      0
    );
  }

  if (purchaseDate) purchaseDate.addEventListener("change", calculateWarrantyPending);
  if (warrantyMonths) warrantyMonths.addEventListener("input", calculateWarrantyPending);

  /* ===== CAMPUS → AREA ===== */
  if (campusSelect && areaRoomSelect) {
  campusSelect.addEventListener("change", () => {
    areaRoomSelect.innerHTML = `<option value="">Select Area</option>`;

    const areas = campusAreas[campusSelect.value];
    if (!areas) return;

    areas.forEach(room => {
      const opt = document.createElement("option");
      opt.value = room;
      opt.textContent = room;
      areaRoomSelect.appendChild(opt);
    });
  });
}

  /* ================== Invoice downlaod logic  ================== */
const invoiceInput = document.getElementById("invoiceFiles");

if (invoiceInput) {
  invoiceInput.addEventListener("change", () => {
    const files = invoiceInput.files;

    if (files.length > 5) {
      alert("Maximum 5 invoice files allowed");
      invoiceInput.value = "";
      return;
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB limit`);
        invoiceInput.value = "";
        return;
      }
    }
  });
}
}

const filePreview = document.getElementById("filePreview");
const uploadProgress = document.getElementById("uploadProgress");

if (invoiceInput) {
  invoiceInput.addEventListener("change", () => {
    filePreview.innerHTML = "";
    uploadProgress.innerHTML = "Uploading...";

    [...invoiceInput.files].forEach(file => {
      const div = document.createElement("div");
      div.textContent = file.name;
      filePreview.appendChild(div);
    });

    setTimeout(() => {
      uploadProgress.innerHTML = "✅ Upload complete";
    }, 1000);
  });
}

  /* ================== FORM SUBMIT ================== */
if (assetForm) {
  assetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      role: role.value,
      title: title.value,
      name: nameField.value,
      email: email.value,

      batch: role.value === "student" ? batch.value : "",
      roll_no: role.value === "student" ? rollNo.value : "",
      department: role.value === "employee" ? dept.value : "",
      designation: role.value === "employee" ? designation.value : "",
      emp_id: role.value === "employee" ? empId.value : "",

      entity: document.getElementById("entity")?.value || "",
      campus: campusSelect?.value || "",
      area_room: areaRoomSelect?.value || "",

      asset_desc: assetDesc.value,
      asset_type: assetType.value,
      serial_no: assetId.value,
      purchase_date: purchaseDate.value,

      platform: platform.value,
      mac_address: macAddress.value || "",

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
      asset_price: assetPrice?.value
        ? parseInt(assetPrice.value)
        : 0
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

    alert(editId ? "Updated Successfully" : "Added Successfully");

    editId = null;
    assetForm.reset();
    toggleFields();
    toggleMacField();
    loadAssets(1);
  });
}

/* Init UI state */
toggleFields();
toggleMacField();

/* ================== CAMPUS → AREA ================== */
if (campusSelect && areaRoomSelect) {
  campusSelect.addEventListener("change", () => {
    areaRoomSelect.innerHTML = `<option value="">Select Area / Room</option>`;

    const areas = campusAreas[campusSelect.value];
    if (!areas) return;

    areas.forEach(area => {
      const opt = document.createElement("option");
      opt.value = area;
      opt.textContent = area;
      areaRoomSelect.appendChild(opt);
    });
  });
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

  if (!result.data) {
    alert("Failed to load assets");
    return;
  }

  const a = result.data.find(x => x.id === id);
  if (!a) {
    alert("Asset not found");
    return;
  }

  // 🔐 Set edit mode
  editId = id;

  // Switch to entry page
  const entryBtn = document.querySelector('.nav-btn[data-page="entry"]');
  switchPage("entry", entryBtn);

  // Fill form
  role.value = a.role || "";
  title.value = a.title || "";
  nameField.value = a.name || "";
  email.value = a.email || "";

  batch.value = a.batch || "";
  rollNo.value = a.roll_no || "";
  dept.value = a.department || "";
  designation.value = a.designation || "";
  empId.value = a.emp_id || "";

  campusSelect.value = a.campus || "";
  areaRoomSelect.value = a.area_room || "";

  assetDesc.value = a.asset_desc || "";
  assetType.value = a.asset_type || "";
  assetId.value = a.serial_no || "";
  purchaseDate.value = a.purchase_date || "";

  platform.value = a.platform || "";
  macAddress.value = a.mac_address || "";

  brand.value = a.brand || "";
  model.value = a.model || "";
  ram.value = a.ram || "";
  processor.value = a.processor || "";
  hdd.value = a.storage || "";
  remarks.value = a.remarks || "";

  shopOrigin.value = a.shop_origin || "";
  assetPrice.value = a.asset_price || "";
  purchaseAssetDate.value = a.purchase_asset_date || "";

  toggleFields();
  toggleMacField();
}


async function deleteAsset(id) {
  if (!confirm("Delete asset?")) return;
  await fetch(`${API_BASE}/assets/${id}`, { method: "DELETE" });
  loadAssets(currentPage);
}

/* ================== charts ================== */
function renderBatchChart(data) {
  const ctx = document.getElementById("batchChart");
  if (!ctx) return;

  const counts = {};
  data.forEach(d => {
    if (d.batch) counts[d.batch] = (counts[d.batch] || 0) + 1;
  });

  if (batchChartInstance) batchChartInstance.destroy();

  batchChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: "Assets",
        data: Object.values(counts)
      }]
    },
    options: { responsive: true }
  });
}


/* ================== SWITCH PAGE ================== */

function switchPage(page, btn) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + page)?.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  if (page === "dashboard") {
    loadAssets(1);
  }
}

  // 🔍 SEARCH
  function applyFilters() {
  let filtered = [...dashboardData];

  const q = searchInput.value.toLowerCase();
  const roleVal = filterRole.value;
  const batchVal = filterBatch.value;

  if (q) {
  filtered = filtered.filter(d =>
    d.name?.toLowerCase().includes(q) ||
    d.serial_no?.toLowerCase().includes(q) ||
    d.campus?.toLowerCase().includes(q) ||
    d.area_room?.toLowerCase().includes(q)
  );
}

  if (roleVal !== "all") {
    filtered = filtered.filter(d => d.role === roleVal);
  }

  if (batchVal !== "all") {
    filtered = filtered.filter(d => d.batch === batchVal);
  }

  renderTable(filtered);
  renderStats(filtered);
  renderRoleChart(filtered);
  renderRecent(filtered);
}

async function downloadExcel() {
  if (!dashboardData.length) return alert("No data");

  const filtered = dashboardData.filter(d =>
    d.name?.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  const ws = XLSX.utils.json_to_sheet(filtered);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Filtered Assets");
  XLSX.writeFile(wb, "Filtered_Assets.xlsx");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

/* ================== Loadassets ================== */
async function loadAssets(page = 1) {
  currentPage = page;

  const res = await fetch(
    `${API_BASE}/assets?page=${page}&limit=${limit}`
  );
  const result = await res.json();

  if (!result.data) return;

  dashboardData = result.data; // 🔥 REQUIRED

  renderTable(dashboardData);
  renderStats(dashboardData);
  renderRoleChart(dashboardData);
  renderBatchChart(dashboardData);
  renderRecent(dashboardData);
  renderPagination(result.total);
  renderPageInfo(result.total);
}


/* ================== FEEDBACK ================== */
showToast("✅ Asset saved successfully");
showToast("🗑 Asset deleted");
showToast("✏️ Editing asset — update details and submit");

/* ================== Failed Save ================== */
const result = await res.json();
if (!res.ok) {
  alert(result.error || "Save failed");
  return;
}

document.addEventListener("DOMContentLoaded", initApp);