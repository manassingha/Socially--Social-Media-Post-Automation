import CTA from "../components/Home/CTA";
import Features from "../components/Home/Features";
import Footer from "../components/Home/Footer";
import Hero from "../components/Home/Hero";
import HowItWorks from "../components/Home/HowItWorks";
import Navbar from "../components/Home/Navbar";
import Pricing from "../components/Home/Pricing";
import Testimonials from "../components/Home/Testimonials";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
