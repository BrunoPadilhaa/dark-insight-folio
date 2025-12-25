import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Database, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

interface AboutContent {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
}

const About = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('section');

      if (error) throw error;
      setAboutContent(data || []);
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentBySection = (section: string) => {
    return aboutContent.find(content => content.section === section);
  };

  const skills = [
    'Power BI', 'Tableau', 'SQL', 'Python', 'dbt', 'Snowflake', 
    'PostgreSQL', 'DAX', 'ETL/ELT', 'Data Modeling', 'Azure', 'AWS'
  ];

  const highlights = [
    {
      icon: BarChart3,
      title: 'Data Visualization',
      description: 'Creating compelling dashboards and reports that tell data stories and drive business decisions.'
    },
    {
      icon: Database,
      title: 'Data Engineering',
      description: 'Building robust data pipelines and warehouses for scalable analytics infrastructure.'
    },
    {
      icon: TrendingUp,
      title: 'Business Analytics',
      description: 'Translating complex data into actionable insights that impact business strategy and growth.'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Optimizing queries, models, and processes for maximum efficiency and reliability.'
    }
  ];

  const headerContent = getContentBySection('header');
  const storyContent = getContentBySection('story');
  const skillsContent = getContentBySection('skills');

  if (loading) {
    return (
      <section id="about" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-xl text-muted-foreground">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              {headerContent?.title || 'About Me'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {headerContent?.subtitle || 'Passionate about transforming data into strategic business value.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Story */}
            <div className="animate-slide-up">
              <div className="prose prose-lg max-w-none">
                {storyContent?.content ? (
                  storyContent.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-6" 
                       dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph) }} />
                  ))
                ) : (
                  <>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      With over <span className="text-primary font-semibold">5 years of experience</span> in 
                      Business Intelligence and Data Analytics, I specialize in creating data-driven solutions 
                      that empower organizations to make informed decisions.
                    </p>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      My expertise spans from building comprehensive Power BI dashboards to designing 
                      scalable data warehouses with dbt. I'm passionate about clean code, efficient 
                      processes, and delivering insights that matter.
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-8">
                      When I'm not working with data, you'll find me exploring the latest BI tools, 
                      contributing to open-source projects, or sharing knowledge with the data community.
                    </p>
                  </>
                )}
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {skillsContent?.title || 'Technical Skills'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Highlights */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {highlights.map((highlight, index) => (
                <Card 
                  key={highlight.title} 
                  className="bg-gradient-card border-border/50 hover-lift group"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <highlight.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {highlight.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;