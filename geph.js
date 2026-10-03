
// ========== 1. DONNÉES ==========
const categories = JSON.parse(localStorage.getItem("cats")) || [];
const goals = JSON.parse(localStorage.getItem("goals")) || [];
const debts = JSON.parse(localStorage.getItem("debts")) || [];

function save() {
  localStorage.setItem("cats", JSON.stringify(categories));
  localStorage.setItem("goals", JSON.stringify(goals));
  localStorage.setItem("debts", JSON.stringify(debts));
}

// ========== 2. ONGLETS ==========
document.querySelectorAll(".tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("show"));
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("show");
    btn.classList.add("active");
  };
});

// ========== 3. BUDGET ==========
function addCategory() {
  const name = document.getElementById("catName").value.trim();
  const limit = Number(document.getElementById("catLimit").value);

  if (name === "" || limit <= 0) {
    alert("Remplis le nom et un budget supérieur à 0");
    return;
  }

  categories.push({ 
  name: name, 
  limit: limit, 
  spent: 0 
  });
  save();
  updateAll();

  document.getElementById("catName").value = "";
  document.getElementById("catLimit").value = "";
}

function addExpense() {
  const index = document.getElementById("expCat").value;   // texte : "" ou "0", "1"...
  const amount = Number(document.getElementById("expAmount").value);

  if (index === "" || amount <= 0) {
    alert("Choisis une catégorie et un montant supérieur à 0");
    return;
  }

  categories[Number(index)].spent += amount;
  save();
  updateAll();
  document.getElementById("expAmount").value = "";
}

function removeCategory(index) {
  categories.splice(index, 1);
  save();
  updateAll();
}

function fillSelect() {
  const select = document.getElementById("expCat");
  select.innerHTML = "";

  if (categories.length === 0) {
    select.innerHTML = `<option value="">Crée d'abord une catégorie</option>`;
    return;
  }

  categories.forEach((c, i) => {
    select.innerHTML += `<option value="${i}">${c.name}</option>`;
  });
}

function showCategories() {
  const list = document.getElementById("catList");
  list.innerHTML = "";

  categories.forEach((c, index) => {
    const pct = Math.min((c.spent / c.limit) * 100, 100);
    const danger = c.spent >= c.limit ? "danger" : "";

    list.innerHTML += `<div class="item">
      <div class="item-top">
        <div><b>${c.name}</b><br>${c.spent} / ${c.limit} FC</div>
        <button class="delete" onclick="removeCategory(${index})">🗑️</button>
      </div>
      <div class="progress">
        <div class="fill ${danger}" style="width:${pct}%"></div>
      </div>
    </div>`;
  });
}

function updateDashboard() {
  let budget = 0;
  let spent = 0;

  categories.forEach(c => {
    budget += c.limit;
    spent += c.spent;
  });

  document.getElementById("totalBudget").innerHTML = budget + " FC";
  document.getElementById("totalSpent").innerHTML = spent + " FC";
  document.getElementById("totalLeft").innerHTML = (budget - spent) + " FC";
}

// ========== 4. ÉPARGNE ==========
function addGoal() {
  const name = document.getElementById("goalName").value.trim();
  const target = Number(document.getElementById("goalTarget").value);

  if (name === "" || target <= 0) {
    alert("Remplis le nom et un montant supérieur à 0");
    return;
  }

  goals.push({ name: name, target: target, saved: 0 });
  save();
  updateAll();

  document.getElementById("goalName").value = "";
  document.getElementById("goalTarget").value = "";
}

function addToGoal(index) {
  const amount = Number(prompt("Montant à ajouter ?"));

  if (isNaN(amount) || amount <= 0) return;

  goals[index].saved += amount;
  save();
  updateAll();
}

function removeGoal(index) {
  goals.splice(index, 1);
  save();
  updateAll();
}

function showGoals() {
  const list = document.getElementById("goalList");
  list.innerHTML = "";

  goals.forEach((g, index) => {
    const pct = Math.min((g.saved / g.target) * 100, 100);

    list.innerHTML += `<div class="item">
      <div class="item-top">
        <div><b>${g.name}</b><br>${g.saved} / ${g.target} FC (${Math.round(pct)} %)</div>
        <div>
          <button onclick="addToGoal(${index})">➕</button>
          <button class="delete" onclick="removeGoal(${index})">🗑️</button>
        </div>
      </div>
      <div class="progress">
        <div class="fill" style="width:${pct}%"></div>
      </div>
    </div>`;
  });
}

// ========== 5. DETTES ==========
function addDebt() {
  const name = document.getElementById("debtName").value.trim();
  const amount = Number(document.getElementById("debtAmount").value);
  const type = document.getElementById("debtType").value;   // "owe" ou "owed"

  if (name === "" || amount <= 0) {
    alert("Remplis le nom et un montant supérieur à 0");
    return;
  }

  debts.push({ name: name, amount: amount, type: type });
  save();
  updateAll();

  document.getElementById("debtName").value = "";
  document.getElementById("debtAmount").value = "";
}

function removeDebt(index) {
  debts.splice(index, 1);
  save();
  updateAll();
}

function showDebts() {
  const list = document.getElementById("debtList");
  list.innerHTML = "";

  let owe = 0;
  let owed = 0;

  debts.forEach((d, index) => {
    if (d.type === "owe") owe += d.amount;
    else owed += d.amount;

    list.innerHTML += `<div class="item ${d.type}">
      <div class="item-top" style="margin-bottom:0">
        <div><b>${d.name}</b><br>${d.amount} FC</div>
        <button class="delete" onclick="removeDebt(${index})">🗑️</button>
      </div>
    </div>`;
  });

  document.getElementById("totalOwe").innerHTML = owe + " FC";
  document.getElementById("totalOwed").innerHTML = owed + " FC";
}

// ========== 6. CONVERTISSEUR ==========
function convert() {
  const rate = Number(document.getElementById("convRate").value);
  const amount = Number(document.getElementById("convAmount").value);
  const type = document.getElementById("convType").value;
  const result = document.getElementById("convResult");

  if (rate <= 0 || amount <= 0) {
    result.innerHTML = "Entre un taux et un montant supérieurs à 0";
    return;
  }

  if (type === "fcToUsd") {
    result.innerHTML = (amount / rate) + " USD";
  } else {
    result.innerHTML = (amount * rate) + " FC";
  }
}

// ========== 7. THÈME ==========
document.getElementById("theme").onclick = function () {
  document.body.classList.toggle("light");
  this.innerHTML = document.body.classList.contains("light") ? "☀️" : "🌙";
};

// ========== 8. TOUT METTRE À JOUR ==========
function updateAll() {
  fillSelect();
  showCategories();
  updateDashboard();
  showGoals();
  showDebts();
}

updateAll();   // un seul appel, tout en bas


