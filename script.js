// SebCapital Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyDAzFNyR0hEZHaYycv8Ja77Uqy3mWQq80w",
  authDomain: "sebcapital-1020.firebaseapp.com",
  projectId: "sebcapital-1020",
  storageBucket: "sebcapital-1020.firebasestorage.app",
  messagingSenderId: "585198991431",
  appId: "1:585198991431:web:5d9ea2cf6366327b38d962",
  measurementId: "G-8RVVMVN1Z3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function signup() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, pass).then(() => {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("survey-section").style.display = "block";
  }).catch((err) => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass).then((cred) => {
    loadDashboard(cred.user.uid);
  }).catch((err) => alert(err.message));
}

function submitSurvey() {
  const uid = auth.currentUser.uid;
  const income = document.getElementById("income").value;
  const expenses = document.getElementById("expenses").value;
  const age = document.getElementById("age").value;
  const goal = document.getElementById("goal").value;

  db.collection("users").doc(uid).set({
    income,
    expenses,
    age,
    goal,
    goals: []
  }).then(() => {
    loadDashboard(uid);
  });
}

function addGoal() {
  const goalText = document.getElementById("new-goal").value;
  const uid = auth.currentUser.uid;
  if (!goalText) return;

  db.collection("users").doc(uid).update({
    goals: firebase.firestore.FieldValue.arrayUnion(goalText)
  }).then(() => {
    const li = document.createElement("li");
    li.textContent = goalText;
    document.getElementById("goal-list").appendChild(li);
    document.getElementById("new-goal").value = "";
  });
}

function loadDashboard(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    const data = doc.data();
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("survey-section").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    const savings = parseFloat(data.income) - parseFloat(data.expenses);
    document.getElementById("summary").innerText =
      `You save $${savings}/month. Goal: ${data.goal}`;

    const list = document.getElementById("goal-list");
    list.innerHTML = "";
    (data.goals || []).forEach(g => {
      const li = document.createElement("li");
      li.textContent = g;
      list.appendChild(li);
    });
  });
}
