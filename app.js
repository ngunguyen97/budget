var budgetController = (function() {
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}
	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var data = {
		allItems: {
			inc: [],
			exp: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	}

	return {
		addItem: function(type, des ,val) {
			var newItem, ID;

			
			// Create a new ID
			if(data.allItems[type].length) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}else {
				ID = 0;
			}
			

			// Create an item based on 'inc' or 'exp'
			if(type === 'exp') {
				newItem = new Expense(ID, des, val);
			}else if(type === 'inc') {
				newItem = new Income(ID, des, val);
			}
			// Push it into our budget constructor
			data.allItems[type].push(newItem);

			// Return the new Item
			return newItem;

		},
		getData: function() {
			return data;
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
			var input = UIctrl.getInput();

			console.log(input);

		// 2. Add the item to the budget controller
			var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			console.log(budgetCtrl.getData());
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