import { Event } from "electron";

export const PaymentHandler = (
  event: Event,
  url: string,
  callback: (params: object) => void,
) => {
  let parsedUrl = new URL(url);
  const isFinish = parsedUrl.searchParams.has("transaction_status");

  if (isFinish) {
    event.preventDefault();
    const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
    callback(queryParams);
  }
};
