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
    this.percentage = -1;
  };

  Expense.prototype.setPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
    deleteItem: (type, id) => {
      data.allItems[type] = data.allItems[type].filter(item => item.id !== id);
    },
    setPercentages: () => {
      data.allItems.exp.forEach(item => item.setPercentage(data.totals.inc));
    },
    getPercentages: () => {
      const allPercentages = data.allItems.exp.map(item =>
        item.getPercentage()
      );
      return allPercentages;
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
        html = `<div class="item clearfix" id="inc_%id%">
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
        html = `<div class="item clearfix" id="exp_%id%">
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
    },
    displayBudget: obj => {
      // .budget__value .budget__income--value .budget__expenses--value  .budget__expenses--percentage
      document.querySelector('.budget__value').textContent = obj.budget;
      document.querySelector('.budget__income--value').textContent =
        obj.totalInc;
      document.querySelector('.budget__expenses--value').textContent =
        obj.totalExp;

      if (obj.percentExpense > 0) {
        document.querySelector('.budget__expenses--percentage').textContent =
          obj.percentExpense + '%';
      } else {
        document.querySelector('.budget__expenses--percentage').textContent =
          '---';
      }
    },
    deleteListItem: selectorId => {
      const el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },
    displayPercentages: percentages => {
      const fields = document.querySelectorAll('.item__percentage'); //this returns a nodelist

      function nodeListForEach(list, callback) {
        for (let i = 0; i < list.length; i += 1) {
          callback(list[i], i);
        }
      }

      nodeListForEach(fields, (item, index) => {
        if (percentages[index] > 0) {
          item.textContent = percentages[index] + '%';
        } else {
          item.textContent = '---';
        }
      });
    },
    displayYear: () => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      const now = new Date();
      const thisMonth = months[now.getMonth()];
      const year = now.getFullYear();
      // const month = now.getMonth();

      document.querySelector('.budget__title--month').textContent =
        thisMonth + ' ' + year;
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

      // update the percentages
      updatePercentages();

      // For testing purpose
      console.log(inputData, addedItem);
      budgetController.logData();
    }
  };

  const ctrlDeleteItem = event => {
    const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      const split = itemId.split('_');
      const type = split[0];
      const id = split[1];

      // delete the item from data struct
      budgetCtrl.deleteItem(type, id);
      // delete the item from the budget
      uiCtrl.deleteListItem(itemId);
      // show the updated budget
      updateBudget();
      // update percentages
      updatePercentages();
    }
  };

  const updateBudget = () => {
    // Set the budgets
    budgetController.setBudget();

    // return the calculated budgets
    const budget = budgetController.getBudget();

    // Update the ui with budget values;
    uiController.displayBudget(budget);
    // console.log('budget: ', budget);
  };

  const updatePercentages = () => {
    // Calc percentages
    budgetCtrl.setPercentages();
    // Read percentages from the budget controller
    const percentages = budgetCtrl.getPercentages();
    console.log(percentages);
    // update the ui with new percentages
    uiCtrl.displayPercentages(percentages);
  };

  // Attach event listeners
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
  document.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });

  document
    .querySelector('.container')
    .addEventListener('click', ctrlDeleteItem);

  uiCtrl.displayBudget({
    budget: 0,
    totalExp: 0,
    totalInc: 0,
    percentExpense: -1
  });

  uiCtrl.displayYear();
})(budgetController, uiController);
