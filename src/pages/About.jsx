const teamMembers = [
    { 
        name: 'Varun Rajput', 
        role: 'Founder & CEO', 
        img: '/images/nobita.jfif',
        description: 'Driving the company vision, focused on ethical practices and leveraging technology to scale property solutions.'
    },
    { 
        name: 'Smriti Garg', 
        role: 'Head of Product Design', 
        img: '/images/sizuka.jfif',
        description: 'Creating seamless and intuitive user experiences for property owners and tenants, prioritizing accessibility.'
    },
    { 
        name: 'Neha Singh', 
        role: 'Lead Frontend Engineer', 
        img: '/images/girl2.jfif',
        description: 'Responsible for bringing the platform to life with modern, responsive, and performance-optimized code.'
    },
    { 
        name: 'Akansha Tomar', 
        role: 'Backend Architect', 
        img: '/images/girl3.jfif',
        description: 'Designing and managing the robust, scalable server architecture that secures all transaction data.'
    },
];

// Core Values data
const coreValues = [
    { 
        title: 'Trust', 
        description: 'Building lasting relationships through strong ethics and absolute integrity.',
        icon: 'M9 12l2 2 4-4m5.618-4.417a2.196 2.196 0 00-2.437-1.077c-.913.295-1.745.897-2.31 1.637l-2.02 2.613L7 20l5.5-2 5-6.5L21.36 9.585a2.196 2.196 0 00-2.437-1.077z'
    },
    { 
        title: 'Transparency', 
        description: 'Clear communication and honest dealings in every step of your transaction.',
        icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM12 1.5c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z'
    },
    { 
        title: 'Growth', 
        description: 'Committed to maximizing your wealth and property value through continuous improvement.',
        icon: 'M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zM12 1C5.935 1 1 5.935 1 12s4.935 11 11 11 11-4.935 11-11S18.065 1 12 1z'
    },
    { 
        title: 'Innovation', 
        description: 'Utilizing cutting-edge technology to provide modern property management solutions.',
        icon: 'M9 19c0 .5-.4 1-1 1H4c-.6 0-1-.5-1-1v-4c0-.5.4-1 1-1h4c.6 0 1 .5 1 1v4zM15 4c0-.5.4-1 1-1h4c.6 0 1 .5 1 1v4c0 .5-.4 1-1 1h-4c-.6 0-1-.5-1-1V4zM9 9c0-.5.4-1 1-1h4c.6 0 1 .5 1 1v4c0 .5-.4 1-1 1h-4c-.6 0-1-.5-1-1V9zM15 14c0-.5.4-1 1-1h4c.6 0 1 .5 1 1v4c0 .5-.4 1-1 1h-4c-.6 0-1-.5-1-1v-4z'
    },
];

// Why Choose Data
const whyChooseData = [
    {
        title: 'Full Property Management',
        description: 'Comprehensive solutions including maintenance, tenant screening, and rent collection, all hassle-free.',
        icon: 'M12 3v18M6 6v15M18 10v11M3 21h18'
    },
    {
        title: 'Dedicated Tenant Support',
        description: '24/7 support services ensuring smooth communication and quick resolution of all concerns.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 13h9a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
        title: 'Streamlined Renting',
        description: 'Quick and hassle-free rental process with fully digital documentation and simple agreement procedures.',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
        title: 'Verified Listings',
        description: 'All properties undergo rigorous checks ensuring complete authenticity and legal compliance for your peace of mind.',
        icon: 'M9 12l2 2 4-4m5.618-4.417a2.196 2.196 0 00-2.437-1.077c-.913.295-1.745.897-2.31 1.637l-2.02 2.613L7 20l5.5-2 5-6.5L21.36 9.585a2.196 2.196 0 00-2.437-1.077z'
    },
];


const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header Section with Background Image - Mobile & Desktop Responsive */}
            <div 
                className="relative h-[55vh] lg:h-[65vh] bg-cover bg-center flex items-center justify-center text-white shadow-2xl"
                style={{ 
                
                    backgroundImage: "url('/images/about.jfif')", 
                }}
            >
                {/* Darker Overlay (bg-opacity-85) for maximum text readability, especially on mobile */}
                <div className="absolute inset-0  bg-opacity-85 flex flex-col justify-center items-center px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-xl tracking-tight text-gray-200 transition duration-500 ">
                        The Homzy Story
                    </h1>
                    {/* Centered and Stylized Sub-text - Better Contrast */}
                    <p className="text-xl md:text-3xl font-light italic text-white/90 p-3 rounded-lg shadow-xl border-b-4 border-indigo-400">
                        Your Property, Our Priority. <span className="font-extrabold block sm:inline text-indigo-200">Building Trust, One Home at a Time.</span>
                    </p>
                </div>
            </div>

            {/* About Grihamate Section - Mission & Vision */}
            <section className="container mx-auto px-6 py-16 lg:py-24 max-w-6xl">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12 border-b-4 border-indigo-500 inline-block pb-1">
                    Our Mission & Vision
                </h2>
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* Left Block: Vision */}
                    <div className="md:order-1 bg-white p-8 rounded-xl shadow-2xl border-t-8 border-gray-300">
                        <h3 className='text-3xl font-bold text-indigo-700 mb-4'>Our Vision</h3>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4 font-semibold italic">
                            "To be the most trusted and technologically advanced real estate platform, ensuring every client finds their perfect fit with ease and confidence."
                        </p>
                        <p className="text-md text-gray-600 leading-relaxed">
                            We believe in using innovation to simplify property management and transactions. Our journey is built on the core belief that excellence is a habit, not an act.
                        </p>
                    </div>

                    {/* Right Block: Mission */}
                    <div className="md:order-2 bg-white p-8 rounded-xl shadow-2xl border-t-8 border-gray-300">
                        <h3 className='text-3xl font-bold text-indigo-700 mb-4'>Our Mission</h3>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4 font-semibold italic">
                            "To bridge the gap between property seekers and their dream homes by providing comprehensive, ethical, and hassle-free property solutions."
                        </p>
                         <p className="text-md text-gray-600 leading-relaxed">
                            We commit to maximizing value for property owners and providing exceptional service to tenants, driving success through transparency and dedication.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- Core Values Section - Cleaner Background --- */}
            <section className="bg-gray-100 py-16 lg:py-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
                        The Pillars We Stand On
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl shadow-xl transform hover:scale-[1.05] transition duration-300 text-center flex flex-col items-center border-b-7 border-gray-300"
                            >
                                <div className="text-indigo-600 mb-4 bg-indigo-100 p-4 rounded-full shadow-lg">
                                    <svg
                                        className="w-12 h-12 mx-auto"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d={value.icon}
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-md text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Meet Our Dedicated Team Section - Polished Look --- */}
            <section className="container mx-auto px-6 py-16 lg:py-24 max-w-6xl">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
                    Meet Our Dedicated Team
                </h2>
                <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    A team of experienced professionals, passionate about transforming your real estate journey.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-2xl shadow-indigo-100/50 p-6 text-center transition duration-500 hover:shadow-indigo-400/50 transform hover:-translate-y-1 border-b-4 border-gray-300"
                        >
                            {/* Prominent Image Container */}
                            <div className="w-32 h-32 rounded-full mx-auto mb-5 border-4 border-gray-500 p-1 bg-white flex items-center justify-center overflow-hidden shadow-xl">
                                {member.img ? (
                                    // 🚨 IMPORTANT: Ensure these files are in your 'public/images/' folder
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="object-cover w-full h-full rounded-full"
                                    />
                                ) : (
                                    <svg
                                        className="w-16 h-16 text-gray-500"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M24 20.993V24H0v-2.997A14.99 14.99 0 0112 18.268a14.99 14.99 0 0112 2.725zM12 15a6 6 0 100-12 6 6 0 000 12z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                            <p className="text-lg text-indigo-600 font-semibold mb-3">{member.role}</p>
                            {/* Styled Description */}
                            <p className="text-sm text-gray-500 italic border-t pt-3 mt-3">
                                {member.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- Why Choose Grihamate? Section - Finalized Design --- */}
            <section className="bg-indigo-50 py-16 lg:py-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Your Benefits with Us
                        </h2>
                        <p className="text-xl text-gray-600 max-w-xl mx-auto">
                            Experience the difference with our comprehensive real estate solutions designed to exceed your expectations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyChooseData.map((item, index) => (
                            <div 
                                key={index} 
                                className="bg-white p-8 rounded-xl shadow-xl text-center flex flex-col items-center transition duration-500 hover:shadow-indigo-500/50 hover:bg-white border-b-4 border-transparent hover:border-gray-200"
                            >
                                <div className="text-white mb-4 bg-indigo-600 p-4 rounded-full shadow-lg">
                                    <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-md text-gray-600 mb-5 flex-grow">{item.description}</p>
                                <button className="mt-auto px-6 py-2 text-sm font-semibold text-white bg-gray-500 rounded-full hover:border-gray-200 shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                                    Explore ervices
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;