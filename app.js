const budgetController = (function() {
  // Copied it from stack overflow
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  function calcTotal(type) {
    let sum = 0;

    data.allItems[type].forEach(dataItem => {
      sum += dataItem.value;
    });

    data.totals[type] = sum;
  }

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0, // income - expense
    percentExpense: -1
  };

  return {
    addItem: (type, desc, val) => {
      let newItem, id;

      // Generate new id
      id = uuidv4();

      // create either Income or Expense object based on the type of user input

      if (type === 'exp') {
        newItem = new Expense(id, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(id, desc, val);
      }
      // push it to datastructure
      data.allItems[type].push(newItem);
      // Return newly created object
      return newItem;
    },
    setBudget: () => {
      // Calculate total income and expenses
      calcTotal('exp');
      calcTotal('inc');

      // Calculate the budget (income - expense)
      data.budget = data.totals['inc'] - data.totals['exp'];

      // Calculate the percent of expenses
      if (data.totals['inc'] > 0) {
        data.percentExpense = Math.round(
          (data.totals['exp'] / data.totals['inc']) * 100
        );
      } else {
        data.percentExpense = -1;
      }
    },
    getBudget: () => {
      return {
        budget: data.budget,
        totalExp: data.totals['exp'],
        totalInc: data.totals['inc'],
        percentExpense: data.percentExpense
      };
    },

    logData: () => console.log(data)
  };
})();

const uiController = (function() {
  return {
    getInput: () => {
      const type = document.querySelector('.add__type').value;
      const description = document.querySelector('.add__description').value;
      // The value is a string convert it to float
      const value = parseFloat(document.querySelector('.add__value').value);

      return {
        type,
        description,
        value
      };
    },
    addListItem: (item, type) => {
      let html, element;

      if (type === 'inc') {
        html = `<div class="item clearfix" id="income-%id">
        <div class="item__description">%description%</div>
        <div class="right clearfix">
            <div class="item__value">+ %value%</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
    </div>`;
        element = '.income__list';
      } else if (type === 'exp') {
        html = `<div class="item clearfix" id="expense-%id%">
        <div class="item__description">%description%</div>
        <div class="right clearfix">
            <div class="item__value">- %value%</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
    </div>`;
        element = '.expenses__list';
      }

      // Update the html string with the item data
      let newHtml = html.replace('%id%', item.id);
      newHtml = newHtml.replace('%description%', item.description);
      newHtml = newHtml.replace('%value%', item.value);

      // Insert the newHtml string to the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: () => {
      const list = document.querySelectorAll(
        '.add__description' + ', ' + '.add__value'
      );
      Array.prototype.forEach.call(list, element => {
        element.value = '';
      });

      list[0].focus();
    }
  };
})();

const controller = (function(budgetCtrl, uiCtrl) {
  const ctrlAddItem = () => {
    //TODO 1) get the input data
    const inputData = uiCtrl.getInput();

    // Check if the input data is valid
    if (
      inputData.description !== '' &&
      !isNaN(inputData.value) &&
      inputData.value > 0
    ) {
      // pass the data to budget controller (update the budget)
      const addedItem = budgetCtrl.addItem(
        inputData.type,
        inputData.description,
        inputData.value
      );
      // pass data to ui controller and update ui
      uiCtrl.addListItem(addedItem, inputData.type);
      uiCtrl.clearFields();

      // update the budget
      updateBudget();

      // For testing purpose
      console.log(inputData, addedItem);
      budgetController.logData();
    }
  };

  const updateBudget = () => {
    // Set the budgets
    budgetController.setBudget();

    // return the calculated budgets
    const budget = budgetController.getBudget();

    // Update the ui with budget values;
    console.log('budget: ', budget);
  };

  // Attach event listeners
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
  document.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, uiController);
