# 🚀 Guia de Deploy - Lumenis Academy Beta

## 🎯 Preparação para Beta

### 1. Checklist Pré-Deploy
- [ ] Todos os testes passando
- [ ] Build sem erros
- [ ] Configurações de produção definidas
- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente definidas
- [ ] Monitoramento configurado

### 2. Ambientes de Deploy

## 🌐 Deploy com Vercel (Recomendado para Beta)

### Vantagens:
- Deploy automático via Git
- CDN global
- HTTPS automático
- Fácil configuração

### Passos:
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login na Vercel
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar domínio customizado (opcional)
vercel domains add lumenisacademy.com
```

### Configuração Vercel:
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

## 🔥 Deploy com Netlify

### Passos:
```bash
# 1. Build do projeto
npm run build

# 2. Deploy via Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# Ou via interface web: arrastar pasta dist/
```

### Configuração Netlify:
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

## 🖥️ Deploy em VPS/Servidor Próprio

### Requisitos do Servidor:
- **Ubuntu 20.04+** ou CentOS 8+
- **Node.js 18+**
- **Nginx** ou Apache
- **SSL Certificate** (Let's Encrypt)
- **2GB RAM** mínimo
- **20GB SSD** mínimo

### Configuração do Servidor:
```bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar Nginx
sudo apt install nginx -y

# 4. Configurar firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable

# 5. Instalar SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
```

### Configuração Nginx:
```nginx
# /etc/nginx/sites-available/lumenisacademy
server {
    listen 80;
    server_name lumenisacademy.com www.lumenisacademy.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lumenisacademy.com www.lumenisacademy.com;

    ssl_certificate /etc/letsencrypt/live/lumenisacademy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lumenisacademy.com/privkey.pem;

    root /var/www/lumenis-academy/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if using PHP backend)
    location /api/ {
        try_files $uri $uri/ /api/index.php?$query_string;
    }
}
```

### Deploy Script:
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying Lumenis Academy..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Build project
npm run build

# Copy to web directory
sudo cp -r dist/* /var/www/lumenis-academy/

# Restart Nginx
sudo systemctl reload nginx

echo "✅ Deploy completed successfully!"
echo "🌐 Site available at: https://lumenisacademy.com"
```

## 📊 Monitoramento e Analytics

### Google Analytics 4:
```javascript
// js/analytics.js
export function initializeAnalytics() {
  if (import.meta.env.VITE_GA_TRACKING_ID) {
    gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_title: 'Lumenis Academy',
      page_location: window.location.href
    })
  }
}

export function trackEvent(eventName, parameters = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'Lumenis Academy',
      ...parameters
    })
  }
}
```

### Error Monitoring (Sentry):
```javascript
// js/error-monitoring.js
import * as Sentry from "@sentry/browser"

export function initializeErrorMonitoring() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Filter sensitive data
        if (event.user) {
          delete event.user.email
        }
        return event
      }
    })
  }
}
```

## 🧪 Estratégia de Beta Testing

### 1. Soft Launch
- **Público limitado**: 100 usuários iniciais
- **Funcionalidades core**: Login, cursos básicos, dashboard
- **Feedback ativo**: Formulários e analytics

### 2. Feedback Collection
```javascript
// js/feedback.js
export class FeedbackCollector {
  constructor() {
    this.feedbackData = []
  }

  collectFeedback(type, data) {
    const feedback = {
      type,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.feedbackData.push(feedback)
    this.sendToAnalytics(feedback)
  }

  sendToAnalytics(feedback) {
    // Send to your analytics platform
    console.log('Feedback collected:', feedback)
  }
}
```

### 3. A/B Testing
- **Versão A**: Interface atual
- **Versão B**: Interface otimizada
- **Métricas**: Engajamento, conversão, tempo na página

## 🔧 Configuração de Produção

### Environment Variables:
```bash
# .env.production
VITE_APP_ENV=production
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_producao
VITE_STRIPE_PUBLIC_KEY=pk_live_sua_chave_stripe
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://sua-dsn-sentry
```

### Build Otimizado:
```javascript
// vite.config.prod.js
export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js', 'three'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

## 📈 Métricas de Sucesso para Beta

### KPIs Principais:
- **Taxa de Registro**: > 15%
- **Engajamento**: > 60% completam primeira lição
- **Retenção D7**: > 40%
- **NPS**: > 50
- **Tempo médio na plataforma**: > 15 minutos

### Ferramentas de Monitoramento:
- **Google Analytics 4**: Comportamento do usuário
- **Hotjar**: Heatmaps e gravações de sessão
- **Supabase Analytics**: Dados do banco
- **Uptime Robot**: Monitoramento de disponibilidade

## 🎉 Lançamento da Beta

### Timeline Sugerida:
1. **Semana 1**: Deploy em staging + testes internos
2. **Semana 2**: Soft launch com 50 usuários
3. **Semana 3**: Expansão para 200 usuários
4. **Semana 4**: Launch público da beta

### Comunicação:
- **Landing page** específica para beta
- **Email marketing** para lista de interessados
- **Redes sociais** com hashtag #LumenisBeta
- **Parcerias** com influenciadores educacionais

### Suporte Beta:
- **Chat ao vivo** durante horário comercial
- **FAQ** específico para beta
- **Canal Discord** para comunidade beta
- **Formulário de feedback** integrado

## 🔄 Processo de Atualização

### Deploy Contínuo:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

**Pronto para o lançamento! 🚀**