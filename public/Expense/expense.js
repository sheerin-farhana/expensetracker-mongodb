function successalert(msg) {
  const alertDiv = document.getElementById("success-alert");
  alertDiv.classList.remove("d-none");
  alertDiv.innerText = msg;
  setTimeout(() => {
    alertDiv.classList.add("d-none");
  }, 4000);
}

function failurealert(msg) {
  const errorAlertDiv = document.getElementById("failure-alert");
  errorAlertDiv.classList.remove("d-none");
  errorAlertDiv.innerText = msg;
  setTimeout(() => {
    errorAlertDiv.classList.add("d-none");
  }, 2000);
}

const downloadReportBtn = document.getElementById("download-report--btn");

if (!downloadReportBtn.hasEventListener) {
  downloadReportBtn.hasEventListener = true;
  downloadReportBtn.removeEventListener("click", downloadReportHandler); // Remove existing listener
  downloadReportBtn.addEventListener("click", downloadReportHandler);
}

const buyPremiumBtn = document.getElementById("buy-premium-btn");
function showPremiumFeature() {
  const premiumUserContainer = document.getElementById(
    "premium-user-container"
  );

  const showDownloadFilesBtn = document.getElementById("show-files-btn");

  // downloadReportBtn.classList.remove('d-none');

  showDownloadFilesBtn.classList.remove("d-none");

  showDownloadFilesBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const downloadedFilesResponse = await axios.get(
        "http://localhost:3000/expense/filesdownloaded",
        {
          headers: {
            Authorization: "Bearer " + token, //the token is a variable which holds the token
          },
        }
      );
      const downloadedFiles = downloadedFilesResponse.data.downloadedExpenses;
      const expenseReport = document.getElementById("expense-report");
      expenseReport.classList.remove("d-none");

      const tableBody = expenseReport.querySelector("tbody");
      downloadedFiles.forEach((file) => {
        const row = document.createElement("tr");

        // Assuming each item in downloadedFiles has fileURL and createdAt properties
        const fileURLCell = document.createElement("td");
        fileURLCell.textContent = file.fileURL;
        row.appendChild(fileURLCell);

        const createdAtCell = document.createElement("td");
        createdAtCell.textContent = file.createdAt; // Adjust the date formatting as needed
        row.appendChild(createdAtCell);

        // Append the row to the table body
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.log(err);
      failurealert("Something went wrong. Please try again.");
    }
  });

  buyPremiumBtn.style.display = "none";
  premiumUserContainer.innerText = "PREMIUM USER";
  premiumUserContainer.style.color = "green";
  premiumUserContainer.style.fontFamily = "Cinzel";
  premiumUserContainer.style.fontSize = "24px";
  premiumUserContainer.style.fontWeight = "Bold";

  const showLeaderboardBtn = document.getElementById("show-leaderboard-btn");
  showLeaderboardBtn.classList.remove("d-none");
  showLeaderboardBtn.classList.add("btn");
  showLeaderboardBtn.style.backgroundColor = "#2ecc71";
  showLeaderboardBtn.textContent = "Show Leaderboard";

  // Modify the showLeaderboardBtn event listener
  showLeaderboardBtn.addEventListener("click", async () => {
    try {
      // Fetch data from the "/leaderboard/api" endpoint
      const response = await axios.get(
        "http://localhost:3000/premium/showLeaderboard"
      );
      const leaderboardData = response.data;
      console.log("Leaderboard", leaderboardData);

      // Create the leaderboard modal dynamically
      const leaderboardModal = document.createElement("div");
      leaderboardModal.innerHTML = `<div class="modal fade" id="leaderboardModal" tabindex="-1" aria-labelledby="leaderboardModalLabel" aria-hidden="true">
        <div class="modal-dialog" id="leaderboard-modal">
          <div class="modal-content">
            <div class="modal-header float-right">
              <h5 class="modal-title text-center">Leaderboard</h5>
              <div class="text-right">
                <i data-dismiss="modal" aria-label="Close" class="fa fa-close"></i>
              </div>
            </div>
            <div class="modal-body">
                
      
      
              <div>
                
                <table class="table table-bordered ">
        <thead>
          <tr class="table-success">
            <th scope="col">Rank</th>
            <th scope="col">User</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          ${renderLeaderboardRows(leaderboardData)};
        </tbody>
      </table>
      
              </div>
      
      
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" id="close-btn">Close</button>
            </div>
          </div>
        </div>
      </div>`;

      document.body.appendChild(leaderboardModal);

      // Show the modal
      // $('#leaderboardModal').modal('show');

      const leaderboardModalShow = new bootstrap.Modal(
        document.getElementById("leaderboardModal")
      );
      leaderboardModalShow.show();
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  });

  // Helper function to render leaderboard rows
  function renderLeaderboardRows(data) {
    return data
      .map(
        (entry, index) => `
        <tr>
            <th class="table-danger" scope="row">${index + 1}</th>
            <td class="table-info">${entry.name}</td>
            <td class="table-warning">${entry.totalexpense}</td>
        </tr>
    `
      )
      .join("");
  }

  // premiumContainer.appendChild(showLeaderboardBtn);
}

async function downloadReportHandler(e) {
  e.preventDefault();
  // The rest of your downloadReportBtn click handler logic
  e.preventDefault();
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/expense/download", {
      headers: {
        Authorization: "Bearer " + token, //the token is a variable which holds the token
      },
    });

    if (response.status === 200) {
      var a = document.createElement("a");
      a.href = response.data.fileURL;
      a.download = "myexpense.txt";
      a.click();
    }
  } catch (err) {
    console.log(err);
  }
}

const isPremiumUser = localStorage.getItem("isPremiumUser") === "true";

console.log("IS PREMIUM USER ", isPremiumUser);

if (isPremiumUser === true) {
  showPremiumFeature();
}

const addExpenseBtn = document.querySelector("#add-expense-btn");
addExpenseBtn.addEventListener("click", async function (e) {
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  // Add the expense
  const addedExpense = await addExpense({ amount, category, description });

  if (addedExpense) {
    addExpenseToUi(addedExpense);
  }
});

async function addExpense(expenseObject) {
  try {
    const token = localStorage.getItem("token");
    const { amount, category, description } = expenseObject;
    const expense = await axios.post(
      "http://localhost:3000/expense/insertExpense",
      {
        amount,
        category,
        description,
      },
      {
        headers: {
          Authorization: "Bearer " + token, //the token is a variable which holds the token
        },
      }
    );

    const expenseId = expense._id;
    if (expense.status === 200) {
      successalert("Expense Added");

      // Check if the number of displayed expenses is within the limit
      const expenseList = document.getElementById("expenseList");

      await updateTotalAmount(token);
      return expense.data.data; // Return the added expense
    } else {
      console.log("Response status", expense.status);
    }
  } catch (err) {
    // console.log('Error adding expense:', err);
    failurealert("Error adding expense. Please try again");
    // alert('Error adding expense. Please try again.');
  }
}

function addExpenseToUi(expenseObject) {
  const { _id, expenseamt, category, description } = expenseObject;
  // Create a new expense item
  const expenseItem = document.createElement("div");
  expenseItem.classList.add("expense-item");
  expenseItem.setAttribute("data-id", _id);

  // Display the expense details
  expenseItem.innerHTML = `
        <p><strong>Amount:</strong> $${expenseamt}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Description:</strong> ${description}</p>
        <button class="btn btn-danger" onclick="deleteExpense(this)" data-id=${_id}>Delete</button>
    `;

  const currentPage = parseInt(
    document.getElementById("currentPage").textContent
  );
  const noitemPerPage = document.getElementById("noiteminpage") || 5;
  const startIndex = (currentPage - 1) * noitemPerPage;
  const endIndex = startIndex + noitemPerPage;
  const expenseItems = document.querySelectorAll(".expense-item");
  console.log(expenseItems.length, "EXPENSE ITEMS");
  if (noitemPerPage || 5 <= expenseItems.length) {
    const expenseList = document.getElementById("expenseList");
    expenseList.appendChild(expenseItem);
  }

  // Clear the form
  document.getElementById("expenseForm").reset();

  return expenseItem; // Return the expense item
}

async function updateTotalAmount(token) {
  let totalAmount = 0;
  const totalAmountInput = document.querySelector("#totalAmount");

  const expenses = await axios.get("http://localhost:3000/expense/getExpense", {
    headers: {
      Authorization: "Bearer " + token, //the token is a variable which holds the token
    },
  });
  const expenseData = expenses.data.expense;
  console.log("EXPENSE DATA", expenseData);

  expenseData.forEach((expense) => {
    console.log(expense.expenseamt);
    totalAmount += Number(expense.expenseamt);
  });

  totalAmountInput.innerText = `Total Amount: $${totalAmount.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  let hasMoreExpenses = false;
  let hasPreviousExpenses = false;

  const isPremiumUser = localStorage.getItem("isPremiumUser") === "true";

  const token = localStorage.getItem("token");

  if (isPremiumUser != false) {
    showPremiumFeature();
  }

  const currentPageBtn = document.querySelector("#currentPage");
  const nextPageBtn = document.querySelector("#nextPage");
  const prevPageBtn = document.querySelector("#prevPage");

  prevPageBtn.addEventListener("click", onclickprevpage);
  nextPageBtn.addEventListener("click", onclicknextpage);

  const noItemSelect = document.getElementById("noiteminpage");
  noItemSelect.addEventListener("change", onNoItemPerPageChange);

  async function onNoItemPerPageChange() {
    const selectedValue = document.getElementById("noiteminpage").value;
    localStorage.setItem("noitemPerPage", selectedValue);

    await refresh();
  }

  let currentPage = 1;

  // Function to handle the click on the "Previous" button
  async function onclickprevpage() {
    if (currentPage > 1) {
      currentPage--;
      await refresh();
      updateTotalAmount(token);
    }
  }

  // Function to handle the click on the "Next" button
  async function onclicknextpage() {
    if (hasMoreExpenses) {
      currentPage++;
      await refresh();
      updateTotalAmount(token);
    }
  }

  // Function to refresh and fetch expenses based on the current page and limit
  async function refresh() {
    try {
      const token = localStorage.getItem("token");
      const noitemPerPage = localStorage.getItem("noitemPerPage") || 5;
      const response = await axios.get(
        `http://localhost:3000/expense/getexpensesperpage?page=${currentPage}&noitem=${noitemPerPage}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      //   console.log("for pagination", response);
      showOutput(response.data.expenses);
      updatePageNumber();
    } catch (err) {
      // console.log(err);
      failurealert("OOPS !! Something went wrong !!");
      console.log(err);
      // alert('Error: Something went wrong');
    }
  }

  // Function to update the page number and buttons based on the current state
  function updatePageNumber() {
    currentPageBtn.textContent = currentPage;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = !hasMoreExpenses;
  }

  // Function to show the fetched expenses in the UI
  function showOutput(response) {
    hasMoreExpenses = response.hasMoreExpenses;
    hasPreviousExpenses = response.hasPreviousExpenses;

    // Accumulate expense items
    const expenseItems = [];

    // Assuming you have a function like addExpenseToUi to display the expenses
    response.forEach((expense) => {
      const expenseItem = addExpenseToUi(expense);
      expenseItems.push(expenseItem);
    });

    // Append all expense items to the expenseList
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = ""; // Clear existing expenses
    expenseItems.forEach((item) => expenseList.appendChild(item));

    // Update the page number and buttons based on the current state
    updatePageNumber();
  }

  // Initial load
  await refresh();
  updateTotalAmount(token);
});

async function deleteExpense(button) {
  const expenseId = button.getAttribute("data-id");
  const token = localStorage.getItem("token");

  if (!expenseId) {
    console.error("Expense ID is undefined.");
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:3000/expense/deleteExpense/${expenseId}`,
      null,
      {
        headers: {
          Authorization: "Bearer " + token, //the token is a variable that holds the token
        },
      }
    );

    if (response.status !== 200) {
      // Handle the case where the delete request was not successful
      failurealert("Failed to delete expense");
      console.error("Failed to delete expense:", response.status);
      return;
    }

    successalert("Expense deleted successfully");

    updateTotalAmount(token);

    // Remove the parent expense item when the delete request is successful
    button.parentNode.remove();
  } catch (err) {
    // console.error('Error deleting expense:', err);
    failurealert("Error deleting expense, try again");
    // alert('Error deleting expense. Please try again.');
  }
}

document.getElementById("buy-premium-btn").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      successalert("You are now a premium user");

      // alert("You are a premium user");
      showPremiumFeature();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", async function (response) {
    console.log(response);
    await axios.post(
      "http://localhost:3000/purchase/updatetransactionstatus",
      {
        order_id: options.order_id,
        payment_id: null, // Indicate payment failure
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    failurealert("OOPS!! Something went wrong! Try again!! ");
    // alert("Something went wrong");
  });
};

document.getElementById("nav-signout-btn").addEventListener("click", (e) => {
  e.preventDefault();
  // alert("its working");
  window.location.href = "../Login/login.html";
});
