import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ResponsiveContainer } from './components/ResponsiveContainer'
import { AspectCanvas } from './components/AspectCanvas'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <AspectCanvas>
    <ResponsiveContainer>
      <App />
    </ResponsiveContainer>
  </AspectCanvas>
);
