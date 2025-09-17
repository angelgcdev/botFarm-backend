import { Injectable } from '@nestjs/common';
// import { CreateDashboardDto } from './dto/create-dashboard.dto';
// import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // create(createDashboardDto: CreateDashboardDto) {
  //   return 'This action adds a new dashboard';
  // }

  getTotalFacebookCommentsForPersonal(user_id: number) {
    return this.prisma.facebook_interaction_history.count({
      where: {
        device: { user_id },
        NOT: [{ comment: null }, { comment: '' }],
      },
    });
  }

  getTotalFacebookSharesForPersonal(user_id: number) {
    return this.prisma.facebook_shared_group.count({
      where: {
        facebook_interaction_history: {
          device: { user_id },
        },
      },
    });
  }

  getTotalFacebookLikesForPersonal(user_id: number) {
    return this.prisma.facebook_interaction_history.count({
      where: {
        device: { user_id },
        liked: true,
      },
    });
  }

  getTotalFacebookInteractionsForPersonal(user_id: number) {
    return this.prisma.facebook_interaction_history.count({
      where: {
        device: { user_id },
      },
    });
  }

  getTotalTiktokSharesForPersonal(user_id: number) {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        device: { user_id },
        shared_on_facebook: true,
      },
    });
  }

  async getTotalClientsForDay(user_id: number, range: '7d' | '30d' | '90d') {
    // 1️⃣ Determinar fecha de inicio según el rango
    const referenceDate = new Date(); // hoy
    let daysToSubtract = 90;
    if (range === '30d') daysToSubtract = 30;
    else if (range === '7d') daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // 2️⃣ Traer registros del backend solo a partir de startDate
    const clients = await this.prisma.client.findMany({
      where: {
        user_id,
        created_at: {
          gte: startDate, // solo desde startDate
        },
      },
      select: { created_at: true },
      orderBy: { created_at: 'asc' },
    });

    // 3️⃣ Agrupar por fecha en JS
    const grouped: Record<string, number> = {};
    clients.forEach((c) => {
      const date = c.created_at.toISOString().split('T')[0]; // YYYY-MM-DD
      grouped[date] = (grouped[date] || 0) + 1;
    });

    // 4️⃣ Generar el array completo de fechas aunque no tengan clientes
    const result: { date: string; clients: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= referenceDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        clients: grouped[dateStr] || 0, // si no hay registros → 0
      });

      currentDate.setDate(currentDate.getDate() + 1); // pasar al siguiente día
    }

    return result;
  }

  async getTotalSalesForDay(user_id: number, range: '7d' | '30d' | '90d') {
    // 1️⃣ Determinar fecha de inicio según el rango
    const referenceDate = new Date(); // hoy
    let daysToSubtract = 90;
    if (range === '30d') daysToSubtract = 30;
    else if (range === '7d') daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // 2️⃣ Traer registros de ventas desde startDate
    const sales = await this.prisma.sale.findMany({
      where: {
        user_id,
        created_at: {
          gte: startDate,
        },
      },
      select: { total: true, created_at: true },
      orderBy: { created_at: 'asc' },
    });

    // 3️⃣ Agrupar por fecha en JS
    const grouped: Record<string, number> = {};
    sales.forEach((s) => {
      const date = s.created_at.toISOString().split('T')[0]; // YYYY-MM-DD
      grouped[date] = (grouped[date] || 0) + (s.total || 0); // sumar ventas
    });

    // 4️⃣ Generar array completo de fechas aunque no tengan ventas
    const result: { date: string; totalSales: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= referenceDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        totalSales: grouped[dateStr] || 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  async getOriginClients(user_id: number) {
    // 1️⃣ Traer todos los clientes y sus ventas
    const sales = await this.prisma.sale.findMany({
      where: { user_id },
      select: { client_origin: true },
    });

    // 2️⃣ Contar ventas por origen
    const counts: Record<string, number> = {
      tiktok: 0,
      facebook: 0,
      recomendacion: 0,
      otro: 0,
    };

    sales.forEach((sale) => {
      switch (sale.client_origin) {
        case 'TIKTOK':
          counts.tiktok++;
          break;
        case 'FACEBOOK':
          counts.facebook++;
          break;
        case 'RECOMENDACION':
          counts.recomendacion++;
          break;
        case 'OTRO':
          counts.otro++;
          break;
      }
    });

    // 3️⃣ Mapear a la estructura que espera el frontend
    const chartData = [
      {
        socialMedia: 'tiktok',
        totalClients: counts.tiktok,
      },
      {
        socialMedia: 'facebook',
        totalClients: counts.facebook,
      },
      {
        socialMedia: 'recomendacion',
        totalClients: counts.recomendacion,
        fill: '#9aedc4',
      },
      {
        socialMedia: 'otro',
        totalClients: counts.otro,
      },
    ];

    return chartData;
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  // update(id: number, updateDashboardDto: UpdateDashboardDto) {
  //   return `This action updates a #${id} dashboard`;
  // }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
