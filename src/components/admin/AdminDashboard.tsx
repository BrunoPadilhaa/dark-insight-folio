import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Edit2, Trash2, LogOut, ArrowUp, ArrowDown } from 'lucide-react';
import ProjectForm from './ProjectForm';

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

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      
      fetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentProject = projects.find(p => p.id === id);
    if (!currentProject) return;

    const newOrder = direction === 'up' 
      ? currentProject.display_order - 1
      : currentProject.display_order + 1;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder project",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'power-bi': return 'bg-yellow-500/20 text-yellow-300';
      case 'dbt': return 'bg-green-500/20 text-green-300';
      case 'sql': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your BI portfolio projects</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Project
              </Button>
              <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Resume Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resume Management</CardTitle>
            <CardDescription>Upload your resume (PDF format)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    // Delete existing resume first
                    const { data: existingFiles } = await supabase.storage
                      .from('resumes')
                      .list('');
                    
                    if (existingFiles && existingFiles.length > 0) {
                      await supabase.storage
                        .from('resumes')
                        .remove(existingFiles.map(f => f.name));
                    }

                    // Upload new resume
                    const { error } = await supabase.storage
                      .from('resumes')
                      .upload('resume.pdf', file, {
                        upsert: true
                      });

                    if (error) throw error;

                    toast({
                      title: "Success",
                      description: "Resume uploaded successfully",
                    });
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to upload resume",
                      variant: "destructive",
                    });
                  }
                }}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-sm text-muted-foreground">
                Upload a PDF file. This will replace any existing resume.
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      {project.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      <Badge className={getCategoryColor(project.category)}>
                        {project.category.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(project.id, 'up')}
                      disabled={project.display_order === 1}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(project.id, 'down')}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                {(project.link || project.github) && (
                  <div className="mt-4 space-y-1 text-sm">
                    {project.link && (
                      <div className="text-muted-foreground">
                        Live: <span className="text-primary">{project.link}</span>
                      </div>
                    )}
                    {project.github && (
                      <div className="text-muted-foreground">
                        GitHub: <span className="text-primary">{project.github}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No projects found. Create your first project!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}