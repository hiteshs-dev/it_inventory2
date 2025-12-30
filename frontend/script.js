const API_BASE = "https://itm-inventory-api.hiteshs.workers.dev";

/* ---------------- LOGIN ---------------- */
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const user = username.value;
  const pass = password.value;

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

/* ---------------- PAGE SWITCH ---------------- */
function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`page-${page}`).classList.add("active");
  event.target.classList.add("active");
}

/* ---------------- ROLE TOGGLE ---------------- */
function toggleFields() {
  const role = document.getElementById("role").value;
  studentFields.style.display = role === "student" ? "block" : "none";
  empFields.style.display = role === "employee" ? "block" : "none";
}

/* ---------------- SUBMIT FORM ---------------- */
assetForm.addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    role: role.value,
    title: title.value,
    name: name.value,
    email: email.value,
    batch: batch?.value || "",
    roll_no: rollNo?.value || "",
    department: dept?.value || "",
    designation: designation?.value || "",
    emp_id: empId?.value || "",
    location: location.value,
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

  await fetch(`${API_BASE}/api/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("✅ Asset saved successfully");
  assetForm.reset();
  loadDashboard();
});

/* ---------------- DASHBOARD ---------------- */
async function loadDashboard() {
  const res = await fetch(`${API_BASE}/api/all`);
  const data = await res.json();

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
        <td>-</td>
      </tr>
    `;
  });

  drawCharts(data);
}

/* ---------------- CHARTS ---------------- */
let roleChart, batchChart;

function drawCharts(data) {
  const students = data.filter(d => d.role === "student").length;
  const employees = data.filter(d => d.role === "employee").length;

  roleChart?.destroy();
  roleChart = new Chart(roleChartCtx, {
    type: "doughnut",
    data: {
      labels: ["Students", "Employees"],
      datasets: [{ data: [students, employees] }]
    }
  });

  const batches = {};
  data.forEach(d => {
    if (d.batch) batches[d.batch] = (batches[d.batch] || 0) + 1;
  });

  batchChart?.destroy();
  batchChart = new Chart(batchChartCtx, {
    type: "bar",
    data: {
      labels: Object.keys(batches),
      datasets: [{ data: Object.values(batches) }]
    }
  });
}

const roleChartCtx = document.getElementById("roleChart");
const batchChartCtx = document.getElementById("batchChart");