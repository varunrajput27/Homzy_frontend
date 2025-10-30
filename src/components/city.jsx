import React from 'react';
const cities = [
  { name: 'New Delhi', properties: 28, image: '/images/new-delhi.jfif', url: '#' },
  { name: 'Mumbai', properties: 12, image: '/images/mumbai.jfif', url: '#' },
  { name: 'Goa', properties: 32, image: '/images/goa.jfif', url: '#' },
  { name: 'Haryana', properties: 19, image: '/images/haryana.jfif', url: '#' },
];

const CityCard = ({ name, properties, image, url, className }) => {
  return (
    <a
      href={url}
      className={`relative rounded-xl overflow-hidden shadow-lg bg-cover bg-center 
                  transition duration-300 ease-in-out transform hover:scale-[1.02] ${className}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent/10"></div>
      {/* Content */}
      <div className="absolute bottom-0 left-0 p-4 text-white z-10">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm opacity-90">{properties} properties</p>
      </div>
    </a>
  );
};

const City = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#333]">
          What city will you live in?
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Discover your perfect home in the city you love. Explore the best neighborhoods and find a place that truly feels like yours.
        </p>
      </header>

      {/* Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-min">
          {/* Card 1: New Delhi */}
          <CityCard
            {...cities[0]}
            className="sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[180px] sm:min-h-[200px] lg:min-h-[450px]"
          />

          {/* Card 2: Mumbai */}
          <CityCard
            {...cities[1]}
            className="min-h-[150px] sm:min-h-[200px] lg:min-h-[215px]"
          />

          {/* Card 3: Goa */}
          <CityCard
            {...cities[2]}
            className="min-h-[150px] sm:min-h-[200px] lg:row-span-2 lg:min-h-[450px]"
          />

          {/* Card 4: Haryana */}
          <CityCard
            {...cities[3]}
            className="min-h-[150px] sm:min-h-[200px] lg:min-h-[215px]"
          />
        </div>
      </div>
    </div>
  );
};

export default City;
