import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { X, Upload, ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  console.log('ProjectForm rendering with project:', project);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'power-bi',
    tags: '',
    image: '',
    link: '',
    github: '',
    featured: false,
    has_details: false,
    details_content: '',
    details_images: [] as string[],
    published: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [quillRef, setQuillRef] = useState<ReactQuill | null>(null);

  // Prevent modal from closing when navigating away or switching tabs
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    // Show confirmation dialog when trying to navigate away
    e.preventDefault();
    e.returnValue = 'You have unsaved changes in the project form. Are you sure you want to leave?';
    return 'You have unsaved changes in the project form. Are you sure you want to leave?';
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent ESC key from closing modal accidentally
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

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
        has_details: project.has_details,
        details_content: project.details_content || '',
        details_images: project.details_images || [],
        published: project.published,
      });
      setImagePreview(project.image || '');
    }

    // Add event listeners to prevent modal from closing unexpectedly
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, handleBeforeUnload, handleKeyDown]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const uploadContentImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading content image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if a new one was selected
      const finalImageUrl = await uploadImage();
      if (imageFile && !finalImageUrl) {
        return; // Upload failed, don't proceed
      }

      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        image: finalImageUrl || null,
        link: formData.link || null,
        github: formData.github || null,
        featured: formData.featured,
        has_details: formData.has_details,
        details_content: formData.details_content || null,
        details_images: formData.details_images,
        published: formData.published,
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
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        // Prevent modal from closing when clicking outside
        e.stopPropagation();
      }}
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{project ? 'Edit Project' : 'Add New Project'}</CardTitle>
              <CardDescription>
                {project ? 'Update project details' : 'Create a new portfolio project'}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Are you sure you want to close? Any unsaved changes will be lost.')) {
                  onClose();
                }
              }}
            >
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
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="data-analysis">Data Analysis</SelectItem>
                  <SelectItem value="machine-learning">Machine Learning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
              <Label htmlFor="image">Project Image</Label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Button>
                  {!imagePreview && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm">No image selected</span>
                    </div>
                  )}
                </div>
                <Input
                  id="image-url"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image: e.target.value }));
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Or enter image URL"
                  className="text-sm"
                />
              </div>
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_details"
                checked={formData.has_details}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, has_details: checked as boolean }))
                }
              />
              <Label htmlFor="has_details">Has detailed page</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, published: checked as boolean }))
                }
              />
              <Label htmlFor="published">Published (visible to public)</Label>
            </div>

            {formData.has_details && (
              <>
                  <div className="space-y-2">
                    <Label htmlFor="details_content">Project Details</Label>
                    <div className="border border-border rounded-lg overflow-hidden bg-background">
                      <ReactQuill
                        ref={(ref) => setQuillRef(ref)}
                        value={formData.details_content}
                        onChange={(value, delta, source, editor) => {
                          setFormData(prev => ({ ...prev, details_content: value }));
                        }}
                        style={{ 
                          height: '400px', 
                          marginBottom: '42px',
                        }}
                        modules={{
                          toolbar: {
                            container: [
                              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                              [{ 'font': [] }],
                              [{ 'size': ['small', false, 'large', 'huge'] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'color': [] }, { 'background': [] }],
                              [{ 'script': 'sub'}, { 'script': 'super' }],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                              [{ 'indent': '-1'}, { 'indent': '+1' }],
                              [{ 'direction': 'rtl' }],
                              [{ 'align': [] }],
                              ['link', 'image', 'video'],
                              ['blockquote', 'code-block'],
                              ['clean']
                            ],
                            handlers: {
                              image: () => {
                                const input = document.createElement('input');
                                input.setAttribute('type', 'file');
                                input.setAttribute('accept', 'image/*');
                                input.click();
                                
                                input.onchange = async () => {
                                  const file = input.files?.[0];
                                  if (file && quillRef) {
                                    setUploading(true);
                                    try {
                                      const imageUrl = await uploadContentImage(file);
                                      if (imageUrl) {
                                        const quill = quillRef.getEditor();
                                        const range = quill.getSelection();
                                        const index = range ? range.index : quill.getLength();
                                        quill.insertEmbed(index, 'image', imageUrl);
                                        quill.setSelection(index + 1, 0);
                                      }
                                    } catch (error) {
                                      console.error('Error inserting image:', error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to insert image",
                                        variant: "destructive",
                                      });
                                    } finally {
                                      setUploading(false);
                                    }
                                  }
                                };
                              }
                            }
                          },
                          clipboard: {
                            matchVisual: false
                          }
                        }}
                        formats={[
                          'header', 'font', 'size',
                          'bold', 'italic', 'underline', 'strike',
                          'color', 'background', 'script',
                          'list', 'bullet', 'check', 'indent',
                          'direction', 'align',
                          'link', 'image', 'video',
                          'blockquote', 'code-block'
                        ]}
                        theme="snow"
                        placeholder="Write your project details here. Use the toolbar to format text and add images..."
                      />
                    </div>
                    {uploading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span>Uploading image...</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Use the rich text editor above to format your content. Click the image icon in the toolbar to add images directly to your content.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <strong>Formatting Tips:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Use headers (H1-H6) to structure your content</li>
                          <li>Bold, italic, and underline text for emphasis</li>
                          <li>Create bulleted and numbered lists</li>
                          <li>Add links and images using the toolbar</li>
                          <li>Use code blocks for technical content</li>
                        </ul>
                      </div>
                    </div>
                </div>
              </>
            )}

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