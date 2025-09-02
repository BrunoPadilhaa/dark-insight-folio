import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface AboutContent {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
}

interface AboutContentFormProps {
  onClose: () => void;
}

const AboutContentForm = ({ onClose }: AboutContentFormProps) => {
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      toast.error('Failed to load about content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (id: string, field: keyof AboutContent, value: string) => {
    setAboutContent(prev => 
      prev.map(content => 
        content.id === id ? { ...content, [field]: value } : content
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const content of aboutContent) {
        const { error } = await supabase
          .from('about_content')
          .update({
            title: content.title,
            subtitle: content.subtitle,
            content: content.content
          })
          .eq('id', content.id);

        if (error) throw error;
      }
      
      toast.success('About content updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating about content:', error);
      toast.error('Failed to update about content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Edit About Content</CardTitle>
            <CardDescription>
              Customize the text content in the About section
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {aboutContent.map((content) => (
            <div key={content.id} className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold text-lg capitalize">{content.section} Section</h3>
              
              {content.section === 'header' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`title-${content.id}`}>Title</Label>
                    <Input
                      id={`title-${content.id}`}
                      value={content.title || ''}
                      onChange={(e) => updateContent(content.id, 'title', e.target.value)}
                      placeholder="About Me"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`subtitle-${content.id}`}>Subtitle</Label>
                    <Textarea
                      id={`subtitle-${content.id}`}
                      value={content.subtitle || ''}
                      onChange={(e) => updateContent(content.id, 'subtitle', e.target.value)}
                      placeholder="Passionate about transforming data..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              {content.section === 'story' && (
                <div className="space-y-2">
                  <Label htmlFor={`content-${content.id}`}>Story Content</Label>
                  <Textarea
                    id={`content-${content.id}`}
                    value={content.content || ''}
                    onChange={(e) => updateContent(content.id, 'content', e.target.value)}
                    placeholder="Your professional story..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use double line breaks (\n\n) to separate paragraphs. HTML is allowed for styling.
                  </p>
                </div>
              )}

              {content.section === 'skills' && (
                <div className="space-y-2">
                  <Label htmlFor={`title-${content.id}`}>Skills Section Title</Label>
                  <Input
                    id={`title-${content.id}`}
                    value={content.title || ''}
                    onChange={(e) => updateContent(content.id, 'title', e.target.value)}
                    placeholder="Technical Skills"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutContentForm;