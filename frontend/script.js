/* ================== GLOBAL ERROR DEBUG ================== */
window.onerror = function (msg, src, line) {
  alert(`JS ERROR:\n${msg}\nLine: ${line}`);
};

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

/* ===== Accounting ===== */
const shopOrigin = document.getElementById("ShopOrigin");
const purchasePrice = document.getElementById("PurchasePrice");

/* ===== Location (MUST BE BEFORE SUBMIT) ===== */
const campusSelect = document.getElementById("campus");
const areaRoomSelect = document.getElementById("areaRoom");

/* ===== Dashboard (SAFE) ===== */
const dashTable = document.getElementById("dashTable");
const pagination = document.getElementById("pagination");
const pageInfo = document.getElementById("pageInfo");

const searchInput = document.getElementById("searchInput") || { value: "" };
const filterRole = document.getElementById("filterRole") || { value: "all" };
const filterBatch = document.getElementById("filterBatch") || { value: "all" };

/* ================== LOGIN ================== */
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
  if (!purchaseDate.value || !warrantyMonths.value) return;

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
purchaseDate.addEventListener("change", calculateWarrantyPending);
warrantyMonths.addEventListener("input", calculateWarrantyPending);

/* ================== FORM SUBMIT ================== */
assetForm.addEventListener("submit", async e => {
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

    entity: document.getElementById("entity").value,
    campus: campusSelect.value,
    area_room: areaRoomSelect.value,

    asset_desc: assetDesc.value,
    asset_type: assetType.value,
    serial_no: assetId.value,
    purchase_date: purchaseDate.value,

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

  alert(editId ? "Updated Successfully" : "Added Successfully");
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
    `${API_BASE}/assets?page=${page}&limit=${limit}`
  );

  const result = await res.json();
  if (!result.data) return;

  renderTable(result.data);
  renderPagination(result.total);
  if (pageInfo) renderPageInfo(result.total);
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
  const a = result.data.find(x => x.id === id);
  if (!a) return;

  editId = id;

  role.value = a.role;
  title.value = a.title;
  nameField.value = a.name;
  email.value = a.email;
  batch.value = a.batch || "";
  rollNo.value = a.roll_no || "";
  dept.value = a.department || "";
  designation.value = a.designation || "";
  empId.value = a.emp_id || "";
  campusSelect.value = a.campus || "";
  areaRoomSelect.value = a.area_room || "";
  assetDesc.value = a.asset_desc;
  assetType.value = a.asset_type;
  assetId.value = a.serial_no;
  purchaseDate.value = a.purchase_date;
  platform.value = a.platform || "";
  macAddress.value = a.mac_address || "";
  brand.value = a.brand || "";
  model.value = a.model || "";
  ram.value = a.ram || "";
  processor.value = a.processor || "";
  hdd.value = a.storage || "";
  remarks.value = a.remarks || "";
  warrantyMonths.value = a.warranty_months || "";
  warrantyPending.value = a.warranty_pending || "";
  warrantyInfo.value = a.warranty_info || "";
  verifiedBy.value = a.verified_by || "";
  verificationDate.value = a.verification_date || "";
  shopOrigin.value = a.shop_origin || "";
  purchasePrice.value = a.purchase_price || "";

  toggleFields();
  toggleMacField();
}

async function deleteAsset(id) {
  if (!confirm("Delete asset?")) return;
  await fetch(`${API_BASE}/assets/${id}`, { method: "DELETE" });
  loadAssets(currentPage);
}

/* ================== CAMPUS → AREA ================== */
campusSelect.addEventListener("change", () => {
  areaRoomSelect.innerHTML = `<option value="">Select Area</option>`;
  const areas = campusAreas[campusSelect.value];
  if (!areas) return;

  areas.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    areaRoomSelect.appendChild(opt);
  });
});

/* ================== FILTER ================== */
function applyFilters() {
  loadAssets(1);
}

/* ================== INIT ================== */
toggleFields();
toggleMacField();