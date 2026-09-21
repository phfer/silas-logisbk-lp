# Silas Passos × Logisbk

Landing page estática, sem build nem dependências em produção. Conceito: **A mesma vontade de vencer.** Objetivo: associar as conquistas de Silas à parceria com Logisbk e levar interessados ao cadastro empresarial oficial.

## Abrir localmente

Na raiz deste worktree:

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory clientes/Silas-Passos/site
```

Abra http://127.0.0.1:8769. Alternativamente, abra `index.html`; para teste completo de vídeo e legendas prefira o servidor HTTP.

## Conteúdo e ativos

- Logos autênticas fornecidas, sem redesenho. Logo de Silas localizada em `~/Downloads/Silas passos.png` e comparada à apresentação original.
- Hero extraído aos 6,25s do vídeo enviado: carro #96 com Logisbk legível. Foto do pódio do acervo oficial fornecido para o projeto.
- Vídeo completo de 58,816 segundos, 1080p H.264/AAC, 26.075.153 bytes. Redução de 96,85% sobre o original 4K, que permanece intacto em Downloads. Carrega apenas por iniciativa do visitante, sem reprodução automática.
- Faixa de acessibilidade indica música de fundo; análise local não identificou falas. Fontes locais: Barlow Condensed e Manrope, distribuídas pelo Google Fonts.
- Origens e fontes de alegações em `asset-manifest.json` e no rodapé da página. O texto não comunica assuntos empresariais vetados no briefing.

## Conversão

Todos os CTAs levam a `https://www.logisbank.com.br/conta-digital/`, com identificação de campanha e posição. Origem, mídia, campanha e termo recebidos na URL são preservados quando válidos (até 160 caracteres). Sem parâmetros recebidos: `utm_source=silas_passos`, `utm_medium=landing_page`, `utm_campaign=mesma_vontade_de_vencer`.

O formulário pertence ao site oficial do Logisbk. Esta LP não captura dados pessoais nem simula cadastro. O caminho real foi aberto e o formulário oficial ficou visível; nenhum cadastro foi enviado. UTMs identificam os links; registro de leads e atribuição final dependem do formulário/analytics do banco. Nenhum pixel ou rastreador externo foi instalado.

## Verificar

Requer o Playwright já instalado na raiz deste worktree e o launcher seguro do Mac:

```sh
node clientes/Silas-Passos/site/qa/check.cjs
```

Verificações: 320, 390, 768, 1440 e 1920px; ausência de overflow/erros de JS/404; imagens carregadas e textos alternativos; links e âncoras; FAQ; CTA móvel; preservação de UTMs; reprodução real do MP4; carregamento do vídeo somente por clique; fallback sem JavaScript. Resultados e capturas em `qa/`.

## Publicação

Estado desta entrega: prévia local, não publicada. Hospedar `index.html`, `styles.css`, `app.js` e `assets/` juntos em hospedagem estática com HTTPS e suporte a byte-range para MP4. As pastas de QA e documentação não são necessárias no servidor público. Quando o domínio definitivo for definido, configurar canonical, URL e imagem Open Graph absolutas. Publicação e alterações no cadastro do banco exigem autorização própria.

## Identidade corrigida

Marca pública: **Logisbk**. Logos oficiais do Desktop (`Logo Logisbk laranjahorizontal.png` e variante branca). Cor dominante **#F27400**, extraída da logo; base preta e neutros quentes. A orientação atual do Paulo para esta campanha prevalece sobre a antiga preferência azul do perfil pessoal do Silas. O domínio de cadastro permanece no endereço oficial previamente verificado. Fotos e vídeo históricos preservam as marcas neles registradas.

## Abertura com movimento

O hero reproduz `assets/hero-racing-loop.mp4`: montagem local de 12,666 segundos, 1600×900, 4.716.316 bytes, sem áudio. Usa o material original de Silas, com cortes de pista e cockpit. O vídeo inicia automaticamente, em loop, com `muted` e `playsinline`. Um botão permite pausar/retomar. A reprodução pausa fora da tela ou quando a guia fica oculta. Com preferência de movimento reduzido, o poster permanece e o visitante pode iniciar manualmente; sem JavaScript, o poster continua visível.

Tipografia inclinada com entrada em sequência, vídeo em tela cheia e faixa laranja em movimento compõem a nova abertura. As animações respeitam `prefers-reduced-motion`. O filme completo de 59 segundos continua na seção própria, carregando apenas por clique.

Teste específico: `node clientes/Silas-Passos/site/qa/hero-motion.cjs`. Verifica reprodução real, ausência de som, reinício do loop, pausa manual, pausa fora da tela, retorno e preferência de movimento reduzido em desktop/mobile.

## Capítulo cinematográfico por rolagem

A seção “O que nos move” fixa a cena por três etapas: estratégia, controle e confiança. O visitante controla o avanço e o retorno do vídeo com a rolagem nativa. Não há bloqueio da roda, touch ou teclas. Seções e cartões entram progressivamente; uma linha laranja indica o progresso da página.

O fundo `apex-scroll.mp4` foi gerado no Higgsfield (Seedance 2.5, job `d2a7d5d1-e078-46e6-9a9c-5394da034da3`, estimativa de 35 créditos). É uma curva abstrata de luz laranja, sem simular Silas, seu carro ou sua marca. Versão final: 5,042 segundos, 1440×810, H.264, 2.216.195 bytes, sem áudio e com frames-chave para busca precisa. O clipe é carregado próximo à seção e convertido em Blob local para permitir busca mesmo em prévias sem suporte a byte-range.

Com movimento reduzido ou sem JavaScript, os três blocos são exibidos estaticamente e o vídeo de rolagem não é baixado. O modo também responde à mudança da preferência com a página aberta.

Teste: `node clientes/Silas-Passos/site/qa/scroll-story.cjs`. Confere capítulos, quadro do vídeo correspondente à rolagem, retorno, posição fixa, larguras 320/390/1440 e alternativas acessíveis. Evidências em `qa/scroll-results.json` e `qa/scroll-*.png`.

## Direção atual: filme de fogo, mockup editorial e quatro capítulos

O efeito anterior de partículas/Canvas foi rejeitado pelo Paulo e removido. O novo `fire-logo-reveal.mp4` é um filme gerado no Higgsfield, Kling3.0Pro, job `952092b4-209f-499c-bf97-760c54b0ab71`, estimativa12,25créditos. Usa a curva anterior como início e símbolo original em fundo preto como referência final. Chama volumétrica contínua forma o símbolo; últimos frames mantêm a marca legível. 7,042s,1440×810,H264,24fps,2,51MB,GOP6. A rolagem controla os dois filmes e permite reverter; sem autoplay no capítulo.

A foto do troféu ganhou composição de capa editorial com perspectiva, profundidade de páginas e selo. As duas fotos de comemoração formam composição assimétrica com recortes arredondados. São os mesmos arquivos autênticos do post indicado (slides1,11,12); apenas apresentação CSS, sem gerar ou modificar o rosto de Silas.

Quatro novas seções relacionam Silas e Logisbk: vitória, foco, perseverança e inteligência emocional. Cada uma apresenta um fato/experiência de Silas e sua conexão editorial com a rotina empresarial, ligada a recursos reais da conta. Não são depoimentos ou promessas de resultado financeiro. Recursos conferidos novamente na página oficial da conta: Pix/transferências,pagamentos/boletos,extrato completo e acesso multiusuário.

Verificação: `qa/scroll-story.cjs` confere os dois vídeos reais, progresso/retorno, remoção do Canvas, identidade final, mobile e preferência de movimento reduzido. `qa/check.cjs` valida as quatro seções, conexão Silas/Logisbk, fotos e links em320/390/768/1440/1920px. Executar suítes de navegador sequencialmente nesta máquina.

A seção foco usa um frame real do cockpit aos 29s do filme fornecido. O fallback CSS de movimento reduzido atua diretamente; a próxima interação sincroniza o estado JS se o navegador não emitir o evento de mudança. A reprodução manual do hero pode ser escolhida pelo visitante.

## Abertura de largada

`loading.js` e o bloco `.race-loader` apresentam uma abertura de 3,65s: semáforo, contagem e revelação em duas metades. Pode ser pulada por botão ou Escape. Conteúdo de fundo fica inert até a saída; timers são cancelados na limpeza. Sem JS, com movimento reduzido ou em links com hash, o site abre diretamente. Um watchdog no head libera a página em 6,5s se o script não carregar. Nenhuma mídia nova ou porcentagem artificial.

Teste: `node clientes/Silas-Passos/site/qa/loading.cjs`.

## Painel Clareza por rolagem

A arte de inteligência emocional responde à posição do visitante: órbita e pontos giram, arco SVG avança e a palavra ganha nitidez/brilho. Os rótulos observar, entender e decidir acompanham três fases. Reutiliza `paintScroll` e seu requestAnimationFrame sob demanda; sem loop ocioso. Movimento reduzido e ausência de JS preservam o painel estático. Teste: `node clientes/Silas-Passos/site/qa/clarity-scroll.cjs`.

## Otimização móvel

A versão móvel preserva as cenas e prioriza leitura/toque: textos principais15px, alvos≥44px, margens de notch/home indicator e adaptação para paisagem curta. Vídeos960×540 são escolhidos antes da requisição para telas até850px ou ponteiro de toque. Versões maiores continuam no desktop. A foto inicial móvel38KB carrega primeiro; vídeo de fundo aguarda a foto. Fontes WOFF substituem os TTF na entrega ao navegador.

Economia de dados/2G mantém o conteúdo estático e não baixa clipes automaticamente. O visitante pode iniciar o vídeo manualmente. Movimento reduzido e ausência de JS permanecem suportados.

Verificação: `node clientes/Silas-Passos/site/qa/mobile.cjs`; repetir com `MOBILE_QA_ENGINE=webkit` para WebKit. Onze dimensões, retrato/paisagem e tablet; não são testes em todos os modelos físicos. `qa/mobile-network.cjs` verifica rede simulada100KB/s,150ms e rotação durante o uso. Resultados/capturas ficam em `qa/`.
