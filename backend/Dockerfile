# 第一阶段：构建 Go 应用
FROM golang:1.24 AS builder
WORKDIR /app


# 禁用 CGO 并设置 GOOS 为 linux，这样生成的是静态编译的 Linux 可执行文件
ENV CGO_ENABLED=0
ENV GOOS=linux

# 先拷贝依赖文件，缓存 go modules 依赖
COPY go.mod go.sum ./
RUN go mod download

# 拷贝所有源代码（包括 .env 文件，但通常只需要代码）
COPY . .

# 构建可执行文件（这里假设你的主程序入口是 main.go，输出名为 app）
RUN go build -o app .

# 第二阶段：生成精简镜像
FROM alpine:latest
WORKDIR /app

# 拷贝构建好的二进制文件
COPY --from=builder /app/app .

# 如果需要 .env 文件在运行时生效，可以拷贝 .env 到镜像内
COPY .env .

# 如果你的应用在 8080 端口监听，可以暴露端口
EXPOSE 8080

# 启动应用
CMD ["./app"]
