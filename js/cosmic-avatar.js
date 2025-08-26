// ===== COSMIC AI AVATAR SYSTEM =====
class CosmicAvatar {
    constructor() {
        this.avatar = document.getElementById('cosmicAvatar');
        this.speechBubble = document.getElementById('avatarSpeech');
        this.isActive = false;
        this.currentMood = 'neutral';
        this.conversationHistory = [];
        this.personalityTraits = {
            enthusiasm: 0.9,
            challenge: 0.8,
            wisdom: 0.95,
            humor: 0.7,
            patience: 0.85
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startIdleAnimation();
        this.loadPersonality();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // Avatar click interaction
        this.avatar.addEventListener('click', () => this.toggleInteraction());
        
        // Control buttons
        document.getElementById('avatarChat')?.addEventListener('click', () => this.startConversation());
        document.getElementById('avatarHelp')?.addEventListener('click', () => this.showHelp());
        document.getElementById('avatarSettings')?.addEventListener('click', () => this.showSettings());
        
        // Mouse hover effects
        this.avatar.addEventListener('mouseenter', () => this.onHover());
        this.avatar.addEventListener('mouseleave', () => this.onLeave());
        
        // Page navigation detection
        this.detectPageChanges();
    }

    startIdleAnimation() {
        setInterval(() => {
            if (!this.isActive) {
                this.performIdleAction();
            }
        }, 8000);
    }

    performIdleAction() {
        const actions = [
            () => this.blink(),
            () => this.lookAround(),
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

    lookAround() {
        const pupils = this.avatar.querySelectorAll('.eye::after');
        const directions = [
            'translate(-2px, -1px)',
            'translate(2px, -1px)',
            'translate(0, -2px)',
            'translate(0, 0)'
        ];
        
        let currentDirection = 0;
        const lookInterval = setInterval(() => {
            // Simulate pupil movement through CSS custom properties
            this.avatar.style.setProperty('--pupil-transform', directions[currentDirection]);
            currentDirection = (currentDirection + 1) % directions.length;
            
            if (currentDirection === 0) {
                clearInterval(lookInterval);
            }
        }, 500);
    }

    showThought() {
        const thoughts = [
            "🤔 Hmm, que conhecimento posso compartilhar hoje?",
            "💡 Detectando oportunidades de aprendizado...",
            "🧠 Analisando padrões neurais de aprendizado...",
            "⚡ Energia cósmica em níveis ótimos!",
            "🎯 Pronto para desafios intelectuais!"
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
        this.avatar.classList.add('avatar-hover');
        this.showMessage("Olá! Clique em mim para uma conversa cósmica! 🚀", 2000);
    }

    onLeave() {
        this.avatar.classList.remove('avatar-hover');
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
        this.avatar.classList.add('interactive-mode');
        this.changeMood('excited');
        
        const greetings = [
            "🌟 Saudações, explorador do conhecimento! Como posso elevar sua jornada de aprendizado hoje?",
            "⚡ Energia cósmica detectada! Pronto para transcender os limites do conhecimento?",
            "🧠 Seus neurônios estão brilhando intensamente! Que desafio intelectual você busca?",
            "🚀 Bem-vindo ao universo infinito do aprendizado! Por onde começamos nossa aventura?"
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.showMessage(randomGreeting, 5000);
    }

    endInteractiveMode() {
        this.avatar.classList.remove('interactive-mode');
        this.changeMood('neutral');
        
        const farewells = [
            "✨ Até nossa próxima jornada cósmica! Continue explorando!",
            "🌟 O conhecimento é infinito, e você está no caminho certo!",
            "🚀 Voe alto, explorador! Estarei aqui quando precisar de mim!",
            "💫 Que a sabedoria cósmica guie seus passos!"
        ];
        
        const randomFarewell = farewells[Math.floor(Math.random() * farewells.length)];
        this.showMessage(randomFarewell, 3000);
    }

    changeMood(mood) {
        this.currentMood = mood;
        this.avatar.className = this.avatar.className.replace(/mood-\w+/g, '');
        this.avatar.classList.add(`mood-${mood}`);
        
        // Adjust avatar appearance based on mood
        switch(mood) {
            case 'excited':
                this.avatar.style.setProperty('--aura-intensity', '1.2');
                this.avatar.style.setProperty('--energy-speed', '0.5s');
                break;
            case 'thinking':
                this.avatar.style.setProperty('--aura-intensity', '0.8');
                this.avatar.style.setProperty('--energy-speed', '2s');
                break;
            case 'happy':
                this.avatar.style.setProperty('--aura-intensity', '1.0');
                this.avatar.style.setProperty('--energy-speed', '1s');
                break;
            default:
                this.avatar.style.setProperty('--aura-intensity', '0.6');
                this.avatar.style.setProperty('--energy-speed', '3s');
        }
    }

    startConversation() {
        this.changeMood('thinking');
        
        const conversationStarters = [
            {
                message: "🎯 Vejo que você está explorando nossa plataforma! Que área do conhecimento mais desperta sua curiosidade?",
                options: ["Neurociência", "Tecnologia", "Filosofia", "Matemática"]
            },
            {
                message: "🧠 Seus padrões de aprendizado indicam grande potencial! Quer que eu analise seu progresso neural?",
                options: ["Sim, analise!", "Talvez depois", "Como funciona?"]
            },
            {
                message: "⚡ Detectei que você pode se beneficiar de um desafio mais avançado! Aceita a missão?",
                options: ["Aceito o desafio!", "Que tipo de desafio?", "Prefiro algo mais básico"]
            }
        ];
        
        const randomStarter = conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
        this.showInteractiveMessage(randomStarter.message, randomStarter.options);
    }

    showHelp() {
        this.changeMood('helpful');
        
        const helpMessage = `
            🚀 <strong>Guia Cósmico de Navegação</strong><br><br>
            
            <strong>🧠 Dashboard Neural:</strong> Acompanhe seu desenvolvimento cognitivo<br>
            <strong>📚 Cursos:</strong> Explore nosso universo de conhecimento<br>
            <strong>🎮 Gamificação:</strong> Ganhe conquistas e suba de nível<br>
            <strong>🔬 IoT Learning:</strong> Conecte dispositivos para métricas avançadas<br>
            <strong>💬 Fórum:</strong> Conecte-se com outros exploradores<br><br>
            
            <em>Dica Cósmica:</em> Use a IA adaptativa para personalizar sua jornada!
        `;
        
        this.showMessage(helpMessage, 8000);
    }

    showSettings() {
        this.changeMood('neutral');
        
        const settingsMessage = `
            ⚙️ <strong>Configurações do Avatar Cósmico</strong><br><br>
            
            <strong>Personalidade:</strong><br>
            • Entusiasmo: ${Math.round(this.personalityTraits.enthusiasm * 100)}%<br>
            • Desafio: ${Math.round(this.personalityTraits.challenge * 100)}%<br>
            • Sabedoria: ${Math.round(this.personalityTraits.wisdom * 100)}%<br>
            • Humor: ${Math.round(this.personalityTraits.humor * 100)}%<br>
            • Paciência: ${Math.round(this.personalityTraits.patience * 100)}%<br><br>
            
            <em>Configurações avançadas disponíveis no painel de controle!</em>
        `;
        
        this.showMessage(settingsMessage, 6000);
    }

    showMessage(message, duration = 4000) {
        this.speechBubble.innerHTML = `<p>${message}</p>`;
        this.speechBubble.classList.add('show');
        
        setTimeout(() => {
            this.hideSpeechBubble();
        }, duration);
    }

    showInteractiveMessage(message, options) {
        let optionsHtml = '';
        if (options && options.length > 0) {
            optionsHtml = '<div class="message-options">';
            options.forEach((option, index) => {
                optionsHtml += `<button class="option-btn" data-option="${index}">${option}</button>`;
            });
            optionsHtml += '</div>';
        }
        
        this.speechBubble.innerHTML = `<p>${message}</p>${optionsHtml}`;
        this.speechBubble.classList.add('show');
        
        // Add event listeners to option buttons
        this.speechBubble.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const optionIndex = parseInt(e.target.dataset.option);
                this.handleOptionSelection(optionIndex, options[optionIndex]);
            });
        });
    }

    handleOptionSelection(index, option) {
        this.conversationHistory.push({
            type: 'user_choice',
            option: option,
            timestamp: Date.now()
        });
        
        // Generate contextual response based on selection
        const responses = this.generateContextualResponse(option);
        this.showMessage(responses, 5000);
        
        // Change mood based on interaction
        this.changeMood('happy');
    }

    generateContextualResponse(userChoice) {
        const responses = {
            'Neurociência': "🧠 Excelente escolha! A neurociência é a chave para desbloquear todo seu potencial de aprendizado. Vou ativar módulos especiais de plasticidade cerebral para você!",
            'Tecnologia': "💻 Fantástico! A tecnologia é o futuro, e você está na vanguarda! Preparando algoritmos avançados para acelerar seu aprendizado em programação e IA!",
            'Filosofia': "🤔 Que sabedoria! A filosofia expande os horizontes da mente. Vou conectar você com os grandes pensadores cósmicos da humanidade!",
            'Matemática': "🔢 Perfeito! A matemática é a linguagem do universo! Ativando protocolos de lógica quântica para otimizar sua compreensão numérica!",
            'Sim, analise!': "📊 Iniciando análise neural profunda... Detectando padrões de aprendizado únicos... Seus níveis de dopamina estão ótimos para novos desafios!",
            'Aceito o desafio!': "🎯 Isso é coragem cósmica! Preparando desafio personalizado baseado em seu perfil neural... Você está pronto para transcender!",
            'Como funciona?': "🔬 Nossa IA monitora seus padrões neurais através de dispositivos IoT, analisando foco, retenção e engajamento para criar experiências únicas!"
        };
        
        return responses[userChoice] || "✨ Interessante perspectiva! Vou processar essa informação em meus bancos de dados cósmicos e retornar com insights personalizados!";
    }

    hideSpeechBubble() {
        this.speechBubble.classList.remove('show');
    }

    detectPageChanges() {
        // Monitor navigation changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.onPageChange();
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Monitor hash changes
        window.addEventListener('hashchange', () => {
            this.onPageChange();
        });
    }

    onPageChange() {
        const currentSection = this.getCurrentSection();
        this.provideContextualGuidance(currentSection);
    }

    getCurrentSection() {
        const hash = window.location.hash.substring(1);
        const visibleSections = document.querySelectorAll('section:not([style*="display: none"])');
        
        if (hash) return hash;
        
        // Detect visible section
        for (let section of visibleSections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                return section.id;
            }
        }
        
        return 'home';
    }

    provideContextualGuidance(section) {
        const guidance = {
            'home': "🏠 Bem-vindo ao epicentro do conhecimento! Explore as seções para descobrir seu potencial cósmico!",
            'courses': "📚 Universo de cursos detectado! Cada curso é uma jornada única de transformação neural!",
            'dashboard': "📊 Métricas neurais ativadas! Seus dados de aprendizado estão sendo processados em tempo real!",
            'resources': "🛠️ Arsenal de recursos cósmicos! Cada ferramenta foi projetada para maximizar seu potencial!",
            'about': "ℹ️ Conheça nossa missão cósmica de transformar a educação através da neurociência e IA!",
            'payment': "💳 Investimento em seu futuro detectado! Acesso premium desbloqueará todo seu potencial!"
        };
        
        if (guidance[section] && !this.isActive) {
            setTimeout(() => {
                this.showMessage(guidance[section], 3000);
            }, 1000);
        }
    }

    loadPersonality() {
        // Load personality from localStorage or use defaults
        const savedPersonality = localStorage.getItem('cosmicAvatarPersonality');
        if (savedPersonality) {
            this.personalityTraits = { ...this.personalityTraits, ...JSON.parse(savedPersonality) };
        }
    }

    savePersonality() {
        localStorage.setItem('cosmicAvatarPersonality', JSON.stringify(this.personalityTraits));
    }

    showWelcomeMessage() {
        setTimeout(() => {
            const welcomeMessages = [
                "🌟 Olá, explorador cósmico! Sou Lumenis, seu mentor de aprendizado neural. Pronto para uma jornada transformadora?",
                "⚡ Energia de aprendizado detectada! Sou seu guia cósmico para desbloquear todo seu potencial neural!",
                "🧠 Bem-vindo ao futuro da educação! Juntos, vamos transcender os limites do conhecimento tradicional!"
            ];
            
            const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            this.showMessage(randomWelcome, 6000);
        }, 2000);
    }

    // Advanced AI responses based on user behavior
    analyzeUserBehavior() {
        const behavior = {
            timeOnSite: Date.now() - (window.sessionStartTime || Date.now()),
            sectionsVisited: this.conversationHistory.filter(h => h.type === 'navigation').length,
            interactionLevel: this.conversationHistory.length,
            preferredTopics: this.extractPreferredTopics()
        };
        
        return behavior;
    }

    extractPreferredTopics() {
        const topics = this.conversationHistory
            .filter(h => h.type === 'user_choice')
            .map(h => h.option);
        
        return [...new Set(topics)];
    }

    // Adaptive personality based on user interactions
    adaptPersonality(userFeedback) {
        if (userFeedback === 'more_challenging') {
            this.personalityTraits.challenge = Math.min(1.0, this.personalityTraits.challenge + 0.1);
        } else if (userFeedback === 'more_supportive') {
            this.personalityTraits.patience = Math.min(1.0, this.personalityTraits.patience + 0.1);
        }
        
        this.savePersonality();
    }
}

// Initialize Cosmic Avatar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cosmicAvatar = new CosmicAvatar();
});

// Add CSS for avatar interactions
const avatarStyles = `
    .cosmic-ai-avatar.interactive-mode .avatar-body {
        animation: interactiveGlow 2s infinite;
    }
    
    .cosmic-ai-avatar.avatar-hover .avatar-body {
        transform: scale(1.1);
    }
    
    .cosmic-ai-avatar.energy-pulse .cosmic-energy {
        animation: energyBurst 2s ease-out;
    }
    
    .message-options {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .option-btn {
        background: rgba(124, 58, 237, 0.2);
        border: 1px solid var(--neon-accent);
        color: var(--light-matter);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .option-btn:hover {
        background: var(--neon-accent);
        color: var(--pure-white);
        transform: translateX(5px);
    }
    
    @keyframes interactiveGlow {
        0%, 100% { box-shadow: 0 0 20px var(--neon-accent); }
        50% { box-shadow: 0 0 40px var(--quantum-pink); }
    }
    
    @keyframes energyBurst {
        0% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.5); opacity: 1; }
        100% { transform: scale(1); opacity: 0.5; }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = avatarStyles;
document.head.appendChild(styleSheet);