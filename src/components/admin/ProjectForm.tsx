import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

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
  display_order: number;
}

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'power-bi',
    tags: '',
    image: '',
    link: '',
    github: '',
    featured: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        tags: project.tags.join(', '),
        image: project.image || '',
        link: project.link || '',
        github: project.github || '',
        featured: project.featured,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        image: formData.image || null,
        link: formData.link || null,
        github: formData.github || null,
        featured: formData.featured,
      };

      if (project) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        // Get the highest display_order and add 1
        const { data: lastProject } = await supabase
          .from('projects')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1);

        const newDisplayOrder = lastProject && lastProject[0] 
          ? lastProject[0].display_order + 1 
          : 1;

        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert({
            ...projectData,
            display_order: newDisplayOrder,
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${project ? 'update' : 'create'} project`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{project ? 'Edit Project' : 'Add New Project'}</CardTitle>
              <CardDescription>
                {project ? 'Update project details' : 'Create a new portfolio project'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Project title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Project description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="power-bi">Power BI</SelectItem>
                  <SelectItem value="dbt">dbt</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Power BI, Analytics, Dashboard"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="/src/assets/project-image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Live Demo Link</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://app.powerbi.com/your-dashboard"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub Repository</Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, featured: checked as boolean }))
                }
              />
              <Label htmlFor="featured">Featured project</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}