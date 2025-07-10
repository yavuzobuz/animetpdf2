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
        <Button variant="link" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Geri Dön
        </Button>
        <p>Kullanıcı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto">
        <Button variant="link" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Geri Dön
        </Button>

        <h1 className="text-2xl font-bold mb-6">{user.email} detayları</h1>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Kullanıcı</TabsTrigger>
            <TabsTrigger value="projects">Projeler</TabsTrigger>
            <TabsTrigger value="tickets">Talepler</TabsTrigger>
            <TabsTrigger value="actions">İşlemler</TabsTrigger>
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
                      <TableCell>{user.plan_name}</TableCell>
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

          <TabsContent value="actions">
            {/* İşlemler sekmesi için basit placeholder */}
            <p>Bu bölümde kullanıcıya özel işlemler yapılabilir.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
