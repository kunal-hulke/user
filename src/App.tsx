import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import MandapList from './components/MandapList/MandapList';
import MandapDetails from './pages/MandapDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';
import BookingDetails from './pages/BookingDetails';
import ExploreVenue from './pages/ExploreVenue';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Favorites from './pages/Favorites';
import Footer from './components/Footer/Footer';
import PhotographerDetails from './pages/PhotographerDetails';
import CatererDetails from './pages/CatererDetails';
import RoomDetails from './pages/RoomDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mandaps" element={<MandapList />} />
          <Route path="/mandaps/:id" element={<MandapDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/explore-venue" element={<ExploreVenue />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/photographer/:id" element={<PhotographerDetails />} />
          <Route path="/caterer/:id" element={<CatererDetails />} />
          <Route path="/room/:id" element={<RoomDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;