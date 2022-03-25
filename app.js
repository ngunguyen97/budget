var budgetController = (function() {
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	}

	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		}
	};

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	};


	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var calculateTotal = function(type) {
		var sum = 0;

		data.allItems[type].forEach( function(element, index) {
			sum += element.value;
		});

		data.totals[type] = sum;
	}

	var data = {
		allItems: {
			inc: [],
			exp: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
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
		calculateBudget: function() {
			// calculate total income and expense
			calculateTotal('inc');
			calculateTotal('exp');

			// calculate the budget: income - expense
			data.budget = data.totals.inc - data.totals.exp;

			// the percentage of income that we spent.
			if(data.totals.inc > 0) {

				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},
		calculatePercentages: function() {
			data.allItems.exp.forEach(function(element) {
					element.calcPercentage(data.totals.inc);
			});
		},
		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(curr) {
					return curr.getPercentage();
			});
				return allPerc;
		},
		deleteItem: function(type ,id) {
			var ids, index;

			
			ids = data.allItems[type].map(function(current) {
					return current.id;
			});

			
			index = ids.indexOf(id);

			if(index !== -1) {
				data.allItems[type].splice(index,1);
			}

		},
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
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
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesLabel: '.item__percentage',
		yearLabel: '.budget__title--month'
	}

	var formatNumber = function(num, type) {
			var numSplit, int, dec, sign;
			/*
				 + or - before number exactly 2 decimal points comma separating the thousands.
				 2310.4567 = + 2,310.46 23104567
				 2000 = 2,000.00

			*/
			
			num = Math.abs(num);
			num = num.toFixed(2);
			
			numSplit = num.split('.');

			int = numSplit[0];

			if(int.length > 3 && int.length < 7) {
				int = int.substring(0,int.length - 3) + ',' + int.substring(int.length -3);
			}else if(int.length >= 7 && int.length < 9) {
				int = int.substring(0,int.length - 6) + ',' + int.substring(int.length - 6, int.length - 3) + ',' + int.substring(int.length - 3);
			}else if(int.length >= 9) {
				int = int.substring(0,int.length - 9) + ',' + int.substring(int.length - 9, int.length - 6) + ',' + int.substring(int.length - 6, int.length - 3) + ',' + int.substring(int.length - 3);
			}

			type === 'exp' ? sign = '-' : sign = '+';

			dec = numSplit[1];

			return sign + ' ' + int +'.'+ dec;

	};

	return {
		getInput: function() {
			var type, description, value;
			type = document.querySelector(DOMstrings.inputType).value;
			description = document.querySelector(DOMstrings.inputDescription).value;
			value = document.querySelector(DOMstrings.inputValue).value;

			return {
				type: type,
				description: description,
				value: parseFloat(value)
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
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

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
		displayBudget:function(obj) {
			var type;
				obj.budget >= 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expenLabel).textContent = formatNumber(obj.totalExp, 'exp');
			if(obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			}else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}		
		},
		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesLabel);

			/* The way 1
			if(percentages.length > 0) {
				var nodeList = Array.prototype.slice.call(fields);
					nodeList.forEach( function(element, index) {
						element.textContent = percentages[index] + '%';
					});
			}	
			*/
								
				var nodeListForEach = function(list, callback) {
						for(var i = 0; i < list.length; i++) {
								callback(list[i], i);
						}
				};

				nodeListForEach(fields, function(current, index) {
						if(percentages[index] > 0) {
							current.textContent = percentages[index] + '%';													
						}else {
							current.textContent = '---';
						}
				});	
				
		},
		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},
		displayYear: function() {
			var now, months, month, year;
			now = new Date();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			month = now.getMonth();
			year = now.getFullYear();

			document.querySelector(DOMstrings.yearLabel).textContent = months[month] + ' ' + year; 
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

	}

	var updateBudget = function () {
		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		UIctrl.displayBudget(budget);
	}

	var updatePercentages = function() {
		 // 1. Calculate percentages
		 budgetCtrl.calculatePercentages();

		 // 2. Read percentages from the budget controller
		 var percentages = budgetCtrl.getPercentages();

		 // 3. Update the UI with the new percentages

		 UIctrl.displayPercentages(percentages);
	}

	var ctrlAddItem = function () {
		var input, newItem;
		// 1. Get the field input data
		input = UIctrl.getInput();

		if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI
			UIctrl.addListItem(newItem, input.type);

			// 4. Clear the input fields
			UIctrl.clearFields();

			// 5. Calculate and update the budget
				updateBudget();

			// 6. Calcualte and update percentages.	
			updatePercentages();
		}
		
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;


		if(itemID) {
				splitID = itemID.split('-');
				type = splitID[0];
				ID = parseInt(splitID[1]);

				// 1. delete the item from our structor
				budgetCtrl.deleteItem(type, ID);

				// 2. Delete from the UI
				UIctrl.deleteListItem(itemID);

				// 3. Update and show the new budgetLabel
				updateBudget();

				// 4. Calcualte and update percentages.	
				updatePercentages();
		}

	}

	return {
		init: function() {
			console.log('Application has started...');
			UIctrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEvenlistener();
			UIctrl.displayYear();
		}
	};

})(budgetController, UIControler);

controller.init();