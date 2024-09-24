import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        types: path.resolve(__dirname, "./src/types"),
      },
    },
    define: {},
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ""),
          configure: proxy => {
            proxy.on("error", (err, _, res) => {
              console.log("proxy error", err);
              res.writeHead(500, {
                "Content-Type": "text/plain",
              });
              res.end(
                "Something went wrong. And we are reporting a custom error message."
              );
            });
            proxy.on("proxyReq", (_, req) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
      },
    },
  };
});
