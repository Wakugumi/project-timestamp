const { default: Transaction } = require("../services/PaymentService");

const route = require("express").Router();

route.post("/transaction", async (req, res, next) => {
  const { booth_id, items, gross_amount } = req.body;

  try {
    const transaction = new Transaction(gross_amount, booth_id, items);
    const token = await transaction.createTransaction();
    res.status(200).send(token);
  } catch (error) {
    next(error);
  }
});

module.exports = route;
