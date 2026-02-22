# modern_auth_vue/Dockerfile
# 建置環境 (Node.js)
# 使用輕量級 Node.js 映像作為基礎
# 選擇 Alpine 版本可大幅減少映像大小
FROM node:22-alpine

# 設置工作目錄
WORKDIR /app

# 先複製 package.json 和 package-lock.json
# 這樣可以利用 Docker 的層級快取，加快後續構建
COPY package*.json ./

# 安裝依賴包
RUN npm install

# 複製其餘源代碼
COPY . .

# 開放 Vite 開發服務器的默認端口
EXPOSE 80

# 啟動Vite開發服務器
# --host 0.0.0.0 參數允許容器外部訪問
CMD ["npm","run","dev","--", "--host","0.0.0.0"]