// Teste de fumaça com Playwright: abre o jogo, passa da abertura, tira prints e lista erros do console.
// Uso: npm i -D playwright && npx playwright install chromium && node tests/teste-3d.js
// Serve o Three.js local (vendor/) no lugar do CDN, para rodar sem internet.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader']});
const p=await b.newPage({viewport:{width:390,height:780}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,'../vendor/three.r128.min.js')),contentType:'text/javascript'}));
await p.goto('file://'+path.join(__dirname,'../index.html'));
// a abertura de cinema dura ~12 s; o teste aperta "Pular" assim que ele aparece (e confere que o botão funciona)
await p.waitForSelector('#sp-skip:not([hidden])',{timeout:60000});await p.click('#sp-skip');await p.waitForSelector('#sp-go:not([hidden])',{timeout:60000}); // espera a barra chegar ao fim (antes era um tempo fixo de 4,5 s, que falhava em máquina lenta)
await p.click('#sp-go',{force:true});await p.waitForTimeout(1500);await p.screenshot({path:'teste-fazenda.png'});
await p.mouse.click(230,400);await p.waitForTimeout(700);
await p.click('.tool >> text=Vizinhos');await p.waitForTimeout(500);await p.locator('[data-visit]').first().click();await p.waitForTimeout(2500);
await p.screenshot({path:'teste-visita.png'});
console.log(errs.length?'ERROS: '+JSON.stringify(errs):'Sem erros no console.');await b.close();})();
