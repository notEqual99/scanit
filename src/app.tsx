import Router from 'preact-router';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import './app.css'

const App = () => {
  return (
    <>
      <Navbar />
      <div>
        <Router>
          <Home path="/" />
          <About path="/about" />
        </Router>
      </div>
      <Footer/>
    </>
  );
}

export default App;