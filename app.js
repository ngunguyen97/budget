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
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list'
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
		addListItem: function(obj, type) {
			var html, newHtml, element;
			//1. Create HTML string with placeholder text.
			if(type === 'inc') {
				element = DOMstrings.incomeContainer;

				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}else if (type === 'exp') {
				element = DOMstrings.expenseContainer;

				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//2. Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
			
		},
		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
	
			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach( function(element, index) {
				element.value = "";
			});

			fieldsArr[0].focus();
			
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
		var input, newItem;
		// 1. Get the field input data
		input = UIctrl.getInput();

		// 2. Add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3. Add the item to the UI
		UIctrl.addListItem(newItem, input.type);

		// 4. Clear the input fields
		UIctrl.clearFields();

		// 5. Calculate the budget

		// 6. Display the budget on the UI
	}

	return {
		init: function() {
			console.log('Application has started...');
			setupEvenlistener();
		}
	}

})(budgetController, UIControler);

controller.init();