const pg = require("pg");
const uuid = require("uuid");
const client = new pg.Client(
  "postgres://shazeeda:Password111@localhost:5432/acme_dining_db"
);

const createCustomer = async (customerName) => {
  const SQL = `
INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *`;
  const result = await client.query(SQL, [uuid.v4(), customerName]);
  return result.rows[0];
};

const createResturant = async (resturantName) => {
  const SQL = `
INSERT INTO resturant(id, name) VALUES($1, $2) RETURNING *`;
  const result = await client.query(SQL, [uuid.v4(), resturantName]);
  return result.rows[0];
};

const createReservation = async (
  reservationName,
  resturantName,
  date,
  partyCount,
  customerName
) => {
  const SQL = `
INSERT INTO reservations(id, name, date, party_count, restaurant_id, customer_id) VALUES($1, $2, $3 (SELECT id FROM restaurants WHERE name =$4), $5) RETURNING *`;
  const result = await client.query(SQL, [
    uuid.v4(),
    reservationName,
    date,
    partyCount,
    resturantName,
    customerName,
  ]);
  return result.rows[0];
};

const fetchResturants = async () => {
  const SQL = `
  SELECT * FROM restaurants`;
  const restult = await client.query(SQL);
  return result.rows[0];
};

const fetchCustomer = async () => {
  const SQL = `
  SELECT * FROM customers`;
  const restult = await client.query(SQL);
  return result.rows[0];
};

const destroyReservation = async (reservationId) => {
  const SQL = `
  DELETE FROM reservations where id = $1`;
  const result = await client.query(SQL, reservationId);
  return result.rows[0];
};

const fetchReservations = async () => {
  const SQL = `
  SELECT * FROM reservations`;
  const restult = await client.query(SQL);
  return result.rows[0];
};

const init = async () => {
  console.log("db initialized");
  await client.connect();

  const SQL = `
  DROP TABLE IF EXISTS reservations;
  DROP TABLE IF EXISTS customers;
  DROP TABLE IF EXISTS restaurants;
  
  CREATE TABLE restaurants(
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL
  ); 
  
  CREATE TABLE customers(
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL
  );
  
  CREATE TABLE reservations(
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  party_count INTEGER NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL
  ); `;

  await client.query(SQL);
  ["Bob", "Jan", "Jerry"].forEach((name) => {
    async (name) => createCustomer(name);
    console.log("customer created: + name");
  });

  await client.query(SQL);
  ["Nobu", "76", "Chili's"].forEach((name) => {
    async (name) => createResturant(name);
    console.log("resturant created: + name");
  });

  await createReservation("Bob", "Nobu", "2025-02-14, 2");
};

// init();

module.exports = {
  init,
  createCustomer,
  createReservation,
  // createRestaurant,
  fetchCustomer,
  fetchResturants,
  fetchReservations,
  destroyReservation,
};
