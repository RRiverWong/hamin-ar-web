# Hamin AR Web

[English](#english) · [한국어](#한국어)

Live experience: [hamin-ar-web.vercel.app](https://hamin-ar-web.vercel.app/)

## English

Hamin AR Web is a mobile, image-tracked WebAR artwork built with Three.js, MindAR, and Vite. Visitors open the website, allow camera access, and point their phone at the target image. The artwork then appears standing on the image without requiring an App Store download.

The current experience intentionally has no custom interface. After the browser's camera-permission prompt, the camera and image tracking start automatically.

### Artwork behavior

- The five sculptural layers keep their original staggered arrangement.
- Each layer rotates around the same invisible vertical axis.
- Adjacent layers rotate in opposite directions at the same angular speed.
- Rotation starts when the target is found and pauses when tracking is lost.
- Position and rotation smoothing reduce visible tracking jitter on mobile devices.

### Technology

- Three.js 0.160
- MindAR 1.2.5 image tracking
- Vite 5
- GLB/glTF artwork
- Vercel hosting

### Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. Camera access works on `localhost`; testing from another mobile device requires HTTPS.

Create a production build with:

```bash
npm run build
```

### Project assets

- `public/assets/target.jpg` — image visitors point their camera at
- `public/assets/target.mind` — compiled MindAR tracking data
- `public/assets/gesturetouch.glb` — current 3D artwork

When replacing the target image, compile the new image with the MindAR image compiler and replace both `target.jpg` and `target.mind`.

### Deploy to Vercel

Import the repository into Vercel. The build command and output directory are configured in `vercel.json`.

### Browser notes

- Use Safari on iPhone or Chrome on Android.
- Camera access must be allowed when prompted.
- Mobile deployment must use HTTPS.
- Browser chrome and the system camera-permission prompt cannot be hidden by the website.

### Artwork rights

The artwork, target image, and 3D model are project-specific creative assets. No permission to reuse or redistribute them is granted by this repository.

---

## 한국어

Hamin AR Web은 Three.js, MindAR, Vite로 제작한 모바일 이미지 트래킹 WebAR 작품입니다. 관람객은 App Store에서 앱을 설치할 필요 없이 웹사이트를 열고 카메라 접근을 허용한 뒤, 휴대폰 카메라를 타깃 이미지에 비추면 됩니다. 그러면 3D 작품이 이미지 위에 세워진 형태로 나타납니다.

현재 버전에는 별도의 사용자 인터페이스가 없습니다. 브라우저의 카메라 권한 요청을 허용하면 카메라와 이미지 트래킹이 자동으로 시작됩니다.

### 작품 동작

- 다섯 개의 조형 레이어는 원래의 어긋난 배치를 유지합니다.
- 모든 레이어는 동일한 보이지 않는 수직축을 중심으로 회전합니다.
- 인접한 레이어는 같은 각속도로 서로 반대 방향으로 회전합니다.
- 타깃을 인식하면 회전이 시작되고, 인식이 끊기면 일시 정지됩니다.
- 모바일 환경에서 발생하는 흔들림을 줄이기 위해 위치와 회전에 스무딩을 적용했습니다.

### 사용 기술

- Three.js 0.160
- MindAR 1.2.5 이미지 트래킹
- Vite 5
- GLB/glTF 3D 모델
- Vercel 호스팅

### 로컬 실행

Node.js 18 이상이 필요합니다.

```bash
npm install
npm run dev
```

Vite가 표시하는 로컬 주소를 브라우저에서 엽니다. `localhost`에서는 카메라를 사용할 수 있지만, 다른 모바일 기기에서 테스트하려면 HTTPS가 필요합니다.

프로덕션 빌드 생성:

```bash
npm run build
```

### 프로젝트 에셋

- `public/assets/target.jpg` — 관람객이 카메라로 비추는 타깃 이미지
- `public/assets/target.mind` — MindAR용으로 컴파일된 트래킹 데이터
- `public/assets/gesturetouch.glb` — 현재 사용 중인 3D 작품

타깃 이미지를 교체할 때는 새 이미지를 MindAR 이미지 컴파일러로 변환한 뒤 `target.jpg`와 `target.mind`를 함께 교체해야 합니다.

### Vercel 배포

이 저장소를 Vercel로 가져오면 됩니다. 빌드 명령과 출력 폴더는 `vercel.json`에 설정되어 있습니다.

### 브라우저 안내

- iPhone에서는 Safari, Android에서는 Chrome 사용을 권장합니다.
- 브라우저가 요청할 때 카메라 접근을 허용해야 합니다.
- 모바일 배포 환경에서는 HTTPS가 필요합니다.
- 브라우저 주소 표시줄과 시스템 카메라 권한 창은 웹사이트에서 숨길 수 없습니다.

### 작품 저작권

작품, 타깃 이미지, 3D 모델은 이 프로젝트를 위해 제작된 창작 에셋입니다. 이 저장소는 해당 에셋의 재사용 또는 재배포 권한을 부여하지 않습니다.
