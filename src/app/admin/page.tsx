'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { LogOut, Users, FolderKanban, TicketCheck, Activity, Shield, FileText, Play } from "lucide-react";
import { TicketReplyDialog } from '@/components/admin/ticket-reply-dialog';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [creditsToAdd, setCreditsToAdd] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, usersRes, projectsRes, ticketsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/tickets')
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.data);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.data);
      }
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.data);
      }
      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        setTickets(data.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Admin yetkisi gerekli.',
      });
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action: string, userId: string, extraData?: any) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, ...extraData }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Başarılı', description: data.message });
        loadData();
      } else {
        toast({ variant: 'destructive', title: 'Hata', description: data.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız.' });
    }
  };

  const handleProjectAction = async (action: string, projectId: string) => {
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, projectId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Başarılı', description: data.message });
        loadData();
      } else {
        toast({ variant: 'destructive', title: 'Hata', description: data.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız.' });
    }
  };

  const handleTicketAction = async (ticketId: string) => {
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close', ticketId })
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Başarılı', description: data.message });
        loadData();
      } else {
        toast({ variant: 'destructive', title: 'Hata', description: data.error });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız.' });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed', err);
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg">Admin paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => router.push('/')}>Ana Sayfa</Button>
            <Button variant="destructive" onClick={handleLogout}>Çıkış Yap</Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projeler</CardTitle>
                <FileText className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Animasyonlar</CardTitle>
                <Play className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAnimations}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bu Ay Yeni</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="projects">Projeler</TabsTrigger>
            <TabsTrigger value="tickets">Talepler</TabsTrigger>
            <TabsTrigger value="actions">İşlemler</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>PDF/Animasyon</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge>{user.plan_name}</Badge>
                        </TableCell>
                        <TableCell>{user.pdf_count}/{user.animation_count}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm(`${user.email} silinsin mi?`)) {
                                  handleUserAction('delete', user.id);
                                }
                              }}
                            >Sil</Button>
                            {user.is_blocked ? (
                              <Button size="sm" onClick={() => handleUserAction('unblock', user.id)}>Aç</Button>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => handleUserAction('block', user.id)}>Blok</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Proje Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tür</TableHead>
                      <TableHead>Başlık</TableHead>
                      <TableHead>Kullanıcı</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell><Badge variant="secondary">{project.project_type === 'pdf' ? 'PDF' : 'Animasyon'}</Badge></TableCell>
                        <TableCell>
                          <Button 
                            variant="link" 
                            className="p-0 max-w-[300px] text-left"
                            title={project.title}
                            onClick={() => router.push(`/projects/${project.id}`)}
                          >
                            {project.title.length > 50 ? `${project.title.slice(0, 47)}...` : project.title}
                          </Button>
                        </TableCell>
                        <TableCell>{project.user_email}</TableCell>
                        <TableCell>
                          <Badge variant={project.is_deleted ? 'destructive' : 'default'}>
                            {project.is_deleted ? 'Silindi' : project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(project.created_at).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>
                          {!project.is_deleted && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                if (confirm('Proje silinsin mi?')) {
                                  handleProjectAction('delete', project.id);
                                }
                              }}
                            >
                              Sil
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Destek Talepleri</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Konu</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mesaj</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead colSpan={2}>İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.subject}</TableCell>
                        <TableCell>{t.email}</TableCell>
                        <TableCell className="max-w-[300px] truncate" title={t.message}>{t.message}</TableCell>
                        <TableCell>
                          <Badge variant={t.status === 'closed' ? 'secondary' : 'default'}>{t.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(t.created_at).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {t.status === 'open' && (
                              <Button size="sm" onClick={() => handleTicketAction(t.id)}>Kapat</Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TicketReplyDialog 
                            ticketId={t.id} 
                            ticketSubject={t.subject} 
                            userEmail={t.email} 
                            onSuccess={() => loadData()}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kredi Ekle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kullanıcı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Kredi sayısı"
                    value={creditsToAdd}
                    onChange={(e) => setCreditsToAdd(e.target.value)}
                  />
                  <Button 
                    onClick={() => {
                      if (selectedUserId && creditsToAdd) {
                        handleUserAction('addCredits', selectedUserId, { credits: parseInt(creditsToAdd) });
                        setCreditsToAdd('');
                        setSelectedUserId('');
                      }
                    }} 
                    className="w-full"
                  >
                    Kredi Ekle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Değiştir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kullanıcı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email} ({user.plan_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Plan seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => {
                      if (selectedUserId && selectedPlan) {
                        handleUserAction('changePlan', selectedUserId, { planName: selectedPlan });
                        setSelectedPlan('');
                        setSelectedUserId('');
                      }
                    }} 
                    className="w-full"
                  >
                    Plan Değiştir
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}