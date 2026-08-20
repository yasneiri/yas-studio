# Yas Studio — reconstrucción completa

Proyecto Next.js 14 completo, listo para subir a GitHub y desplegar en Coolify.
Todos los archivos incluidos (config, Docker, API routes, componentes).

## Model IDs corregidos (verificados contra docs.kie.ai)

| Antes (roto) | Ahora (correcto) |
|---|---|
| `bytedance/seedance-2.5` | `bytedance/seedance-2-5` |
| `bytedance/seedance-1-5-pro` | `bytedance/seedance-1.5-pro` |
| `kling/v3-standard-text-to-video` | `kling-3.0/video` |
| `kling/v2-6-text-to-video` | `kling-2.6/text-to-video` |
| `kling/v2-6-image-to-video` | `kling-2.6/image-to-video` |
| `kling/motion-control-v3` | `kling-3.0/motion-control` |
| `kling/motion-control` | `kling-2.6/motion-control` |
| `kling/v3-omni-*` | `kling-3.0/omni-*` |
| `gpt-image/gpt-image-2-*` | `gpt-image-2-*` |

Regla del prefijo Kling en kie.ai:
- Kling 3.0 core / Omni / motion-control → prefijo `kling-3.0/`
- Kling 2.6 core / motion-control → prefijo `kling-2.6/`
- Kling V3 Turbo y Avatar → prefijo `kling/`

## Bugs de API corregidos

1. **Créditos no cargaban** — el endpoint era `/api/v1/user/credits` (no existe).
   Corregido al oficial: `/api/v1/chat/credit`.
2. **Estado de fallo** — el frontend buscaba `state === "failed"` pero kie.ai
   devuelve `fail`. Ahora acepta `fail`/`failed`/`error` (case-insensitive).
3. **Status route** — extracción de URLs más robusta (resultUrls, video_url,
   image_url, arrays anidados) + soporte de `successFlag` para Veo.
4. **Generate route** — ahora reporta el `msg` de error real de kie.ai.

## Dockerfile

- Copia `package-lock.json` (antes solo package.json → riesgo de fallo con React Flow).
- Heap de build subido a 2560MB (React Flow pesa más).

## Todas las plantillas usan IDs 100% verificados

seedance-2-5, seedance-2, seedance-2-fast, kling-3.0/video,
kling/ai-avatar-pro, veo3_quality, wan/2-7-text-to-video.

## Deploy en Coolify

1. Sube todos estos archivos a `github.com/yasneiri/yas-studio` (reemplaza todo).
2. En Coolify: Actions → Deploy.
3. Abre la app → Settings → pega tu API key de kie.ai.
4. Video → elige Seedance 2.0 Fast → prompt corto → Generate.
