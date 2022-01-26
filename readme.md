# zoom research

줌은 어떻게 제공하고 있고, 원리는 무엇인가

## 어떻게 제공하는가

- https://marketplace.zoom.us/docs/sdk/sdk-reference/web-reference

## 글 요약

- https://marketplace.zoom.us/docs/sdk/native-sdks/introduction
  - 줌 클라이언트 앱의 subset 기능을 제공
  - 장점 3가지
    - easy to use: 쉽게 구현할 수 있음
    - 현지화: 7개 주요 언어 기본 지원 + 번역 확장성
    - 맞춤형: 직접 통합할 수 있음
  - SDK 기능은 줌 클라이언트와 아예 똑같은건 아니다.
- https://marketplace.zoom.us/docs/sdk/native-sdks/web/build
  - 순서대로 진행해야함 (크레덴셜 얻기 -> sdk 설치하기)
    - JWT app type 으로 앱 생성
  - meeting sdk 설치방법 2가지
    - npm install
    - cdn
      - 사용방법이 2가지로 나뉨
      - 컴포넌트 뷰는 벤더 css 추가 필요
      - 컴포넌트 뷰는 embedded 붙은 js 추가
      - 클라이언트 뷰는 안붙은 js 추가
      - 두 뷰 모두 벤더 라이브러리는 각각 추가
- https://marketplace.zoom.us/docs/sdk/native-sdks/web/signature
  - 미팅이나 웨비나 참석을 위해선 암호화된 시그니처가 검증되어야한다. 시그니처는 JWT 크레덴셜이 안전하게 저장되어있는 서버에서 매번 생성되어야한다.
  - 대충 구현한건 [여기](./server.js)에
  - 서버로 부터 얻은 시그니처 값은 ZoomMtg.join 메서드에서 사용된다.

```js
ZoomMtg.join({
  signature: signature, // <- here
  meetingNumber: meetingNumber,
  userName: userName,
  apiKey: apiKey,
  userEmail: userEmail,
  passWord: password,
  success: (success) => {
    console.log(success);
  },
  error: (error) => {
    console.log(error);
  },
});
```

- https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view

  - 컴포넌트 뷰는 3가지 컴포넌트(갤러리 뷰, 스크린 공유, 리본 뷰)를 사용할 수 있음
  - floating widget으로 존재함
  - ![](./images/2.갤러리.png)
  - ![](./images/3.화면공유.png)
  - 끝나면 화면에서 사라짐
  - body에 1개 추가해두어야함.

  ```html
  <body>
    <div id="meetingSDKElement">
      <!-- Zoom Meeting SDK Rendered Here -->
    </div>
  </body>
  ```

- https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view
  - 풀 페이지로 사용할 수 있음
  - 줌 웹 클라이언트와 동일한 경험을 줄 수 있음
  - ![](./images/5.클라이언트.png)
  - 개발방식 body에 2개를 추가해두어야함. iframe은 없음
  ```html
  <body>
    <div id="zmmtg-root"></div>
    <div id="aria-notify-area"></div>
  </body>
  ```

## meeting sdk 구성

### inside

- index.js
- embedded.js
- dist
  - css
    - bootstrap.css
    - react-select.css
  - fonts
    - glyphicons
  - lib
    - audio (= 오디오 파일들)
    - av (= audio video 관련 스크립트)
    - image (= 이미지 파일들)
    - lang (= 다국어 json 파일들)
    - webim.min.js (= ?)
  - zoom-meeting-2.1.1.min.js
  - zoomus-websdk.umd.min.js
  - zoom-meeting-embedded-ES5.min.js
  - zoomus-websdk.embedded.umd.min.js

### 특이사항

- react, redux, redux-thunk 사용
- 라이브러리 버전이 고정되어 있음
- 빌드는 webpack 사용한 듯
- 기본 css는 js파일에 포함되어있음
- 사용하려면 webpack 사용해야함. es 모듈 환경에선 클라이언트뷰는 제대로 동작안함...
  - 그래도 잘돌아가는 github 예제가 있음.
- 컴포넌트 뷰에선 커스텀 버튼을 추가할 수 있음.

---

별개로

## Embed 어떻게 할까?

- iframe 활용하지 않고, 스크립트를 활용한 런타임 통합
  - Javascript를 통한 런타임 통합: iframe과 달리 유연한 통합이 가능하다. 현실적으로 가장 많이 사용하는 방식이다.
    - 컨테이너 애플리케이션을 단위 애플리케이션 번들을 `<script>` 태그를 통합 다운로드 받고
    - 약속된 초기화 메소드를 호출한다.
    - 클라이언트측에서 (브라우져) 통합한다.
    - 출처: https://mobicon.tistory.com/572 [Mobile Convergence]
- framework는 svelte 유지.
  - 2가지 장점을 가져갈 수 있음 = 번들 사이즈 최소화 + 코드 변경 최소화

## sdk 사용 시나리오

- zoom의 클라이언트 뷰와 유사할 듯 (=정해진 영역 전체를 사용하는 것)
- create 호출하면 대기실 뷰가 생김.

```ts
import ConnectLiveEmbed from '@kep/connectlive-embed-sdk';

ConnectLiveEmbed.create({
  target: 'icl-embed-root',
  options: { ... }, // 일단은 css 수정 + 버튼 라벨 수정
  onSuccess: () => {},
  onFailure: () => {}
});

// UI 조작 없이
ConnectLiveEmbed.join();
ConnectLiveEmbed.leave();

// iframe 제거
ConnectLiveEmbed.remove();
```
