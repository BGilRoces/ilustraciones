# Ilustraciones

Biblioteca de ilustraciones animadas reutilizables para videos hechos con [HyperFrames](https://hyperframes.heygen.com) (HTML + GSAP renderizado a MP4).

Cada pieza es una sub-composición en `compositions/`. Un video nuevo se arma combinando piezas desde un `index.html`, sin copiar código.

## Catálogo

| Pieza | Archivo | Qué es | Tamaño |
|---|---|---|---|
| `campo` | `compositions/campo.html` | Cielo, sol, nubes, loma y pasto | 1080×1920 |
| `vaca` | `compositions/vaca.html` | Vaca con caravana en la oreja y ciclo de caminata (~3,2 s) | 620×430 |

## Cómo usar una pieza

En el `index.html` del video, cada pieza es un host con `data-composition-src`:

```html
<div id="campo" class="clip"
     data-composition-id="campo"
     data-composition-src="compositions/campo.html"
     data-start="0" data-duration="7.4" data-track-index="0"
     data-width="1080" data-height="1920"></div>
```

Reglas:

- El `data-composition-id` del host tiene que ser igual al de adentro del archivo de la pieza.
- Los `id` internos van con prefijo de la pieza (`vaca-tail`) para no chocar si se usa dos veces.
- Posición, tamaño y movimiento de la pieza en la escena se animan desde el `index.html` (ver `#cowWrap`). La animación propia de la pieza vive dentro de su archivo.

## Videos

Todos los videos comparten `compositions/`. El preview, el check y los snapshots de HyperFrames solo miran `index.html`, así que el repo funciona con un "video en curso" y una carpeta de videos guardados:

- `index.html`: el video en el que se está trabajando.
- `videos/<nombre>.html`: videos guardados.
- `renders/`: MP4 generados (no se suben a git).

```bash
npm run video:list                  # videos guardados
npm run video:save -- mi-video      # index.html -> videos/mi-video.html
npm run video:open -- mi-video      # videos/mi-video.html -> index.html (no pisa trabajo sin guardar; --force para pisar)
npm run video:render -- mi-video    # renderiza a renders/mi-video.mp4 sin tocar index.html
```

Para un video nuevo: guardá el actual con `video:save`, reemplazá `index.html` por el nuevo y seguí.

Ojo: si editás en Studio, los cambios van a `index.html`; guardalos con `video:save` antes de abrir otro video.

Videos guardados:

- `vaca-demo`: la vaca camina, zoom a la caravana, texto "Caravana electrónica".

## En otra computadora

```bash
git clone https://github.com/BGilRoces/ilustraciones.git
cd ilustraciones
npm run dev      # preview (descarga hyperframes la primera vez)
npm run check    # lint + layout + contraste
npm run render   # genera el MP4
```

Los renders (`*.mp4`) y la carpeta `.hyperframes/` no se suben. Las skills de HyperFrames se instalan por computadora: `npx hyperframes skills update`.

## Agregar piezas nuevas

1. Crear `compositions/<nombre>.html` con `<template>` (estilos, markup y script adentro), id propio y su timeline en `window.__timelines["<nombre>"]`.
2. Agregarla a la tabla del catálogo.
3. `npm run check` y `npx hyperframes snapshot --at ...` antes de commitear.
