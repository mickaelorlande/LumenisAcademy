// ===== PYTHON COMPLETE MODULE CONTROLLER =====
class PythonCompleteModule {
    constructor() {
        this.currentLesson = 2; // Starting at lesson 2 (Sintaxe Básica)
        this.totalLessons = 8;
        this.progress = 15; // 1 lesson completed
        this.neuralMetrics = {
            programming: 78,
            algorithmic: 65,
            problemSolving: 82
        };
        this.codeHistory = [];
        this.currentTab = 'main';
        this.aiPersonality = 'expert'; // expert, encouraging, challenging
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCodeEditor();
        this.initializePythonEnvironment();
        this.startAdvancedNeuralTracking();
        this.loadUserProgress();
        this.setupAITutor();
        this.updateProgress();
    }

    setupEventListeners() {
        // Lesson navigation
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchLesson(e));
        });

        // Code playground
        document.getElementById('runCode')?.addEventListener('click', () => this.runPythonCode());
        document.getElementById('clearCode')?.addEventListener('click', () => this.clearCode());

        // Project workspace
        document.getElementById('runProject')?.addEventListener('click', () => this.runProject());
        document.getElementById('downloadProject')?.addEventListener('click', () => this.downloadProject());
        document.getElementById('shareProject')?.addEventListener('click', () => this.shareProject());

        // Workspace tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // AI Tutor
        document.getElementById('floatingAI')?.addEventListener('click', () => this.toggleAITutor());
        document.getElementById('closeTutor')?.addEventListener('click', () => this.closeAITutor());
        document.getElementById('sendTutorMessage')?.addEventListener('click', () => this.sendTutorMessage());
        
        // AI Suggestions
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAISuggestion(e.target.dataset.suggestion));
        });

        // PDF Modal
        document.getElementById('downloadPDF')?.addEventListener('click', () => this.showPDFModal());
        document.getElementById('closePdfModal')?.addEventListener('click', () => this.hidePDFModal());
        document.getElementById('markPdfRead')?.addEventListener('click', () => this.markPDFAsRead());

        // Lesson completion
        document.getElementById('completeLesson2')?.addEventListener('click', () => this.completeLesson(2));

        // Code editor enhancements
        document.getElementById('pythonCode')?.addEventListener('input', (e) => this.onCodeChange(e));
        document.getElementById('tutorInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendTutorMessage();
        });
    }

    initializeCodeEditor() {
        const codeEditor = document.getElementById('pythonCode');
        if (codeEditor) {
            // Add syntax highlighting and auto-completion
            this.setupCodeHighlighting(codeEditor);
            this.addCodeSnippets();
        }
    }

    setupCodeHighlighting(editor) {
        // Enhanced code editor with real-time syntax highlighting
        editor.addEventListener('input', () => {
            this.highlightSyntax(editor);
            this.trackCodingMetrics(editor.value);
        });

        editor.addEventListener('keydown', (e) => {
            // Auto-indentation
            if (e.key === 'Enter') {
                this.handleAutoIndent(e, editor);
            }
            
            // Auto-completion
            if (e.key === 'Tab') {
                e.preventDefault();
                this.handleAutoComplete(editor);
            }
        });
    }

    handleAutoIndent(e, editor) {
        const lines = editor.value.split('\n');
        const currentLine = lines[lines.length - 1];
        
        // Check if current line ends with ':'
        if (currentLine.trim().endsWith(':')) {
            e.preventDefault();
            const indent = '    '; // 4 spaces
            const cursorPos = editor.selectionStart;
            const newValue = editor.value.substring(0, cursorPos) + '\n' + indent + editor.value.substring(cursorPos);
            editor.value = newValue;
            editor.selectionStart = editor.selectionEnd = cursorPos + indent.length + 1;
        }
    }

    handleAutoComplete(editor) {
        const cursorPos = editor.selectionStart;
        const textBeforeCursor = editor.value.substring(0, cursorPos);
        const lastWord = textBeforeCursor.split(/\s+/).pop();
        
        const completions = {
            'pr': 'print()',
            'inp': 'input()',
            'def': 'def function_name():',
            'if': 'if condition:',
            'for': 'for item in items:',
            'wh': 'while condition:',
            'try': 'try:\n    pass\nexcept Exception as e:\n    print(e)'
        };
        
        if (completions[lastWord]) {
            const completion = completions[lastWord];
            const newValue = textBeforeCursor.slice(0, -lastWord.length) + completion + editor.value.substring(cursorPos);
            editor.value = newValue;
            
            // Position cursor appropriately
            if (completion.includes('()')) {
                editor.selectionStart = editor.selectionEnd = cursorPos - lastWord.length + completion.indexOf('()') + 1;
            }
        }
    }

    addCodeSnippets() {
        // Add common Python snippets to the playground
        const snippets = [
            {
                name: 'Hello World',
                code: 'print("Olá, Lumenis Academy!")'
            },
            {
                name: 'Variáveis',
                code: `nome = "Estudante"
idade = 25
print(f"Olá, {nome}! Você tem {idade} anos.")`
            },
            {
                name: 'Loop For',
                code: `for i in range(5):
    print(f"Contando: {i}")`
            },
            {
                name: 'Função Simples',
                code: `def saudacao(nome):
    return f"Olá, {nome}!"

resultado = saudacao("Lumenis")
print(resultado)`
            }
        ];
        
        // Store snippets for quick access
        this.codeSnippets = snippets;
    }

    runPythonCode() {
        const code = document.getElementById('pythonCode').value;
        const output = document.getElementById('outputContent');
        
        if (!code.trim()) {
            output.textContent = 'Digite algum código Python primeiro!';
            return;
        }
        
        // Simulate Python execution (in production, use Pyodide or server-side execution)
        output.textContent = 'Executando código...';
        
        setTimeout(() => {
            try {
                const result = this.simulatePythonExecution(code);
                output.innerHTML = result;
                
                // Track successful execution
                this.trackCodingMetrics(code, 'execution_success');
                this.updateNeuralMetrics('programming', 2);
                
            } catch (error) {
                output.innerHTML = `<span class="error">Erro: ${error.message}</span>`;
                this.trackCodingMetrics(code, 'execution_error');
            }
        }, 1000);
    }

    simulatePythonExecution(code) {
        // Basic Python code simulation
        const lines = code.split('\n');
        let output = [];
        let variables = {};
        
        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue;
            
            try {
                if (line.startsWith('print(')) {
                    const content = line.match(/print\((.*)\)/)?.[1];
                    if (content) {
                        let result = this.evaluateExpression(content, variables);
                        output.push(result);
                    }
                } else if (line.includes('=') && !line.includes('==')) {
                    const [varName, varValue] = line.split('=').map(s => s.trim());
                    variables[varName] = this.evaluateExpression(varValue, variables);
                }
            } catch (e) {
                output.push(`Erro na linha: ${line}`);
            }
        }
        
        return output.length > 0 ? output.join('\n') : 'Código executado com sucesso!';
    }

    evaluateExpression(expr, variables) {
        // Simple expression evaluation
        expr = expr.replace(/['"]/g, ''); // Remove quotes for simplicity
        
        // Replace variables
        for (let [name, value] of Object.entries(variables)) {
            expr = expr.replace(new RegExp(`\\b${name}\\b`, 'g'), value);
        }
        
        // Handle f-strings (simplified)
        if (expr.includes('f"') || expr.includes("f'")) {
            expr = expr.replace(/f["'](.*)["']/, (match, content) => {
                return content.replace(/\{([^}]+)\}/g, (m, varName) => {
                    return variables[varName] || varName;
                });
            });
        }
        
        return expr;
    }

    clearCode() {
        document.getElementById('pythonCode').value = '';
        document.getElementById('outputContent').textContent = 'Código limpo! Digite novo código para executar.';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`tab-${tabName}`).style.display = 'block';
        
        this.currentTab = tabName;
    }

    runProject() {
        const output = document.getElementById('projectOutput');
        
        // Simulate running the calculator project
        output.innerHTML = '';
        
        const simulatedOutput = [
            '🧠 Calculadora Neural Lumenis',
            '========================================',
            '',
            'Escolha uma operação:',
            '1. Adição (+)',
            '2. Subtração (-)',
            '3. Multiplicação (*)',
            '4. Divisão (/)',
            '5. Análise Neural',
            '0. Sair',
            '',
            'Sua escolha: 1',
            'Digite o primeiro número: 15',
            'Digite o segundo número: 27',
            '',
            '🧮 Resultado: 15 + 27 = 42',
            '',
            '🧠 Processo Neural:',
            '   Adição ativa o córtex parietal inferior',
            '   Seu cérebro combina quantidades usando redes neurais especializadas',
            '💡 Dica de aprendizado: Visualize os números como objetos físicos sendo combinados',
            '',
            '🧠 Análise Neural:',
            '   Dopamina: +4%',
            '   Acetilcolina: 87%',
            '   Padrão detectado: Preferência por Adição'
        ];
        
        let lineIndex = 0;
        const typeInterval = setInterval(() => {
            if (lineIndex < simulatedOutput.length) {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.textContent = simulatedOutput[lineIndex];
                output.appendChild(line);
                output.scrollTop = output.scrollHeight;
                lineIndex++;
            } else {
                clearInterval(typeInterval);
                this.showProjectCompletionMessage();
            }
        }, 300);
        
        // Track project execution
        this.trackCodingMetrics('project_execution', 'project_run');
        this.updateNeuralMetrics('problemSolving', 5);
    }

    showProjectCompletionMessage() {
        this.showMessage('🎉 Projeto executado com sucesso! Você está dominando Python!', 'success');
        
        // Enable lesson completion
        const completeBtn = document.getElementById('completeLesson2');
        if (completeBtn) {
            completeBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--neural-cyan))';
            completeBtn.innerHTML = '<i class="fas fa-check"></i> Projeto Concluído - Finalizar Lição';
        }
    }

    downloadProject() {
        // Create downloadable project files
        const projectFiles = {
            'main.py': document.getElementById('tab-main').textContent,
            'neural_calc.py': document.getElementById('tab-neural').textContent,
            'utils.py': document.getElementById('tab-utils').textContent
        };
        
        // Create and download zip file (simplified)
        this.createDownloadableProject(projectFiles);
        this.showMessage('Projeto baixado! Verifique sua pasta de downloads.', 'success');
    }

    createDownloadableProject(files) {
        // In production, this would create a proper zip file
        // For now, download the main file
        const mainContent = files['main.py'];
        const blob = new Blob([mainContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calculadora_neural.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    shareProject() {
        // Share project functionality
        if (navigator.share) {
            navigator.share({
                title: 'Meu Projeto Python - Lumenis Academy',
                text: 'Confira meu projeto de Calculadora Neural em Python!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showMessage('Link copiado para a área de transferência!', 'success');
        }
    }

    // Advanced AI Tutor for Python
    setupAITutor() {
        this.aiResponses = {
            syntax: [
                "🐍 Python tem sintaxe muito limpa! Veja como é simples: `print('Hello')` vs outras linguagens que precisam de muito mais código.",
                "A indentação em Python não é apenas estilo - é parte da sintaxe! Seu cérebro processa hierarquia visual naturalmente.",
                "Variáveis em Python são dinâmicas: `x = 5` depois `x = 'texto'` funciona! Isso reduz carga cognitiva inicial."
            ],
            debug: [
                "🔍 Debugging é como ser um detetive neural! Leia a mensagem de erro de baixo para cima - Python te dá pistas precisas.",
                "Erro comum: `IndentationError` - Python usa indentação para estrutura. Mantenha consistência de 4 espaços!",
                "Use `print()` para debug! É como 'pensar em voz alta' - ajuda seu cérebro a rastrear o fluxo lógico."
            ],
            neural: [
                "🧠 Quando você programa, ativa as mesmas áreas cerebrais da linguagem! Por isso Python 'lê' como inglês.",
                "Loops treinam seu córtex pré-frontal para padrões repetitivos - como exercitar um músculo mental!",
                "Funções são como 'chunks' neurais - seu cérebro agrupa código relacionado para processar mais eficientemente."
            ]
        };
    }

    handleAISuggestion(suggestion) {
        const responses = this.aiResponses[suggestion] || [];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        if (randomResponse) {
            this.addAIMessage(randomResponse);
        }
    }

    generateAdvancedAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Advanced context-aware responses
        if (lowerMessage.includes('erro') || lowerMessage.includes('error')) {
            return this.generateErrorHelp(userMessage);
        }
        
        if (lowerMessage.includes('como') && lowerMessage.includes('funciona')) {
            return this.generateConceptExplanation(userMessage);
        }
        
        if (lowerMessage.includes('exercício') || lowerMessage.includes('prática')) {
            return this.generatePracticeExercise();
        }
        
        if (lowerMessage.includes('difícil') || lowerMessage.includes('não entendo')) {
            return this.generateEncouragementAndHelp(userMessage);
        }
        
        if (lowerMessage.includes('projeto') || lowerMessage.includes('calculadora')) {
            return this.generateProjectHelp();
        }
        
        // Default intelligent response
        return this.generateContextualResponse(userMessage);
    }

    generateErrorHelp(message) {
        const errorHelps = [
            "🔧 Vamos debuggar juntos! Primeiro, leia a mensagem de erro - Python é muito específico sobre o que está errado. Qual erro você está vendo?",
            "🎯 Erros são oportunidades de aprendizado! Seu cérebro está criando conexões mais fortes quando resolve problemas. Me mostre o código que está dando erro.",
            "🧠 Debugging ativa seu córtex pré-frontal - a mesma área usada para resolver quebra-cabeças! Vamos analisar linha por linha."
        ];
        
        return errorHelps[Math.floor(Math.random() * errorHelps.length)];
    }

    generateConceptExplanation(message) {
        return "🎓 Ótima pergunta! Vou explicar tanto o conceito técnico quanto como seu cérebro processa essa informação. Isso ajuda na retenção e compreensão profunda. Sobre qual conceito específico você quer saber?";
    }

    generatePracticeExercise() {
        const exercises = [
            "🎯 Que tal criar um programa que calcule sua idade em dias? Use: idade_anos * 365. Isso treina multiplicação e variáveis!",
            "🧮 Desafio neural: Crie um programa que peça 3 números e mostre o maior. Isso desenvolve lógica condicional!",
            "🔄 Exercício de loop: Faça um programa que conte de 1 a 10, mas pule o número 7. Use `for` e `if`!"
        ];
        
        return exercises[Math.floor(Math.random() * exercises.length)];
    }

    generateEncouragementAndHelp(message) {
        return "💪 Ei, isso é completamente normal! Programação é como aprender um novo idioma - seu cérebro precisa de tempo para formar novas conexões neurais. Vamos quebrar em partes menores. Qual parte específica está confusa?";
    }

    generateProjectHelp() {
        return "🚀 O projeto da calculadora é perfeito para consolidar conceitos! Ele combina entrada de dados, operações matemáticas, loops e condicionais. Quer que eu explique alguma parte específica do código?";
    }

    generateContextualResponse(message) {
        const responses = [
            "🤖 Interessante! Como especialista em Python e neurociência, posso abordar isso de várias formas. Prefere uma explicação técnica ou mais conceitual?",
            "🧠 Baseado no seu progresso neural, vejo que você está pronto para conceitos mais avançados! Vamos explorar isso juntos.",
            "⚡ Seu padrão de aprendizado indica alta capacidade lógica! Posso sugerir exercícios personalizados para acelerar seu desenvolvimento."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Advanced neural tracking for programming
    startAdvancedNeuralTracking() {
        // Track coding patterns and neural development
        setInterval(() => {
            this.analyzeCodePatterns();
            this.updateAdvancedMetrics();
        }, 15000);
    }

    analyzeCodePatterns() {
        const codeEditor = document.getElementById('pythonCode');
        if (!codeEditor) return;
        
        const code = codeEditor.value;
        const patterns = {
            functions: (code.match(/def\s+\w+/g) || []).length,
            loops: (code.match(/for\s+|while\s+/g) || []).length,
            conditionals: (code.match(/if\s+|elif\s+/g) || []).length,
            variables: (code.match(/\w+\s*=/g) || []).length,
            comments: (code.match(/#.*$/gm) || []).length
        };
        
        // Analyze complexity and update neural metrics
        const complexity = this.calculateCodeComplexity(patterns);
        this.updateNeuralMetrics('algorithmic', complexity * 2);
        
        // Store pattern analysis
        this.codeHistory.push({
            timestamp: Date.now(),
            patterns: patterns,
            complexity: complexity,
            lineCount: code.split('\n').length
        });
    }

    calculateCodeComplexity(patterns) {
        let complexity = 0;
        
        complexity += patterns.functions * 3;
        complexity += patterns.loops * 2;
        complexity += patterns.conditionals * 2;
        complexity += patterns.variables * 1;
        complexity += patterns.comments * 0.5; // Good practice bonus
        
        return Math.min(10, complexity); // Cap at 10
    }

    updateAdvancedMetrics() {
        // Simulate advanced neural metrics for programming
        const metrics = ['programming', 'algorithmic', 'problemSolving'];
        
        metrics.forEach(metric => {
            const variation = (Math.random() - 0.5) * 3; // -1.5 to +1.5
            this.neuralMetrics[metric] = Math.max(0, Math.min(100, this.neuralMetrics[metric] + variation));
        });
        
        this.updateNeuralDisplay();
        this.generateAIInsights();
    }

    updateNeuralMetrics(metric, boost) {
        this.neuralMetrics[metric] = Math.min(100, this.neuralMetrics[metric] + boost);
        this.updateNeuralDisplay();
    }

    updateNeuralDisplay() {
        Object.keys(this.neuralMetrics).forEach(metric => {
            const metricElement = document.querySelector(`.metric-fill.${metric.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            if (metricElement) {
                metricElement.style.width = `${this.neuralMetrics[metric]}%`;
            }
        });
    }

    generateAIInsights() {
        const insights = document.querySelector('.insight');
        if (!insights) return;
        
        const avgMetric = Object.values(this.neuralMetrics).reduce((a, b) => a + b, 0) / 3;
        
        const insightMessages = [
            `Seu desenvolvimento algorítmico está ${avgMetric > 80 ? 'excepcional' : avgMetric > 60 ? 'muito bom' : 'em crescimento'}! Continue praticando.`,
            `Detectei melhoria de ${Math.round(Math.random() * 10 + 5)}% na lógica de programação esta semana!`,
            `Seus padrões neurais indicam aptidão para ${avgMetric > 75 ? 'programação avançada' : 'conceitos intermediários'}!`,
            `Recomendo focar em ${this.getWeakestArea()} para desenvolvimento equilibrado.`
        ];
        
        const randomInsight = insightMessages[Math.floor(Math.random() * insightMessages.length)];
        insights.textContent = randomInsight;
    }

    getWeakestArea() {
        const areas = {
            programming: 'sintaxe e estruturas básicas',
            algorithmic: 'pensamento algorítmico',
            problemSolving: 'resolução de problemas complexos'
        };
        
        const weakest = Object.keys(this.neuralMetrics).reduce((a, b) => 
            this.neuralMetrics[a] < this.neuralMetrics[b] ? a : b
        );
        
        return areas[weakest];
    }

    trackCodingMetrics(code, event = 'code_change') {
        const metrics = {
            event: event,
            codeLength: code.length,
            lineCount: code.split('\n').length,
            timestamp: Date.now(),
            lesson: this.currentLesson,
            neuralState: this.neuralMetrics
        };
        
        // Store metrics
        const storedMetrics = JSON.parse(localStorage.getItem('pythonMetrics') || '[]');
        storedMetrics.push(metrics);
        localStorage.setItem('pythonMetrics', JSON.stringify(storedMetrics.slice(-200)));
        
        console.log('Python metrics tracked:', metrics);
    }

    onCodeChange(e) {
        const code = e.target.value;
        
        // Real-time code analysis
        this.analyzeCodeQuality(code);
        
        // Update engagement metrics
        this.updateNeuralMetrics('programming', 0.5);
    }

    analyzeCodeQuality(code) {
        const quality = {
            hasComments: code.includes('#'),
            hasFunctions: code.includes('def '),
            hasVariables: /\w+\s*=/.test(code),
            properIndentation: this.checkIndentation(code),
            pythonic: this.checkPythonicStyle(code)
        };
        
        // Provide real-time feedback
        this.showCodeQualityFeedback(quality);
    }

    checkIndentation(code) {
        const lines = code.split('\n');
        let indentationConsistent = true;
        
        for (let line of lines) {
            if (line.trim() && line.startsWith(' ')) {
                const spaces = line.match(/^ */)[0].length;
                if (spaces % 4 !== 0) {
                    indentationConsistent = false;
                    break;
                }
            }
        }
        
        return indentationConsistent;
    }

    checkPythonicStyle(code) {
        // Check for Pythonic patterns
        const pythonicPatterns = [
            /for\s+\w+\s+in\s+/, // for loops
            /if\s+__name__\s*==\s*['"']__main__['"]/, // main guard
            /def\s+\w+\(.*\):/, // function definitions
        ];
        
        return pythonicPatterns.some(pattern => pattern.test(code));
    }

    showCodeQualityFeedback(quality) {
        // Visual feedback for code quality (could be implemented as tooltips or sidebar)
        const qualityScore = Object.values(quality).filter(Boolean).length;
        
        if (qualityScore >= 4) {
            this.updateNeuralMetrics('programming', 1);
        }
    }

    // PDF functionality
    showPDFModal() {
        const modal = document.getElementById('pdfModal');
        modal.style.display = 'flex';
        
        // Track PDF access
        this.trackCodingMetrics('pdf_access', 'pdf_opened');
    }

    hidePDFModal() {
        const modal = document.getElementById('pdfModal');
        modal.style.display = 'none';
    }

    markPDFAsRead() {
        // Mark PDF as read and update progress
        this.showMessage('PDF marcado como lido! Isso contribui para seu progresso neural.', 'success');
        this.updateNeuralMetrics('programming', 3);
        this.hidePDFModal();
    }

    // Enhanced lesson completion
    completeLesson(lessonNumber) {
        // Advanced completion tracking
        const completionData = {
            lesson: lessonNumber,
            timeSpent: this.calculateTimeSpent(),
            codeWritten: this.codeHistory.length,
            neuralGrowth: this.calculateNeuralGrowth(),
            timestamp: Date.now()
        };
        
        // Mark lesson as completed
        const lessonItem = document.querySelector(`[data-lesson="${lessonNumber}"]`);
        const statusIcon = lessonItem.querySelector('.lesson-status');
        
        statusIcon.classList.add('completed');
        statusIcon.innerHTML = '<i class="fas fa-check"></i>';
        
        // Unlock next lesson
        const nextLesson = document.querySelector(`[data-lesson="${lessonNumber + 1}"]`);
        if (nextLesson) {
            const nextStatus = nextLesson.querySelector('.lesson-status');
            nextStatus.classList.remove('locked');
            nextStatus.classList.add('current');
            nextStatus.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        // Update progress
        this.progress = (lessonNumber / this.totalLessons) * 100;
        this.updateProgress();
        
        // Show advanced completion message
        this.showAdvancedCompletionMessage(completionData);
        
        // Trigger neural reward system
        this.triggerNeuralReward();
        
        // Save progress
        this.saveProgress(completionData);
    }

    calculateTimeSpent() {
        // Calculate time spent on current lesson
        const sessionStart = sessionStorage.getItem('lessonStartTime');
        if (sessionStart) {
            return Math.round((Date.now() - parseInt(sessionStart)) / 1000 / 60); // minutes
        }
        return 0;
    }

    calculateNeuralGrowth() {
        const initialMetrics = JSON.parse(sessionStorage.getItem('initialNeuralMetrics') || '{}');
        const currentMetrics = this.neuralMetrics;
        
        let totalGrowth = 0;
        let metricCount = 0;
        
        Object.keys(currentMetrics).forEach(metric => {
            if (initialMetrics[metric]) {
                totalGrowth += currentMetrics[metric] - initialMetrics[metric];
                metricCount++;
            }
        });
        
        return metricCount > 0 ? Math.round(totalGrowth / metricCount) : 0;
    }

    showAdvancedCompletionMessage(data) {
        const message = `
            🎉 <strong>Lição Concluída com Excelência!</strong><br><br>
            ⏱️ Tempo de estudo: ${data.timeSpent} minutos<br>
            💻 Código escrito: ${data.codeWritten} versões<br>
            🧠 Crescimento neural: +${data.neuralGrowth}%<br><br>
            <em>Seu cérebro está criando novas conexões neurais! Continue assim!</em>
        `;
        
        this.showMessage(message, 'success');
    }

    triggerNeuralReward() {
        // Visual and auditory feedback for dopamine release
        document.body.classList.add('neural-reward');
        
        // Create particle explosion effect
        this.createRewardParticles();
        
        setTimeout(() => {
            document.body.classList.remove('neural-reward');
        }, 3000);
        
        // Update all neural metrics positively
        Object.keys(this.neuralMetrics).forEach(metric => {
            this.updateNeuralMetrics(metric, Math.random() * 5 + 2);
        });
    }

    createRewardParticles() {
        const container = document.createElement('div');
        container.className = 'reward-particles';
        document.body.appendChild(container);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'reward-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(particle);
        }
        
        setTimeout(() => {
            document.body.removeChild(container);
        }, 3000);
    }

    saveProgress(data) {
        // Save to localStorage and send to API
        const progressData = {
            moduleId: 'python-complete',
            lessonId: data.lesson,
            completionData: data,
            neuralMetrics: this.neuralMetrics,
            timestamp: Date.now()
        };
        
        localStorage.setItem('pythonProgress', JSON.stringify(progressData));
        
        // In production, send to API
        console.log('Progress saved:', progressData);
    }

    loadUserProgress() {
        const savedProgress = localStorage.getItem('pythonProgress');
        if (savedProgress) {
            const data = JSON.parse(savedProgress);
            this.progress = data.completionData?.lesson ? (data.completionData.lesson / this.totalLessons) * 100 : 0;
            this.neuralMetrics = { ...this.neuralMetrics, ...data.neuralMetrics };
            this.updateProgress();
            this.updateNeuralDisplay();
        }
        
        // Set session start time
        sessionStorage.setItem('lessonStartTime', Date.now().toString());
        sessionStorage.setItem('initialNeuralMetrics', JSON.stringify(this.neuralMetrics));
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
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 6000);
    }

    // AI Tutor methods (inherited and enhanced)
    toggleAITutor() {
        const panel = document.getElementById('aiTutorPanel');
        const btn = document.getElementById('floatingAI');
        
        panel.classList.toggle('open');
        btn.classList.toggle('active');
        
        if (panel.classList.contains('open')) {
            this.initializePythonAIConversation();
        }
    }

    closeAITutor() {
        const panel = document.getElementById('aiTutorPanel');
        const btn = document.getElementById('floatingAI');
        
        panel.classList.remove('open');
        btn.classList.remove('active');
    }

    initializePythonAIConversation() {
        const welcomeMessage = `🐍 Olá! Sou seu tutor especializado em Python com foco em neurociência do aprendizado. 

Vejo que você está na lição "${document.querySelector('.lesson-item.active .lesson-info h4')?.textContent}". 

Baseado em suas métricas neurais:
• Lógica de Programação: ${this.neuralMetrics.programming}%
• Pensamento Algorítmico: ${this.neuralMetrics.algorithmic}%
• Resolução de Problemas: ${this.neuralMetrics.problemSolving}%

Como posso potencializar seu aprendizado hoje?`;
        
        setTimeout(() => {
            this.addAIMessage(welcomeMessage);
        }, 500);
    }

    sendTutorMessage() {
        const input = document.getElementById('tutorInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addUserMessage(message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate advanced AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAdvancedAIResponse(message);
            this.addAIMessage(response);
        }, 1500);
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

    showTypingIndicator() {
        const conversation = document.getElementById('tutorConversation');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'tutor-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        conversation.appendChild(typingDiv);
        conversation.scrollTop = conversation.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    initializePythonEnvironment() {
        // Set up Python environment simulation
        console.log('Python environment initialized for Lumenis Academy');
        
        // Load Pyodide for real Python execution (in production)
        // this.loadPyodide();
    }
}

// Initialize module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pythonModule = new PythonCompleteModule();
});

// Add enhanced styles for Python module
const pythonStyles = `
    .neural-reward {
        animation: neuralRewardGlow 3s ease-out;
    }
    
    @keyframes neuralRewardGlow {
        0% { filter: brightness(1); }
        25% { filter: brightness(1.3) saturate(1.5) hue-rotate(30deg); }
        50% { filter: brightness(1.5) saturate(2) hue-rotate(60deg); }
        75% { filter: brightness(1.3) saturate(1.5) hue-rotate(30deg); }
        100% { filter: brightness(1); }
    }
    
    .reward-particles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
    }
    
    .reward-particle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--cosmic-gold);
        border-radius: 50%;
        animation: particleFloat 3s ease-out forwards;
    }
    
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
        }
        20% {
            opacity: 1;
            transform: translateY(80vh) scale(1);
        }
        80% {
            opacity: 1;
            transform: translateY(20vh) scale(1);
        }
        100% {
            transform: translateY(-20vh) scale(0);
            opacity: 0;
        }
    }
    
    .typing-indicator .message-content {
        background: rgba(124, 58, 237, 0.1);
        padding: 0.75rem 1rem;
        border-radius: 12px;
    }
    
    .typing-dots {
        display: flex;
        gap: 0.25rem;
    }
    
    .typing-dots span {
        width: 6px;
        height: 6px;
        background: var(--neon-accent);
        border-radius: 50%;
        animation: typingDot 1.4s infinite;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typingDot {
        0%, 60%, 100% {
            transform: scale(1);
            opacity: 0.5;
        }
        30% {
            transform: scale(1.2);
            opacity: 1;
        }
    }
    
    .floating-message.success {
        border-color: var(--success-green);
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
    }
    
    .floating-message.success .message-content i {
        color: var(--success-green);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = pythonStyles;
document.head.appendChild(styleSheet);