# 使用 Node.js 基础镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 暴露端口，假设你的 Express 服务器运行在 3000 端口，根据实际情况修改
EXPOSE 3000

# 启动应用
CMD ["node", "/app/src/app.js"]
