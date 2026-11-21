// 1. SAMPLE INITIAL DATA (Saved in browser localStorage)
let applications = JSON.parse(localStorage.getItem("applications")) || [
  {
    id: "APP-0001",
    name: "Aarav Sharma",
    phone: "9876543210",
    gender: "Male",
    city: "Chennai",
    state: "Tamil Nadu",
    status: "Approved",
    date: "2026-11-18"
  },
  {
    id: "APP-0002",
    name: "Priya Nair",
    phone: "9123456789",
    gender: "Female",
    city: "Bengaluru",
    state: "Karnataka",
    status: "Pending",
    date: "2026-11-20"
  }
];

let certificates = JSON.parse(localStorage.getItem("certificates")) || [
  {
    id: "CERT-0001",
    name: "Aarav Sharma",
    phone: "9876543210",
    city: "Chennai",
    state: "Tamil Nadu",
    issuedOn: "2026-11-19",
    status: "Valid"
  }
];

function saveData() {
  localStorage.setItem("applications", JSON.stringify(applications));
  localStorage.setItem("certificates", JSON.stringify(certificates));
}

// 2. NAVIGATION BETWEEN PAGES
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Show selected page
  document.getElementById("page-" + pageName).classList.add("active");

  // Refresh tables if viewing admin pages
  if (pageName === "admin-applications") renderApplicationsTable();
  if (pageName === "admin-certificates") renderCertificatesTable();
}

// 3. CITIZEN: REQUEST CERTIFICATE
function submitRequest(event) {
  event.preventDefault();

  const name = document.getElementById("req-name").value;
  const phone = document.getElementById("req-phone").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const city = document.getElementById("req-city").value;
  const state = document.getElementById("req-state").value;

  // Generate ID like APP-0003
  const nextNum = String(applications.length + 1).padStart(4, "0");
  const newAppId = "APP-" + nextNum;
  const today = new Date().toISOString().split("T")[0];

  applications.push({
    id: newAppId,
    name,
    phone,
    gender,
    city,
    state,
    status: "Pending",
    date: today
  });

  saveData();

  // Show success message
  const successBox = document.getElementById("request-success");
  successBox.innerHTML = `
    <strong>Application submitted successfully!</strong><br>
    Application ID: <strong>#${newAppId}</strong>
  `;
  successBox.classList.remove("hidden");

  // Clear form
  document.getElementById("request-form").reset();
}

// 4. CITIZEN: TRACK APPLICATION
function trackApplication(event) {
  event.preventDefault();
  const inputId = document.getElementById("track-input").value.trim().replace("#", "").toUpperCase();
  const resultDiv = document.getElementById("track-result");

  const app = applications.find((a) => a.id === inputId);

  if (app) {
    resultDiv.innerHTML = `
      <div class="result-box">
        <p><strong>Name:</strong> ${app.name}</p>
        <p><strong>Status:</strong> ${app.status}</p>
        <p><strong>Submission Date:</strong> ${app.date}</p>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `<div class="alert error">Error: Application ID not found.</div>`;
  }
}

// 5. PUBLIC: VERIFY CERTIFICATE
function verifyCertificate(event) {
  event.preventDefault();
  const inputId = document.getElementById("verify-input").value.trim().replace("#", "").toUpperCase();
  const resultDiv = document.getElementById("verify-result");

  const cert = certificates.find((c) => c.id === inputId);

  if (cert) {
    resultDiv.innerHTML = `
      <div class="result-box">
        <p><strong>Name:</strong> ${cert.name}</p>
        <p><strong>Phone:</strong> ${cert.phone}</p>
        <p><strong>Issued on Date:</strong> ${cert.issuedOn}</p>
        <p><strong>Status:</strong> ${cert.status}</p>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `<div class="alert error">Status: Not Found (Invalid Certificate ID)</div>`;
  }
}

// 6. ADMIN: LOGIN & LOGOUT
function handleAdminLogin(event) {
  event.preventDefault();
  const user = document.getElementById("admin-user").value;
  const pass = document.getElementById("admin-pass").value;

  if (user === "admin" && pass === "admin") {
    document.getElementById("login-error").classList.add("hidden");
    document.getElementById("public-nav").classList.add("hidden");
    document.getElementById("admin-nav").classList.remove("hidden");
    showPage("admin-applications");
  } else {
    const errorBox = document.getElementById("login-error");
    errorBox.textContent = "Invalid username or password. Try admin / admin.";
    errorBox.classList.remove("hidden");
  }
}

function logoutAdmin() {
  document.getElementById("admin-nav").classList.add("hidden");
  document.getElementById("public-nav").classList.remove("hidden");
  showPage("home");
}

// 7. ADMIN: MANAGE APPLICATIONS
function renderApplicationsTable() {
  const tbody = document.getElementById("applications-table-body");
  tbody.innerHTML = "";

  applications.forEach((app) => {
    const isPending = app.status === "Pending";
    tbody.innerHTML += `
      <tr>
        <td>#${app.id}</td>
        <td>${app.name}</td>
        <td>${app.phone}</td>
        <td>${app.gender}</td>
        <td>${app.city}</td>
        <td>${app.state}</td>
        <td><strong>${app.status}</strong></td>
        <td>
          <button class="btn-small btn-issue" ${!isPending ? "disabled" : ""} onclick="issueCert('${app.id}')">Issue</button>
          <button class="btn-small btn-reject" ${!isPending ? "disabled" : ""} onclick="rejectApp('${app.id}')">Reject</button>
        </td>
      </tr>
    `;
  });
}

function issueCert(appId) {
  const app = applications.find((a) => a.id === appId);
  if (!app) return;

  app.status = "Approved";

  const nextCertNum = String(certificates.length + 1).padStart(4, "0");
  const newCertId = "CERT-" + nextCertNum;
  const today = new Date().toISOString().split("T")[0];

  certificates.push({
    id: newCertId,
    name: app.name,
    phone: app.phone,
    city: app.city,
    state: app.state,
    issuedOn: today,
    status: "Valid"
  });

  saveData();
  renderApplicationsTable();
  alert(`Certificate Issued! Certificate ID: #${newCertId}`);
}

function rejectApp(appId) {
  const app = applications.find((a) => a.id === appId);
  if (!app) return;

  app.status = "Rejected";
  saveData();
  renderApplicationsTable();
}

// 8. ADMIN: MANAGE CERTIFICATES
function renderCertificatesTable() {
  const tbody = document.getElementById("certificates-table-body");
  tbody.innerHTML = "";

  certificates.forEach((cert) => {
    const isValid = cert.status === "Valid";
    tbody.innerHTML += `
      <tr>
        <td>#${cert.id}</td>
        <td>${cert.name}</td>
        <td>${cert.phone}</td>
        <td>${cert.city}</td>
        <td>${cert.state}</td>
        <td>${cert.issuedOn}</td>
        <td><strong>${cert.status}</strong></td>
        <td>
          <button class="btn-small btn-reject" ${!isValid ? "disabled" : ""} onclick="revokeCert('${cert.id}')">Revoke</button>
        </td>
      </tr>
    `;
  });
}

function revokeCert(certId) {
  const cert = certificates.find((c) => c.id === certId);
  if (!cert) return;

  cert.status = "Revoked";
  saveData();
  renderCertificatesTable();
}