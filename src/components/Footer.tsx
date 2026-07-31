import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/20 border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left - Copyright */}
          <div className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {currentYear} Bruno Padilha. All rights reserved.
          </div>

          {/* Center - Navigation */}
          <nav className="flex space-x-8 mb-4 md:mb-0">
            <a 
              href="#home" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Home
            </a>
            <a 
              href="#projects" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Contact
            </a>
          </nav>

          {/* Right - Social Links */}
          <div className="flex space-x-4">
            <a 
              href="https://github.com/BrunoPadilhaa"
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com/in/brunopadilha-brp"
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="mailto:bruno_brp@hotmail.com"
              className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;