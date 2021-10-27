/* eslint-disable max-len */
const express = require('express');
const db = require('../db');

const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Shoes' });
});

// List products
router.get('/shoes', async (req, res) => {
  const query = 'SELECT shoes.shoe_brand, shoes.shoe_name, details.shoe_type, details.shoe_design, details.shoe_weight FROM shoes, details WHERE shoes.id=details.shoe_id';
  // const query = 'SELECT shoe_brand FROM shoes';

  const result = await db.query(query);

  res.render('shoe-list', { rows: result.rows });
});

// Sort List by Name of Shoe
router.get('/shoe-list', async (req, res) => {
  let query = 'SELECT shoes.shoe_brand, shoes.shoe_name, details.shoe_type, details.shoe_design, details.shoe_weight FROM shoes, details WHERE shoes.id=details.shoe_id';
  if (req.query.sort) {
    if (req.query.sort === 'shoe_nameAZ') {
      query += ' ORDER BY shoe_name';
    } else if (req.query.sort === 'shoe_brandAZ') {
      query += ' ORDER BY shoe_brand';
    } else if (req.query.sort === 'shoe_nameZA') {
      query += ' ORDER BY shoe_brand DESC';
    } else if (req.query.sort === 'shoe_brandZA') {
      query += ' ORDER BY shoe_brand DESC';
    }
  }

  const result = await db.query(query);

  res.render('shoe-list', { rows: result.rows, query });
});

// Search List of Shoes for Shoe Type
router.get('/shoe-filter', async (req, res) => {
  const query = 'SELECT * FROM shoes INNER JOIN details ON shoes.id=details.shoe_id WHERE details.shoe_type LIKE $1';
  const parameters = [`%${req.query.search}%`];
  const result = await db.query(query, parameters);
  console.log(query, parameters);

  res.render('shoe-list', {
    rows: result.rows,
    query,
    parameters,
  });
});


// New product form
router.get('/shoes/create', (req, res) => {
  res.render('shoe-create');
});

// Store new product
router.post('/shoes', async (req, res) => {
  const brandQuery = 'INSERT INTO shoes (shoe_brand, shoe_name) VALUES ($1, $2) ';
  const detailsQuery = 'INSERT INTO details (details.shoe_type, details.shoe_design, details.shoe_weight) VALUES ($3, $4, $5)';
  const parameters = [
    req.body.shoebrand,
    req.body.shoename,
    req.body.shoetype,
    req.body.shoedesign,
    req.body.shoeweight,
  ];

  // eslint-disable-next-line no-unused-vars
  const result = await db.query(brandQuery, detailsQuery, parameters);

  res.render('new-shoe-result', { brandQuery, detailsQuery, parameters: JSON.stringify(parameters) });
});

// Show new shoe form
router.get('/shoes/create', (req, res) => {
  res.render('shoe-create');
});

// Show an shoe brand name and details
router.get('/shoes/:id', async (req, res) => {
  const query = 'SELECT shoes.shoe_brand, shoes.shoe_name, details.shoe_type, details.shoe_design, details.shoe_weight FROM shoes INNER JOIN details ON shoes.id = details.shoe_id WHERE shoes.id = $1';
  const parameters = [
    req.params.id,
  ];

  const result = await db.query(query, parameters);

  res.render('view-order', { rows: result.rows, query, parameters: JSON.stringify(parameters) });
});


module.exports = router;
