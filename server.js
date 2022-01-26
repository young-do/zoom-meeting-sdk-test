require("dotenv").config();
const crypto = require("crypto"); // crypto comes with Node.js
const fastify = require("fastify")({ logger: true });

const {
  API_KEY,
  API_SECRET,
  MEETING_NUMBER,
  MEETING_PASSWORD,
  MEETING_USERNAME,
} = process.env;

fastify.register(require("fastify-cors"));

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
  // Prevent time sync issue between client signature generation and zoom
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString(
    "base64"
  );
  const hash = crypto
    .createHmac("sha256", apiSecret)
    .update(msg)
    .digest("base64");
  const signature = Buffer.from(
    `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
  ).toString("base64");

  return signature;
}

// pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number,
// and 0 to join meeting or webinar or 1 to start meeting
fastify.get("/sign", (req, rep) => {
  const meetingNumber = 3291256579; // 	Meeting or Webinar number
  const role = 0; // 1 for hosts, 0 for participants
  const signature = generateSignature(
    API_KEY,
    API_SECRET,
    MEETING_NUMBER,
    role
  );
  rep.send({ signature });
});

fastify.listen(3000, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});

// Zoom 회의 참가
// https://zoom.us/j/3291256579?pwd=Z2FHaklPcEpPdmEzSFdoc3RnK0hXdz09

// 회의 ID: 329 125 6579
// 암호: H5snaM
