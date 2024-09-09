## 개발 사항

### 주요 기능
- **로그인 및 회원가입**: 이메일과 비밀번호를 통한 로그인 및 회원가입 기능 구현. 네이버 소셜 로그인 지원.
  - [로그인 스토어 모듈](src/store/modules/loginStore.js)
  - [로그인 페이지](src/views/ProceedLogin.vue)
- **사용자 정보 관리**: 로그인 후 사용자 정보를 서버에서 요청하여 상태 관리.
  - [사용자 정보 요청](src/store/modules/loginStore.js)
- **클래스 상세 정보**: 클래스 상세 정보를 보여주는 페이지 구현.
  - [클래스 상세 정보 컴포넌트](src/components/classDetail/DetailInfo.vue)
- **주문 관리**: 주문 내역 조회 및 주문 취소 기능 구현.
  - [주문 상세 정보 컴포넌트](src/components/myPage/DetailOrder.vue)

### 사용된 기술 스택
- Vue 3
- Vite
- Axios
- Bootstrap 5.3

### 프로젝트 구조
- `src/`: 소스 코드 디렉토리
  - `components/`: 재사용 가능한 Vue 컴포넌트
  - `views/`: 페이지 단위 Vue 컴포넌트
  - `store/`: Vuex 상태 관리 모듈
  - `router/`: Vue 라우터 설정
  - `assets/`: 이미지 및 기타 정적 자산

### 환경 변수
- `.env` 파일을 사용하여 API URL 및 기타 환경 변수를 설정.
  - `VUE_APP_API_URL`: API 서버의 기본 URL
  - `VUE_APP_BRAND_FOOTER_LOGO_URL`: 브랜드 로고 URL


### 기타
- 자세한 내용은 각 컴포넌트 및 모듈의 주석을 참고하세요.# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
