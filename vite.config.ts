import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isLibrary = mode === 'library'

  return {
    plugins: [
      vue(),
      dts({
        insertTypesEntry: true,
        include: ['src/components/**/*.vue', 'src/types/**/*.ts']
      })
    ],
    build: isLibrary ? {
      lib: {
        entry: resolve(__dirname, 'src/components/VueGridify.vue'),
        name: 'VueGridify',
        fileName: (format) => `vue-gridify.${format}.js`
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    } : {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  }
})