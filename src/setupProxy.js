const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // API 요청이 '/api'로 시작하는 경우 프록시를 통해 전송합니다.
    createProxyMiddleware({
      target: "https://13.209.61.158.nip.io", // 실제 서버 주소로 변경
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api", // 프록시 경로 재작성 (필요에 따라 조정 가능)
      },
    })
  );
};
