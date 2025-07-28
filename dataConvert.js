const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

const parseJSON = (value) => {
  if (!value) return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    (trimmed.startsWith('{') && trimmed.endsWith('}'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch (err) {
      return value;
    }
  }
  return value;
};

const pathName = path.join(__dirname, 'data.csv');
const data = fs.readFileSync(pathName, 'utf8');

const rows = data.split('\n');

const headers = parseCSVLine(rows[0]);
console.log(headers);

const users = [];
const products = [];
const orders = [];

const userCols = [
  'name',
  'lastName',
  'email',
  'password',
  'phone',
  'role',
  'address'
];
const productCols = [
  'nameProduct',
  'description',
  'price',
  'stock',
  'productImage',
  'user',
  'available',
  'typeProduct',
  'ratings'
];
const orderCols = ['customer', 'deliveryDate', 'items', 'status', 'notes'];

rows.slice(1).forEach((row) => {
  const rowData = parseCSVLine(row);
  const rowObj = {};

  headers.forEach((prop, i) => {
    rowObj[prop.trim()] = parseJSON(rowData[i]);
  });

  const userObj = {};
  userCols.forEach((col) => (userObj[col] = rowObj[col]));
  if (userObj.name) {
    userObj._id = new mongoose.Types.ObjectId();
    users.push(userObj);
  }

  const productObj = {};
  productCols.forEach((col) => (productObj[col] = rowObj[col]));
  if (productObj.nameProduct) {
    productObj._id = new mongoose.Types.ObjectId();
    products.push(productObj);
  }

  const orderObj = {};
  orderCols.forEach((col) => (orderObj[col] = rowObj[col]));
  if (orderObj.customer) {
    orders.push(orderObj);
  }
});

const seedsPath = path.join(__dirname, 'src', 'utils', 'seeds');

fs.writeFileSync(
  path.join(seedsPath, 'users.js'),
  `const users = ${JSON.stringify(
    users,
    null,
    2
  )};\n\nmodule.exports = users;\n`,
  'utf8'
);

fs.writeFileSync(
  path.join(seedsPath, 'products.json'),
  `const products = ${JSON.stringify(
    products,
    null,
    2
  )};\n\nmodule.exports = products;\n`,
  'utf8'
);
fs.writeFileSync(
  path.join(seedsPath, 'orders.json'),
  `const orders = ${JSON.stringify(
    orders,
    null,
    2
  )};\n\nmodule.exports = orders;\n`,
  'utf8'
);

//! Tengo que añadir instruccones de como utilizar este archivo, primero users, modificar los productos y comentar el users, luego hacer lo mismo con products modificar el csv para order e insertarlos, ya que uno de depende de otro y estamos generando los _id aleatorios.
