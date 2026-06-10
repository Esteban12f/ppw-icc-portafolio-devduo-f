/**
 * set-custom-claims.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Script para asignar el Custom Claim `role: 'programador'` a los usuarios
 * programadores en Firebase Authentication.
 *
 * ¿Por qué Custom Claims?
 * - Son parte del JWT token y están disponibles en Firestore Security Rules.
 * - Permiten aplicar lógica de roles sin consultar la base de datos.
 * - Son verificables en el cliente con user.getIdTokenResult().
 *
 * INSTRUCCIONES:
 * 1. Instala dependencias:
 *      npm install firebase-admin
 *
 * 2. Descarga la clave de servicio de Firebase:
 *    Firebase Console → Proyecto → Configuración → Cuentas de servicio
 *    → Generar nueva clave privada → Guarda como `serviceAccountKey.json`
 *    en la misma carpeta que este script.
 *
 * 3. Asegúrate de que los programadores ya tienen cuentas registradas
 *    en Firebase Authentication (con los emails indicados).
 *
 * 4. Ejecuta:
 *      node set-custom-claims.js
 *
 * 5. Los usuarios deben CERRAR SESIÓN y VOLVER A INICIAR SESIÓN para que
 *    el nuevo claim sea cargado en su token.
 *    (Alternativamente, llama a authService.refreshRole() en el cliente.)
 * ──────────────────────────────────────────────────────────────────────────────
 */

const admin = require('firebase-admin');

// Ajusta la ruta si el archivo JSON tiene otro nombre o está en otro directorio
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/** Correos de los programadores — deben coincidir con Firebase Auth y con Strapi */
const PROGRAMADOR_EMAILS = [
  'joehv33@gmail.com',
  'alexpaucar.887@gmail.com'
];

async function setProgramadorClaims() {
  console.log('\n Asignando Custom Claims de Programador...\n');

  for (const email of PROGRAMADOR_EMAILS) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'programador' });
      console.log(`claim 'programador' asignado a ${email} (uid: ${userRecord.uid})`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`Usuario no encontrado: ${email}`);
        console.log(`Asegúrate de que el programador se haya registrado con ese correo.`);
      } else {
        console.error(`Error para ${email}:`, error.message);
      }
    }
  }

  console.log('\n✅ Proceso completado.');
  console.log('📌 Recuerda: los programadores deben cerrar sesión y volver a entrar');
  console.log('   para que el nuevo claim sea efectivo en su token.\n');
  process.exit(0);
}

setProgramadorClaims();