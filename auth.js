// 认证系统配置
const AUTH_CONFIG = {
    // 验证配置 (已加密处理)
    vh: '000000007d4ae735', // 验证哈希
    sk: '2024_KC_SECURITY_SALT', // 安全密钥
    
    // 本地存储配置
    sessionKey: 'student_access_token',
    attemptKey: 'login_attempts',
    lockoutKey: 'lockout_until',
    
    // 安全配置
    sessionDuration: 24 * 60 * 60 * 1000, // 24小时有效期
    maxAttempts: 3,                        // 最大尝试次数
    lockoutDuration: 30 * 60 * 1000       // 锁定30分钟
};

// 认证管理类
class AuthManager {
    constructor() {
        this.isLocked = false;
        this.checkLockoutStatus();
    }

    // 检查是否被锁定
    checkLockoutStatus() {
        const lockoutUntil = localStorage.getItem(AUTH_CONFIG.lockoutKey);
        if (lockoutUntil && new Date().getTime() < parseInt(lockoutUntil)) {
            this.isLocked = true;
            const remainingTime = Math.ceil((parseInt(lockoutUntil) - new Date().getTime()) / 60000);
            return remainingTime;
        } else {
            this.isLocked = false;
            localStorage.removeItem(AUTH_CONFIG.lockoutKey);
            localStorage.removeItem(AUTH_CONFIG.attemptKey);
            return 0;
        }
    }

    // 验证用户是否已登录
    isAuthenticated() {
        const token = localStorage.getItem(AUTH_CONFIG.sessionKey);
        if (!token) return false;
        
        try {
            const tokenData = JSON.parse(token);
            const currentTime = new Date().getTime();
            return currentTime < tokenData.expiry;
        } catch (e) {
            localStorage.removeItem(AUTH_CONFIG.sessionKey);
            return false;
        }
    }

    // 验证密码
    validatePassword(inputPassword) {
        // 检查是否被锁定
        const lockoutRemaining = this.checkLockoutStatus();
        if (this.isLocked) {
            throw new Error(`密码错误次数过多，请等待 ${lockoutRemaining} 分钟后重试`);
        }

        // 验证密码 - 使用哈希比较
        const inputHash = this.hashPassword(inputPassword);
        if (inputHash === AUTH_CONFIG.vh) {
            // 密码正确，清除尝试记录
            localStorage.removeItem(AUTH_CONFIG.attemptKey);
            
            // 设置会话token
            const tokenData = {
                authenticated: true,
                timestamp: new Date().getTime(),
                expiry: new Date().getTime() + AUTH_CONFIG.sessionDuration
            };
            localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(tokenData));
            return true;
        } else {
            // 密码错误，记录尝试次数
            let attempts = parseInt(localStorage.getItem(AUTH_CONFIG.attemptKey) || '0') + 1;
            localStorage.setItem(AUTH_CONFIG.attemptKey, attempts.toString());
            
            if (attempts >= AUTH_CONFIG.maxAttempts) {
                // 达到最大尝试次数，锁定账户
                const lockoutUntil = new Date().getTime() + AUTH_CONFIG.lockoutDuration;
                localStorage.setItem(AUTH_CONFIG.lockoutKey, lockoutUntil.toString());
                this.isLocked = true;
                throw new Error(`密码错误次数过多，账户已锁定 30 分钟`);
            } else {
                throw new Error(`密码错误，还可尝试 ${AUTH_CONFIG.maxAttempts - attempts} 次`);
            }
        }
    }

    // 退出登录
    logout() {
        localStorage.removeItem(AUTH_CONFIG.sessionKey);
    }

    // 获取会话剩余时间
    getSessionRemainingTime() {
        const token = localStorage.getItem(AUTH_CONFIG.sessionKey);
        if (!token) return 0;
        
        try {
            const tokenData = JSON.parse(token);
            const remaining = tokenData.expiry - new Date().getTime();
            return remaining > 0 ? remaining : 0;
        } catch (e) {
            return 0;
        }
    }

    // 安全的密码哈希函数
    hashPassword(password) {
        // 组合密码和盐
        const combined = password + AUTH_CONFIG.sk + new Date().getFullYear();
        
        // 多轮哈希增强安全性
        let hash = this.simpleHash(combined);
        for (let i = 0; i < 3; i++) {
            hash = this.simpleHash(hash.toString() + AUTH_CONFIG.sk);
        }
        
        // 转换为固定长度的十六进制字符串
        return this.toHexString(Math.abs(hash));
    }

    // 改进的哈希函数
    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash);
    }

    // 转换为十六进制字符串
    toHexString(num) {
        return num.toString(16).padStart(16, '0').slice(0, 16);
    }

    // 密码设置工具函数（仅用于生成新密码哈希，部署时可删除）
    generatePasswordHash(newPassword) {
        const hash = this.hashPassword(newPassword);
        console.log(`新密码 "${newPassword}" 的哈希值: ${hash}`);
        return hash;
    }
}

// 创建全局认证管理器实例
const authManager = new AuthManager();

// 页面保护功能
function protectPage() {
    if (!authManager.isAuthenticated()) {
        // 未认证用户跳转到主页
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// 显示密码输入对话框
function showPasswordDialog(targetUrl) {
    // 先检查是否已登录
    if (authManager.isAuthenticated()) {
        window.location.href = targetUrl;
        return;
    }

    // 检查锁定状态
    const lockoutRemaining = authManager.checkLockoutStatus();
    if (authManager.isLocked) {
        alert(`账户已锁定，请等待 ${lockoutRemaining} 分钟后重试`);
        return;
    }

    const password = prompt('请输入学员访问密码：');
    if (password === null) return; // 用户取消

    try {
        if (authManager.validatePassword(password)) {
            alert('验证成功！24小时内无需重复输入密码');
            window.location.href = targetUrl;
        }
    } catch (error) {
        alert(error.message);
    }
}

// 简单的混淆函数（用于其他用途）
function simpleObfuscate(str) {
    return btoa(str).split('').reverse().join('');
}