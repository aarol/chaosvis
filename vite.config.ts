import { defineConfig } from "vite";

export default (_: any, mode: string) => defineConfig({
  base: mode === 'production' ? '/chaosvis/' : '/'
})