// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// async function testQuery() {
//   try {
//     // Aquí va tu consulta SQL para probar
//     const result = await prisma.$queryRaw`
//       SELECT
//   cg.*,
//   crs.*,
//   rs.*
// FROM
//   cuenta_google cg
// LEFT JOIN
//   cuenta_red_social crs ON crs.cuenta_google_id = cg.id
// LEFT JOIN
//   red_social rs ON rs.id = crs.red_social_id
// WHERE
//   cg.dispositivo_id = 15
// LIMIT 1
//       `;
//     console.log(result);
//   } catch (error) {
//     console.error('Error ejecutando la consulta:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// testQuery();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCuentaGoogleQuery() {
  try {
    // Usa un ID de dispositivo válido de tu base de datos
    const dispositivoId = 15; // Reemplaza este valor con un ID real

    const cuentaGoogle = await prisma.cuenta_google.findFirst({
      where: { dispositivo_id: dispositivoId },
      include: {
        cuenta_red_social: {
          include: {
            red_social: true,
          },
        },
      },
    });

    console.log('Resultado:', JSON.stringify(cuentaGoogle, null, 2));
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCuentaGoogleQuery();
