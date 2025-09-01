import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProjectCard from './ProjectCard';
import { supabase } from '@/integrations/supabase/client';

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
  published: boolean;
}

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'power-bi', label: 'Power BI' },
    { id: 'dbt', label: 'dbt' },
    { id: 'sql', label: 'SQL' }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore my portfolio of Business Intelligence projects, showcasing expertise in 
            data visualization, analytics engineering, and database optimization.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeFilter === category.id ? "default" : "outline"}
              className={`
                px-6 py-2 rounded-full transition-all duration-300
                ${activeFilter === category.id 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'border-border hover:border-primary hover:bg-primary/10'
                }
              `}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
              {filteredProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* No Projects Message */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No projects found for this category. Check back soon!
                </p>
              </div>
            )}
          </>
        )}

        {/* View More Button */}
        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg transition-all duration-300 hover-glow"
          >
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;