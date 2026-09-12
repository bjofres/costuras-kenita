# Costuras Kenita · Taller de Costura en Maipú

Landing de una sola página para el taller **Costuras Kenita** (Las Águilas 664, Maipú): arreglos de ropa casual, vestir formal y todo lo del colegio — con máquina de coser ilustrada y animada en SVG. 🧵

🌐 **Demo:** https://bjofres.github.io/costuras-kenita/

## Qué incluye

- Hero con máquina de coser SVG animada (aguja, hilo y carrete en movimiento)
- Servicios: casual y arreglos, vestir formal, colegio y actividades
- Trabajos, reseñas reales de Google Maps, preguntas frecuentes
- Mapa de ubicación + botón de WhatsApp (+56 9 3090 6255)
- Formulario de cotización que arma el mensaje y abre WhatsApp
- 100% responsive, sin frameworks ni build

## Ver el sitio

Doble clic en **`index.html`**. No requiere servidor ni instalación.

## Personalizar

- **WhatsApp:** en `app.js`, objeto `SITE` → campo `whatsapp` (código país + número, sin `+`).
- **Nombre, dirección y textos:** directo en `index.html`.
- **Colores y tipografías:** variables en `:root` de `styles.css`.

## Estructura

```
index.html   # Contenido y estructura
styles.css   # Diseño (variables, responsive, animaciones)
app.js       # Interacciones (menú, formulario → WhatsApp, contadores)
assets/      # Reservado para fotos reales
```

## Estado

Fase 1 terminada. Ideas para Fase 2: fotos reales, agenda online y migración a Nuxt 3 + Tailwind.
