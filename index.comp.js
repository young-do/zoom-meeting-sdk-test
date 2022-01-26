import "dotenv/config";
import ZoomMtgEmbedded from "@zoomus/websdk/embedded";

const API_KEY = process.env.API_KEY;
const MEETING_NUMBER = process.env.MEETING_NUMBER;
const MEETING_PASSWORD = process.env.MEETING_PASSWORD;
const MEETING_USERNAME = process.env.MEETING_USERNAME;

const client = ZoomMtgEmbedded.createClient();

const meetingSDKElement = document.getElementById("meetingSDKElement");

(async () => {
  await client.init({
    debug: true,
    zoomAppRoot: meetingSDKElement,
    language: "en-US",
    customize: {
      meetingInfo: [
        "topic",
        "host",
        "mn",
        "pwd",
        "telPwd",
        "invite",
        "participant",
        "dc",
        "enctype",
      ],
      toolbar: {
        buttons: [
          {
            text: "Custom Button",
            className: "CustomButton",
            onClick: () => {
              console.log("custom button");
            },
          },
        ],
      },
    },
  });

  const { signature } = await fetch("http://localhost:3000/sign").then((res) =>
    res.json()
  );

  await client.join({
    apiKey: API_KEY,
    signature,
    meetingNumber: MEETING_NUMBER,
    password: MEETING_PASSWORD,
    userName: MEETING_USERNAME,
  });
})();
