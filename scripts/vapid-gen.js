const fs = require("node:fs/promises");
const path = require("path");
const webpush = require("web-push");

// VAPID keys should be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

console.log("\n\n........................................");
console.log("THESE KEYS SHOULD BE GENERATED ONLY ONCE");
console.log("........................................");
console.log();
async function run() {
  await fs.writeFile(
    path.join(__dirname, "..", ".env"),
    `PRIVATE_KEY=${vapidKeys.privateKey}
PUBLIC_KEY=${vapidKeys.publicKey}`
  );
  console.log("VAPID KEYS GENERATED");
  console.log("CHECK THE ROOT DIRECTORY FOR THE .env file\n\n");
}

run();
