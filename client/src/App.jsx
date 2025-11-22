import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Search from './pages/Search';
import GameDetails from './pages/GameDetails';

import Layout from './components/Layout';

import SaveReport from './components/SaveReport';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/save-report/:id" element={<SaveReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
