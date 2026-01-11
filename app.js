// GLOBAL ACCESS
window.startApp = startApp;
window.toggleTheme = toggleTheme;
window.nextMonth = nextMonth;
window.requestPayment = requestPayment;
let currentFilter = "All";

let month = 1;


const loans = [
  { id: 1, name: "John Davis", status: "Healthy", balance: 10000, due: 1000, requested: false, history: [] },
  { id: 2, name: "Maria Kovac", status: "At Risk", balance: 8500, due: 900, requested: false, history: [] },
  { id: 3, name: "Alex Petrov", status: "Delinquent", balance: 12000, due: 1100, requested: false, history: [] },
  { id: 4, name: "Liam Brown", status: "Healthy", balance: 6000, due: 700, requested: false, history: [] },
  { id: 5, name: "Sofia Marin", status: "At Risk", balance: 9200, due: 950, requested: false, history: [] }
];


function startApp() {
  document.getElementById("landing").classList.remove("active");
  document.getElementById("dashboard").classList.add("active");
  render();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

function render() {
  renderMetrics();
  renderLoans();
}

function renderMetrics() {
  document.getElementById("totalLoans").textContent = loans.length;
  document.getElementById("atRiskLoans").textContent = loans.filter(l => l.status === "At Risk").length;
  document.getElementById("delinquentLoans").textContent = loans.filter(l => l.status === "Delinquent").length;

  const score =
    100 -
    loans.filter(l => l.status === "At Risk").length * 15 -
    loans.filter(l => l.status === "Delinquent").length * 30;

  document.getElementById("healthScore").textContent = Math.max(score, 0) + " / 100";
  document.getElementById("monthLabel").textContent = "Month " + month;
}

function renderLoans() {
  const list = document.getElementById("loanList");
  list.innerHTML = "";

  loans
    .filter(l => currentFilter === "All" || l.status === currentFilter)
    .forEach(loan => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${loan.name}</span><strong>${loan.status}</strong>`;
      li.onclick = () => showDetails(loan);
      list.appendChild(li);
    });
}


function showDetails(loan) {
  let btn = "";
  if ((loan.status === "At Risk" || loan.status === "Delinquent") && !loan.requested) {
    btn = `<button class="primary-btn" onclick="requestPayment(${loan.id})">
      Send Payment Request
    </button>`;
  }

  let historyHtml = "<p>No payment history</p>";
  if (loan.history.length > 0) {
    historyHtml = loan.history
      .map(h => `Month ${h.month}: ${h.action} ($${h.amount})`)
      .join("<br>");
  }

  document.getElementById("loanDetails").innerHTML = `
    <p><strong>Name:</strong> ${loan.name}</p>
    <p><strong>Status:</strong> ${loan.status}</p>
    <p><strong>Balance:</strong> $${loan.balance}</p>
    <p><strong>Monthly Due:</strong> $${loan.due}</p>

    <hr style="margin:10px 0">

    <strong>Payment History</strong>
    <p>${historyHtml}</p>

    ${btn}
  `;
}

  document.getElementById("loanDetails").innerHTML = `
    <p><strong>Name:</strong> ${loan.name}</p>
    <p><strong>Status:</strong> ${loan.status}</p>
    <p><strong>Balance:</strong> $${loan.balance}</p>
    <p><strong>Due:</strong> $${loan.due}</p>
    ${btn}
  `;


function requestPayment(id) {
  const loan = loans.find(l => l.id === id);
  loan.requested = true;
  notify("Payment request sent to " + loan.name);

  setTimeout(() => processPayment(loan), 10000 + Math.random() * 5000);
  render();
}

function processPayment(loan) {
  const r = Math.random();
  let record = { month, action: "", amount: 0 };

  if (r > 0.6) {
    loan.balance -= loan.due;
    loan.status = "Healthy";
    record.action = "Full payment";
    record.amount = loan.due;
    notify(loan.name + " paid in full");

  } else if (r > 0.3) {
    const paid = Math.floor(loan.due / 2);
    loan.balance -= paid;
    loan.status = "At Risk";
    record.action = "Partial payment";
    record.amount = paid;
    notify(loan.name + " made partial payment");

  } else {
    loan.status = "Delinquent";
    record.action = "Missed payment";
    record.amount = 0;
    notify(loan.name + " missed payment");
  }

  loan.history.push(record);
  loan.requested = false;
  render();
}

function nextMonth() {
  month++;
  loans.forEach(l => {
    if (l.status === "Healthy" && Math.random() < 0.15) l.status = "At Risk";
    if (l.status === "At Risk" && Math.random() < 0.3) l.status = "Delinquent";
  });
  notify("Advanced to next month");
  render();
}

function notify(msg) {
  const box = document.createElement("div");
  box.className = "notification";
  box.textContent = msg;
  document.getElementById("notificationArea").appendChild(box);
  setTimeout(() => box.remove(), 6000);
}
function setFilter(status) {
  currentFilter = status;
  renderLoans();
}
