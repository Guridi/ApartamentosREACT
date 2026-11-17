import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Configura React y la comunicación local con el backend.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // Vite reenvía /api a ASP.NET Core en el puerto 5143 por defecto.
  const proxy = {
    '/api': { target: env.VITE_API_TARGET || 'http://localhost:5143' },
  }

  return {
    plugins: [react()],
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 4173, strictPort: true, proxy },
  }
})
