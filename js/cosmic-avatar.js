// ===== COSMIC AI AVATAR SYSTEM - SIMPLIFIED =====
class CosmicAvatar {
    constructor() {
        this.avatar = document.getElementById('cosmicAvatar');
        this.speechBubble = document.getElementById('avatarSpeech');
        this.isActive = false;
        this.currentMood = 'neutral';
        
        this.init();
    }

    init() {
        if (!this.avatar || !this.speechBubble) {
            console.log('Avatar elements not found, skipping initialization');
            return;
        }
        
        this.setupEventListeners();
        this.startIdleAnimation();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // Avatar click interaction
        this.avatar.addEventListener('click', () => this.toggleInteraction());
        
        // Control buttons
        const chatBtn = document.getElementById('avatarChat');
        const helpBtn = document.getElementById('avatarHelp');
        const settingsBtn = document.getElementById('avatarSettings');
        
        if (chatBtn) chatBtn.addEventListener('click', () => this.startConversation());
        if (helpBtn) helpBtn.addEventListener('click', () => this.showHelp());
        if (settingsBtn) settingsBtn.addEventListener('click', () => this.showSettings());
        
        // Mouse hover effects
        this.avatar.addEventListener('mouseenter', () => this.onHover());
        this.avatar.addEventListener('mouseleave', () => this.onLeave());
    }

    startIdleAnimation() {
        setInterval(() => {
            if (!this.isActive) {
                this.performIdleAction();
            }
        }, 10000);
    }

    performIdleAction() {
        const actions = [
            () => this.blink(),
            () => this.showThought(),
            () => this.energyPulse()
        ];
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        randomAction();
    }

    blink() {
        const eyes = this.avatar.querySelectorAll('.eye');
        eyes.forEach(eye => {
            eye.style.transform = 'scaleY(0.1)';
            setTimeout(() => {
                eye.style.transform = 'scaleY(1)';
            }, 150);
        });
    }

    showThought() {
        const thoughts = [
            "🤔 Que conhecimento posso compartilhar hoje?",
            "💡 Detectando oportunidades de aprendizado...",
            "🧠 Analisando padrões de estudo...",
            "⚡ Energia cósmica em níveis ótimos!",
            "🎯 Pronto para novos desafios!"
        ];
        
        const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
        this.showMessage(randomThought, 3000);
    }

    energyPulse() {
        this.avatar.classList.add('energy-pulse');
        setTimeout(() => {
            this.avatar.classList.remove('energy-pulse');
        }, 2000);
    }

    onHover() {
        this.showMessage("Olá! Clique em mim para uma conversa cósmica! 🚀", 2000);
    }

    onLeave() {
        this.hideSpeechBubble();
    }

    toggleInteraction() {
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            this.startInteractiveMode();
        } else {
            this.endInteractiveMode();
        }
    }

    startInteractiveMode() {
        this.changeMood('excited');
        
        const greetings = [
            "🌟 Saudações, explorador do conhecimento! Como posso ajudar hoje?",
            "⚡ Energia de aprendizado detectada! Pronto para transcender limites?",
            "🧠 Seus neurônios estão brilhando! Que desafio você busca?",
            "🚀 Bem-vindo ao universo do aprendizado! Por onde começamos?"
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.showMessage(randomGreeting, 5000);
    }

    endInteractiveMode() {
        this.changeMood('neutral');
        
        const farewells = [
            "✨ Até nossa próxima jornada! Continue explorando!",
            "🌟 O conhecimento é infinito! Você está no caminho certo!",
            "🚀 Voe alto, explorador! Estarei aqui quando precisar!",
            "💫 Que a sabedoria cósmica guie seus passos!"
        ];
        
        const randomFarewell = farewells[Math.floor(Math.random() * farewells.length)];
        this.showMessage(randomFarewell, 3000);
    }

    changeMood(mood) {
        this.currentMood = mood;
        // Simple mood changes without complex CSS
    }

    startConversation() {
        const conversationStarters = [
            "🎯 Vejo que você está explorando nossa plataforma! Que área mais te interessa?",
            "🧠 Quer que eu analise seu progresso de aprendizado?",
            "⚡ Detectei potencial para desafios avançados! Aceita a missão?"
        ];
        
        const randomStarter = conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
        this.showMessage(randomStarter, 6000);
    }

    showHelp() {
        const helpMessage = `
            🚀 <strong>Guia de Navegação</strong><br><br>
            
            <strong>🏠 Início:</strong> Página principal com informações<br>
            <strong>📚 Cursos:</strong> Explore nosso catálogo de cursos<br>
            <strong>🛠️ Recursos:</strong> Ferramentas educacionais<br>
            <strong>ℹ️ Sobre:</strong> Conheça nossa missão<br>
            <strong>📊 Dashboard:</strong> Acompanhe seu progresso (após login)<br><br>
            
            <em>Dica:</em> Faça login para acessar recursos premium!
        `;
        
        this.showMessage(helpMessage, 8000);
    }

    showSettings() {
        const settingsMessage = `
            ⚙️ <strong>Configurações do Avatar</strong><br><br>
            
            <strong>Status:</strong> Online e funcionando<br>
            <strong>Modo:</strong> Assistente educacional<br>
            <strong>Personalidade:</strong> Entusiasmado e sábio<br><br>
            
            <em>Configurações avançadas disponíveis após login!</em>
        `;
        
        this.showMessage(settingsMessage, 6000);
    }

    showMessage(message, duration = 4000) {
        if (!this.speechBubble) return;
        
        this.speechBubble.innerHTML = `<p>${message}</p>`;
        this.speechBubble.classList.add('show');
        
        setTimeout(() => {
            this.hideSpeechBubble();
        }, duration);
    }

    hideSpeechBubble() {
        if (this.speechBubble) {
            this.speechBubble.classList.remove('show');
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            const welcomeMessages = [
                "🌟 Olá! Sou Lumenis, seu mentor de aprendizado. Pronto para começar?",
                "⚡ Bem-vindo ao futuro da educação! Como posso ajudar hoje?",
                "🧠 Energia de conhecimento detectada! Vamos aprender juntos!"
            ];
            
            const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            this.showMessage(randomWelcome, 5000);
        }, 3000);
    }
}

// Initialize Cosmic Avatar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 Inicializando Cosmic Avatar...');
    window.cosmicAvatar = new CosmicAvatar();
});