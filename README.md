# 乳首开发教程 - 部署指南

## 🚀 快速部署到微信分享

### 方案1：GitHub Pages（免费，推荐）

1. **创建GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **上传到GitHub**
   - 在GitHub创建新仓库
   - 上传所有文件

3. **启用GitHub Pages**
   - 进入仓库设置
   - 找到Pages选项
   - 选择main分支
   - 保存后获得网址：`https://你的用户名.github.io/仓库名/`

4. **分享到微信群**
   - 直接分享GitHub Pages链接
   - 大家点击就能直接查看

### 方案2：Netlify（免费，更简单）

1. **注册Netlify账号**
   - 访问 netlify.com
   - 用GitHub账号登录

2. **拖拽部署**
   - 直接把整个文件夹拖到Netlify
   - 自动生成网址

3. **自定义域名**（可选）
   - 可以绑定自己的域名

### 方案3：Vercel（免费，速度快）

1. **注册Vercel账号**
   - 访问 vercel.com
   - 用GitHub账号登录

2. **导入项目**
   - 选择GitHub仓库
   - 自动部署

### 方案4：本地服务器 + 内网穿透

1. **安装ngrok**
   ```bash
   # 下载ngrok
   # 运行本地服务器
   python3 -m http.server 8000
   
   # 在另一个终端运行
   ngrok http 8000
   ```

2. **获得公网地址**
   - ngrok会提供一个公网地址
   - 可以直接分享到微信群

## 📱 移动端优化

所有页面都已经针对手机进行了优化：
- 响应式设计
- 触摸友好
- 字体大小自适应
- 导航优化

## 🔗 分享链接格式

部署后的链接格式：
```
https://你的域名/index.html          # 主页
https://你的域名/chapter-01.html     # 第1节
https://你的域名/chapter-02.html     # 第2节
https://你的域名/chapter-03.html     # 第3节
https://你的域名/chapter-04.html     # 第4节
```

## 💡 建议

1. **推荐使用GitHub Pages**：免费、稳定、速度快
2. **测试分享**：部署后先在群里测试一下
3. **备份**：记得备份所有文件
4. **更新**：后续更新内容时，重新上传即可

## 🎯 最终效果

部署成功后，您就可以：
- 在微信群里直接分享链接
- 大家点击就能在手机浏览器中查看
- 支持所有手机型号
- 自动适配屏幕大小
