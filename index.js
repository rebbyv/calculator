/////////// MODEL ///////////
// listens to the controller to take in state change
// talks to the view to update the view
var Model = {
  firstNum: true,
  numOne: '',
  numTwo: '',
  operator: false,
  lastChange: [],
  // lastChange = numOne, numTwo, decimal, negate, operator, percent

  setNum: (btn) => {
    if (Model.firstNum) {
      Model.numOne += btn;
      Model.lastChange.push('numOne');
    } else {
      if (Model.operator) {
        Model.numTwo += btn;
        Model.lastChange.push('numTwo');
      }
    }
    View.updateView();
  },

  setOperator: (btn) => {
    if (Model.numOne !== '') {
      Model.operator = btn;
    }
    Model.lastChange.push('operator')
    Model.firstNum = false;
    View.updateView();
  },

  clear: () => {
    Model.firstNum = true;
    Model.numOne = '';
    Model.numTwo = '';
    Model.operator = false;
    View.updateView();
  },

  undo: () => {
    var change = Model.lastChange.pop()
    if (change === 'numOne' || change === 'numTwo' || change === 'decimal') {
      if (Model.firstNum) {
        Model.numOne = Model.numOne.slice(0, Model.numOne.length - 1)
      } else {
        Model.numTwo = Model.numTwo.slice(0, Model.numTwo.length - 1)
      }
    } else if (change === 'operator') {
      Model.operator = false;
    } else if (change === 'negate') {
      if (Model.firstNum) {
        if (Model.numOne[0] === '-') {
          Model.numOne = Model.numOne.slice(1);
        } else {
          Model.numOne = '-' + Model.numOne;
        }
      } else {
        if (Model.numTwo[0] === '-') {
          Model.numTwo = Model.numTwo.slice(1);
        } else {
          Model.numTwo = '-' + Model.numTwo;
        }
      }
    } else if (change === 'percent') {
      if (Model.firstNum) {
        Model.numOne = Model.numOne * 100;
      } else {
        Model.numTwo = Model.numTwo * 100;
      }
    } 
    View.updateView();
  },

  negate: () => {
    if (Model.firstNum) {
      if (Model.numOne[0] === '-') {
        Model.numOne = Model.numOne.slice(1);
      } else {
        Model.numOne = '-' + Model.numOne;
      }
    } else {
      if (Model.numTwo[0] === '-') {
        Model.numTwo = Model.numTwo.slice(1);
      } else {
        Model.numTwo = '-' + Model.numTwo;
      }
    }
    Model.lastChange.push('negate')
    View.updateView();
  },

  makeFloat: () => {
    if (Model.firstNum) {
      if (!Model.numOne.includes('.')) {
        Model.numOne = Model.numOne + '.';
      }
    } else {
      if (!Model.numTwo.includes('.')){
        Model.numTwo = Model.numTwo + '.';
      }
    }
    Model.lastChange.push('decimal')
    View.updateView();
  },

  makePercent: () => {
    if (Model.firstNum) {
      Model.numOne = (parseInt(Model.numOne) / 100) + '';
    } else {
      Model.numTwo = (parseInt(Model.numTwo) / 100) + '';
    }
    Model.lastChange.push('percent')
    View.updateView();
  },

  calculate: () => {
    var result;
    if (Model.operator === '/') {
      result = parseFloat(Model.numOne) / parseFloat(Model.numTwo);
    } else if (Model.operator === 'x') {
      result = parseFloat(Model.numOne) * parseFloat(Model.numTwo);
    } else if (Model.operator === '+') {
      result = parseFloat(Model.numOne) + parseFloat(Model.numTwo);
    } else if (Model.operator === '-') {
      result = parseFloat(Model.numOne) - parseFloat(Model.numTwo);
    } else {
      result = Model.numOne;
    }
    View.updateHistory(result, Model.numOne, Model.numTwo, Model.operator)
    Model.operator = false;
    Model.numOne = result + '';
    Model.numTwo = '';
    Model.firstNum = true;
    View.updateView();
  }
}




/////////// VIEW ///////////
// listens to the model for state changes
// talks to the DOM
var View = {
  updateView: () => {
    document.getElementById('input').innerHTML = Model.numOne + ' ' + (Model.operator ? Model.operator: '') + ' ' + Model.numTwo;
  },

  updateHistory: (result, numOne, numTwo, operator) => {
    var hist = document.getElementById('history');
    hist.innerHTML = `<p>${numOne} ${operator ? operator: ''} ${numTwo} = ${result}</p>` + hist.innerHTML;
  }
}


/////////// CONTROLLER ///////////
// listens for events from the DOM
// talks to the model to update state
var Controller = {
  addListners: () => {
    var spans = document.getElementsByTagName("span");
    for (let i = 0; i < spans.length; i++) {
      spans[i].addEventListener('click', Controller.handleClick, false)
    }
  },
  
  handleClick: () => {
    var operators = '/x+-';
    var btn = event.target.innerHTML;

    if (btn === 'Clear') {
      Model.clear();
    } else if (btn === 'Undo') {
      Model.undo();
    } else if (btn === '%') {
      Model.makePercent();
    } else if (btn === '.') {
      Model.makeFloat();
    } else if (btn === '-/+') {
      Model.negate();
    }  else if (btn === '=') {
      Model.calculate();
    } else if (operators.includes(btn)) {
      Model.setOperator(btn);
    } else {
      Model.setNum(btn);
    }
  }
}


window.onload = Controller.addListners();