const invoices = require('./invoices.json');
const plays = require('./plays.json');
const statement = require('./statement.js');

invoices.forEach((invoice) => console.log(statement(invoice, plays)));