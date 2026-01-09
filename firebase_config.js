// 주의: 이 파일은 예시 템플릿입니다. 
// Firebase 콘솔에서 발급받은 실제 키 값으로 내용을 교체해야 작동합니다.

// HTML의 <head> 태그 안에 아래 스크립트 2줄을 먼저 추가해야 합니다:
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>

const firebaseConfig = {
    apiKey: "AIzaSyCnX0fg8trYsgf-25HKF7vf8btdNC1L6EM",
    authDomain: "portfolio-dohyeons10-mk2.firebaseapp.com",
    databaseURL: "https://portfolio-dohyeons10-mk2-default-rtdb.firebaseio.com",
    projectId: "portfolio-dohyeons10-mk2",
    storageBucket: "portfolio-dohyeons10-mk2",
    messagingSenderId: "171636079716",
    appId: "1:171636079716:web:c676eabb312faa51c67371"
};

// Firebase 초기화
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.database(); // 전역 변수로 설정하여 다른 파일에서 사용 가능하게 함
}