# 🖥️ Guia Completo - XAMPP Setup para Lumenis Academy

## 📋 Pré-requisitos

- **XAMPP** (Apache + MySQL + PHP 8.1+)
- **Navegador moderno** (Chrome, Firefox, Edge)
- **Editor de código** (VS Code recomendado)

## 🚀 Passo a Passo Completo

### 1. Instalar e Configurar XAMPP

1. **Baixe o XAMPP** do site oficial: https://www.apachefriends.org/
2. **Instale** seguindo o assistente
3. **Inicie** Apache e MySQL no painel de controle do XAMPP

### 2. Configurar o Projeto

```bash
# Copie todo o projeto para a pasta htdocs do XAMPP
# Caminho padrão: C:\xampp\htdocs\LumenisAcademy
```

### 3. Configurar o Banco de Dados

1. **Acesse phpMyAdmin**: http://localhost/phpmyadmin
2. **Crie o banco de dados**:
   - Clique em "Novo"
   - Nome: `lumenis_academy`
   - Collation: `utf8mb4_unicode_ci`
   - Clique em "Criar"

3. **Importe o schema**:
   - Selecione o banco `lumenis_academy`
   - Clique na aba "SQL"
   - Copie e cole o conteúdo do arquivo `supabase/migrations/20250826235823_broad_crystal.sql`
   - Clique em "Executar"

### 4. Configurar Credenciais

Edite o arquivo `api/config.php` se necessário:

```php
// Configuração padrão do XAMPP (geralmente não precisa alterar)
define('DB_HOST', 'localhost');
define('DB_NAME', 'lumenis_academy');
define('DB_USER', 'root');
define('DB_PASS', ''); // Senha vazia no XAMPP padrão
```

### 5. Testar a Instalação

1. **Acesse**: http://localhost/LumenisAcademy
2. **Teste o login** com:
   - Email: `admin@lumenis.com`
   - Senha: `123456`

### 6. Estrutura de Pastas no XAMPP

```
C:\xampp\htdocs\LumenisAcademy\
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos principais
├── js/
│   ├── main.js             # Controlador principal
│   ├── data.js             # Dados dos cursos
│   └── cosmic-avatar.js    # Sistema do avatar
├── api/
│   ├── config.php          # Configurações
│   ├── auth.php            # Autenticação
│   ├── courses.php         # Gestão de cursos
│   ├── neural.php          # Métricas neurais
│   ├── payments.php        # Pagamentos
│   └── .htaccess          # Configurações Apache
├── modules/
│   ├── math-fundamental/   # Módulo de matemática
│   └── python-complete/    # Módulo de Python
└── uploads/               # Arquivos enviados
```

## 🔧 Configurações Avançadas

### Apache Virtual Host (Opcional)

Para usar um domínio local como `lumenis.local`:

1. **Edite o arquivo hosts**:
   - Windows: `C:\Windows\System32\drivers\etc\hosts`
   - Adicione: `127.0.0.1 lumenis.local`

2. **Configure Virtual Host** em `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName lumenis.local
    DocumentRoot "C:/xampp/htdocs/LumenisAcademy"
    
    <Directory "C:/xampp/htdocs/LumenisAcademy">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

3. **Reinicie o Apache** no painel do XAMPP

### Configurações de Segurança

O projeto já inclui:
- ✅ **Proteção XSS** - Headers de segurança
- ✅ **Proteção SQL Injection** - Prepared statements
- ✅ **Rate Limiting** - Controle de tentativas
- ✅ **Validação de entrada** - Sanitização de dados
- ✅ **Autenticação JWT** - Tokens seguros
- ✅ **Hash de senhas** - Argon2ID

## 🧪 Testando Funcionalidades

### 1. Teste de Login
- Acesse: http://localhost/LumenisAcademy
- Clique em "Login"
- Use: `admin@lumenis.com` / `123456`

### 2. Teste de Registro
- Clique em "Cadastre-se gratuitamente"
- Preencha os dados
- Verifique se o usuário foi criado no banco

### 3. Teste de Cursos
- Navegue para "Cursos"
- Teste diferentes categorias
- Acesse um curso gratuito

### 4. Teste do Dashboard
- Faça login
- Acesse o Dashboard
- Verifique as métricas neurais

## 🔍 Solução de Problemas

### Problema: "Erro de conexão com banco"
**Solução**: 
- Verifique se MySQL está rodando no XAMPP
- Confirme se o banco `lumenis_academy` foi criado
- Verifique as credenciais em `api/config.php`

### Problema: "Página não carrega"
**Solução**:
- Verifique se Apache está rodando
- Confirme o caminho: `C:\xampp\htdocs\LumenisAcademy`
- Teste: http://localhost/LumenisAcademy

### Problema: "API não funciona"
**Solução**:
- Verifique se o arquivo `.htaccess` está na pasta `api/`
- Confirme se mod_rewrite está habilitado no Apache
- Teste diretamente: http://localhost/LumenisAcademy/api/auth.php

### Problema: "Erro 500"
**Solução**:
- Verifique os logs do Apache em `C:\xampp\apache\logs\error.log`
- Ative `DEBUG_MODE` em `api/config.php`
- Verifique permissões das pastas

## 📊 Monitoramento

### Logs do Sistema
- **Apache**: `C:\xampp\apache\logs\`
- **MySQL**: `C:\xampp\mysql\data\`
- **Aplicação**: `logs/` (criado automaticamente)

### Verificação de Saúde
- **Apache**: http://localhost/dashboard
- **MySQL**: http://localhost/phpmyadmin
- **Aplicação**: http://localhost/LumenisAcademy

## 🎯 Próximos Passos

1. ✅ **Configure o XAMPP**
2. ✅ **Importe o banco de dados**
3. ✅ **Teste todas as funcionalidades**
4. 🔄 **Personalize conforme necessário**
5. 🚀 **Prepare para produção**

## 📞 Suporte Rápido

### Comandos Úteis XAMPP:
- **Iniciar serviços**: Painel de Controle XAMPP
- **Parar serviços**: Painel de Controle XAMPP
- **Reiniciar Apache**: Stop → Start no painel
- **Acessar logs**: Botão "Logs" no painel

### URLs Importantes:
- **Aplicação**: http://localhost/LumenisAcademy
- **phpMyAdmin**: http://localhost/phpmyadmin
- **Dashboard XAMPP**: http://localhost/dashboard

**Agora você pode rodar o projeto localmente com total segurança! 🚀**