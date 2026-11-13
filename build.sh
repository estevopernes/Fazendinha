#!/usr/bin/env bash
# Junta as partes de src/ num único index.html (o jogo publicado é um arquivo só).
set -e
cd "$(dirname "$0")"
cat src/00_head.html src/10_core.js src/30_cam.js src/40_plants.js src/50_animals.js src/60_build.js src/65_world.js src/70_runtime.js src/75_three.js src/80_ui.js > dist-index.html
# checagem de sintaxe do JavaScript (precisa de Node.js)
if command -v node >/dev/null; then sed -n '/^<script>/,/<\/script>/p' dist-index.html | sed '1d;$d' > /tmp/fz-check.js && node --check /tmp/fz-check.js && echo "Sintaxe OK"; fi
echo "Gerado dist-index.html. Compare com index.html antes de substituir."
