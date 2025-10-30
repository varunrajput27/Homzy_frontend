import React, { useState } from 'react';
import City from '../components/city';
import ContactPage from '../components/Contactpage';
import Commercialproperty from '../components/Commercialproperty';
import Review from '../components/Review';
import HeroSection from '../components/Herosection';
import Properties from '../components/Properties';

const Home = () => {
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    rentBuy: '',
    bedrooms: '',
  });

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };

  return (
    <div>
      <HeroSection onSearch={handleSearch} />
      <Properties filters={filters} />
      <Review />
      <Commercialproperty />
      <ContactPage />
      <City />
    </div>
  );
};

export default Home;
