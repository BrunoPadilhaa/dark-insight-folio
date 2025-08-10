import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date_earned: string;
  badge_image?: string;
  verification_link?: string;
  display_order: number;
}

const Certifications = () => {
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
        .order('date_earned', { ascending: false })
        .limit(5);

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
      month: 'long'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (certifications.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Certifications & Badges
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional certifications that validate my expertise in business intelligence and data analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {certifications.map((cert, index) => (
            <Card 
              key={cert.id} 
              className="bg-gradient-card border-border/50 hover-lift group relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                {cert.badge_image ? (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={cert.badge_image}
                      alt={`${cert.name} badge`}
                      className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                )}
                
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {cert.name}
                </h3>
                
                <Badge variant="secondary" className="mb-2 text-xs">
                  {cert.issuer}
                </Badge>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {formatDate(cert.date_earned)}
                </p>

                {cert.verification_link && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-border hover:border-primary hover:bg-primary/10"
                    asChild
                  >
                    <a href={cert.verification_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Verify
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate('/certifications')}
          >
            <Award className="h-5 w-5 mr-2" />
            View All Certifications
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Certifications;