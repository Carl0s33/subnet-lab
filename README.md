<div align="center">

# Subnet Lab

Calculadora profissional de sub-redes IPv4. Projeto desenvolvido para portfólio acadêmico – IFRN (Campus Nova Cruz).

**Tagline:** Cálculos de sub-redes sem complicação.  
**Slug:** `subnet-lab`

<br/>

</div>

## Sobre o projeto

Aplicação web para calcular informações de sub-redes IPv4 a partir de um IP e máscara (CIDR ou decimal), com foco em usabilidade, acessibilidade e visual moderno. Ideal para estudos, certificações e atividades práticas em redes.

### Principais recursos

- Endereço de rede, broadcast, primeiro/último host, total e hosts utilizáveis
- Máscara decimal e wildcard, representações binárias (IP e máscara)
- Validações com mensagens claras e acessíveis (toasts, ARIA)
- Histórico de cálculos recente (localStorage)
- Modo claro/escuro com alternância (next-themes)
- UI moderna (shadcn-ui) e responsiva (Tailwind CSS)

## Tecnologias

- Vite + React + TypeScript
- Tailwind CSS + shadcn-ui
- next-themes (tema claro/escuro)
- Vitest + Testing Library (testes)

## Como executar localmente

Requisitos: Node.js 18+ (ou 20+ recomendado) e npm.

```bash
git clone https://github.com/<seu-usuario>/ip-subnet-craft.git
cd ip-subnet-craft
npm ci
npm run dev
```

Acesse http://localhost:5173

## Testes

```bash
npm run test
```

## Build e Deploy (GitHub Pages)

O repositório já inclui um workflow em `.github/workflows/deploy.yml` que:

- Faz build com base ajustada para GitHub Pages
- Publica automaticamente na branch `gh-pages`
- Dispara a cada push na `main`

Após a primeira execução do Actions, a aplicação ficará disponível em:

```
https://<seu-usuario>.github.io/ip-subnet-craft/
```

## Estrutura de pastas (resumo)

```
src/
  components/
    CalculadoraSubrede.tsx      # Componente principal
    ResultadosSubrede.tsx       # Card de resultados
    HistoricoCalculos.tsx       # Histórico (localStorage)
    TrocaTema.tsx               # Alternância claro/escuro
    Rodape.tsx                  # Rodapé
    QuickExamples.tsx           # Exemplos rápidos de máscara
  hooks/
    useHistoricoCalculos.ts     # Hook do histórico
  lib/
    subnet-utils.ts             # Cálculos e validações
```

## Acessibilidade e UX

- Texto alternativo e labels ARIA
- Foco visível e navegação por teclado
- Contraste aprimorado no tema claro (sombra sutil em cartões e inputs)

## Autor

**Carlos Eduardo**  
Estudante do Instituto Federal do Rio Grande do Norte – Campus Nova Cruz (IFRN)  

- Portfolio: em breve  
- LinkedIn: em breve  
- E-mail: carlos.vitor@escolar.ifrn.edu.br

Sinta-se à vontade para abrir issues, propor melhorias ou enviar PRs. 😊
