const API = "https://YOUR_WORKER_URL"; // Cloudflare Worker URL

// ---------------- LOGIN ----------------
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  loginModal.style.display = "none";
  navTabs.style.display = "flex";
});

// ---------------- PAGE SWITCH ----------------
function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  if (page === "dashboard") loadDashboard();
}

function logout() {
  location.reload();
}

// ---------------- ROLE TOGGLE ----------------
function toggleFields() {
  const role = document.getElementById("role").value;
  studentFields.style.display = role === "student" ? "block" : "none";
  empFields.style.display = role === "employee" ? "block" : "none";
}

// ---------------- SUBMIT FORM ----------------
assetForm.addEventListener("submit", async e => {
  e.preventDefault();

  const role = document.getElementById("role").value;

  const payload = {
    role,
    title: title.value,
    name: name.value,
    email: email.value,
    batch: batch.value,
    rollNo: rollNo.value,
    dept: dept.value,
    designation: designation.value,
    empId: empId.value,
    location: role === "student" ? studentLocation.value : empLocation.value,

    assetDesc: assetDesc.value,
    assetType: assetType.value,
    assetId: assetId.value,
    purchaseDate: purchaseDate.value,
    brand: brand.value,
    model: model.value,
    ram: ram.value,
    processor: processor.value,
    storage: storage.value,
    remarks: remarks.value
  };

  await fetch(API + "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("Entry Saved Successfully");
  assetForm.reset();
});

// ---------------- DASHBOARD ----------------
let chart;

async function loadDashboard() {
  const res = await fetch(API + "/list");
  const data = await res.json();

  statTotal.textContent = data.length;
  statStudents.textContent = data.filter(d => d.role === "student").length;
  statEmployees.textContent = data.filter(d => d.role === "employee").length;

  renderChart(data);
}

function renderChart(data) {
  const students = data.filter(d => d.role === "student").length;
  const employees = data.filter(d => d.role === "employee").length;

  if (chart) chart.destroy();

  chart = new Chart(roleChart, {
    type: "pie",
    data: {
      labels: ["Students", "Employees"],
      datasets: [{ data: [students, employees] }]
    }
  });
}
