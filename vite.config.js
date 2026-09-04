import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Eu uso uma base configurável: localmente ela é "/" e no GitHub Pages recebe
// o nome do repositório para que imagens, JavaScript e CSS sejam encontrados.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  // Este plugin permite que o Vite transforme os componentes JSX do React.
  plugins: [react()],
  // Durante o desenvolvimento o site abre na porta 3000.
  server: {
    port: 3000,
    open: true
  }
})
