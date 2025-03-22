/**
 * Handles payment callback on window will navigate event
 * @param {import("electron/renderer").Event<import("electron/main").WebContentsWillNavigateEventParams>} event
 * @param {string} url data url of the callback
 * @param {function(string[]):void} callback returns the query params as array of string
 */
const PaymentCallback = (event, url, callback) => {
  let parsedUrl = new URL(url);
  const isFinish = parsedUrl.searchParams.has("transaction_status");

  if (isFinish) {
    event.preventDefault();
    const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
    callback(queryParams);
  }
};

module.exports = PaymentCallback;
