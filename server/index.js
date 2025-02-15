import express, { json } from "express";
import { createCustomer, fetchResturants, fetchReservations, createReservation, destroyReservation, init as _init } from "./db.js";
const app = express();
app.use(json());

app.post("/api/customer", async (req, res, next) => {
  const result = await createCustomer(req.body.name);
  res.send(result);
});

app.get("/api/restaurants", async (req, res, next) => {
  const result = await fetchResturants();
  res.send(result);
});

app.get("/api/reservations", async (req, res, next) => {
  const result = await fetchReservations();
  res.send(result);
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  const { id } = req.params;
  const result = await createReservation(
    req.body.reservationName,
    req.body.resturantName,
    req.body.date,
    req.body.partyCount,
    id
  );
  res.send(result);
});

app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    const { id } = req.params;
    const result = await destroyReservation(id);
    res.send(result);
  }
);

const init = async () => {
  await _init();
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
};

init();
