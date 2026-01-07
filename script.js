// 🔔 Ask laptop notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// REGISTER
function register() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({user: username.value, pass: password.value});
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered!");
}

// LOGIN
function login() {
  let user = username.value;
  let pass = password.value;

  if (user === "admin" && pass === "admin") {
    localStorage.setItem("role","admin");
    location.href="admin.html";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let ok = users.find(u=>u.user===user && u.pass===pass);

  if(ok){
    localStorage.setItem("role","user");
    localStorage.setItem("currentUser",user);
    location.href="user.html";
  } else alert("Invalid login");
}

// ADD ISSUE
function addIssue() {
  let issues = JSON.parse(localStorage.getItem("issues")) || [];
  let reader = new FileReader();

  reader.onload = function () {
    issues.push({
      user: localStorage.getItem("currentUser"),
      title: title.value,
      category: category.value,
      description: description.value,
      image: reader.result,
      status: "Open",
      date: new Date().toLocaleString()   // ✅ DATE & TIME ADDED
    });

    localStorage.setItem("issues", JSON.stringify(issues));
    localStorage.setItem("newIssue", "yes");

    alert("Issue submitted!");
    showUserIssues();
  };

  reader.readAsDataURL(image.files[0]);
}

// USER VIEW
function showUserIssues() {
  let list = document.getElementById("myIssues");
  let user = localStorage.getItem("currentUser");
  let issues = JSON.parse(localStorage.getItem("issues")) || [];

  list.innerHTML = "";

  issues.filter(i => i.user === user).forEach(i => {
    list.innerHTML += `
    <li class="issue">
      <b>${i.title}</b><br>
      <span class="tag">${i.category}</span><br>
      🕒 ${i.date ? i.date : "Date not available"}<br>
      Status: <span class="status ${i.status.replace(" ","-").toLowerCase()}">${i.status}</span>
      <img src="${i.image}">
    </li>`;
  });
}

// ADMIN VIEW
function showIssues() {
  let list = document.getElementById("issueList");
  let issues = JSON.parse(localStorage.getItem("issues")) || [];

  list.innerHTML = "";

  if (issues.length === 0) {
    list.innerHTML = "<li>No issues reported yet</li>";
    return;
  }

  issues.forEach((i, index) => {
    list.innerHTML += `
    <li class="issue">
      <b>${i.title}</b> (${i.user})<br>
      <span class="tag">${i.category}</span><br>
      🕒 ${i.date ? i.date : "Date not available"}<br><br>

      Status:
      <select onchange="changeStatus(${index}, this.value); updateStatusColor(this)">
  <option value="Open" ${i.status==="Open"?"selected":""}>Open</option>
  <option value="In Progress" ${i.status==="In Progress"?"selected":""}>In Progress</option>
  <option value="Resolved" ${i.status==="Resolved"?"selected":""}>Resolved</option>
</select>
      <img src="${i.image}">
    </li>`;
  });
}


// CHANGE STATUS
function changeStatus(i,val){
  let issues=JSON.parse(localStorage.getItem("issues"));
  issues[i].status=val;
  localStorage.setItem("issues",JSON.stringify(issues));
  localStorage.setItem("statusUser",issues[i].user);
}

// ADMIN NOTIFICATION
function adminNotification(){
  if(localStorage.getItem("newIssue")==="yes"){
    alert("🔔 New issue reported!");
    new Notification("New Issue",{body:"A user submitted an issue"});
    localStorage.removeItem("newIssue");
  }
}

// USER NOTIFICATION
function userNotification(){
  let u=localStorage.getItem("statusUser");
  if(u===localStorage.getItem("currentUser")){
    alert("✅ Issue status updated!");
    new Notification("Issue Updated",{body:"Admin updated your issue"});
    localStorage.removeItem("statusUser");
  }
}

// LOGOUT
function logout(){
  localStorage.removeItem("role");
  localStorage.removeItem("currentUser");
  location.href="index.html";
}
