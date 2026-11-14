import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  const rawBase = import.meta.env.BASE_URL || '/';
  const basename = rawBase === '/' ? undefined : rawBase.replace(/\/$/, '');

  return (
    <BrowserRouter basename={basename}>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

