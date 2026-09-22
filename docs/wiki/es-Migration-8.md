---
layout: wiki
title: "Actualizar desde la versión 7"
lang: es
permalink: /wiki/es-Migration-8
translation_key: "Migration-8"
---

# Actualizar desde la versión 7

La versión 8 elimina los antiguos nodos HUE, Matter e IA, sus configuraciones y los nodos Utility separados. Completa la migración mientras KNX Ultimate 7 siga instalado.

> ▶️ [Ver la videoguía para migrar de KNX Ultimate 7 a 8](https://youtu.be/fpNNi1jZZSc) *(en italiano)*

1. Haz una copia de toda la carpeta de usuario de Node-RED: flujos, credenciales, ajustes y `knxultimatestorage`. El JSON de los flujos por sí solo no guarda los emparejamientos Matter.

2. Con KNX Ultimate 7, usa **Migrate KNX** o el botón de conversión de KNX Utility para los antiguos nodos Utility. Revisa todos los flujos y subflujos y haz Deploy.

3. Instala `node-red-contrib-hue-ultimate` y/o `node-red-contrib-matter-ultimate` y reinicia Node-RED. Acepta el aviso de migración. HUE convierte tanto los nodos individuales antiguos como el antiguo Controller multimodal.

4. Revisa los flujos convertidos y haz Deploy. Se conservan ID y referencias de configuración. Mantén la misma carpeta de usuario y no borres `knxultimatestorage/matter`: contiene identidades de emparejamiento y fabrics Matter.

5. Sustituye o elimina `knxUltimateAI` y `knxUltimateAIHomeAssistant` antes de actualizar. Cerebrum Ultimate es el paquete de IA separado; no hay conversión automática de IA. Elimina también las configuraciones antiguas sin uso.

6. Comprueba que los dispositivos funcionen, instala KNX Ultimate 8 y reinicia Node-RED. Los nodos HUE y Matter que usan KNX mantienen el gateway existente.

## Si se bloquea la instalación

La instalación de la versión 8 busca nodos HUE y Matter antiguos en los flujos guardados, incluidas configuraciones, flujos desactivados y subflujos. Instalar los nuevos paquetes no basta: convierte y haz Deploy primero. No se pueden revisar todos los almacenamientos personalizados ni los cambios sin guardar; los pasos de migración siguen siendo necesarios.

Si actualizaste demasiado pronto, reinstala KNX Ultimate 7 y reinicia Node-RED antes de migrar. Restaura la copia completa si es necesario. No borres los nodos desconocidos ni reinicies los emparejamientos Matter.

## Documentación

- [KNX Utility]({{ '/wiki/es-KNX-Utility' | relative_url }})
- [HUE Ultimate](https://supergiovane.github.io/node-red-contrib-hue-ultimate/es/index.html)
- [Matter Ultimate](https://supergiovane.github.io/node-red-contrib-matter-ultimate/es/index.html)
- [Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme)
