# José A. Oliveira - Landing page imobiliária

Landing page estática dedicada ao corretor José A. Oliveira, com foco em primeiro imóvel e Minha Casa Minha Vida em São Paulo e Grande São Paulo.

## Tecnologias

- React + TypeScript + Vite
- CSS puro com design responsivo
- Dados locais em arquivos do projeto
- Build estático para hospedagem em Cloudflare Pages, GitHub Pages, Netlify ou Vercel

## Como instalar

```bash
npm install
```

## Como executar

```bash
npm run dev
```

## Como gerar o build

```bash
npm run build
```

A pasta estática de publicação será gerada em `dist/`.

## Onde ficam os imóveis fictícios

Os dados dos imóveis estão em:

- `src/data/properties.ts`

Cada item do catálogo é um objeto com nome, região, faixa de preço, fotos e status do imóvel. Para trocar depois pelos imóveis reais, basta:

1. Editar os objetos em `src/data/properties.ts`
2. Trocar as imagens na pasta `public/images/properties/`
3. Atualizar os contatos em `src/config/site.ts`
4. Rodar o build novamente

## Como trocar as imagens

Coloque as imagens em:

- `public/images/properties/`

Use arquivos WebP/AVIF otimizados, com proporções consistentes e nomes sem espaços. O catálogo já referencia as imagens por caminho relativo.

## Como configurar WhatsApp, telefone e e-mail

Atualize o arquivo:

- `src/config/site.ts`

Exemplo:

```ts
export const siteConfig = {
  whatsapp: '5511999999999',
  phone: '',
  email: '',
};
```

Enquanto os dados reais não existirem, o formulário e os botões ficam em demonstração automática. O envio só funciona quando o WhatsApp real for informado.

## Como publicar no Cloudflare Pages

1. Crie um repositório GitHub com o projeto.
2. Acesse o Cloudflare Pages.
3. Clique em "Create a project".
4. Conecte seu repositório.
5. Configure a build como:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Faça o deploy.

## Pasta a ser publicada

Publicar apenas o conteúdo da pasta:

- `dist/`

## Como conectar um domínio

No Cloudflare Pages:

1. Abra o projeto
2. Vá em "Custom domains"
3. Adicione o domínio
4. Ajuste os registros DNS conforme instruído pelo Cloudflare

## Como atualizar o site no futuro

Como o site é totalmente estático, a manutenção é feita editando arquivos locais e publicando novamente o build. Os pontos mais comuns de atualização são:

- `src/data/properties.ts`
- `src/config/site.ts`
- `public/images/properties/`
- `README.md`

## Observações

- Não há API, backend, banco de dados ou autenticação.
- Os dados ficam somente no frontend estático.
- A pré-simulação não armazena informações; ela apenas monta a mensagem e abre o WhatsApp.
