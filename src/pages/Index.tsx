import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Projects />
      <Certifications />
      
      <Contact />
      <Footer />
    </div>;
};
export default Index;