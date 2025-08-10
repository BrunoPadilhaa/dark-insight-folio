import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date_earned: string;
  badge_image?: string;
  verification_link?: string;
  display_order: number;
}

interface CertificationFormProps {
  certification?: Certification | null;
  onClose: () => void;
}

const CertificationForm = ({ certification, onClose }: CertificationFormProps) => {
  const [formData, setFormData] = useState<Certification>({
    name: '',
    issuer: '',
    date_earned: '',
    badge_image: '',
    verification_link: '',
    display_order: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (certification) {
      setFormData(certification);
      if (certification.badge_image) {
        setImagePreview(certification.badge_image);
      }
    }
  }, [certification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('certification-badges')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('certification-badges')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload badge image');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let badgeImageUrl = formData.badge_image;

      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          badgeImageUrl = uploadedUrl;
        }
      }

      const certificationData = {
        ...formData,
        badge_image: badgeImageUrl,
      };

      if (certification?.id) {
        // Update existing certification
        const { error } = await supabase
          .from('certifications')
          .update(certificationData)
          .eq('id', certification.id);

        if (error) throw error;
        toast.success('Certification updated successfully!');
      } else {
        // Create new certification
        const { error } = await supabase
          .from('certifications')
          .insert([certificationData]);

        if (error) throw error;
        toast.success('Certification created successfully!');
      }

      onClose();
    } catch (error) {
      console.error('Error saving certification:', error);
      toast.error('Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">
            {certification?.id ? 'Edit Certification' : 'Add New Certification'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Certification Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Microsoft Power BI Data Analyst Associate"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer" className="text-foreground">Issuing Organization *</Label>
                <Input
                  id="issuer"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Microsoft"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_earned" className="text-foreground">Date Earned *</Label>
                <Input
                  id="date_earned"
                  name="date_earned"
                  type="date"
                  value={formData.date_earned}
                  onChange={handleInputChange}
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order" className="text-foreground">Display Order</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification_link" className="text-foreground">Verification Link (Optional)</Label>
              <Input
                id="verification_link"
                name="verification_link"
                type="url"
                value={formData.verification_link}
                onChange={handleInputChange}
                placeholder="https://credentials.example.com/verify/..."
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge_image" className="text-foreground">Badge Image</Label>
              <Input
                id="badge_image"
                name="badge_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-background border-border text-foreground"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Badge preview"
                    className="w-20 h-20 object-contain rounded border border-border"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {certification?.id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {certification?.id ? 'Update Certification' : 'Create Certification'}
                  </>
                )}
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
};

export default CertificationForm;