# 🚀 Guia de Configuração - Lumenis Academy

## 📋 Pré-requisitos

### Para qualquer máquina:
- **Node.js 18+** (recomendado: versão LTS)
- **Git** para controle de versão
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### Para desenvolvimento local com XAMPP:
- **XAMPP** (Apache + MySQL + PHP)
- **Composer** para dependências PHP

## 🌐 1. Rodando em Qualquer Máquina (Vite + Supabase)

### Passo 1: Clone e Instale
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lumenis-academy.git
cd lumenis-academy

# Instale dependências
npm install
```

### Passo 2: Configure o Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas configurações
```

### Passo 3: Execute o Projeto
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

**Acesso:** `http://localhost:3000`

## 🗄️ 2. Configuração com Supabase

### Passo 1: Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Configure nome, senha do banco e região

### Passo 2: Configurar Banco de Dados
1. No painel do Supabase, vá em "SQL Editor"
2. Execute o script de migração (arquivo `supabase/migrations/`)
3. Configure as políticas RLS (Row Level Security)

### Passo 3: Configurar Variáveis
```bash
# No arquivo .env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### Passo 4: Testar Conexão
```bash
npm run dev
```

## 🖥️ 3. Configuração Local com XAMPP

### Passo 1: Instalar XAMPP
1. Baixe XAMPP do site oficial
2. Instale e inicie Apache + MySQL
3. Acesse `http://localhost/phpmyadmin`

### Passo 2: Configurar Banco de Dados
```sql
-- Criar banco de dados
CREATE DATABASE lumenis_academy;

-- Importar schema (use o arquivo api/database.sql)
```

### Passo 3: Configurar Projeto
```bash
# Copie o projeto para htdocs
cp -r lumenis-academy /xampp/htdocs/LumenisAcademy

# Configure o arquivo api/config.php
```

### Passo 4: Configurar Apache
Edite o arquivo `api/config.php`:
```php
// Configuração para XAMPP local
define('DB_HOST', 'localhost');
define('DB_NAME', 'lumenis_academy');
define('DB_USER', 'root');
define('DB_PASS', ''); // Senha vazia no XAMPP padrão
define('API_BASE_URL', 'http://localhost/LumenisAcademy/api');
```

**Acesso:** `http://localhost/LumenisAcademy`

## 🚀 4. Lançamento da Versão Beta

### Preparação para Beta
1. **Teste todas as funcionalidades**
2. **Configure analytics**
3. **Prepare documentação**
4. **Configure monitoramento**

### Deploy Options

#### Opção A: Vercel (Recomendado)
```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Opção B: Netlify
```bash
# Build do projeto
npm run build

# Upload da pasta dist/ para Netlify
```

#### Opção C: Servidor VPS
```bash
# Build
npm run build

# Upload via FTP/SSH para seu servidor
# Configure Apache/Nginx para servir os arquivos
```

## 📁 Estrutura de Arquivos para Deploy

```
lumenis-academy/
├── dist/                 # Build de produção
├── api/                  # Backend PHP (para XAMPP)
├── supabase/            # Configurações Supabase
├── modules/             # Módulos de curso
├── css/                 # Estilos
├── js/                  # Scripts
├── package.json         # Configurações Node.js
├── vite.config.js       # Configurações Vite
└── .env                 # Variáveis de ambiente
```

## 🔧 Configurações Específicas

### Para Produção:
```javascript
// vite.config.js para produção
export default defineConfig({
  base: '/', // ou '/lumenis-academy/' se em subdiretório
  build: {
    minify: 'terser',
    sourcemap: false, // Desabilitar em produção
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
})
```

### Para XAMPP:
```apache
# .htaccess na raiz do projeto
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Headers de segurança
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

## 🧪 Testando a Configuração

### Checklist de Testes:
- [ ] Página inicial carrega corretamente
- [ ] Animações funcionam
- [ ] Login/registro funciona
- [ ] Cursos são exibidos
- [ ] Dashboard neural funciona
- [ ] IA Avatar responde
- [ ] Métricas são salvas
- [ ] Responsividade mobile

### Comandos de Teste:
```bash
# Testar build
npm run build && npm run preview

# Verificar erros no console
# Testar em diferentes navegadores
# Testar em dispositivos móveis
```

## 🔒 Segurança para Produção

### Configurações Essenciais:
1. **HTTPS obrigatório**
2. **Variáveis de ambiente seguras**
3. **Rate limiting configurado**
4. **Backup automático do banco**
5. **Monitoramento de erros**

### Headers de Segurança:
```javascript
// Para Vercel/Netlify - arquivo _headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
```

## 📊 Monitoramento

### Métricas Importantes:
- **Performance da página**
- **Erros JavaScript**
- **Tempo de carregamento**
- **Taxa de conversão**
- **Engajamento do usuário**

### Ferramentas Recomendadas:
- **Google Analytics 4**
- **Sentry** para monitoramento de erros
- **Lighthouse** para performance
- **Supabase Analytics** para dados do banco

## 🎯 Próximos Passos

1. **Configure o ambiente escolhido**
2. **Teste todas as funcionalidades**
3. **Configure monitoramento**
4. **Prepare documentação para usuários**
5. **Lance a versão beta**
6. **Colete feedback dos usuários**
7. **Itere baseado no feedback**

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme as variáveis de ambiente
3. Teste a conectividade com o banco
4. Verifique permissões de arquivo

**Boa sorte com o lançamento da Lumenis Academy! 🚀**