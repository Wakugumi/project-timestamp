/*Install midtrans-client (https://github.com/Midtrans/midtrans-nodejs-client) NPM package.
npm install --save midtrans-client*/

const crypt = require("crypto");

//SAMPLE REQUEST START HERE

const midtransClient = require("midtrans-client");
// Create Snap API instance
let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.NODE_PAYMENT_KEY,
});

let parameter = {
  transaction_details: {
    order_id: "YOUR-ORDERID-123456",
    gross_amount: 10000,
  },
  credit_card: {
    secure: true,
  },
  customer_details: {
    first_name: "budi",
    last_name: "pratama",
    email: "budi.pra@example.com",
    phone: "08111222333",
  },
};
function generateOrderId() {
  const id = crypt.randomUUID();
  return "TEST-" + id;
}
class Transaction {
  constructor(gross_amount, booth_id, items) {
    this.parameter = {
      transaction_details: {
        order_id: generateOrderId(),
        gross_amount: gross_amount,
      },
      credit_card: {
        secure: true,
      },
      item_details: [...items],
      customer_details: {
        booth_id: booth_id,
      },
    };
  }

  /**
   * Create transaction
   * @returns {Promise<string>} return string on resolve, otherwise thrown error
   */
  async createTransaction() {
    snap
      .createTransaction(this.parameter)
      .then((transaction) => {
        return transaction.token;
      })
      .catch((error) => {
        throw error;
      });
  }
}

module.exports = Transaction;
