const state = {
  earnings: 0,
  expense: 0,
  net: 0,
  transactions: [],
};

let isUpdate = false;
let tid;

const transactionFormEl = document.getElementById("transactionForm");

const renderTransactions = () => {
  const transactionContainerEl = document.querySelector(".transactions");
  const netAmountEl = document.getElementById("netAmount");
  const earningEl = document.getElementById("earning");
  const expenseEl = document.getElementById("expense");

  const transactions = state.transactions;

  let earning = 0;
  let expense = 0;
  let net = 0;

  transactionContainerEl.innerHTML = "";

  transactions.forEach((transaction) => {
    const { id, amount, text, type } = transaction;
    const isCredit = type === "credit";
    const sign = isCredit ? "+" : "-";

    const transactionEl = `
      <div class="transaction" id="${id}">
          <div class="content" onclick="showEdit(${id})">
              <div class="left">
                  <p>${text}</p>
                  <p>${sign} PKR ${amount}</p>
              </div>
              <div class="status ${isCredit ? "credit" : "debit"}">
                ${isCredit ? "C" : "D"}
              </div>
          </div>
          <div class="lower">
              <div class="icon" onclick="handleUpdate(${id})">
                  <i class="fa-solid fa-pen"></i>
              </div>
              <div class="icon" onclick="handleDelete(${id})">
                  <i class="fa-solid fa-trash"></i>
              </div>
          </div>
      </div>
    `;

    earning += isCredit ? amount : 0;
    expense += !isCredit ? amount : 0;
    net = earning - expense;

    transactionContainerEl.insertAdjacentHTML("afterbegin", transactionEl);
  });

  netAmountEl.innerHTML = `PKR ${net}`;
  earningEl.innerHTML = `PKR ${earning}`;
  expenseEl.innerHTML = `PKR ${expense}`;
};

const addTransaction = (e) => {
  e.preventDefault();

  const isEarn = e.submitter.id === "earnBtn";

  const formData = new FormData(transactionFormEl);
  const tData = {};

  formData.forEach((value, key) => {
    tData[key] = value;
  });

  const { text, amount } = tData;
  if (!text || !amount) return;

  const transaction = {
    id: isUpdate ? tid : Math.floor(Math.random() * 100000),
    text: text,
    amount: +amount,
    type: isEarn ? "credit" : "debit",
  };

  if (isUpdate) {
    const index = state.transactions.findIndex((t) => t.id === tid);
    state.transactions[index] = transaction;
    isUpdate = false;
    tid = null;
  } else {
    state.transactions.push(transaction);
  }

  renderTransactions();
  transactionFormEl.reset();
};





renderTransactions();
transactionFormEl.addEventListener("submit", addTransaction);
