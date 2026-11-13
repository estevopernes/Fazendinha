# Fazendinha: relatório técnico do projeto

Versão entregue: **v3 (3D)**, a mesma publicada em 13/11/2026 no link do artifact
(https://claude.ai/artifact/8G1QsUYfGwNAJUtjcJMRo9).
O `index.html` deste pacote é **byte a byte idêntico** ao publicado (MD5 `dff04ca00d4aa0a307a5a50fef20b951`).
Nada foi alterado para montar o pacote.

---

## 1. Resumo

A Fazendinha é um jogo de fazenda para celular que roda no navegador. É um protótipo de um jogador só:
não tem servidor, login nem banco de dados. Todo o estado fica salvo no `localStorage` do próprio aparelho.

- **Linguagem:** JavaScript puro (ES2020, sem TypeScript, sem framework, sem bundler).
- **Motor gráfico:** [Three.js r128](https://threejs.org) (WebGL) para o mundo 3D, com uma camada **Canvas 2D** por cima para balões, barras de progresso, textos e partículas.
- **Interface:** HTML e CSS (HUD, bandeja de ferramentas, lojas em "gaveta" que sobe de baixo).
- **Arte:** **toda feita por código.** Os modelos 3D são low-poly, montados com primitivas do Three.js (caixas, cilindros, esferas, cones). Os ícones da loja e a tela de abertura são desenhados em Canvas 2D. **Não há arquivos de imagem, textura, áudio ou modelo 3D externos** (.glb/.fbx/.png).
- **Dependências externas (via internet):**
  - Three.js r128: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` (há uma cópia local em `vendor/three.r128.min.js`, licença MIT).
  - Fontes Google: Fredoka e Nunito (`fonts.googleapis.com`). Sem elas o jogo usa fontes do sistema.

## 2. Estrutura do pacote

```
fazendinha-projeto/
├── index.html            ← O JOGO (arquivo único, idêntico ao publicado). Abra este.
├── RELATORIO.md          ← este relatório
├── build.sh              ← junta src/ e gera dist-index.html (+ checagem de sintaxe)
├── src/                  ← o MESMO código do index.html, separado por assunto (fonte de edição)
│   ├── 00_head.html      ← <head>, CSS, HTML do HUD/bandeja/gaveta/abertura, <script> do Three.js
│   ├── 10_core.js        ← dados do jogo (economia), mapa, estado, salvar/carregar, XP/nível
│   ├── 30_cam.js         ← câmera 3D (ortográfica isométrica), luz, sombras, zoom/arrastar, conversão tela↔mundo
│   ├── 40_plants.js      ← desenho 2D das plantas (usado nos ícones e na abertura)
│   ├── 50_animals.js     ← desenho 2D de animais/cachorro/pessoas (ícones e abertura)
│   ├── 60_build.js       ← desenho 2D de cocho, árvore, casa, celeiro (ícones/abertura)
│   ├── 65_world.js       ← textura do chão (grama, caminhos, lago, flores) usada no 3D + desenhos 2D de cercas/decoração
│   ├── 70_runtime.js     ← laço do jogo (frame), IA dos animais, cachorro, visitante/ladrão, efeitos, ícones
│   ├── 75_three.js       ← TODOS os modelos 3D, animações 3D e a camada 2D por cima (render/overlay)
│   └── 80_ui.js          ← toques, lojas, celeiro, cash/Pix, vizinhos, visitas, colocação de itens, abertura, boot
├── vendor/
│   └── three.r128.min.js ← Three.js local (para testes/offline)
├── tests/
│   └── teste-3d.js       ← teste de fumaça com Playwright (abre, joga um pouco, tira prints, lista erros)
├── docs/screenshots/     ← prints da versão atual
└── legacy/               ← versões antigas, só para referência (não são usadas)
    ├── v1-arquivo-unico/ ← 1ª versão 2D vista de cima
    └── v2-2d-partes/     ← versão 2D em partes, antes do 3D
```

**Importante:** `index.html` = concatenação, nesta ordem, de
`00_head.html 10_core.js 30_cam.js 40_plants.js 50_animals.js 60_build.js 65_world.js 70_runtime.js 75_three.js 80_ui.js`.
Rodar `./build.sh` gera um `dist-index.html` idêntico ao `index.html` (conferido por MD5). Edite em `src/` e gere de novo.
Todo o JS roda dentro de uma única IIFE (`(()=>{ 'use strict'; ... })()`), então as funções não ficam no `window`.

## 3. Como executar localmente

1. **Mais simples:** abra `index.html` direto no navegador (Chrome/Edge/Safari). Precisa de internet por causa do Three.js no CDN.
2. **Com servidor local (recomendado para celular na mesma rede):**
   ```bash
   cd fazendinha-projeto
   python3 -m http.server 8080      # ou: npx serve .
   ```
   Abra `http://localhost:8080` (ou `http://IP-do-PC:8080` no celular).
3. **Sem internet:** troque, numa cópia, a linha
   `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`
   por `<script src="vendor/three.r128.min.js"></script>`.
4. **Teste automático:**
   ```bash
   npm i -D playwright && npx playwright install chromium
   node tests/teste-3d.js
   ```
5. **Zerar o progresso:** no console do navegador, `localStorage.removeItem('fazendinha-v3')` e recarregue.

## 4. Como publicar e atualizar

- **Hoje:** o jogo está publicado como *artifact* do Claude (página privada em claude.ai, compartilhável pelo menu Compartilhar). Para atualizar por lá, o arquivo `index.html` é republicado no mesmo link.
- **Em qualquer hospedagem estática** (o jogo é um arquivo só): GitHub Pages, Netlify, Vercel, Cloudflare Pages, Firebase Hosting. Basta subir o `index.html` (e, se quiser rodar sem CDN, a pasta `vendor/`).
- **Fluxo de atualização sugerido:** editar `src/` → `./build.sh` → testar `dist-index.html` → renomear para `index.html` → subir.
- **Salvamento:** a chave é `fazendinha-v3`. Se mudar o formato do estado, troque a chave (ex.: `fazendinha-v4`) ou faça migração em `load()` (10_core.js), senão saves antigos podem quebrar.
- **App de loja (Play Store/App Store):** dá para empacotar com Capacitor ou como PWA/TWA. Ainda não foi feito.

## 5. Onde fica cada sistema (arquivo → funções)

| Sistema | Arquivo | Funções/constantes principais |
|---|---|---|
| Tabelas de economia (sementes, animais, abrigos, decoração, produtos, celeiro, pacotes de cash) | `10_core.js` | `CROPS`, `ANIMALS`, `PEN_TYPES`, `DECO`, `PRODUCTS`, `BARN_UP`, `CASH_PACKS`, `DOG_COST`, `FOOD_COST`, `FOOD_SECS` |
| Limites por nível | `10_core.js` | `maxPlots(l)`, `maxAnimals(k,l)`, `maxPens(k,l)`, `plotCost(n)` |
| XP e nível | `10_core.js` | `need(l)` (XP do nível), `addXP()` (sobe nível: +50 moedas e +10 cash) |
| Estado inicial, salvar/carregar, tempo offline | `10_core.js` | `freshState()`, `load()`, `save()`, `catchUp()` |
| Crescimento das plantas | `10_core.js` / `70_runtime.js` | `plant()`, `growPlots()`, `weedTick()` (ervas/pragas), `stageTick()` (troca de estágio), `waterPlot()` |
| Mapa e colocação | `10_core.js` / `80_ui.js` | `T`, `COLS`, `ROWS`, `BARN`, `HOUSE`, `DOGHOUSE`, `POND`, `GATE`, `blockedTile`, `occAt`, `canPlace`, `penGeo`; `startPlacing`, `placeTap`, `confirmPlace` |
| Produção dos animais e rotina (andar, comer, beber, bicar) | `70_runtime.js` | `updAnimal()` (estados e ovos), produção em `frame()` |
| Coleta de produtos | `80_ui.js` | `tap()`, `collectEggs()` |
| Cachorro guardião e ração | `70_runtime.js` / `10_core.js` | `updDog()`, `dogSpot()`, `bitten()`, `dogAwake()` |
| Vizinho que visita sua fazenda (ajuda ou rouba) | `70_runtime.js` | `startVisitor()`, `planVisit()`, `updVisitor()`, `applyVisitorAction()`, `finishVisitor()`, `instantVisit()` |
| Você visitando vizinhos (5 ações) | `80_ui.js` | `visit()`, `visitTap()`, `goHome()`; fazendas geradas por `makeNeighbor()`, `makeNeighborFarm()` (10_core.js) |
| Lista de vizinhos / convite por @Instagram | `80_ui.js` | `openNeighbors()`, `renderNeighbors()`, `addNeighbor()` |
| Lojas | `80_ui.js` | `openShop()`, `renderShop()` (abas: sementes, animais, abrigos, terreno/decoração, cachorro, cash) |
| Celeiro (estoque, venda, ampliação) | `80_ui.js` / `10_core.js` | `openBarn()`, `renderBarn()`, `addBarn()`, `barnFree()` |
| Cash e Pix | `80_ui.js` | `renderCash()`, `pixCode()`, `showPix()` |
| HUD e ferramentas | `80_ui.js` | `hud()`, `buildTools()`, `toast()`, `openSheet()`, `closeSheet()` |
| Câmera, zoom, arrastar, toque→mundo | `30_cam.js` | `initThree()`, `updCamera()`, `iso()` (mundo→tela), `inv()` (tela→mundo), `setZoom()`, `panTo()`, `centerOn()`, `resize()` |
| Modelos 3D | `75_three.js` | `mkHouse`, `mkBarn`, `mkTree`, `mkBush`, `mkRock`, `mkDogHouse`, `mkPen`, `mkTrough`, `mkDeco`, `mkCrop(k,estágio)`, `mkWeed`, `mkAnimal3`, `mkDog3`, `mkPerson3`, `mkEgg`, `build3DStatic()` |
| Sincronizar estado → cena 3D e desenhar | `75_three.js` | `syncFarm()`, `render(farm)`, `overlay(farm)`; cache de objetos por `WeakMap` (`OBJ`, `objFor`) |
| Laço do jogo | `70_runtime.js` | `frame(now)` (requestAnimationFrame) |
| Ícones e efeitos | `70_runtime.js` | `makeIcons()` (`ICON`), `fx()`, `puff()`, `burstS()` |
| Abertura e inicialização | `80_ui.js` | `splash()` (barra de carregamento por etapas), `start()`, `boot` no fim do arquivo |

Coordenadas: o mundo usa pixels de grade (`T=56` por quadrado, mapa 18×26). No 3D, 1 quadrado = 1 unidade (`U=1/T`); x do mundo → x 3D, y do mundo → z 3D.

## 6. Regras e economia (valores atuais no código)

### Sementes (`CROPS`, tempo em segundos)
| Semente | Custo | Vende (un) | Tempo | Rende | XP | Nível |
|---|---|---|---|---|---|---|
| Alface | 5 | 3 | 1 min | 4 | 1 | 1 |
| Cenoura | 8 | 5 | 1 min 35 s | 4 | 2 | 1 |
| Batata | 14 | 8 | 3 min 20 s | 4 | 3 | 2 |
| Tomate | 22 | 12 | 7 min | 5 | 6 | 2 |
| Pepino | 20 | 9 | 5 min 30 s | 5 | 5 | 3 |
| Milho | 30 | 18 | 13 min | 4 | 9 | 3 |
| Morango | 45 | 15 | 25 min | 6 | 14 | 4 |
| Abóbora | 60 | 80 | 40 min | 2 | 18 | 5 |
| Girassol | 50 | 30 | 18 min | 4 | 12 | 6 |
| Melancia | 90 | 70 | 65 min | 2 | 26 | 7 |
| Berinjela | 110 | 45 | 90 min | 4 | 32 | 8 |
| Uva | 160 | 50 | 3 h | 6 | 48 | 9 |
| Abacaxi | 240 | 140 | 6 h | 3 | 70 | 10 |
| Girassol arco-íris (rara) | 6 cash | 90 | 30 min | 4 | 20 | 1 |
| Abóbora gigante (rara) | 8 cash | 600 | 50 min | 1 | 30 | 1 |
| Uva dourada (rara) | 12 cash | 120 | 2 h | 6 | 45 | 1 |

- **Estágios:** semente (<50%), broto (50%), flores (75%), fruto/maduro (100%). Cada troca tem animação de "pulo".
- **Rega:** só uma vez por plantio, liberada a partir de 50%, corta 10% do tempo.
- **Ervas daninhas e pragas** aparecem aleatoriamente (`weedTick`, a cada 30 s) e **param o crescimento** até serem removidas.

### Animais (`ANIMALS`; cada abrigo comporta 4 animais, `PEN_CAP=4`)
| Animal | Custo | Produz | Ciclo | XP por coleta | Nível | Abrigo |
|---|---|---|---|---|---|---|
| Galinha | 150 | 6 ovos (5 cada) | 10 min | 2 | 1 | Galinheiro (300, nív. 1) |
| Vaca | 200 | 2 L de leite (15/L) | 10 min | 3 | 2 | Curral (500, nív. 2) |
| Ovelha | 450 | 5 lãs (20 cada) | 20 min | 5 | 3 | Estábulo das ovelhas (700, nív. 3) |
| Cabra | 400 | 5 L de leite de cabra (25/L) | 30 min | 7 | 4 | Cabril (650, nív. 4) |
| Pavão | 900 | 3 penas (120 cada) | 1 h | 12 | 6 | Viveiro do pavão (1.500, nív. 6) |
| Galinha dourada (exótica) | 30 cash | 3 ovos dourados (25) | 15 min | 4 | 1 | Galinheiro |
| Ovelha negra (exótica) | 45 cash | 3 lãs negras (50) | 25 min | 7 | 1 | Estábulo |
| Pavão branco (exótico) | 80 cash | 2 penas brancas | 1 h | 15 | 1 | Viveiro |

Galinhas botam ovos no chão do galinheiro (toque para recolher). Os outros animais mostram um balão "×quantidade" quando a produção está pronta.

### Limites por nível (10_core.js)
- Canteiros: `8 + (nível-1)×2`, máximo 60. Preço do canteiro: `30 + 6×(canteiros acima de 8)`.
- Animais comuns: galinha começa com 2 por nível de liberação, os outros com 1, e liberam +1 por nível.
- Animais exóticos: `1 + floor((nível-1)/3)`.
- Abrigos: 1 de cada tipo ao liberar, +1 a cada 3 níveis.
- XP para passar do nível *l*: `20 + 25×l`. Ao subir: **+50 moedas e +10 cash**.

### Celeiro
Começa com **100 espaços**. Ampliações (`BARN_UP`): 150 (800 moedas, nív. 2), 200 (2.000, nív. 4), 300 (4.500, nív. 6), 400 (9.000, nív. 8), 550 (16.000, nív. 10), 750 (28.000, nív. 12), 1000 (45.000, nív. 15). Todo item mostra o preço de venda; dá para vender por item ou tudo.

### Decoração (`DECO`)
Cerca de madeira 10, Canteiro de flores 35, Cerca branca 25 (nív. 2), Banco 60 (nív. 2), Árvore frutífera 80 (nív. 3), Carrinho de mão 90 (nív. 3), Espantalho 120 (nív. 4), Poço 250 (nív. 5), Fonte de pedra 40 cash, Moinho de vento 60 cash. Todos dão XP.

### Cachorro
Custa 400 moedas. A ração custa 40 e dura 15 min. Acordado, ele persegue o vizinho que tenta roubar e **morde**: o ladrão foge sem levar nada e você ganha de 15 a 35 moedas. Sem ração, ele dorme e não vigia.

### Moedas e cash
- Início: 500 moedas e 20 cash.
- Pacotes de cash (`CASH_PACKS`): 50 por R$ 4,90 · 110 por R$ 9,90 · 240 por R$ 19,90 · 650 por R$ 49,90 · 1400 por R$ 99,90.

## 7. Vizinhos e visitas

- **Lista de vizinhos:** você adiciona pelo @ do Instagram e o jogo gera um link de convite para copiar. O vizinho e a fazenda dele são **gerados localmente** (`makeNeighbor`, `makeNeighborFarm`), com nomes de exemplo (`NAMES`).
- **Você visita:** 5 ações por vizinho por dia: **colher** (para ele, ganha XP e moedas), **regar**, **tirar ervas/pragas** e **roubar** (até 5 itens maduros). Depois, **Voltar**.
- **Vizinho visita você:** de tempos em tempos (55 a 100 s) aparece um vizinho que entra pelo portão (`GATE`), anda até os canteiros e rega, tira erva, mata praga ou rouba. Se o cachorro estiver acordado, ele morde o ladrão. Ao sair, aparece um resumo do que ele fez (`logEv`). Ao reabrir o jogo, `instantVisit()` simula visitas que aconteceram enquanto você estava fora.

## 8. O que é real e o que é simulado

| Recurso | Situação |
|---|---|
| Plantar, crescer, regar, colher, animais, produção, celeiro, lojas, XP, níveis, limites, cachorro | **Real** (funciona por completo no aparelho) |
| Progresso salvo | **Real, mas só local** (localStorage do navegador; não sincroniza entre aparelhos e some se limpar os dados do navegador) |
| Tempo passando com o jogo fechado | **Real** (`catchUp()` usa o relógio do aparelho; dá para trapacear mudando a hora) |
| Vizinhos e as fazendas deles | **Simulado** (gerados localmente; não existem outros jogadores de verdade) |
| Instagram | **Simulado** (só guarda o @; não há login nem lista de amigos do Instagram, que a API da Meta não fornece para isso) |
| Link de convite | **Simulado** (gera o texto/link, mas não há servidor para receber quem clica) |
| Pagamento Pix | **Simulado / TESTE** (QR e copia-e-cola de teste + botão "Simular pagamento aprovado"; **nenhuma cobrança real**) |
| Banco de dados / servidor | **Não existe** |

## 9. Erros conhecidos e limitações

1. **Tudo offline e local:** sem backend, não há multiplayer real, ranking, contas nem proteção contra trapaça (dá para editar o `localStorage` ou mudar o relógio).
2. **Pix não é real:** para cobrar de verdade, é preciso um provedor (Mercado Pago, Efí, Asaas etc.), um servidor para criar a cobrança e um webhook para confirmar o pagamento antes de liberar o cash.
3. **Depende de internet** para carregar o Three.js do CDN e as fontes (ver item 3 da seção "Como executar").
4. **Visual 3D low-poly feito por código:** o dono do projeto quer um visual mais caprichado, "nível estúdio". Pacotes gratuitos da Quaternius foram avaliados e **rejeitados pelo dono** (não usar). O próximo passo é modelos de um artista 3D ou gerados por IA (ex.: Meshy), carregados com `GLTFLoader` (.glb).
5. **Código legado ainda dentro do arquivo:** `render2D()` e `drawGhost2D()` em `70_runtime.js` e os desenhos 2D de `40/50/60/65` são da versão 2D. Os desenhos 2D ainda servem para os **ícones da loja e a tela de abertura**; `render2D`/`drawGhost2D` não são mais chamados.
6. **Desempenho:** sombras PCFSoft com mapa de 2048 px. Em celulares fracos pode pesar; dá para reduzir em `initThree()` (30_cam.js) ou desligar `shadowMap`.
7. **Em testes com navegador sem GPU (headless/SwiftShader)**, os prints às vezes mostram uma faixa transparente atrás do cartão de perfil (topo). É um artefato de composição do navegador de teste, sem relação com a lógica do jogo. Vale confirmar em aparelhos reais.
8. **Acentos e textos** estão todos fixos no código em português (sem sistema de tradução).
9. **Sem som/música.**

## 10. O que ainda falta desenvolver (pendências sugeridas)

- Backend + contas (ex.: Firebase/Supabase): salvar na nuvem, vizinhos reais, visitas reais, convite funcionando.
- Pix real com provedor de pagamento e confirmação por webhook (e regras das lojas de apps, se virar app).
- Modelos 3D profissionais (.glb) com animações (andar, comer, beber, bicar, botar ovo), substituindo `mkAnimal3`, `mkCrop` etc. em `75_three.js`.
- Sons e música.
- Missões/pedidos diários, eventos sazonais, conquistas.
- Fábricas/receitas (ex.: queijo, bolo) para usar os produtos.
- PWA (instalar no celular, ícone, funcionar offline) e/ou empacotar com Capacitor.
- Antitrapaça (validar tempo e economia no servidor).
- Remover o código 2D legado que não é mais usado.

## 11. Histórico de versões

- **v1** (`legacy/v1-arquivo-unico`): 2D vista de cima.
- **v2** (`legacy/v2-2d-partes`): 2D, código separado em partes; depois virou isométrico 2D.
- **v3 (atual)**: mundo em 3D com Three.js, mantendo toda a lógica de jogo das versões anteriores.
