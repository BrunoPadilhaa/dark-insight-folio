import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Github, Edit } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: string;
  link?: string;
  github?: string;
  featured: boolean;
  has_details: boolean;
  details_content?: string;
  details_images?: string[];
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Failed to fetch project details');
        navigate('/');
        return;
      }

      if (!data.has_details) {
        toast.error('This project does not have a details page');
        navigate('/');
        return;
      }

      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to fetch project details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'power-bi':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'dbt':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'sql':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'python':
        return 'bg-blue-200 text-blue-900 dark:bg-blue-800/20 dark:text-blue-400';
      case 'web-development':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'data-analysis':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300';
      case 'machine-learning':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
      case 'other':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Project Info */}
      <section className="bg-gradient-hero relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>
          
          <div className="text-center animate-fade-in">
            <div className="flex justify-center gap-2 mb-6">
              <Badge className={getCategoryColor(project.category)}>
                {project.category.replace('-', ' ').toUpperCase()}
              </Badge>
              {project.featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {project.title}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {project.link && (
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 text-white font-medium px-8 py-4 text-lg hover-glow"
                  asChild
                >
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {project.github && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg transition-all duration-300"
                  asChild
                >
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
              {user && (
                <Button 
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate(`/admin/dashboard?edit=${project.id}`)}
                  className="px-8 py-4 text-lg"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      {project.details_content && (
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Project Details
                </h2>
              </div>
              
              <Card className="bg-gradient-card border-border/50 animate-slide-up">
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none
                               prose-headings:text-foreground prose-p:text-muted-foreground 
                               prose-strong:text-foreground prose-li:text-muted-foreground
                               prose-a:text-primary hover:prose-a:text-primary/80
                               prose-blockquote:text-muted-foreground prose-blockquote:border-primary/30
                               prose-code:text-primary prose-pre:bg-muted/50"
                    dangerouslySetInnerHTML={{ __html: project.details_content }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Tags and Additional Info Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-8 text-foreground">Technologies Used</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {project.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-4 py-2 text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}