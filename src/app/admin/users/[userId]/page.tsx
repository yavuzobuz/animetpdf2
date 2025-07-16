"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

interface UserDetail {
  id: string;
  email: string;
  full_name?: string | null;
  created_at: string;
  plan_name?: string;
  is_blocked?: boolean;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userId } = params as { userId: string };

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [creditsToAdd, setCreditsToAdd] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/user/${userId}`);
        const json = await res.json();
        if (res.ok) {
          setUser(json.data.user);
          setProjects(json.data.projects);
          setTickets(json.data.tickets);
          setStats(json.data.stats);
        } else {
          toast({ variant: "destructive", title: "Hata", description: json.error });
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Hata", description: "Veri alınamadı" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleUserAction = async (action: string, extraData?: any) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, ...extraData }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Başarılı', description: data.message });
        // Kullanıcı verilerini yeniden yükle
        const res = await fetch(`/api/admin/user/${userId}`);
        const json = await res.json();
        if (res.ok) {
          setUser(json.data.user);
          setProjects(json.data.projects);
          setTickets(json.data.tickets);
        }
      } else {
        toast({ variant: 'destructive', title: 'Hata', description: data.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Button 
            variant="default" 
            size="default"
            onClick={() => router.push('/tr/admin')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold shadow-md"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Admin Dashboard'a Dön
          </Button>
        </div>
        <p>Kullanıcı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sabit Nav Header */}
      <div className="sticky top-0 z-0 bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="container mx-auto">
          {/* Header içeriği boş bırakıldı, buton aşağıda sabitleniyor */}
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="p-6">
        <div className="container mx-auto">
          {/* Sabit Geri Butonu – navbar’ın hemen altında */}
          <div className="sticky top-[73px] z-40 bg-transparent pt-2 pb-4">
            <Button
              variant="default"
              size="default"
              onClick={() => router.push('/tr/admin')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold shadow-md"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Admin Dashboard'a Dön
            </Button>
          </div>

          <h1 className="text-2xl font-bold mb-6">{user.email} detayları</h1>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="info">Kullanıcı</TabsTrigger>
              <TabsTrigger value="projects">Projeler</TabsTrigger>
              <TabsTrigger value="tickets">Talepler</TabsTrigger>
              <TabsTrigger value="actions">İşlemler</TabsTrigger>
              <TabsTrigger value="stats">İstatistikler</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Kullanıcı Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                      {user.full_name && (
                        <TableRow>
                          <TableHead>İsim</TableHead>
                          <TableCell>{user.full_name}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableCell>{user.plan_name || 'Free'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Durum</TableHead>
                        <TableCell>
                          <Badge variant={user.is_blocked ? "destructive" : "default"}>
                            {user.is_blocked ? "Bloklu" : "Aktif"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Kayıt Tarihi</TableHead>
                        <TableCell>{new Date(user.created_at).toLocaleDateString("tr-TR")}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projeler</CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <p>Bu kullanıcıya ait proje bulunamadı.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Başlık</TableHead>
                          <TableHead>Tür</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead>Tarih</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>{p.title}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {p.project_type === "pdf" ? "PDF" : "Animasyon"}
                              </Badge>
                            </TableCell>
                            <TableCell>{p.status}</TableCell>
                            <TableCell>{new Date(p.created_at).toLocaleDateString("tr-TR")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>Talepler</CardTitle>
                </CardHeader>
                <CardContent>
                  {tickets.length === 0 ? (
                    <p>Talim bulunamadı.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Konu</TableHead>
                          <TableHead>Mesaj</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead>Tarih</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell>{t.subject}</TableCell>
                            <TableCell className="truncate max-w-[300px]" title={t.message}>
                              {t.message}
                            </TableCell>
                            <TableCell>
                              <Badge variant={t.status === "closed" ? "secondary" : "default"}>{t.status}</Badge>
                            </TableCell>
                            <TableCell>{new Date(t.created_at).toLocaleDateString("tr-TR")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Kullanıcı İstatistikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats ? (
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableHead>Dönüştürülen PDF'ler</TableHead>
                          <TableCell>{stats.converted_pdfs}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Oluşturulan Animasyonlar</TableHead>
                          <TableCell>{stats.created_animations}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Toplam İndirmeler</TableHead>
                          <TableCell>{stats.total_downloads}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Depolama Kullanımı (MB)</TableHead>
                          <TableCell>{stats.storage_used}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Aylık PDF Sayısı</TableHead>
                          <TableCell>{stats.monthly_pdf_count} / {stats.monthly_limit}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <p>İstatistikler bulunamadı.</p>
                  )}
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
                    <Input
                      type="number"
                      placeholder="Kredi sayısı"
                      value={creditsToAdd}
                      onChange={(e) => setCreditsToAdd(e.target.value)}
                    />
                    <Button 
                      onClick={() => {
                        if (creditsToAdd) {
                          handleUserAction('addCredits', { credits: parseInt(creditsToAdd) });
                          setCreditsToAdd('');
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
                    <div className="text-sm text-gray-600 mb-2">
                      Mevcut Plan: <Badge>{user?.plan_name || 'Free'}</Badge>
                    </div>
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
                        if (selectedPlan) {
                          handleUserAction('changePlan', { planName: selectedPlan });
                          setSelectedPlan('');
                        }
                      }} 
                      className="w-full"
                    >
                      Plan Değiştir
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kullanıcı Yönetimi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant={user.is_blocked ? "default" : "destructive"} 
                      onClick={() => handleUserAction(user.is_blocked ? 'unblock' : 'block')} 
                      className="w-full"
                    >
                      {user.is_blocked ? 'Engeli Kaldır' : 'Kullanıcıyı Engelle'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
                          handleUserAction('delete');
                        }
                      }} 
                      className="w-full"
                    >
                      Kullanıcıyı Sil
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}