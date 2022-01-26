import "dotenv/config";
import { ZoomMtg } from "@zoomus/websdk";

// 아래 예시는 제대로 동작하질 않음...

const API_KEY = process.env.API_KEY;
const MEETING_NUMBER = process.env.MEETING_NUMBER;
const MEETING_PASSWORD = process.env.MEETING_PASSWORD;
const MEETING_USERNAME = process.env.MEETING_USERNAME;

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load("en-US");
ZoomMtg.init({
  // leaveUrl: leaveUrl,
  success: async (success) => {
    console.log(success);

    const { signature } = await fetch("http://localhost:3000/sign").then(
      (res) => res.json()
    );

    ZoomMtg.join({
      apiKey: API_KEY,
      signature,
      meetingNumber: MEETING_NUMBER,
      password: MEETING_PASSWORD,
      userName: MEETING_USERNAME,
    });
  },
  error: (error) => {
    console.log(error);
  },
});
