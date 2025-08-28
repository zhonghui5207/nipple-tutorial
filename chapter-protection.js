// 章节页面保护脚本
(function() {
    'use strict';
    
    // 检查认证状态
    function checkAuth() {
        // 如果 auth.js 还未加载，延迟检查
        if (typeof authManager === 'undefined') {
            setTimeout(checkAuth, 100);
            return;
        }
        
        // 检查是否已认证
        if (!authManager.isAuthenticated()) {
            // 未认证，显示提示页面并跳转到主页
            showUnauthorizedPage();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            // 已认证，显示正常页面内容
            showAuthorizedContent();
            addLogoutButton();
        }
    }
    
    // 显示未认证页面
    function showUnauthorizedPage() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 50px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                    text-align: center;
                    max-width: 500px;
                    margin: 20px;
                ">
                    <div style="font-size: 4em; margin-bottom: 20px;">🔐</div>
                    <h2 style="color: #5a67d8; margin-bottom: 20px; font-size: 1.8em;">需要学员验证</h2>
                    <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
                        此内容仅限已验证的学员访问<br>
                        请返回主页进行验证登录
                    </p>
                    <div style="
                        background: #f8f9ff;
                        padding: 20px;
                        border-radius: 10px;
                        margin-bottom: 30px;
                        color: #4a5568;
                        border-left: 4px solid #5a67d8;
                    ">
                        ⏱️ 3秒后自动跳转到主页...
                    </div>
                    <button onclick="window.location.href='index.html'" style="
                        background: linear-gradient(135deg, #5a67d8 0%, #4facfe 100%);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 1em;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(90,103,216,0.3)'" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        立即返回主页
                    </button>
                </div>
            </div>
        `;
    }
    
    // 显示已认证用户的正常内容
    function showAuthorizedContent() {
        // 页面内容已经正常显示，只需要确保可见性
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
    }
    
    // 添加登出按钮
    function addLogoutButton() {
        const navBar = document.querySelector('.nav-bar');
        if (navBar && !document.getElementById('logoutBtn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logoutBtn';
            logoutBtn.innerHTML = '🚪 退出登录';
            logoutBtn.style.cssText = `
                background: #dc3545;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9em;
                font-weight: 500;
                transition: all 0.3s ease;
            `;
            
            logoutBtn.onmouseover = function() {
                this.style.background = '#c82333';
                this.style.transform = 'translateY(-1px)';
            };
            
            logoutBtn.onmouseout = function() {
                this.style.background = '#dc3545';
                this.style.transform = 'translateY(0)';
            };
            
            logoutBtn.onclick = function() {
                if (confirm('确定要退出登录吗？')) {
                    authManager.logout();
                    alert('已退出登录，即将跳转到主页');
                    window.location.href = 'index.html';
                }
            };
            
            navBar.appendChild(logoutBtn);
        }
    }
    
    // 初始化时隐藏页面内容，防止闪烁
    document.addEventListener('DOMContentLoaded', function() {
        // 初始隐藏页面内容
        document.body.style.visibility = 'hidden';
        document.body.style.opacity = '0';
        
        // 执行认证检查
        checkAuth();
    });
    
    // 如果DOM已经加载完成，立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuth);
    } else {
        // DOM已经完成加载
        document.body.style.visibility = 'hidden';
        document.body.style.opacity = '0';
        checkAuth();
    }
})();