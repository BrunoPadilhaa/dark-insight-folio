import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, LogOut, ChevronUp, ChevronDown, Home, Award, Eye, EyeOff, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import CertificationForm from './CertificationForm';
import AboutContentForm from './AboutContentForm';

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
  has_details: boolean;
  details_content?: string;
  details_images?: string[];
  published: boolean;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date_earned: string;
  badge_image?: string;
  verification_link?: string;
  display_order: number;
}

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [showAboutContentForm, setShowAboutContentForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'certifications'>('projects');

  // Check for edit parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      const projectToEdit = projects.find(p => p.id === editId);
      if (projectToEdit) {
        handleEdit(projectToEdit);
      }
      // Clear the URL parameter
      window.history.replaceState({}, '', '/admin/dashboard');
    }
  }, [projects]);

  useEffect(() => {
    fetchProjects();
    fetchCertifications();
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
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      toast.error('Failed to fetch certifications');
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
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentProject = projects.find(p => p.id === id);
    if (!currentProject) return;

    const newOrder = direction === 'up' 
      ? Math.max(0, currentProject.display_order - 1)
      : currentProject.display_order + 1;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error reordering project:', error);
      toast.error('Failed to reorder project');
    }
  };

  const handleEdit = (project: Project) => {
    console.log('Edit button clicked, project:', project);
    setEditingProject(project);
    setShowProjectForm(true);
    console.log('showProjectForm set to true');
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Project ${!currentStatus ? 'published' : 'hidden'} successfully`);
      fetchProjects();
    } catch (error) {
      console.error('Error toggling project visibility:', error);
      toast.error('Failed to update project visibility');
    }
  };

  const handleCloseForm = () => {
    setShowProjectForm(false);
    setShowCertificationForm(false);
    setShowAboutContentForm(false);
    setEditingProject(null);
    setEditingCertification(null);
  };

  const handleDeleteCertification = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        const { error } = await supabase
          .from('certifications')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Certification deleted successfully');
        fetchCertifications();
      } catch (error) {
        console.error('Error deleting certification:', error);
        toast.error('Failed to delete certification');
      }
    }
  };

  const handleReorderCertification = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = certifications.findIndex(cert => cert.id === id);
    const newOrder = direction === 'up' ? 
      Math.max(0, certifications[currentIndex].display_order - 1) :
      certifications[currentIndex].display_order + 1;

    try {
      const { error } = await supabase
        .from('certifications')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      fetchCertifications();
    } catch (error) {
      console.error('Error reordering certification:', error);
      toast.error('Failed to reorder certification');
    }
  };

  const handleEditCertification = (certification: Certification) => {
    setEditingCertification(certification);
    setShowCertificationForm(true);
  };

  const handleCloseCertificationForm = () => {
    setShowCertificationForm(false);
    setEditingCertification(null);
    fetchCertifications();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'power-bi': return 'bg-yellow-500/20 text-yellow-300';
      case 'dbt': return 'bg-green-500/20 text-green-300';
      case 'sql': return 'bg-blue-500/20 text-blue-300';
      case 'python': return 'bg-blue-600/20 text-blue-400';
      case 'web-development': return 'bg-purple-500/20 text-purple-300';
      case 'data-analysis': return 'bg-teal-500/20 text-teal-300';
      case 'machine-learning': return 'bg-pink-500/20 text-pink-300';
      case 'other': return 'bg-indigo-500/20 text-indigo-300';
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
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'projects' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-secondary-foreground hover:text-foreground'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('certifications')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'certifications' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-secondary-foreground hover:text-foreground'
                  }`}
                >
                  Certifications
                </button>
              </div>
              <Button
                onClick={() => {
                  if (activeTab === 'projects') {
                    setShowProjectForm(true);
                  } else {
                    setShowCertificationForm(true);
                  }
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab === 'projects' ? 'Project' : 'Certification'}
              </Button>
              <Button
                onClick={() => setShowAboutContentForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Edit About Content
              </Button>
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Main Page
                </Button>
              </Link>
              <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Content based on active tab */}
        {activeTab === 'projects' ? (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Resume Management</h2>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log('Resume file selected:', file.name);
                    toast.success('Resume upload feature coming soon!');
                  }
                }}
                className="bg-background border border-border rounded-md p-2 text-foreground"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Projects ({projects.length})</h2>
              
              {projects.length === 0 ? (
                <div className="text-center py-8 bg-card border border-border rounded-lg">
                  <p className="text-muted-foreground">No projects found. Create your first project!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                              {project.featured && (
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  Featured
                                </Badge>
                              )}
                              {!project.published && (
                                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                                  Unpublished
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.tags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary" 
                                  className={getCategoryColor(project.category)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePublished(project.id, project.published)}
                              className={`border-border hover:border-primary ${
                                project.published ? 'text-green-600' : 'text-orange-600'
                              }`}
                              title={project.published ? 'Hide project' : 'Show project'}
                            >
                              {project.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReorder(project.id, 'up')}
                              className="border-border hover:border-primary"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReorder(project.id, 'down')}
                              className="border-border hover:border-primary"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(project)}
                              className="border-border hover:border-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Certifications ({certifications.length})</h2>
            
            {certifications.length === 0 ? (
              <div className="text-center py-8 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">No certifications found. Add your first certification!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {certifications.map((cert) => (
                  <Card key={cert.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {cert.badge_image ? (
                            <img
                              src={cert.badge_image}
                              alt={`${cert.name} badge`}
                              className="w-16 h-16 object-contain"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                              <Award className="h-8 w-8 text-primary" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">{cert.name}</h3>
                            <p className="text-muted-foreground">{cert.issuer}</p>
                            <p className="text-sm text-muted-foreground">
                              Earned: {new Date(cert.date_earned).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            {cert.verification_link && (
                              <a 
                                href={cert.verification_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm"
                              >
                                View Verification
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReorderCertification(cert.id, 'up')}
                            className="border-border hover:border-primary"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReorderCertification(cert.id, 'down')}
                            className="border-border hover:border-primary"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCertification(cert)}
                            className="border-border hover:border-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCertification(cert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* About Content Form Modal */}
      {showAboutContentForm && <AboutContentForm onClose={handleCloseForm} />}

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm project={editingProject} onClose={handleCloseForm} />
      )}

      {/* Certification Form Modal */}
      {showCertificationForm && (
        <CertificationForm 
          certification={editingCertification} 
          onClose={handleCloseCertificationForm} 
        />
      )}
    </div>
  );
}