import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ResponsiveContainer } from './components/ResponsiveContainer'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <ResponsiveContainer>
    <App />
  </ResponsiveContainer>
);
