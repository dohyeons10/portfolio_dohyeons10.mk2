// Firebase Auth 상태 감지 및 UI 관리 (버튼 동적 생성)

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 페이지에서는 버튼 생성 안 함
    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === 'login.html') return;

    // 1. 관리자 인증 버튼 생성 (과거 스타일 복원)
    const authBtn = document.createElement('button');
    
    // 버튼 스타일 설정
    authBtn.style.position = 'absolute';
    authBtn.style.top = '10px';
    authBtn.style.right = '10px'; // 우측 상단 (과거 코드 기준)
    authBtn.style.zIndex = '999999';
    authBtn.style.padding = '8px 12px';
    authBtn.style.border = 'none';
    authBtn.style.borderRadius = '4px';
    authBtn.style.cursor = 'pointer';
    authBtn.style.fontWeight = 'bold';
    authBtn.style.fontFamily = 'sans-serif';
    authBtn.style.fontSize = '12px';
    authBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    authBtn.style.color = 'white';
    authBtn.style.transition = 'transform 0.2s, box-shadow 0.2s';

    // 호버 효과
    authBtn.onmouseover = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    };
    authBtn.onmouseout = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    };

    document.body.appendChild(authBtn);

    // 2. 하단 링크 숨김 처리 (기존 footer 링크 대체)
    function hideFooterLinks() {
        const loginLink = document.getElementById('login-link');
        const logoutLink = document.getElementById('logout-link');
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }

    // 3. Firebase Auth 상태 감지 및 버튼 기능 연결
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
            hideFooterLinks(); // 상태 변경 시마다 하단 링크 숨김 확인

            if (user) {
                // 로그인 상태 -> 로그아웃 버튼으로 변경
                console.log('User is signed in:', user.email);
                
                // [중요] 특정 이메일만 관리자 권한 부여
                if (user.email === 'dohyeons10@gmail.com') {
                    sessionStorage.setItem('isAdmin', 'true');
                } else {
                    sessionStorage.removeItem('isAdmin');
                }

                authBtn.innerText = '로그아웃';
                authBtn.style.backgroundColor = '#dc3545'; // 빨간색
                authBtn.onclick = function() {
                    firebase.auth().signOut().then(() => {
                        alert('로그아웃되었습니다.');
                        window.location.href = 'index.html';
                    }).catch((error) => {
                        console.error('Logout error:', error);
                    });
                };
            } else {
                // 로그아웃 상태 -> 로그인 버튼으로 변경
                console.log('User is signed out');
                sessionStorage.removeItem('isAdmin');
                
                authBtn.innerText = '관리자 로그인';
                authBtn.style.backgroundColor = '#28a745'; // 초록색
                authBtn.onclick = function() {
                    window.location.href = 'login.html';
                };
            }
        });
    } else {
        console.error('Firebase Auth not loaded');
        authBtn.style.display = 'none';
    }
});

// 전역 로그아웃 함수 (혹시 다른 곳에서 호출할 경우 대비)
function logout() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            window.location.href = 'index.html';
        });
    }
}