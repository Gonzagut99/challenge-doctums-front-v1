import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixDevTools } from "remix-development-tools";
import { flatRoutes } from 'remix-flat-routes'
// import react from '@vitejs/plugin-react';

installGlobals();

export default defineConfig({
    plugins: [
        remixDevTools(),
        remix({
            future: {
                v3_fetcherPersist: true,
                v3_relativeSplatPath: true,
                v3_throwAbortReason: true,
              },
              
            // ssr: false,
            // ignore all files in routes folder to prevent
            // default remix convention from picking up routes
            ignoredRouteFiles: ['**/*'],
            routes: async defineRoutes => {
                return flatRoutes('routes', defineRoutes)
            },
        }),
        tsconfigPaths(),
        // react()
    ],
    server: {
        port: 8085
    },
    // build: {
    //     manifest: true,
    // },
});

// function remixDevTools(): import("vite").PluginOption {
//     throw new Error("Function not implemented.");
// }

