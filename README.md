# react-ts-twitter

## 보안 설정

### Cloud Firestore, Storage 규칙 수정

기존 개발 모드에서는 모든 것을 허용했지만, 인증된 사용자만 가능하게 변경

```
// before
allow read, write: if request.time < timestamp.date(2024, 2, 12);

// after
allow read, write: if request.auth != null;
```

### Google Cloud API

API 및 서비스 > 사용자 인증 정보 > API 키

1. Browser key 클릭
2. 애플리케이션 제한사항 설정: 웹사이트 선택
3. 웹사이트 제한사항: 웹사이트 추가

- localhost
- 'firebase authentication 에 있는 승인된 도메인'/\*

## Vercel 배포

### Vercel CLI 설치

```
npm install -g vercel
yarn global add vercel

vercel --version
```

### Vercel 로그인

```
vercel login
```

### 배포

```
vercel
```

### 삭제

```
vercel remove
```
