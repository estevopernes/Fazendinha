# AGENTS.md: regras de colaboração (Claude + ChatGPT/Codex)

Este repositório é **só da Fazendinha**. Não misture nada de outros projetos (ex.: Bate-Esse) aqui, nem leve código daqui para lá.

Dono do projeto e quem decide: **Estevão**. As IAs propõem, e ele aprova.

## 1. Antes de começar qualquer tarefa
1. Leia `RELATORIO.md` (como o jogo funciona e onde fica cada sistema).
2. Leia `DECISOES.md` (o que já foi decidido e não deve ser refeito).
3. Puxe a `main` atualizada e veja os pull requests abertos, para não fazer trabalho duplicado.

## 2. Como trabalhar
- **Nunca faça commit direto na `main`.** Crie uma branch por tarefa:
  - Claude: `claude/<assunto-curto>` (ex.: `claude/som-da-galinha`)
  - ChatGPT/Codex: `codex/<assunto-curto>` (ex.: `codex/missoes-diarias`)
- Edite os arquivos em **`src/`**. O `index.html` da raiz é **gerado**: rode `./build.sh`, confira o `dist-index.html` e só então substitua o `index.html` por ele no mesmo commit.
- Uma tarefa = um pull request pequeno e focado. Não misture refatoração com funcionalidade nova.
- **Não reescreva o jogo** nem troque a tecnologia (Three.js, arquivo único) sem aprovação do Estevão. Melhore o que existe.
- Quando o Estevão pedir, revise os PRs da outra IA.
- Não apague nem reescreva o trabalho da outra IA sem explicar o motivo no PR.

## 3. Antes de abrir o pull request (obrigatório)
1. `./build.sh` precisa terminar com **"Sintaxe OK"**.
2. `node tests/teste-3d.js` precisa mostrar **"Sem erros no console."** (veja como instalar no RELATORIO.md, seção 3).
3. Abra o jogo no navegador e jogue o trecho que você mexeu.
4. Na descrição do PR, escreva em português simples:
   - o que mudou, do ponto de vista de quem joga, e por quê;
   - quais arquivos e funções foram mexidos;
   - como você testou;
   - prints, se mudou algo visual.

## 4. Revisão entre as IAs
- Quando uma IA abre um PR, a outra revisa e comenta (bugs, riscos, se fere alguma regra daqui).
- Divergência técnica: cada uma explica a posição em **um comentário curto no PR**. Quem decide é o Estevão.
- **Só o Estevão faz o merge** na `main`.

## 5. Coisas que só mudam com aprovação explícita do Estevão
- **Economia e regras do jogo:** preços, tempos de crescimento/produção, quantidades, XP, níveis, limites por nível, celeiro, cash e pacotes (tabelas em `src/10_core.js`). Os valores atuais estão no RELATORIO.md, seção 6.
- **Formato do save** (`localStorage`, chave `fazendinha-v3`): se mudar, crie migração em `load()` para não apagar o progresso de ninguém.
- **Pagamento real (Pix):** hoje é só simulação. Integrar cobrança real exige provedor, servidor e aprovação.
- **Visual dos modelos:** o dono rejeitou os pacotes gratuitos da Quaternius. Não use esses modelos.
- Adicionar bibliotecas, CDNs, servidores ou serviços pagos.
- Apagar funcionalidades existentes.

## 6. Registro de decisões
Mudança de economia só entra com aprovação **escrita** do Estevão (no PR ou na conversa). Toda decisão do Estevão que valha para o futuro vai em `DECISOES.md`, no formato:
`AAAA-MM-DD — decisão — por quê (se ele disse)`.
Inclua a linha no mesmo PR da mudança.

## 7. Estilo de código
- JavaScript puro, sem framework e sem bundler. Mantenha o jogo como **arquivo único** (`index.html`).
- Textos do jogo em **português do Brasil**.
- Arte original. Não copie nomes, personagens, imagens ou músicas de outros jogos (Colheita Feliz, Fazenda Verde/Green Farm etc.); use-os só como referência de estilo.
- Siga o padrão já existente: dados em `10_core.js`, 3D em `75_three.js`, interface em `80_ui.js`.

## 8. Publicação
- O jogo é servido pelo **GitHub Pages** a partir da `main` (raiz, `index.html`). Fazer merge na `main` = publicar.
- Link: https://estevopernes.github.io/Fazendinha/
