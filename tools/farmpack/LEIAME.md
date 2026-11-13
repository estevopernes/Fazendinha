# Conversão do Farm Pack para o jogo

Gera `src/72_modelos.js` a partir do GLTF original do pacote "Farm Pack Low-poly" (LionStudio).
O pacote original **não** fica no repositório (é material licenciado). Só os modelos usados entram no jogo,
simplificados e compactados.

Requisitos: Python 3 com numpy e Pillow; Node.js com `@gltf-transform/core`, `@gltf-transform/functions` e `meshoptimizer`
(instale numa pasta à parte, ex. `npm i @gltf-transform/core@4 @gltf-transform/functions@4 meshoptimizer three@0.128.0`).

Passos (o GLTF fica em `pack/New folder/Farm Pack 2.gltf`, a textura em `pack/textures/farmatlas.png`):

1. `python3 bbox.py "<gltf>" bbox.json` → caixa de cada peça.
2. `python3 cluster.py bbox.json clusters.json` → junta peças que se encostam em "objetos" com um número (id).
   (Opcional) `node toglb.mjs "<gltf>" full.glb` gera um .glb para ver o catálogo no navegador.
3. Escolha os ids no dicionário `A` de `extract.py` (nome no jogo → ids, filtros, quanto simplificar).
4. `python3 extract.py "<gltf>" clusters.json raw` → geometria de cada modelo, em metros, centrada, chão em y=0.
5. `node simp.mjs raw` → simplifica (meshoptimizer) os que têm `ratio < 1`.
6. `python3 pack.py raw farmatlas.png ../../src/72_modelos.js` → quantiza (posição/uv 16 bits, normal 8 bits),
   reduz a textura para 256×1024 e escreve tudo em base64.
7. `./build.sh` na raiz e teste.

Ids usados hoje: casa 321, celeiro 254, galinheiro 322, estábulo 325, cocho 352, balde 442, cerca 328, cerca branca 368,
macieira 119, laranjeira 120, pinheiro 105, bétula 140, arbusto 143, pedra 85, flores 151/153, poço 431, carrinho 432,
moinho 256 (hélice separada, gira), silo 301, caixa d'água 296, feno 409, barril 506, caixote 503, poste 164, placa 179.
