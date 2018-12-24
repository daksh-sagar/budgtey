const budgetController = (function() {})();

const uiController = (function() {})();

const controller = (function(budgetCtrl, uiCtrl) {
  const ctrlAddItem = () => {
    //TODO 1) get the input data
    // pass the data to budget controller and ui controller
    // update the budget and then update the ui
    console.log('ctrlAddItem called');
  };

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, uiController);
