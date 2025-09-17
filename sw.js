
// sw.js - Service Worker corregido
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
    self.skipWaiting(); // Activa inmediatamente
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
    event.waitUntil(self.clients.claim()); // Toma control de todas las páginas
});

// Manejar notificaciones push - VERSIÓN CORREGIDA
self.addEventListener('push', (event) => {
    console.log('Evento push recibido:', event);

    let title = 'Notificación';
    let body = 'Tienes una nueva notificación';
    let icon = 'https://via.placeholder.com/64/3498db/ffffff?text=Push';
    let tag = 'push-notification';

    try {
        // Intentar parsear como JSON primero
        if (event.data) {
            try {
                const data = event.data.json();
                title = data.title || title;
                body = data.body || body;
                icon = data.icon || icon;
                tag = data.tag || tag;
            } catch (jsonError) {
                // Si falla el JSON, intentar como texto plano
                console.log('No es JSON, intentando como texto:', jsonError);
                const text = event.data.text();
                title = 'Mensaje';
                body = text || body;
            }
        }
    } catch (error) {
        console.error('Error procesando datos push:', error);
        body = 'Nueva notificación recibida';
    }

    const options = {
        body: body,
        icon: icon,
        tag: tag,
        badge: 'https://via.placeholder.com/32/3498db/ffffff?text=!',
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'open',
                title: 'Abrir'
            },
            {
                action: 'close',
                title: 'Cerrar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('Notificación clickeada:', event);
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('https://hetziel.github.io/push/')
        );
    } else if (event.action === 'close') {
        // Solo cerrar la notificación (ya se cerró arriba)
    } else {
        // Clic en el cuerpo de la notificación
        event.waitUntil(
            clients.openWindow('https://hetziel.github.io/push/')
        );
    }
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
    console.log('Notificación cerrada:', event);
});

// Manejar errores de notificaciones
self.addEventListener('pushsubscriptionchange', (event) => {
    console.log('Suscripción push cambiada:', event);
});