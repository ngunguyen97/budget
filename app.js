var budgetController = (function() {
	var x = 23;
	var add = function(a) {
		return a + x;
	}
	return {
		publicTest: function(b) {
			return add(b);
		}
	}
})();

var UIControler = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	}
	return {
		getInput: function() {
			var type, description, value;
			type = document.querySelector(DOMstrings.inputType).value;
			description = document.querySelector(DOMstrings.inputDescription).value;
			value = document.querySelector(DOMstrings.inputValue).value;

			return {
				type: type,
				description: description,
				value: value
			}
		},
		getDOMstrings: function() {
			return DOMstrings;
		}
	}
})();


var controller = (function(budgetCtrl, UIctrl) {

	

	var setupEvenlistener = function () {
		var DOM = UIctrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(e) {
			if(e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});

	}

	var ctrlAddItem = function () {
		// 1. Get the field input data
			var values = UIctrl.getInput();

			console.log(values);

		// 2. Add the item to the budget controller

		// 3. Add the item to the UI

		// 4. Calculate the budget

		// 5. Display the budget on the UI
	}

	return {
		init: function() {
			console.log('Application has started...');
			setupEvenlistener();
		}
	}

})(budgetController, UIControler);

controller.init();