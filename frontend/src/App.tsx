import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import About from './components/About';
import Footer from './components/Footer';
import Products from './components/entity/product/Products';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminProducts from './components/admin/AdminProducts';
import { useTheme } from './context/ThemeContext';
import Loupe from './components/Loupe';
import { LoupeProvider, useLoupeContext } from './context/LoupeContext';
import LoupeSettings from './components/LoupeSettings';

// Inner component rendered inside <Router> so that useLocation() is available.
function ThemedAppContent() {
  const { darkMode } = useTheme();
  const { visible, zoomFactor, lensSize } = useLoupeContext();
  const location = useLocation();

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}
    >
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/loupe" element={<LoupeSettings />} />
        </Routes>
      </main>
      <Footer />
      <Loupe visible={visible} zoom={zoomFactor} size={lensSize} refreshKey={location.pathname} />
    </div>
  );
}

// Wrapper component to apply theme classes
function ThemedApp() {
  return (
    <Router>
      <ThemedAppContent />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LoupeProvider>
          <ThemedApp />
        </LoupeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
