import { useState } from 'react';
import { Navbar } from './Components/index'
import { Home, SearchRes } from './Pages/index'
import { Route, Routes } from 'react-router-dom';

function App() {

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="App">
      {/* <SearchRes searchQuery={searchQuery} /> */}

      <Navbar setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<SearchRes searchQuery={searchQuery} />} />
      </Routes>
    </div>
  );
}

export default App;
