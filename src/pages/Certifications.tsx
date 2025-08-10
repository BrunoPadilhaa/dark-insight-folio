import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Award, Calendar, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date_earned: string;
  badge_image?: string;
  verification_link?: string;
  display_order: number;
}

export default function Certifications() {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('date_earned', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-6 hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Award className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">
                  Certifications & Badges
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A comprehensive collection of professional certifications that validate my expertise 
                in business intelligence, data analytics, and related technologies.
              </p>
            </div>
          </div>

          {/* Certifications Grid */}
          {certifications.length === 0 ? (
            <div className="text-center py-16">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                No Certifications Yet
              </h3>
              <p className="text-muted-foreground">
                Certifications will appear here once they are added to the portfolio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <Card 
                  key={cert.id} 
                  className="bg-gradient-card border-border/50 hover-lift group relative overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    {cert.badge_image ? (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={cert.badge_image}
                          alt={`${cert.name} badge`}
                          className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex justify-center">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <Award className="h-12 w-12 text-primary" />
                        </div>
                      </div>
                    )}
                    
                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {cert.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{cert.issuer}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(cert.date_earned)}</span>
                      </div>
                      
                      <Badge 
                        variant="secondary" 
                        className="w-full justify-center bg-secondary/50 text-secondary-foreground"
                      >
                        Professional Certification
                      </Badge>

                      {cert.verification_link && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-border hover:border-primary hover:bg-primary/10 group"
                          asChild
                        >
                          <a href={cert.verification_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                            Verify Certification
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}