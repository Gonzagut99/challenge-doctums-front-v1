// vite/config.dev.ts
import { vitePlugin as remix } from "file:///I:/Proyectos-programacion/Proyectos-Ciclo-5/challenge-doctums-front-v1/node_modules/@remix-run/dev/dist/index.js";
import { installGlobals } from "file:///I:/Proyectos-programacion/Proyectos-Ciclo-5/challenge-doctums-front-v1/node_modules/@remix-run/node/dist/index.js";
import { defineConfig } from "file:///I:/Proyectos-programacion/Proyectos-Ciclo-5/challenge-doctums-front-v1/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///I:/Proyectos-programacion/Proyectos-Ciclo-5/challenge-doctums-front-v1/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { remixDevTools } from "file:///I:/Proyectos-programacion/Proyectos-Ciclo-5/challenge-doctums-front-v1/node_modules/remix-development-tools/dist/index.js";
import { flatRoutes } from "file:///I:/Proyectos-programacion/Proyectos-Ciclo-5/challenge-doctums-front-v1/node_modules/remix-flat-routes/dist/index.js";
installGlobals();
var config_dev_default = defineConfig({
  plugins: [
    remixDevTools(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      },
      // ssr: false,
      // ignore all files in routes folder to prevent
      // default remix convention from picking up routes
      ignoredRouteFiles: ["**/*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      }
    }),
    tsconfigPaths()
    // react()
  ],
  server: {
    port: 8085
  }
  // build: {
  //     manifest: true,
  // },
});
export {
  config_dev_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS9jb25maWcuZGV2LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiSTpcXFxcUHJveWVjdG9zLXByb2dyYW1hY2lvblxcXFxQcm95ZWN0b3MtQ2ljbG8tNVxcXFxjaGFsbGVuZ2UtZG9jdHVtcy1mcm9udC12MVxcXFx2aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJJOlxcXFxQcm95ZWN0b3MtcHJvZ3JhbWFjaW9uXFxcXFByb3llY3Rvcy1DaWNsby01XFxcXGNoYWxsZW5nZS1kb2N0dW1zLWZyb250LXYxXFxcXHZpdGVcXFxcY29uZmlnLmRldi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vSTovUHJveWVjdG9zLXByb2dyYW1hY2lvbi9Qcm95ZWN0b3MtQ2ljbG8tNS9jaGFsbGVuZ2UtZG9jdHVtcy1mcm9udC12MS92aXRlL2NvbmZpZy5kZXYudHNcIjtpbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSBcIkByZW1peC1ydW4vZGV2XCI7XHJcbmltcG9ydCB7IGluc3RhbGxHbG9iYWxzIH0gZnJvbSBcIkByZW1peC1ydW4vbm9kZVwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG5pbXBvcnQgeyByZW1peERldlRvb2xzIH0gZnJvbSBcInJlbWl4LWRldmVsb3BtZW50LXRvb2xzXCI7XHJcbmltcG9ydCB7IGZsYXRSb3V0ZXMgfSBmcm9tICdyZW1peC1mbGF0LXJvdXRlcydcclxuLy8gaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuXHJcbmluc3RhbGxHbG9iYWxzKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHJlbWl4RGV2VG9vbHMoKSxcclxuICAgICAgICByZW1peCh7XHJcbiAgICAgICAgICAgIGZ1dHVyZToge1xyXG4gICAgICAgICAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gc3NyOiBmYWxzZSxcclxuICAgICAgICAgICAgLy8gaWdub3JlIGFsbCBmaWxlcyBpbiByb3V0ZXMgZm9sZGVyIHRvIHByZXZlbnRcclxuICAgICAgICAgICAgLy8gZGVmYXVsdCByZW1peCBjb252ZW50aW9uIGZyb20gcGlja2luZyB1cCByb3V0ZXNcclxuICAgICAgICAgICAgaWdub3JlZFJvdXRlRmlsZXM6IFsnKiovKiddLFxyXG4gICAgICAgICAgICByb3V0ZXM6IGFzeW5jIGRlZmluZVJvdXRlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmxhdFJvdXRlcygncm91dGVzJywgZGVmaW5lUm91dGVzKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRzY29uZmlnUGF0aHMoKSxcclxuICAgICAgICAvLyByZWFjdCgpXHJcbiAgICBdLFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgcG9ydDogODA4NVxyXG4gICAgfSxcclxuICAgIC8vIGJ1aWxkOiB7XHJcbiAgICAvLyAgICAgbWFuaWZlc3Q6IHRydWUsXHJcbiAgICAvLyB9LFxyXG59KTtcclxuXHJcbi8vIGZ1bmN0aW9uIHJlbWl4RGV2VG9vbHMoKTogaW1wb3J0KFwidml0ZVwiKS5QbHVnaW5PcHRpb24ge1xyXG4vLyAgICAgdGhyb3cgbmV3IEVycm9yKFwiRnVuY3Rpb24gbm90IGltcGxlbWVudGVkLlwiKTtcclxuLy8gfVxyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyWixTQUFTLGNBQWMsYUFBYTtBQUMvYixTQUFTLHNCQUFzQjtBQUMvQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGtCQUFrQjtBQUczQixlQUFlO0FBRWYsSUFBTyxxQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsY0FBYztBQUFBLElBQ2QsTUFBTTtBQUFBLE1BQ0YsUUFBUTtBQUFBLFFBQ0osbUJBQW1CO0FBQUEsUUFDbkIsc0JBQXNCO0FBQUEsUUFDdEIscUJBQXFCO0FBQUEsTUFDdkI7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtGLG1CQUFtQixDQUFDLE1BQU07QUFBQSxNQUMxQixRQUFRLE9BQU0saUJBQWdCO0FBQzFCLGVBQU8sV0FBVyxVQUFVLFlBQVk7QUFBQSxNQUM1QztBQUFBLElBQ0osQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBO0FBQUEsRUFFbEI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxFQUNWO0FBQUE7QUFBQTtBQUFBO0FBSUosQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
