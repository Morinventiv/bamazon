var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Good Connection!");
  createTable();
});

var createTable = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (let i = 0; i < res.length; i++) {
      console.log(
        res[i].id +
          " || " +
          res[i].product +
          " || " +
          res[i].department +
          " || " +
          res[i].cost +
          " || " +
          res[i].stock_quantity +
          " || "
      );
    }
    promptCustomer(res);
  });
};

var promptCustomer = function(res) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: 'What would you like to get? (Quit: "Q")'
      }
    ])
    .then(function(answer) {
			var correct = false;
			if (answer.choice.toUpperCase()=='Q') {
				process.exit();
			}
      for (let i = 0; i < res.length; i++) {
        if (res[i].id == answer.choice) {
					console.log("************************************");
					console.log("You selected " + res[i].product + "!");
					console.log("************************************");

          correct = true;
					var itemId = answer.choice;
					console.log("Line 64. itemId= "+ itemId);
          var itemId = i;
          inquirer
            .prompt({
              type: "input",
              name: "quantity",
              message: "How many do you want?",
              validate: function(value) {
                if (isNaN(value) == false) {
                  return true;
                } else {
                  return false;
                }
              }
            })
            .then(function(answer) {
              if (res[i].stock_quantity - answer.quantity > 0) {
								console.log(res[i].product + " has this many stock items= " + res[i].stock_quantity + ".");
                connection.query(
                  "UPDATE products SET stock_quantity='" +
                    (res[i].stock_quantity - answer.quantity) +
                    "'WHERE id='" +
                    res[i].id +
                    "'",
                  function(err, res2) {
                    console.log("Product Purchased!");
                    createTable();
                  }
                );
              } else {
                console.log("Make another selection");
                promptCustomer(res);
              }
            });
        }
			}
			if (correct==false) {
				console.log("***********************************************");
				console.log("Not a valid Selection. Choose one from the list");
				console.log("***********************************************");
				promptCustomer(res);
			}
    });
}; 
