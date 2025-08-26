// ===== MATH FUNDAMENTAL MODULE CONTROLLER =====
class MathFundamentalModule {
    constructor() {
        this.currentLesson = 1;
        this.totalLessons = 4;
        this.progress = 0;
        this.neuralMetrics = {
            focus: 85,
            engagement: 78,
            comprehension: 92
        };
        this.notes = '';
        this.exerciseData = [];
        this.currentExercise = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadExerciseData();
        this.initializeVideoControls();
        this.startNeuralTracking();
        this.loadSavedNotes();
        this.updateProgress();
    }

    setupEventListeners() {
        // Lesson navigation
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchLesson(e));
        });

        // Lesson completion
        document.getElementById('completeLesson1')?.addEventListener('click', () => this.completeLesson(1));

        // AI Tutor
        document.getElementById('floatingAI')?.addEventListener('click', () => this.toggleAITutor());
        document.getElementById('closeTutor')?.addEventListener('click', () => this.closeAITutor());
        document.getElementById('sendTutorMessage')?.addEventListener('click', () => this.sendTutorMessage());
        document.getElementById('tutorInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendTutorMessage();
        });

        // Notes
        document.getElementById('takeNotesBtn')?.addEventListener('click', () => this.toggleNotes());
        document.getElementById('closeNotes')?.addEventListener('click', () => this.closeNotes());
        document.getElementById('saveNotes')?.addEventListener('click', () => this.saveNotes());

        // Exercise controls
        document.getElementById('nextQuestion')?.addEventListener('click', () => this.nextExercise());
        document.getElementById('prevQuestion')?.addEventListener('click', () => this.prevExercise());

        // Answer checking
        document.querySelectorAll('.check-answer').forEach(btn => {
            btn.addEventListener('click', (e) => this.checkAnswer(e));
        });

        // Video events
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('timeupdate', () => this.updateVideoProgress(video));
            video.addEventListener('ended', () => this.onVideoEnded(video));
        });
    }

    switchLesson(e) {
        const lessonNumber = parseInt(e.currentTarget.dataset.lesson);
        
        // Check if lesson is unlocked
        if (!this.isLessonUnlocked(lessonNumber)) {
            this.showMessage('Complete a lição anterior para desbloquear esta!', 'warning');
            return;
        }

        // Update active lesson
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        // Show lesson content
        document.querySelectorAll('.lesson-view').forEach(view => {
            view.style.display = 'none';
        });
        document.getElementById(`lesson-${lessonNumber}`).style.display = 'block';

        this.currentLesson = lessonNumber;
        this.trackNeuralMetric('lesson_switch', { lesson: lessonNumber });
    }

    isLessonUnlocked(lessonNumber) {
        // First lesson is always unlocked
        if (lessonNumber === 1) return true;
        
        // Check if previous lesson is completed
        const prevLesson = document.querySelector(`[data-lesson="${lessonNumber - 1}"]`);
        return prevLesson?.querySelector('.lesson-status').classList.contains('completed');
    }

    completeLesson(lessonNumber) {
        // Mark lesson as completed
        const lessonItem = document.querySelector(`[data-lesson="${lessonNumber}"]`);
        const statusIcon = lessonItem.querySelector('.lesson-status');
        
        statusIcon.classList.add('completed');
        statusIcon.innerHTML = '<i class="fas fa-check"></i>';
        
        // Unlock next lesson
        const nextLesson = document.querySelector(`[data-lesson="${lessonNumber + 1}"]`);
        if (nextLesson) {
            const nextStatus = nextLesson.querySelector('.lesson-status');
            nextStatus.innerHTML = '<i class="fas fa-play"></i>';
            nextStatus.style.opacity = '1';
        }
        
        // Update progress
        this.progress = (lessonNumber / this.totalLessons) * 100;
        this.updateProgress();
        
        // Show completion message
        this.showMessage('Lição concluída! Parabéns pelo progresso!', 'success');
        
        // Track completion
        this.trackNeuralMetric('lesson_completed', { 
            lesson: lessonNumber,
            progress: this.progress 
        });
        
        // Trigger dopamine boost animation
        this.triggerDopamineBoost();
    }

    updateProgress() {
        const progressFill = document.getElementById('moduleProgress');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${this.progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(this.progress)}% Concluído`;
        }
    }

    triggerDopamineBoost() {
        // Visual feedback for dopamine release
        const body = document.body;
        body.classList.add('dopamine-boost');
        
        setTimeout(() => {
            body.classList.remove('dopamine-boost');
        }, 2000);
        
        // Update neural metrics
        this.neuralMetrics.engagement = Math.min(100, this.neuralMetrics.engagement + 5);
        this.updateNeuralDisplay();
    }

    updateNeuralDisplay() {
        Object.keys(this.neuralMetrics).forEach(metric => {
            const metricElement = document.querySelector(`[data-metric="${metric}"] .metric-fill`);
            if (metricElement) {
                metricElement.style.width = `${this.neuralMetrics[metric]}%`;
            }
        });
    }

    startNeuralTracking() {
        // Simulate neural metric updates
        setInterval(() => {
            this.updateNeuralMetrics();
        }, 10000);
    }

    updateNeuralMetrics() {
        // Simulate realistic neural metric changes
        Object.keys(this.neuralMetrics).forEach(metric => {
            const variation = (Math.random() - 0.5) * 4; // -2 to +2
            this.neuralMetrics[metric] = Math.max(0, Math.min(100, this.neuralMetrics[metric] + variation));
        });
        
        this.updateNeuralDisplay();
        this.trackNeuralMetric('periodic_update', this.neuralMetrics);
    }

    trackNeuralMetric(event, data) {
        // Send neural metrics to backend
        const metrics = {
            event: event,
            data: data,
            timestamp: Date.now(),
            lesson: this.currentLesson,
            neuralState: this.neuralMetrics
        };
        
        // In production, send to API
        console.log('Neural metrics tracked:', metrics);
        
        // Store locally for now
        const storedMetrics = JSON.parse(localStorage.getItem('neuralMetrics') || '[]');
        storedMetrics.push(metrics);
        localStorage.setItem('neuralMetrics', JSON.stringify(storedMetrics.slice(-100))); // Keep last 100
    }

    // AI Tutor functionality
    toggleAITutor() {
        const panel = document.getElementById('aiTutorPanel');
        const btn = document.getElementById('floatingAI');
        
        panel.classList.toggle('open');
        btn.classList.toggle('active');
        
        if (panel.classList.contains('open')) {
            this.initializeAIConversation();
        }
    }

    closeAITutor() {
        const panel = document.getElementById('aiTutorPanel');
        const btn = document.getElementById('floatingAI');
        
        panel.classList.remove('open');
        btn.classList.remove('active');
    }

    initializeAIConversation() {
        // Add contextual AI message based on current lesson
        const contextMessages = {
            1: "Vejo que você está na introdução! A matemática é a linguagem do universo. Tem alguma dúvida sobre os conceitos básicos?",
            2: "Adição e subtração são as bases! Seu cérebro está criando novas conexões neurais. Como está se sentindo com os exercícios?",
            3: "Multiplicação é adição repetida! Posso explicar de forma visual como seu cérebro processa essas operações?",
            4: "Hora dos exercícios! Lembre-se: errar faz parte do aprendizado e fortalece suas conexões neurais."
        };
        
        const message = contextMessages[this.currentLesson] || "Como posso ajudar com matemática hoje?";
        
        setTimeout(() => {
            this.addAIMessage(message);
        }, 500);
    }

    sendTutorMessage() {
        const input = document.getElementById('tutorInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addUserMessage(message);
        input.value = '';
        
        // Generate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addAIMessage(response);
        }, 1000);
    }

    addUserMessage(message) {
        const conversation = document.getElementById('tutorConversation');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'tutor-message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
        conversation.appendChild(messageDiv);
        conversation.scrollTop = conversation.scrollHeight;
    }

    addAIMessage(message) {
        const conversation = document.getElementById('tutorConversation');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'tutor-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        conversation.appendChild(messageDiv);
        conversation.scrollTop = conversation.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Context-aware responses based on current lesson and user input
        if (lowerMessage.includes('não entendi') || lowerMessage.includes('dúvida')) {
            return "Entendo sua dúvida! Vamos quebrar isso em partes menores. Qual parte específica está causando confusão? Posso explicar de forma mais visual ou com exemplos práticos.";
        }
        
        if (lowerMessage.includes('difícil') || lowerMessage.includes('complicado')) {
            return "Percebo que está achando desafiador! Isso é normal e até benéfico - seu cérebro está formando novas conexões. Que tal tentarmos uma abordagem diferente? Posso sugerir exercícios mais simples primeiro.";
        }
        
        if (lowerMessage.includes('exercício') || lowerMessage.includes('prática')) {
            return "Excelente! A prática é fundamental para a neuroplasticidade. Vou criar alguns exercícios personalizados baseados no seu nível atual. Prefere começar com problemas visuais ou numéricos?";
        }
        
        if (lowerMessage.includes('como') || lowerMessage.includes('por que')) {
            return "Ótima pergunta! Vou explicar o 'porquê' por trás do conceito. Entender o raciocínio ajuda seu cérebro a criar conexões mais fortes e duradouras.";
        }
        
        // Default responses based on current lesson
        const lessonResponses = {
            1: "Na introdução, focamos em despertar sua curiosidade matemática. A matemática está em tudo - desde a proporção áurea nas flores até os algoritmos que usamos. Que aspecto mais te interessa?",
            2: "Adição e subtração são como respirar para o cérebro matemático! Seu córtex parietal está processando essas operações. Quer que eu mostre como visualizar essas operações mentalmente?",
            3: "Multiplicação é fascinante! É como seu cérebro faz 'atalhos' neurais. Posso ensinar truques de multiplicação que aproveitam a forma como seu cérebro naturalmente processa padrões.",
            4: "Exercícios são onde a mágica acontece! Cada erro é uma oportunidade de fortalecer conexões neurais. Vamos resolver juntos?"
        };
        
        return lessonResponses[this.currentLesson] || "Interessante! Como posso ajudar você a dominar esse conceito? Lembre-se: seu cérebro é capaz de coisas incríveis!";
    }

    // Notes functionality
    toggleNotes() {
        const panel = document.getElementById('notesPanel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        
        if (panel.style.display === 'flex') {
            setTimeout(() => {
                panel.classList.add('open');
            }, 10);
        }
    }

    closeNotes() {
        const panel = document.getElementById('notesPanel');
        panel.classList.remove('open');
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    }

    saveNotes() {
        const textarea = document.getElementById('notesTextarea');
        this.notes = textarea.value;
        
        // Save to localStorage
        localStorage.setItem(`notes_math_lesson_${this.currentLesson}`, this.notes);
        
        this.showMessage('Anotações salvas com sucesso!', 'success');
    }

    loadSavedNotes() {
        const savedNotes = localStorage.getItem(`notes_math_lesson_${this.currentLesson}`);
        if (savedNotes) {
            const textarea = document.getElementById('notesTextarea');
            if (textarea) {
                textarea.value = savedNotes;
                this.notes = savedNotes;
            }
        }
    }

    // Exercise functionality
    loadExerciseData() {
        this.exerciseData = [
            {
                question: "Maria tinha 25 maçãs. Ela deu 8 maçãs para seus amigos. Quantas maçãs sobraram?",
                type: "word_problem",
                answer: 17,
                explanation: "25 - 8 = 17. Esta é uma operação de subtração simples.",
                hint: "Pense em tirar 8 de um total de 25."
            },
            {
                question: "Um ônibus transporta 45 passageiros. Na próxima parada, sobem mais 12 pessoas. Quantas pessoas estão no ônibus agora?",
                type: "word_problem", 
                answer: 57,
                explanation: "45 + 12 = 57. Somamos os passageiros iniciais com os novos.",
                hint: "Adicione os novos passageiros ao número inicial."
            },
            {
                question: "Calcule: 6 × 8 = ?",
                type: "calculation",
                answer: 48,
                explanation: "6 × 8 = 48. Multiplicação é adição repetida: 6+6+6+6+6+6+6+6 = 48",
                hint: "Pense em 6 grupos de 8 ou 8 grupos de 6."
            },
            {
                question: "Se 72 ÷ 9 = ?, qual é o resultado?",
                type: "calculation",
                answer: 8,
                explanation: "72 ÷ 9 = 8. Divisão pergunta: quantas vezes 9 cabe em 72?",
                hint: "Quantos grupos de 9 você pode fazer com 72?"
            },
            {
                question: "João tem 3 caixas com 15 lápis cada. Quantos lápis ele tem no total?",
                type: "word_problem",
                answer: 45,
                explanation: "3 × 15 = 45. Multiplicamos o número de caixas pela quantidade em cada caixa.",
                hint: "Multiplique o número de caixas pela quantidade em cada uma."
            }
        ];
    }

    loadCurrentExercise() {
        const exercise = this.exerciseData[this.currentExercise];
        const container = document.getElementById('exerciseContent');
        
        container.innerHTML = `
            <div class="exercise-question">
                <h3>Questão ${this.currentExercise + 1}</h3>
                <p class="question-text">${exercise.question}</p>
                <div class="answer-section">
                    <input type="number" id="exerciseAnswer" class="answer-input" placeholder="Sua resposta">
                    <button class="btn btn-solid" id="checkExerciseAnswer">Verificar</button>
                </div>
                <div class="exercise-feedback" id="exerciseFeedback"></div>
                <button class="btn btn-outline hint-btn" id="showHint" style="display: none;">
                    <i class="fas fa-lightbulb"></i> Dica
                </button>
            </div>
        `;
        
        // Update question counter
        document.getElementById('currentQuestion').textContent = this.currentExercise + 1;
        document.getElementById('totalQuestions').textContent = this.exerciseData.length;
        
        // Add event listeners
        document.getElementById('checkExerciseAnswer').addEventListener('click', () => this.checkExerciseAnswer());
        document.getElementById('showHint').addEventListener('click', () => this.showHint());
        
        // Update navigation buttons
        document.getElementById('prevQuestion').disabled = this.currentExercise === 0;
        document.getElementById('nextQuestion').disabled = this.currentExercise === this.exerciseData.length - 1;
    }

    checkExerciseAnswer() {
        const input = document.getElementById('exerciseAnswer');
        const feedback = document.getElementById('exerciseFeedback');
        const exercise = this.exerciseData[this.currentExercise];
        const userAnswer = parseInt(input.value);
        
        if (isNaN(userAnswer)) {
            feedback.innerHTML = '<p class="incorrect">Por favor, digite um número válido.</p>';
            feedback.className = 'exercise-feedback incorrect';
            return;
        }
        
        if (userAnswer === exercise.answer) {
            feedback.innerHTML = `
                <p class="correct">
                    <i class="fas fa-check-circle"></i> Correto! Excelente raciocínio!
                </p>
                <p class="explanation">${exercise.explanation}</p>
            `;
            feedback.className = 'exercise-feedback correct';
            
            // Trigger dopamine boost
            this.triggerDopamineBoost();
            
            // Track correct answer
            this.trackNeuralMetric('correct_answer', {
                exercise: this.currentExercise,
                answer: userAnswer,
                attempts: 1
            });
            
        } else {
            feedback.innerHTML = `
                <p class="incorrect">
                    <i class="fas fa-times-circle"></i> Não é bem isso. Tente novamente!
                </p>
            `;
            feedback.className = 'exercise-feedback incorrect';
            
            // Show hint button
            document.getElementById('showHint').style.display = 'inline-block';
            
            // Track incorrect answer
            this.trackNeuralMetric('incorrect_answer', {
                exercise: this.currentExercise,
                userAnswer: userAnswer,
                correctAnswer: exercise.answer
            });
        }
        
        feedback.style.opacity = '1';
    }

    showHint() {
        const exercise = this.exerciseData[this.currentExercise];
        const feedback = document.getElementById('exerciseFeedback');
        
        feedback.innerHTML += `<p class="hint"><i class="fas fa-lightbulb"></i> Dica: ${exercise.hint}</p>`;
        
        document.getElementById('showHint').style.display = 'none';
    }

    nextExercise() {
        if (this.currentExercise < this.exerciseData.length - 1) {
            this.currentExercise++;
            this.loadCurrentExercise();
        }
    }

    prevExercise() {
        if (this.currentExercise > 0) {
            this.currentExercise--;
            this.loadCurrentExercise();
        }
    }

    // Video controls
    initializeVideoControls() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            const playPauseBtn = video.parentElement.querySelector('#playPauseBtn');
            const fullscreenBtn = video.parentElement.querySelector('#fullscreenBtn');
            
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', () => {
                    if (video.paused) {
                        video.play();
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        video.pause();
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                });
            }
            
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    }
                });
            }
        });
    }

    updateVideoProgress(video) {
        const progressFill = video.parentElement.querySelector('#videoProgress');
        if (progressFill) {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        // Track engagement
        this.trackNeuralMetric('video_progress', {
            currentTime: video.currentTime,
            duration: video.duration,
            progress: (video.currentTime / video.duration) * 100
        });
    }

    onVideoEnded(video) {
        // Auto-enable lesson completion when video ends
        const completeBtn = document.querySelector(`#completeLesson${this.currentLesson}`);
        if (completeBtn) {
            completeBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--neural-cyan))';
            completeBtn.innerHTML = '<i class="fas fa-check"></i> Lição Assistida - Clique para Concluir';
        }
        
        this.trackNeuralMetric('video_completed', {
            lesson: this.currentLesson,
            duration: video.duration
        });
    }

    checkAnswer(e) {
        const button = e.target;
        const correctAnswer = parseInt(button.dataset.correct);
        const input = button.parentElement.querySelector('.answer-input');
        const feedback = button.parentElement.parentElement.querySelector('.exercise-feedback');
        const userAnswer = parseInt(input.value);
        
        if (userAnswer === correctAnswer) {
            feedback.textContent = 'Correto! Excelente trabalho!';
            feedback.className = 'exercise-feedback correct';
            this.triggerDopamineBoost();
        } else {
            feedback.textContent = `Não é bem isso. A resposta correta é ${correctAnswer}. Tente entender o processo!`;
            feedback.className = 'exercise-feedback incorrect';
        }
        
        feedback.style.opacity = '1';
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `floating-message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
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
                document.body.removeChild(messageDiv);
            }, 300);
        }, 4000);
    }
}

// Initialize module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mathModule = new MathFundamentalModule();
    
    // Load first exercise if on lesson 4
    if (document.getElementById('lesson-4')) {
        window.mathModule.loadCurrentExercise();
    }
});

// Add floating message styles
const moduleStyles = `
    .floating-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--deep-space);
        border: 1px solid var(--neon-accent);
        border-radius: 10px;
        padding: 1rem;
        box-shadow: var(--shadow-cosmic);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    }
    
    .floating-message.show {
        transform: translateX(0);
    }
    
    .floating-message.success {
        border-color: var(--success-green);
    }
    
    .floating-message.warning {
        border-color: var(--warning-yellow);
    }
    
    .floating-message .message-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .floating-message.success .message-content i {
        color: var(--success-green);
    }
    
    .floating-message.warning .message-content i {
        color: var(--warning-yellow);
    }
    
    .dopamine-boost {
        animation: dopamineGlow 2s ease-out;
    }
    
    @keyframes dopamineGlow {
        0% { filter: brightness(1); }
        50% { filter: brightness(1.2) saturate(1.3); }
        100% { filter: brightness(1); }
    }
    
    .exercise-feedback.correct {
        background: rgba(16, 185, 129, 0.2);
        color: var(--success-green);
        border: 1px solid var(--success-green);
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
    }
    
    .exercise-feedback.incorrect {
        background: rgba(239, 68, 68, 0.2);
        color: var(--danger-red);
        border: 1px solid var(--danger-red);
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
    }
    
    .hint {
        background: rgba(245, 158, 11, 0.2);
        color: var(--warning-yellow);
        border: 1px solid var(--warning-yellow);
        border-radius: 8px;
        padding: 0.75rem;
        margin-top: 0.5rem;
        font-style: italic;
    }
    
    .explanation {
        margin-top: 0.5rem;
        font-style: italic;
        opacity: 0.9;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = moduleStyles;
document.head.appendChild(styleSheet);