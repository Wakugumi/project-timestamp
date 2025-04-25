const api = require("./APIService.js");

exports.refund = async (transaction_id) => {
  try {
    const refund = await api.refund(transaction_id);
    if (refund.data.status_code !== "200") {
      throw new Error("Refund unsuccessfull, return error");
    }
  } catch (error) {
    throw error;
  }
};
