import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import PinGate from './components/PinGate';
import PageNotFound from './lib/PageNotFound';
import Home from './pages/Home';
import Semester4Page from './pages/Semester4';
import Semester4AIPage from './pages/Semester4AI';
import Semester4UiuxPage from './pages/Semester4UIUX';
import Semester5Page from './pages/Semester5';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <PinGate>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/semester5" element={<Semester5Page />} />
            <Route path="/semester4" element={<Semester4Page />} />
            <Route path="/semester4/ai" element={<Semester4AIPage />} />
            <Route path="/semester4/uiux" element={<Semester4UiuxPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </PinGate>
    </ThemeProvider>
  )
}

export default App
