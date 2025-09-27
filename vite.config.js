import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // load env variables

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname),
      },
    },

    // Expose environment variables to client
    define: {
      "import.meta.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL),
      "import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      "import.meta.env.VITE_CONVEX_URL": JSON.stringify(env.VITE_CONVEX_URL),
      "import.meta.env.CONVEX_DEPLOYMENT": JSON.stringify(env.CONVEX_DEPLOYMENT),
      // Add more envs if needed
    },

    build: {
      rollupOptions: {
        input:
          mode === "extension"
            ? { popup: path.resolve(__dirname, "popup.html") }
            : { main: path.resolve(__dirname, "index.html") },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
      outDir: mode === "extension" ? "dist-extension" : "dist",
    },
  };
});
