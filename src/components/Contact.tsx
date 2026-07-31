import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'bruno_brp@hotmail.com',
      href: 'mailto:bruno_brp@hotmail.com',
      description: 'Send me a message'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      value: 'linkedin.com/in/brunopadilha-brp',
      href: 'https://linkedin.com/in/brunopadilha-brp',
      description: 'Let\'s connect professionally'
    },
    {
      icon: Github,
      title: 'GitHub',
      value: 'github.com/BrunoPadilhaa',
      href: 'https://github.com/BrunoPadilhaa',
      description: 'Check out my code'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Leiria, Portugal',
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
        </div>
      </div>
    </section>
  );
};

export default Contact;