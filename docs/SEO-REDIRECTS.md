# SEO Redirects: WWW vs Non-WWW (Opcional)

Para mejorar el SEO, puedes elegir una versión canónica de tu dominio (con o sin `www`) y redirigir automáticamente la otra versión. **Esta funcionalidad es completamente opcional.**

## Recomendación: Sin WWW

En 2025, la tendencia es usar dominios **sin `www`** porque:
- Más cortos y fáciles de recordar
- Mejor experiencia en móviles
- Siguen la tendencia de sitios modernos (google.com, facebook.com, github.com)

## Configuración de Redirects

### 0. Habilitar soporte para ambos dominios (Opcional)

Si necesitas que tanto `www.yourdomain.com` como `yourdomain.com` funcionen temporalmente (durante migración o testing), agrega esta variable:

```bash
INCLUDE_WWW_VARIANT=true
```

⚠️ **Nota**: Esto es solo para casos especiales. Para SEO óptimo, usa solo una versión y redirige la otra.

### 1. Variables de entorno (Recomendado)

Configura tus variables de entorno para usar la versión **sin www**:

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
BETTER_AUTH_URL=https://yourdomain.com
```

### 2. Redirects automáticos en Next.js

En `next.config.mjs`, descomenta y personaliza esta configuración:

```javascript
async redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'www.yourdomain.com',  // Cambiar por tu dominio con www
        },
      ],
      destination: 'https://yourdomain.com/:path*',  // Cambiar por tu dominio sin www
      permanent: true, // 301 redirect para SEO
    },
  ]
},
```

### 3. Configuración en tu hosting

También asegúrate de que tu proveedor de hosting (Coolify, Vercel, etc.) tenga configurados ambos dominios:
- `yourdomain.com`
- `www.yourdomain.com`

## Funcionamiento

Con esta configuración:
- `https://www.yourdomain.com/any-path` → Redirige a `https://yourdomain.com/any-path`
- `https://yourdomain.com/any-path` → Se sirve directamente
- Google entenderá que `yourdomain.com` es tu dominio canónico
- Better Auth funcionará correctamente con ambos dominios durante la transición

## Verificación

Para verificar que funciona:
1. Visita `https://www.yourdomain.com`
2. Deberías ser redirigido automáticamente a `https://yourdomain.com`
3. La URL en el navegador debería cambiar
4. El código de respuesta HTTP debe ser 301 (permanent redirect)