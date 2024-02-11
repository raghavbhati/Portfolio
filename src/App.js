import logo from './logo.svg';
import './App.css';
import Navbar from './Component/Navbar';
import Hero from './Component/Hero';
import About from './Component/About';
import Project from './Component/Project';
import Contact from './Component/Contact';
import Footer from './Component/Footer';
import { Analytics } from '@vercel/analytics/react';
function App() {
  return (
    <div className="font-Poppins">
      <Navbar/> 
      <Hero/>
      <About/>
      <Project/>
      <Contact/>
      <Footer/>
      <Analytics />
    </div>
  );
}

export default App;
