import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Upload, Camera } from 'lucide-react';
import { useOfficers, type Officer } from '@/hooks/useOfficers';
import { toast } from 'sonner';

export default function OfficerManagement() {
  const { officers, loading, canManage, addOfficer, updateOfficer, deleteOfficer, uploadAvatar } = useOfficers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    bio: '',
    term_start: new Date().toISOString().split('T')[0]
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      email: '',
      bio: '',
      term_start: new Date().toISOString().split('T')[0]
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditingOfficer(null);
  };

  const handleEdit = (officer: Officer) => {
    setEditingOfficer(officer);
    setFormData({
      name: officer.name,
      role: officer.role,
      email: officer.email,
      bio: officer.bio || '',
      term_start: officer.term_start
    });
    setAvatarPreview(officer.avatar_url);
    setDialogOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    setUploading(true);
    try {
      let avatarUrl = editingOfficer?.avatar_url || null;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const officerData = {
        ...formData,
        role: formData.role as 'President' | 'Auditor' | 'Secretary',
        avatar_url: avatarUrl
      };

      if (editingOfficer) {
        await updateOfficer(editingOfficer.id, officerData);
      } else {
        await addOfficer(officerData);
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canManage) return;
    await deleteOfficer(id);
  };

  if (!canManage) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Officer Management</h2>
          <p className="text-muted-foreground">Manage SBO officer profiles and information</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Officer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingOfficer ? 'Edit Officer' : 'Add New Officer'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Profile Picture</Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback className="bg-sbo-blue-light text-sbo-blue">
                      <Camera className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label htmlFor="avatar">
                      <Button type="button" variant="outline" className="cursor-pointer" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Position *</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="President">President</SelectItem>
                      <SelectItem value="Auditor">Auditor</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="officer@sbo.edu"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="term_start">Term Start Date</Label>
                  <Input
                    id="term_start"
                    type="date"
                    value={formData.term_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, term_start: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Enter officer biography and background..."
                  rows={4}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                >
                  {uploading ? 'Saving...' : editingOfficer ? 'Update Officer' : 'Add Officer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officers.map((officer) => (
          <Card key={officer.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Officer Header */}
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarImage src={officer.avatar_url || undefined} />
                    <AvatarFallback className="bg-sbo-blue-light text-sbo-blue text-lg">
                      {officer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg text-foreground">{officer.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {officer.role}
                  </Badge>
                </div>

                {/* Officer Info */}
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Email:</span> {officer.email}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Term:</span> {new Date(officer.term_start).getFullYear()} - {new Date(officer.term_start).getFullYear() + 1}
                  </p>
                  {officer.bio && (
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                      {officer.bio}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(officer)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Officer</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {officer.name} from the officer list? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(officer.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {officers.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-sbo-blue-light rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-sbo-blue" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">No Officers Added</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first SBO officer</p>
        </div>
      )}
    </div>
  );
}