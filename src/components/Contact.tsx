import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'your.email@example.com',
      href: 'mailto:your.email@example.com',
      description: 'Send me a message'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      value: 'linkedin.com/in/yourusername',
      href: 'https://linkedin.com/in/yourusername',
      description: 'Let\'s connect professionally'
    },
    {
      icon: Github,
      title: 'GitHub',
      value: 'github.com/yourusername',
      href: 'https://github.com/yourusername',
      description: 'Check out my code'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Your City, Country',
      href: '',
      description: 'Available for remote work'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Contact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get in touch to discuss your project needs and how we can work together.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 animate-slide-up">
            {contactMethods.map((method, index) => (
              <Card 
                key={method.title} 
                className="bg-gradient-card border-border/50 hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => method.href && window.open(method.href, '_blank')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-primary text-sm font-medium mb-1">
                        {method.value}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-card rounded-2xl p-8 border border-border/50 animate-fade-in">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you need a complex dashboard, data pipeline optimization, or strategic 
              analytics consulting, I'm here to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-white font-medium px-8 py-4 text-lg hover-glow"
                asChild
              >
                <a href="mailto:your.email@example.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg transition-all duration-300"
              >
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;