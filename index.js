/////////// MODEL ///////////
// listens to the controller to take in state change
// talks to the view to update the view
var Model = {
  firstNum: false,
  numOne: '',
  secondNum: false,
  numTwo: '',
  operator: false,

  setNum: (btn) => {
    if (!Model.firstNum) {
      Model.numOne += btn;
    } else {
      if (Model.operator) {
        Model.numTwo += btn;
      }
    }
    View.updateView();
  },

  setOperator: (btn) => {
    Model.operator = btn;
    Model.firstNum = true;
    View.updateView();
  },

  clear: () => {
    Model.firstNum = false;
    Model.numOne = '';
    Model.secondNum = false;
    Model.numTwo = '';
    Model.operator = false;
    View.updateView();
  },

  undo: () => {
    console.log('hello')
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
    View.updateView();
  },

  makeFloat: () => {
    if (!Model.firstNum) {
      Model.numOne = Model.numOne + '.';
    } else {
      Model.numTwo = Model.numTwo + '.';
    }
    View.updateView();
  },

  makePercent: () => {
    if (!Model.firstNum) {
      Model.numOne = parseInt(Model.numOne) / 100;
    } else {
      Model.numTwo = parseInt(Model.numTwo) / 100;
    }
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
    }
    View.updateHistory(result, Model.numOne, Model.numTwo, Model.operator)
    Model.operator = false;
    Model.numOne = result + '';
    Model.numTwo = '';
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
    hist.innerHTML = `<p>${numOne} ${operator} ${numTwo} = ${result}</p>` + hist.innerHTML;
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