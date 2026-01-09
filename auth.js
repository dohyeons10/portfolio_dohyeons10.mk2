document.addEventListener('DOMContentLoaded', function() {
    // 버튼 공통 스타일 적용 함수
    function setButtonStyle(btn) {
        btn.style.position = 'absolute';
        btn.style.right = '10px';
        btn.style.zIndex = '999999';
        btn.style.padding = '8px 12px';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontFamily = 'sans-serif';
        btn.style.fontSize = '12px';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        btn.style.color = 'white';
        btn.style.transition = 'transform 0.2s, box-shadow 0.2s';

        btn.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        };
        btn.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        };
    }

    // 관리자 인증 버튼 생성
    const authBtn = document.createElement('button');
    setButtonStyle(authBtn);
    authBtn.style.top = '10px';

    // 포트폴리오 관리 버튼 생성
    const manageBtn = document.createElement('button');
    manageBtn.innerText = '포트폴리오 관리';
    setButtonStyle(manageBtn);
    manageBtn.style.top = '50px';
    manageBtn.style.backgroundColor = '#007BFF';
    manageBtn.style.color = 'white';
    manageBtn.style.display = 'none';
    manageBtn.onclick = function() {
        window.location.href = 'portfolio_board_management.html';
    };
    document.body.appendChild(manageBtn);

    function promptPassword(callback) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000000';

        const modal = document.createElement('div');
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        modal.style.textAlign = 'center';
        modal.style.minWidth = '250px';

        const title = document.createElement('h3');
        title.innerText = '관리자 인증';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';
        title.style.color = '#333';

        const input = document.createElement('input');
        input.type = 'password';
        input.placeholder = '인증키 입력';
        input.style.width = '100%';
        input.style.padding = '10px';
        input.style.marginBottom = '15px';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '4px';
        input.style.boxSizing = 'border-box';

        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '10px';
        btnContainer.style.justifyContent = 'center';

        const confirmBtn = document.createElement('button');
        confirmBtn.innerText = '확인';
        confirmBtn.style.padding = '8px 15px';
        confirmBtn.style.backgroundColor = '#28a745';
        confirmBtn.style.color = 'white';
        confirmBtn.style.border = 'none';
        confirmBtn.style.borderRadius = '4px';
        confirmBtn.style.cursor = 'pointer';

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = '취소';
        cancelBtn.style.padding = '8px 15px';
        cancelBtn.style.backgroundColor = '#6c757d';
        cancelBtn.style.color = 'white';
        cancelBtn.style.border = 'none';
        cancelBtn.style.borderRadius = '4px';
        cancelBtn.style.cursor = 'pointer';

        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(confirmBtn);
        modal.appendChild(title);
        modal.appendChild(input);
        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        input.focus();

        function close() {
            document.body.removeChild(overlay);
        }

        function submit() {
            const val = input.value;
            close();
            callback(val);
        }

        confirmBtn.onclick = submit;
        cancelBtn.onclick = close;
        
        input.onkeydown = function(e) {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') close();
        };

        overlay.onclick = function(e) {
            if (e.target === overlay) close();
        };
    }

    function updateButton() {
        let isAdmin = false;
        try {
            isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        } catch (e) {
            console.warn('세션 스토리지 접근 불가 (로컬 파일 보안 정책 등):', e);
        }
        
        if (isAdmin) {
            authBtn.innerText = '관리자 해제';
            authBtn.style.backgroundColor = '#dc3545'; // 빨간색 (로그아웃)
            authBtn.style.color = 'white';
            authBtn.onclick = function() {
                try { sessionStorage.removeItem('isAdmin'); } catch(e) {}
                alert('관리자 권한이 해제되었습니다.');
                location.reload();
            };
            
            // profile.html에서만 포트폴리오 관리 버튼 표시
            const path = window.location.pathname;
            const page = path.split("/").pop();
            if (page === 'profile.html') {
                manageBtn.style.display = 'block';
            } else {
                manageBtn.style.display = 'none';
            }
        } else {
            authBtn.innerText = '관리자 인증';
            authBtn.style.backgroundColor = '#28a745'; // 초록색 (로그인)
            authBtn.style.color = 'white';
            authBtn.onclick = function() {
                // Firebase에서 admin_key 값을 읽어옴
                if (typeof db === 'undefined') {
                    alert('Firebase가 연결되지 않았습니다.');
                    return;
                }
                
                db.ref('admin_key').once('value').then((snapshot) => {
                    const serverKey = snapshot.val();

                    if (!serverKey) {
                        alert('인증키가 설정되지 않았습니다.\n콘솔에서 직접 키를 추가해주세요.');
                        return;
                    }

                    // 이미 사용된 키인지 확인
                    const consumedKey = localStorage.getItem('consumed_admin_key');
                    
                    if (String(serverKey) === consumedKey) {
                        alert('이미 사용된 인증키입니다.\n새로운 인증키를 발급받으세요.');
                        return;
                    }
                    
                    promptPassword(function(input) {
                        // 인증 시도 시 무조건 현재 키를 사용 처리 (초기화 효과)
                        localStorage.setItem('consumed_admin_key', String(serverKey));

                        if (input === String(serverKey)) {
                            try { sessionStorage.setItem('isAdmin', 'true'); } catch(e) { alert('브라우저 보안 설정으로 인해 로그인 상태 저장이 안 될 수 있습니다.'); }
                            alert('관리자 인증이 완료되었습니다.');
                        } else {
                            alert('인증키가 일치하지 않습니다.');
                        }
                        location.reload();
                    });
                }).catch((error) => {
                    alert('데이터베이스 연결 오류: ' + error.message);
                });
            };
            manageBtn.style.display = 'none';
        }
    }

    updateButton();
    document.body.appendChild(authBtn);
});