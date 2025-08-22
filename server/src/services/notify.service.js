// Stubs for SMS / push notifications (wire to Twilio/Firebase later)

export async function smsNotify(phone, text) {
  // TODO: integrate with Twilio
  if (!phone) return false;
  console.log(`[sms] -> ${phone}: ${text}`);
  return true;
}

export async function pushNotify(userId, title, body) {
  // TODO: integrate with FCM/Expo Push
  if (!userId) return false;
  console.log(`[push] -> ${userId}: ${title} | ${body}`);
  return true;
}
