const budgetController = (function() {})();

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
    // pass the data to budget controller and ui controller
    // update the budget and then update the ui
    console.log(inputData);
  };

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, uiController);
