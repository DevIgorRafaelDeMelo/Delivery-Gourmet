import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home"; 

function App() {
  return (
    <Router>
      <nav className="bg-teal-700 p-4 text-white flex gap-4">
        <Link to="/" className="hover:underline">Home</Link> 
      </nav>

      <Routes>
        <Route path="/" element={<Home />} /> 
      </Routes>
    </Router>
  );
}

export default App;