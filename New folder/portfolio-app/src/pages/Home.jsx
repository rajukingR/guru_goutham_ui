import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to My Portfolio</h1>
        <p>
          This is the landing page of my portfolio. Here you can find information about my projects, skills, and how to contact me.
        </p>
        <nav>
          <ul>
            <li><a href="/projects">View Projects</a></li>
            <li><a href="/about">About Me</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </main>
      <Footer />
    </div>
  );
};

export default Home;