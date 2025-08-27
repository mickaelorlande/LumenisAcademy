// ===== LUMENIS ACADEMY - MAIN CONTROLLER SIMPLIFICADO =====
class LumenisAcademy {
    constructor() {
        this.currentSection = 'home';
        this.isLoggedIn = false;
        this.userData = null;
        this.currentOdsCard = 0;
        this.loadingProgress = 0;
        
        this.init();
    }

    init() {
        console.log('🚀 Inicializando Lumenis Academy...');
        
        // Simular loading rápido e funcional
        this.simulateLoading();
    }

    simulateLoading() {
        const progressBar = document.querySelector('.loading-progress');
        const loadingText = document.querySelector('.loading-text');
        
        const messages = [
            'Carregando interface...',
            'Preparando cursos...',
            'Ativando sistema...',
            'Quase pronto!'
        ];
        
        let messageIndex = 0;
        
        const loadingInterval = setInterval(() => {
            this.loadingProgress += 25;
            
            if (progressBar) {
                progressBar.style.width = `${this.loadingProgress}%`;
            }
            
            if (loadingText && messageIndex < messages.length) {
                loadingText.textContent = messages[messageIndex];
                messageIndex++;
            }
            
            if (this.loadingProgress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    this.hideLoadingScreen();
                    this.startApplication();
                }, 500);
            }
        }, 500);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    startApplication() {
        console.log('✅ Aplicação iniciada com sucesso!');
        
        this.setupEventListeners();
        this.initializeComponents();
        this.createQuantumParticles();
        this.setupAnimations();
        this.loadCourses();
        this.setupOdsFlashcards();
        this.checkUserSession();
        this.initializeCharts();
        
        // Mostrar mensagem de boas-vindas
        this.showWelcomeMessage();
    }

    showWelcomeMessage() {
        setTimeout(() => {
            if (window.cosmicAvatar) {
                window.cosmicAvatar.showMessage(
                    "🌟 Bem-vindo à Lumenis Academy! Sua jornada de conhecimento cósmico começa agora!",
                    4000
                );
            }
        }, 1000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Login/Register buttons
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('startNowBtn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('startNowHeroBtn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('exploreCoursesBtn')?.addEventListener('click', () => this.navigateToSection('courses'));

        // Modal controls
        document.getElementById('closeModal')?.addEventListener('click', () => this.hideModal('loginModal'));
        document.getElementById('closePaymentModal')?.addEventListener('click', () => this.hideModal('paymentModal'));
        
        // Forms
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('paymentForm')?.addEventListener('submit', (e) => this.handlePayment(e));

        // Course categories
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterCourses(e.target.dataset.category));
        });

        // Resource cards
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleResourceClick(e));
        });

        // Payment plans
        document.querySelectorAll('.plan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePlanSelection(e));
        });

        // ODS Flashcards
        document.getElementById('prevOds')?.addEventListener('click', () => this.previousOdsCard());
        document.getElementById('nextOds')?.addEventListener('click', () => this.nextOdsCard());

        // Mascot interaction
        document.getElementById('cosmicMascote')?.addEventListener('click', () => this.interactWithMascot());

        // Register link
        document.getElementById('registerLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        // Window events
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    initializeComponents() {
        this.initializeProgressTracking();
        this.simulateIoTDevices();
    }

    createQuantumParticles() {
        const container = document.getElementById('quantum-particles');
        if (!container) return;
        
        const particleCount = 20; // Reduzido para melhor performance
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('quantum-particle');
            
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.5 + 0.1;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            container.appendChild(particle);
        }
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate').forEach(el => {
            observer.observe(el);
        });
    }

    loadCourses() {
        const courseGrid = document.getElementById('courseGrid');
        if (!courseGrid) return;

        this.renderCourses('featured');
    }

    renderCourses(category) {
        const courseGrid = document.getElementById('courseGrid');
        const courses = window.LumenisData?.courses[category] || [];
        
        courseGrid.innerHTML = '';
        
        courses.forEach(course => {
            const courseCard = this.createCourseCard(course);
            courseGrid.appendChild(courseCard);
        });
    }

    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.dataset.courseId = course.id;
        
        const premiumBadge = course.premium ? '<div class="course-tag premium"><i class="fas fa-crown"></i> Premium</div>' : '';
        
        card.innerHTML = `
            <div class="course-image" style="background-image: url('${course.image}')">
                <div class="course-tag">${this.getCategoryName(course.category)}</div>
                ${premiumBadge}
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <div class="course-level">${course.level}</div>
                    <a href="#" class="course-btn" data-course="${course.id}">
                        ${course.premium ? 'Adquirir' : 'Acessar'} <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        
        // Add event listeners
        const courseBtn = card.querySelector('.course-btn');
        if (courseBtn) {
            courseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (course.premium) {
                    this.showPaymentModal(course);
                } else {
                    this.accessCourse(course);
                }
            });
        }
        
        card.addEventListener('click', () => this.showCourseDetail(course));
        
        return card;
    }

    getCategoryName(category) {
        const names = {
            'featured': 'Destaque',
            'fundamental': 'Fundamental',
            'medio': 'Médio',
            'enem': 'ENEM',
            'eja': 'EJA',
            'technology': 'Tecnologia',
            'autodidata': 'Autodidata'
        };
        return names[category] || category;
    }

    filterCourses(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
        
        this.renderCourses(category);
    }

    setupOdsFlashcards() {
        const flashcards = document.querySelectorAll('.ods-flashcard');
        
        flashcards.forEach((card, index) => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
            
            if (index !== this.currentOdsCard) {
                card.classList.remove('active');
            }
        });
        
        this.updateOdsCards();
    }

    nextOdsCard() {
        const flashcards = document.querySelectorAll('.ods-flashcard');
        this.currentOdsCard = (this.currentOdsCard + 1) % flashcards.length;
        this.updateOdsCards();
    }

    previousOdsCard() {
        const flashcards = document.querySelectorAll('.ods-flashcard');
        this.currentOdsCard = this.currentOdsCard === 0 ? flashcards.length - 1 : this.currentOdsCard - 1;
        this.updateOdsCards();
    }

    updateOdsCards() {
        const flashcards = document.querySelectorAll('.ods-flashcard');
        
        flashcards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === this.currentOdsCard) {
                card.classList.add('active');
            }
        });
    }

    initializeCharts() {
        const ctx = document.getElementById('neuralChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Desenvolvimento Neural',
                        data: [65, 70, 75, 80, 85, 90],
                        borderColor: '#7C3AED',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#E2E8F0' }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { color: '#E2E8F0' },
                            grid: { color: 'rgba(124, 58, 237, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#E2E8F0' },
                            grid: { color: 'rgba(124, 58, 237, 0.1)' }
                        }
                    }
                }
            });
        }
    }

    simulateIoTDevices() {
        setInterval(() => {
            this.updateIoTMetrics();
        }, 5000);
    }

    updateIoTMetrics() {
        const devices = document.querySelectorAll('.iot-device .stat');
        
        devices.forEach(stat => {
            const text = stat.textContent;
            const match = text.match(/(\d+)%/);
            if (match) {
                const currentValue = parseInt(match[1]);
                const variation = Math.floor(Math.random() * 6) - 3; // -3 a +3
                const newValue = Math.max(70, Math.min(100, currentValue + variation));
                stat.textContent = text.replace(/\d+%/, `${newValue}%`);
            }
        });
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.target.dataset.section;
        if (section) {
            this.navigateToSection(section);
        }
    }

    navigateToSection(section) {
        // Hide all sections
        document.querySelectorAll('main > section').forEach(s => {
            s.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = section;
            
            // Update URL
            window.history.pushState({}, '', `#${section}`);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Load section data
            this.onSectionChange(section);
        }
    }

    onSectionChange(section) {
        switch(section) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'courses':
                this.loadCourses();
                break;
        }
    }

    showLoginModal() {
        this.showModal('loginModal');
    }

    showPaymentModal(course) {
        const modal = document.getElementById('paymentModal');
        const selectedPlan = document.getElementById('selectedPlan');
        
        if (course && selectedPlan) {
            selectedPlan.innerHTML = `
                <h4>${course.title}</h4>
                <div class="plan-price">
                    <span class="currency">R$</span>
                    <span class="amount">${course.price || 297}</span>
                    <span class="period">vitalício</span>
                </div>
            `;
        }
        
        this.showModal('paymentModal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            this.showMessage('Por favor, preencha todos os campos!', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.showLoadingInButton(submitBtn);
        
        try {
            // Simular login (substituir por chamada real da API)
            const response = await this.simulateLogin(email, password);
            
            if (response.success) {
                this.isLoggedIn = true;
                this.userData = response.user;
                
                this.updateUserInterface();
                this.hideModal('loginModal');
                this.navigateToSection('dashboard');
                
                this.showMessage('Login realizado com sucesso!', 'success');
            } else {
                this.showMessage(response.error || 'Erro no login', 'error');
            }
        } catch (error) {
            this.showMessage('Erro de conexão. Tente novamente.', 'error');
        } finally {
            this.restoreButton(submitBtn);
        }
    }

    async simulateLogin(email, password) {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validação simples para demonstração
        if (email === 'admin@lumenis.com' && password === '123456') {
            return {
                success: true,
                user: {
                    id: 1,
                    email: email,
                    firstName: 'Admin',
                    lastName: 'Lumenis',
                    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=50',
                    premium: true
                }
            };
        } else if (email.includes('@') && password.length >= 6) {
            return {
                success: true,
                user: {
                    id: 2,
                    email: email,
                    firstName: email.split('@')[0],
                    lastName: 'Estudante',
                    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=50',
                    premium: false
                }
            };
        } else {
            return {
                success: false,
                error: 'Email ou senha inválidos'
            };
        }
    }

    showRegisterForm() {
        const modalContent = document.querySelector('#loginModal .modal-content');
        modalContent.innerHTML = `
            <span class="close-modal" id="closeModal">&times;</span>
            <h3>Criar Conta Gratuita</h3>
            <form id="registerForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">Nome</label>
                        <input type="text" id="firstName" class="form-control" placeholder="Seu nome" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Sobrenome</label>
                        <input type="text" id="lastName" class="form-control" placeholder="Seu sobrenome" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="registerEmail">E-mail</label>
                    <input type="email" id="registerEmail" class="form-control" placeholder="seu@email.com" required>
                </div>
                <div class="form-group">
                    <label for="registerPassword">Senha</label>
                    <input type="password" id="registerPassword" class="form-control" placeholder="Mínimo 6 caracteres" required>
                </div>
                <button type="submit" class="btn btn-solid" style="width: 100%;">Criar Conta</button>
            </form>
            <div class="register-link">
                Já tem uma conta? <a href="#" id="loginLink">Faça login!</a>
            </div>
        `;
        
        // Re-add event listeners
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal('loginModal'));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('loginLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
    }

    showLoginForm() {
        const modalContent = document.querySelector('#loginModal .modal-content');
        modalContent.innerHTML = `
            <span class="close-modal" id="closeModal">&times;</span>
            <h3>Acesso à Plataforma</h3>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" class="form-control" placeholder="seu@email.com" required>
                </div>
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input type="password" id="password" class="form-control" placeholder="Sua senha" required>
                </div>
                <button type="submit" class="btn btn-solid" style="width: 100%;">Entrar</button>
            </form>
            <div class="register-link">
                Não tem uma conta? <a href="#" id="registerLink">Cadastre-se gratuitamente!</a>
            </div>
        `;
        
        // Re-add event listeners
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal('loginModal'));
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        if (!firstName || !lastName || !email || !password) {
            this.showMessage('Por favor, preencha todos os campos!', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showMessage('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.showLoadingInButton(submitBtn);
        
        try {
            // Simular registro
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.isLoggedIn = true;
            this.userData = {
                id: Date.now(),
                email: email,
                firstName: firstName,
                lastName: lastName,
                avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=50',
                premium: false
            };
            
            this.updateUserInterface();
            this.hideModal('loginModal');
            this.navigateToSection('dashboard');
            
            this.showMessage('Conta criada com sucesso! Bem-vindo à Lumenis Academy!', 'success');
        } catch (error) {
            this.showMessage('Erro ao criar conta. Tente novamente.', 'error');
        } finally {
            this.restoreButton(submitBtn);
        }
    }

    handlePayment(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.showLoadingInButton(submitBtn);
        
        setTimeout(() => {
            this.hideModal('paymentModal');
            this.showMessage('Pagamento processado com sucesso! Acesso premium ativado!', 'success');
            
            if (this.userData) {
                this.userData.premium = true;
                this.updateUserInterface();
            }
            
            this.restoreButton(submitBtn);
        }, 2000);
    }

    handlePlanSelection(e) {
        const planType = e.target.dataset.plan;
        this.showPaymentModal({ title: 'Plano Premium', price: 297 });
    }

    showLoadingInButton(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        button.disabled = true;
        button.dataset.originalText = originalText;
    }

    restoreButton(button) {
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.disabled = false;
    }

    updateUserInterface() {
        if (this.isLoggedIn && this.userData) {
            document.getElementById('loginBtn').style.display = 'none';
            const userMenu = document.getElementById('userMenu');
            userMenu.style.display = 'block';
            
            const userAvatarImg = document.getElementById('userAvatarImg');
            userAvatarImg.src = this.userData.avatar;
            userAvatarImg.alt = `${this.userData.firstName} ${this.userData.lastName}`;
            
            // Save session
            this.saveUserSession();
        }
    }

    logout() {
        this.isLoggedIn = false;
        this.userData = null;
        
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('userMenu').style.display = 'none';
        
        localStorage.removeItem('lumenisUserSession');
        this.navigateToSection('home');
        
        this.showMessage('Logout realizado com sucesso!', 'success');
    }

    handleResourceClick(e) {
        const resourceType = e.currentTarget.dataset.resource;
        
        switch(resourceType) {
            case 'library':
                this.showMessage('Biblioteca em desenvolvimento! Em breve disponível.', 'info');
                break;
            case 'forum':
                this.showMessage('Fórum em desenvolvimento! Em breve disponível.', 'info');
                break;
            case 'tutoring':
                this.showMessage('Tutoria premium! Faça upgrade para acessar.', 'info');
                break;
            case 'articles':
                this.showMessage('Artigos premium! Faça upgrade para acessar.', 'info');
                break;
        }
    }

    accessCourse(course) {
        if (course.id === 'matematica-fund') {
            window.location.href = 'modules/math-fundamental/index.html';
        } else if (course.id === 'python-completo') {
            if (this.userData?.premium) {
                window.location.href = 'modules/python-complete/index.html';
            } else {
                this.showMessage('Curso premium! Faça upgrade para acessar.', 'info');
            }
        } else {
            this.showMessage('Curso em desenvolvimento! Em breve disponível.', 'info');
        }
    }

    showCourseDetail(course) {
        this.showMessage(`Detalhes do curso: ${course.title}`, 'info');
    }

    loadDashboardData() {
        if (!this.isLoggedIn) {
            this.navigateToSection('home');
            this.showMessage('Faça login para acessar o dashboard!', 'error');
            return;
        }
        
        // Simular dados do dashboard
        this.updateDashboardMetrics();
    }

    updateDashboardMetrics() {
        const metrics = document.querySelectorAll('.neural-fill');
        metrics.forEach(metric => {
            const randomValue = Math.floor(Math.random() * 30) + 70; // 70-100%
            metric.style.width = `${randomValue}%`;
        });
    }

    interactWithMascot() {
        const mascot = document.getElementById('cosmicMascote');
        mascot.classList.add('dancing');
        
        setTimeout(() => {
            mascot.classList.remove('dancing');
        }, 2000);
        
        if (window.cosmicAvatar) {
            window.cosmicAvatar.showMessage(
                "🎉 Que energia fantástica! Pronto para uma jornada cósmica de aprendizado?",
                4000
            );
        }
    }

    handleScroll() {
        const header = document.getElementById('mainHeader');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(15, 23, 42, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        }
    }

    initializeProgressTracking() {
        this.trackingData = {
            sessionStart: Date.now(),
            interactions: []
        };
    }

    checkUserSession() {
        const savedSession = localStorage.getItem('lumenisUserSession');
        if (savedSession) {
            try {
                const sessionData = JSON.parse(savedSession);
                if (sessionData.expiresAt > Date.now()) {
                    this.isLoggedIn = true;
                    this.userData = sessionData.userData;
                    this.updateUserInterface();
                }
            } catch (error) {
                console.error('Erro ao carregar sessão:', error);
                localStorage.removeItem('lumenisUserSession');
            }
        }
    }

    saveUserSession() {
        if (this.isLoggedIn && this.userData) {
            const sessionData = {
                userData: this.userData,
                expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
            };
            localStorage.setItem('lumenisUserSession', JSON.stringify(sessionData));
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `floating-message ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-triangle' : 
                    'info-circle';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado - Iniciando Lumenis Academy...');
    window.lumenisApp = new LumenisAcademy();
});

// Add message styles
const messageStyles = `
    .floating-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--deep-space);
        border: 1px solid var(--neon-accent);
        border-radius: 10px;
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-cosmic);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    }
    
    .floating-message.show {
        transform: translateX(0);
    }
    
    .floating-message.success {
        border-color: var(--success-green);
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--deep-space));
    }
    
    .floating-message.error {
        border-color: var(--danger-red);
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), var(--deep-space));
    }
    
    .floating-message.info {
        border-color: var(--neural-cyan);
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), var(--deep-space));
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--light-matter);
    }
    
    .floating-message.success .message-content i {
        color: var(--success-green);
    }
    
    .floating-message.error .message-content i {
        color: var(--danger-red);
    }
    
    .floating-message.info .message-content i {
        color: var(--neural-cyan);
    }
    
    .dancing {
        animation: mascotDance 2s ease-in-out;
    }
    
    @keyframes mascotDance {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(-5deg) scale(1.05); }
        50% { transform: rotate(0deg) scale(1.1); }
        75% { transform: rotate(5deg) scale(1.05); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = messageStyles;
document.head.appendChild(styleSheet);