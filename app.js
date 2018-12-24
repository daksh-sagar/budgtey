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
    }
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

    logData: () => console.log(data)
  };
})();

const uiController = (function() {
  return {
    getInput: () => {
      const type = document.querySelector('.add__type').value;
      const description = document.querySelector('.add__description').value;
      const value = document.querySelector('.add__value').value;

      return {
        type,
        description,
        value
      };
    }
  };
})();

const controller = (function(budgetCtrl, uiCtrl) {
  const ctrlAddItem = () => {
    //TODO 1) get the input data
    const inputData = uiCtrl.getInput();
    // pass the data to budget controller
    const addedItem = budgetCtrl.addItem(
      inputData.type,
      inputData.description,
      inputData.value
    );
    // and ui controller
    // update the budget and then update the ui

    // For testing purpose
    console.log(inputData, addedItem);
    budgetController.logData();
  };

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, uiController);
