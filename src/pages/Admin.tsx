import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Settings, LogOut, Users, MapPin, CreditCard, BarChart3, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useReservations } from '@/hooks/useReservations';
import { useVenues, useCourts } from '@/hooks/useVenues';

const statusColors = {
  HOLD: 'bg-warning/20 text-warning border-warning/30',
  PENDING: 'bg-info/20 text-info border-info/30',
  PAID: 'bg-success/20 text-success border-success/30',
  CANCELLED: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusLabels = {
  HOLD: 'En espera',
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  CANCELLED: 'Cancelado',
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { data: reservations } = useReservations();
  const { data: venues } = useVenues();
  const { data: courts } = useCourts();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const todayReservations = reservations?.filter(r => r.date === format(new Date(), 'yyyy-MM-dd')) || [];
  const pendingPayments = reservations?.filter(r => r.status === 'PENDING') || [];
  const paidThisMonth = reservations?.filter(r => r.status === 'PAID' && r.date.startsWith(format(new Date(), 'yyyy-MM'))) || [];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-xl">RC</span>
          </div>
          <span className="font-display font-bold">Admin Panel</span>
        </div>

        <nav className="space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/admin/reservas" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
            <Calendar size={20} />
            Reservas
          </Link>
          <Link to="/admin/sedes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
            <MapPin size={20} />
            Sedes
          </Link>
          <Link to="/admin/reportes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
            <BarChart3 size={20} />
            Reportes
          </Link>
          <Link to="/admin/ajustes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
            <Settings size={20} />
            Ajustes
          </Link>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut size={20} className="mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Reservas Hoy</p>
                    <p className="text-2xl font-bold">{todayReservations.length}</p>
                  </div>
                  <Calendar className="text-primary" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pendientes de Pago</p>
                    <p className="text-2xl font-bold text-warning">{pendingPayments.length}</p>
                  </div>
                  <AlertCircle className="text-warning" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pagadas este mes</p>
                    <p className="text-2xl font-bold text-success">{paidThisMonth.length}</p>
                  </div>
                  <CheckCircle className="text-success" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Canchas Activas</p>
                    <p className="text-2xl font-bold">{courts?.length || 0}</p>
                  </div>
                  <Users className="text-primary" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent reservations */}
          <Card>
            <CardHeader>
              <CardTitle>Últimas Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reservations?.slice(0, 10).map(reservation => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{reservation.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{reservation.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(reservation.date), "d MMM", { locale: es })} - {reservation.start_time.slice(0, 5)}
                      </p>
                      <Badge className={statusColors[reservation.status]}>
                        {statusLabels[reservation.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
