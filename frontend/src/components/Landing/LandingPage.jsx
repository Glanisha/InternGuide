import React, { useEffect, useState } from "react";
import { BackgroundAnimation } from "./BackgroundAnimation";
import AnimatedTextCycle from "./AnimatedTextCycle";
import { ContainerScroll } from "./ScrollContainer";
import { TestimonialCard } from "./TestimonialCard";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Add Inter font to document head
  useEffect(() => {
    // Create link elements for Google Fonts
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    
    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    
    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    
    // Append to document head
    document.head.appendChild(link1);
    document.head.appendChild(link2);
    document.head.appendChild(link3);
    
    setMounted(true);
    
    // Cleanup function to remove elements when component unmounts
    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
    };
  }, []);

  const words = ["Career", "Intern", "Success"];

  const testimonials = [
    {
      author: {
        name: "Rahul Sharma",
        role: "Software Engineering Intern, Google",
      },
      text: "InternGuide helped me prepare and land my dream internship. The resources and community support were invaluable.",
    },
    {
      author: {
        name: "Sara Dcosta",
        role: "Data Science Intern, Microsoft",
      },
      text: "The interview prep resources were exactly what I needed. Went from rejection to multiple offers in just 2 months!",
    },
    {
      author: {
        name: "Jack Gomes",
        role: "Product Management Intern, Amazon",
      },
      text: "The networking strategies I learned here opened doors I didn't even know existed. Truly game-changing platform.",
    },
    {
      author: {
        name: "Maya Patel",
        role: "UX Design Intern, Apple",
      },
      text: "From resume building to interview prep, InternGuide provided everything I needed to succeed in my internship journey.",
    },
  ];

  // Companies data
  const companies = [
    { name: "Unilever", logo: "/unilever-logo.png" },
    { name: "Tesla", logo: "/tesla-logo.png" },
    { name: "Google", logo: "/google-logo.png" },
    { name: "Microsoft", logo: "/microsoft-logo.png" },
    { name: "Amazon", logo: "/amazon-logo.png" },
    { name: "Apple", logo: "/apple-logo.png" },
    { name: "Meta", logo: "/meta-logo.png" },
    { name: "Netflix", logo: "/netflix-logo.png" },
  ];

  // Using dark theme styles by default (since we're removing the theme toggle)
  const bgColor = "bg-[#080808]";
  const textColor = "text-white";
  const textColorSecondary = "text-gray-400";
  const navBgColor = "bg-[#080808]/80";
  const navBorderColor = "border-white/10";
  const cardBgColor = "bg-white/5";
  const cardBorderColor = "border-white/10";
  const buttonBgColor = "bg-white";
  const buttonTextColor = "text-black";
  const buttonHoverBgColor = "hover:bg-gray-100";
  const outlineButtonTextColor = "text-white";
  const outlineButtonBorderColor = "border-white/20";
  const outlineButtonHoverBg = "hover:bg-white/5";
  const footerBorderColor = "border-white/10";

  if (!mounted) {
    return null; // Prevent initial flash while loading
  }

  return (
    <main className={`relative z-0 min-h-screen ${bgColor}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background animation */}
      <BackgroundAnimation />
      
      <nav className={`fixed top-3 left-0 right-0 z-50 ${navBgColor} backdrop-blur-sm max-w-4xl mx-auto px-2 py-1 rounded-full border ${navBorderColor} shadow-lg`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className={`${textColor} font-bold text-xl`}>
            InternGuide
          </a>
          <div className="flex items-center gap-8">
            <a
              href="/"
              className={`${textColorSecondary} hover:${textColor} transition-colors`}
            >
              Home
            </a>
            <a
              href="#features-section"
              className={`${textColorSecondary} hover:${textColor} transition-colors`}
            >
              Features
            </a>
            <a
              href="#about"
              className={`${textColorSecondary} hover:${textColor} transition-colors`}
            >
              About
            </a>
           
          </div>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold ${textColor} mb-6`}>
            Your Ultimate{" "}
            <AnimatedTextCycle words={words} className="text-gray-300" />
            {" "}Guide
          </h1>
          <p className={`${textColorSecondary} text-lg md:text-xl max-w-2xl mx-auto mb-8`}>
            Expert guidance, curated resources, and a supportive community to
            help you ace your internship journey.
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button 
              onClick={() => navigate('/login')}
              className={`px-8 py-4 ${buttonBgColor} ${buttonTextColor} ${buttonHoverBgColor} rounded-full font-semibold transition-all shadow-md hover:shadow-lg w-full sm:w-auto`}
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/register')}
              className={`px-8 py-4 bg-transparent ${outlineButtonTextColor} border ${outlineButtonBorderColor} ${outlineButtonHoverBg} rounded-full font-semibold transition-all shadow-sm hover:shadow-md w-full sm:w-auto`}
            >
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - Added ID for navbar link */}
      <section id="features-section">
        <ContainerScroll
          titleComponent={
            <h2 className={`text-3xl md:text-5xl font-bold ${textColor} mb-8`}>
              Everything You Need to Succeed
            </h2>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${cardBgColor} border ${cardBorderColor} backdrop-blur-sm shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
              >
                <h3 className={`text-xl font-semibold ${textColor} mb-3`}>
                  {feature.title}
                </h3>
                <p className={`${textColorSecondary}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </ContainerScroll>
      </section>

    

      <section className="relative z-10 py-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-5xl font-bold ${textColor} mb-4`}>
              What Our Users Say
            </h2>
            <p className={`${textColorSecondary} text-lg`}>
              Join thousands of successful interns who transformed their careers
            </p>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-hidden py-4">
              {/* First animation */}
              <div className="animate-marquee flex gap-6 shrink-0">
                {testimonials.map((testimonial, idx) => (
                  <TestimonialCard
                    key={`first-${idx}`}
                    author={testimonial.author}
                    text={testimonial.text}
                    darkMode={true}
                  />
                ))}
              </div>
              {/* Second animation (clone) */}
              <div className="animate-marquee flex gap-6 shrink-0">
                {testimonials.map((testimonial, idx) => (
                  <TestimonialCard
                    key={`second-${idx}`}
                    author={testimonial.author}
                    text={testimonial.text}
                    darkMode={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-bold ${textColor} mb-4`}>
              About InternGuide
            </h2>
            <p className={`${textColorSecondary} text-lg`}>
              Empowering students to take charge of their internship journey with the right tools and community support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Our Mission */}
            <div className={`p-8 rounded-xl ${cardBgColor} border ${cardBorderColor} backdrop-blur-sm shadow-md transform hover:-translate-y-2 hover:shadow-xl transition duration-300 ease-in-out`}>
              <h3 className={`text-2xl font-semibold ${textColor} mb-4`}>Our Mission</h3>
              <p className={`${textColorSecondary}`}>
                We aim to bridge the gap between ambition and opportunity. InternGuide is built to simplify the internship process—offering guidance, mentorship, and access to resources all in one place.
              </p>
            </div>

            {/* Why InternGuide? */}
            <div className={`p-8 rounded-xl ${cardBgColor} border ${cardBorderColor} backdrop-blur-sm shadow-md transform hover:-translate-y-2 hover:shadow-xl transition duration-300 ease-in-out`}>
              <h3 className={`text-2xl font-semibold ${textColor} mb-4`}>Why InternGuide?</h3>
              <p className={`${textColorSecondary}`}>
                Unlike traditional platforms, we focus on personalized growth. Whether you're struggling with your resume or unsure about interview prep, we've got tailored solutions to guide you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-5xl font-bold ${textColor} mb-6`}>
            Interested in Mentoring or Offering Internships?
          </h2>
          <p className={`${textColorSecondary} text-lg mb-8 max-w-2xl mx-auto`}>
            Register now to view detailed analytics, connect with talented students, 
            and collaborate with our faculty to shape the next generation of professionals.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className={`px-8 py-4 ${buttonBgColor} ${buttonTextColor} ${buttonHoverBgColor} rounded-full font-semibold shadow-md hover:shadow-lg transition-all`}
          >
            Register Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${footerBorderColor} py-8 px-4`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className={`${textColorSecondary} text-sm mb-4 md:mb-0`}>
            © 2025 InternGuide. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="#about"
              className={`${textColorSecondary} hover:${textColor} transition-colors`}
            >
              About
            </a>
            <a
              href="#contact"
              className={`${textColorSecondary} hover:${textColor} transition-colors`}
            >
              Contact
            </a>
            <a
              href="#"
              className={`${textColorSecondary} hover:${textColor} transition-colors`}
            >
              Privacy
            </a>
        
          </div>
        </div>
      </footer>
    </main>
  );
};

// Features data
const features = [
  {
    title: "Personalized Solutions",
    description: "Get tailored recommendations that address your specific challenges and needs.",
  },
  {
    title: "Smart Matching System",
    description: "Our intelligent algorithm connects you with the most relevant resources and opportunities.",
  },
  {
    title: "Expert Guidance",
    description: "Access professional advice and proven strategies to overcome your obstacles.",
  },
  {
    title: "Comprehensive Resources",
    description: "Find all the tools and information you need in one convenient platform.",
  },
];

export default Landing;