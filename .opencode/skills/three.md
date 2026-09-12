# Three.js

## Objetivos
- Implementar escenas 3D con Three.js optimizadas para rendimiento
- Manejar materiales, geometrías, iluminación y sombras correctamente
- Usar post-processing y shaders personalizados de forma eficiente

## Best Practices
- Preferir InstancedMesh sobre múltiples meshes individuales para reducir draw calls
- Usar BufferGeometry con atributos compartidos siempre que sea posible
- Implementar LOD (Level of Detail) para objetos distantes
- Optimizar sombras usando shadow.mapSize controlado y PCFSoftShadowMap
- Cargar modelos GLTF con Draco compression para reducir tamaño

## Anti-Patterns
- Mesh por instancia: genera cientos de draw calls. Usar InstancedMesh.
- MeshStandardMaterial sin fiz: preferir MeshBasicMaterial o MeshLambertMaterial
- Recrear EffectComposer en cada frame: inicializar una vez y usar setSize

## Errores Comunes
- Olvidar render() después de modificar la escena
- No actualizar aspect de c