alert("script.js loaded");

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

  const data = {
    role: role.value,
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
    serial_no: assetId.value,
    brand: brand.value,
    model: model.value,
    ram: ram.value,
    processor: processor.value,
    storage: hdd.value,
    remarks: remarks.value
  };

  try {
    const res = await fetch(
      "https://itm-inventory-api.hiteshs.workers.dev/api/add",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }
    );

    if (!res.ok) throw new Error("API error");

    alert("✅ Asset Added Successfully");
    assetForm.reset();
    toggleFields();

  } catch (err) {
    console.error(err);
    alert("❌ Submit failed. Check console.");
  }
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