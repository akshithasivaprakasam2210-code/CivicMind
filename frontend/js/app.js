let latitude = sessionStorage.getItem("latitude");
let longitude = sessionStorage.getItem("longitude");

if (!latitude || !longitude) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            sessionStorage.setItem("latitude", latitude);
            sessionStorage.setItem("longitude", longitude);

            const latInput = document.getElementById("latitude");
            const lngInput = document.getElementById("longitude");

            if (latInput) latInput.value = latitude;
            if (lngInput) lngInput.value = longitude;

            console.log(latitude, longitude);
        });
    }
} else {
    const latInput = document.getElementById("latitude");
    const lngInput = document.getElementById("longitude");

    if (latInput) latInput.value = latitude;
    if (lngInput) lngInput.value = longitude;
}

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (e) {

            e.preventDefault();

            const role = document.getElementById("loginRole").value;

            if (role === "citizen") {

                const email = document.getElementById("loginEmail").value;
                const name = email.split("@")[0];

                localStorage.setItem("citizenName", name);
                localStorage.setItem("citizenEmail", email);

                window.location.href = "citizen-dashboard.html";

            }

            else if (role === "officer") {

                const email = document.getElementById("loginEmail").value;
                const password = document.getElementById("loginPassword").value;

                try {

                    const response = await fetch("http://localhost:8080/api/officers/login", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })

                    });

                    const text = await response.text();

                    if (!response.ok) {
                        throw new Error(text || "Login failed");
                    }

                    if (!text) {
                        alert("Backend returned an empty response.");
                        return;
                    }

                    const officer = JSON.parse(text);

                    if (officer && officer.id) {

                        localStorage.setItem("officerId", officer.id);
                        localStorage.setItem("officerArea", officer.area);

                        window.location.href = "officer-dashboard.html";

                    } else {

                        alert("Invalid Officer Login");

                    }

                } catch (error) {

                    console.error(error);
                    alert("Unable to connect to backend.");

                }

            }

            else if (role === "admin") {

                window.location.href = "admin-dashboard.html";

            }

            else {

                alert("Please select a role.");

            }

        });

    }

});

  // Register form demo
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(e){

        e.preventDefault();

        const role = document.getElementById("role").value;

        if(role === "Officer"){

            const officer = {

                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                area: document.getElementById("area").value

            };

            try{

                const response = await fetch("http://localhost:8080/api/officers/register",{

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify(officer)

                });

                if(response.ok){

                    alert("Officer Registered Successfully");

                    window.location.href="login.html";

                }else{

                    alert("Officer Registration Failed");

                }

            }catch(error){

                console.error(error);

                alert("Unable to connect to backend");

            }

        }

        else if(role === "Citizen"){

            alert("Citizen Registered Successfully");

            window.location.href="login.html";

        }

        else if(role === "Admin"){

            alert("Admin Registered Successfully");

            window.location.href="login.html";

        }

        else{

            alert("Please select a role.");

        }

    });

}


  // Complaint form demo
  
const grievanceForm = document.getElementById("grievanceForm");

if (grievanceForm) {
  grievanceForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const area = document.getElementById("area").value.trim();
    const severity = document.getElementById("severity").value;
    const description = document.getElementById("description").value.trim();
    const landmark = document.getElementById("landmark").value.trim();
    const formMessage = document.getElementById("formMessage");

    if (!title || !category || !area || !severity || !description) {
      formMessage.style.color = "red";
      formMessage.textContent = "Please fill all required fields.";
      return;
    }

   const grievanceData = {
  title: title,
  category: category,
  area: area,
  severity: severity,
  description: description,
  landmark: landmark,
  latitude: latitude,
  longitude: longitude,

  citizenEmail: localStorage.getItem("citizenEmail"),

  status: "Pending",
  priorityScore: getPriorityScore(severity),
  createdAt: new Date().toISOString()
};

    try {
      const response = await fetch("http://localhost:8080/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(grievanceData)
      });

      if (!response.ok) {
        throw new Error("Backend not reachable");
      }

      const savedComplaint = await response.json();

      saveComplaintToLocal(savedComplaint);

      formMessage.style.color = "green";
      formMessage.textContent = "Complaint submitted successfully!";
      grievanceForm.reset();
    } catch (error) {
      console.log("Backend failed, saving locally...", error);

      grievanceData.id = Date.now();
      saveComplaintToLocal(grievanceData);

      formMessage.style.color = "orange";
      formMessage.textContent =
        "Complaint saved locally for demo because backend is not reachable.";
      grievanceForm.reset();
    }
  });
}

function saveComplaintToLocal(complaint) {
  let complaints = JSON.parse(localStorage.getItem("civicmind_complaints")) || [];
  complaints.push(complaint);
  localStorage.setItem("civicmind_complaints", JSON.stringify(complaints));
}

function getPriorityScore(severity) {
  switch (severity) {
    case "Critical":
      return 95;
    case "High":
      return 80;
    case "Medium":
      return 60;
    case "Low":
      return 35;
    default:
      return 50;
  }
}
const complaintsContainer = document.getElementById("complaintsContainer");

if (complaintsContainer) {
  loadComplaints();
}

async function loadComplaints() {
  try {
    const response = await fetch("http://localhost:8080/api/grievances");
    const complaints = await response.json();

    if (complaints.length === 0) {
      complaintsContainer.innerHTML = `
        <div class="empty-state-card">
          <h3>No complaints submitted yet</h3>
          <p>Once you submit a grievance, it will appear here.</p>
        </div>
      `;
      return;
    }

    complaintsContainer.innerHTML = complaints.map((complaint) => `
      <div class="complaint-card">
        <div class="complaint-card-header">
          <h3>${complaint.title}</h3>
          <span class="status-badge">${complaint.status}</span>
        </div>

        <div class="complaint-meta">
          <span><strong>Category:</strong> ${complaint.category}</span>
          <span><strong>Severity:</strong> ${complaint.severity}</span>
          <span><strong>Area:</strong> ${complaint.area}</span>
        </div>

        <p class="complaint-description">
          ${complaint.description}
        </p>

        <div class="complaint-footer">
          <span><strong>Landmark:</strong> ${complaint.landmark}</span>
        </div>
      </div>
    `).join("");

  } catch (error) {
    console.error(error);
    complaintsContainer.innerHTML =
      "<h3>Unable to load complaints.</h3>";
  }
}

function updateComplaintStatus(index, newStatus) {
  let complaints = JSON.parse(localStorage.getItem("civicmind_complaints")) || [];

  if (!complaints[index]) return;

  complaints[index].status = newStatus;
  localStorage.setItem("civicmind_complaints", JSON.stringify(complaints));

  loadOfficerComplaints();

  // also refresh citizen complaints page data if opened later
  if (typeof loadComplaints === "function") {
    loadComplaints();
  }
}
const officerComplaintsContainer = document.getElementById("officerComplaintsContainer");

if (officerComplaintsContainer) {
    loadOfficerComplaints();
}

async function loadOfficerComplaints() {

    try {

        const area = localStorage.getItem("officerArea");

        const response = await fetch(
            `http://localhost:8080/api/grievances/area/${encodeURIComponent(area)}`
        );

        const complaints = await response.json();

        if (complaints.length === 0) {

            officerComplaintsContainer.innerHTML =
                "<h3>No complaints available for your area.</h3>";

            return;
        }

        officerComplaintsContainer.innerHTML = complaints.map(c => `

<div class="complaint-card">

    <h3>${c.title}</h3>

    <p><strong>Category:</strong> ${c.category}</p>

    <p><strong>Area:</strong> ${c.area}</p>

    <p><strong>Severity:</strong> ${c.severity}</p>

    <p><strong>Status:</strong></p>

    <select onchange="updateStatus(${c.id}, this.value)">

        <option value="Pending" ${c.status==="Pending"?"selected":""}>Pending</option>

        <option value="In Progress" ${c.status==="In Progress"?"selected":""}>In Progress</option>

        <option value="Resolved" ${c.status==="Resolved"?"selected":""}>Resolved</option>

    </select>

    <p>${c.description}</p>

</div>

        `).join("");

    } catch (error) {

        console.error(error);

    }

}
async function updateStatus(id, status) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/grievances/${id}/status?status=${encodeURIComponent(status)}`,
            {
                method: "PUT"
            }
        );

        if (response.ok) {
            alert("Status updated successfully!");
            loadOfficerComplaints();
        } else {
            alert("Failed to update status.");
        }
    } catch (error) {
        console.error(error);
        alert("Backend error.");
    }
}
document.addEventListener("DOMContentLoaded", function () {

    const welcome = document.getElementById("welcomeUser");

    if (welcome) {

        const name = localStorage.getItem("citizenName");

        if (name) {
            welcome.innerHTML = `Welcome back, ${name} 👋`;
        }

    }

});
async function loadCitizenStats() {

    const total = document.getElementById("totalComplaints");

    if (!total) return;

    try {

       const email = localStorage.getItem("citizenEmail");

const response = await fetch(
    `http://localhost:8080/api/grievances/citizen/${email}`
);
        const complaints = await response.json();
        console.log (complaints);

        document.getElementById("totalComplaints").innerText = complaints.length;

document.getElementById("resolvedComplaints").innerText =
    complaints.filter(c =>
        c.status &&
        c.status.toLowerCase().includes("resolved")
    ).length;

document.getElementById("progressComplaints").innerText =
    complaints.filter(c =>
        c.status &&
        c.status.toLowerCase().includes("progress")
    ).length;
document.getElementById("pendingComplaints").innerText =
    complaints.filter(c =>
        c.status &&
        c.status.toLowerCase().includes("pending")
    ).length;
    } catch (error) {

        console.error("Unable to load dashboard statistics", error);

    }

}

document.addEventListener("DOMContentLoaded", loadCitizenStats);
async function loadRecentComplaints() {

    const table = document.getElementById("recentComplaintsBody");

    if (!table) return;

    try {

       const email = localStorage.getItem("citizenEmail");

const response = await fetch(
    `http://localhost:8080/api/grievances/citizen/${email}`
);
        const complaints = await response.json();

        if (complaints.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">No complaints found.</td>
                </tr>
            `;

            return;
        }


        table.innerHTML = complaints.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.title}</td>
                <td>${c.category}</td>
                <td>${c.status}</td>
                <td>${c.severity}</td>
            </tr>
        `).join("");

    } catch (error) {

        console.error("Unable to load complaints", error);

    }

}

document.addEventListener("DOMContentLoaded", loadRecentComplaints);
const welcome = document.getElementById("welcomeCitizen");

if (welcome) {

    const name = localStorage.getItem("citizenName");

    if (name) {
        welcome.innerHTML = `Welcome back, ${name} 👋`;
    }

}
function logout() {

    localStorage.clear();

    window.location.href = "index.html";

}