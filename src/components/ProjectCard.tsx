import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github, Star, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import images
import powerbiImage from '@/assets/powerbi-dashboard.jpg';
import dbtImage from '@/assets/dbt-code.jpg';
import sqlImage from '@/assets/sql-analysis.jpg';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  link?: string;
  github?: string;
  featured: boolean;
  has_details: boolean;
  details_content?: string;
  details_images?: string[];
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  // Map image paths to imported images, or use uploaded URLs
  const getImageSrc = (imagePath: string) => {
    if (!imagePath) return powerbiImage; // fallback
    if (imagePath.includes('supabase') || imagePath.startsWith('http')) return imagePath; // uploaded image
    if (imagePath.includes('powerbi')) return powerbiImage;
    if (imagePath.includes('dbt')) return dbtImage;
    if (imagePath.includes('sql')) return sqlImage;
    return imagePath; // fallback
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover-lift group relative overflow-hidden">
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        </div>
      )}

      {/* Project Image */}
      <div className="relative overflow-hidden">
        <img 
          src={getImageSrc(project.image)} 
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {project.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-secondary/50 text-secondary-foreground border-border/30"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {project.link && (
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
              asChild
            >
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </a>
            </Button>
          )}
          {project.has_details && (
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Details
            </Button>
          )}
          {project.github && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border hover:border-primary hover:bg-primary/10 flex-1"
              asChild
            >
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                Code
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;