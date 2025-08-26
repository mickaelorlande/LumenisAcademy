// ===== DADOS DOS CURSOS =====
const coursesData = {
    featured: [
        {
            id: 'neurociencia-aprendizado',
            title: 'Neurociência do Aprendizado',
            description: 'Compreenda como seu cérebro aprende e otimize seus processos cognitivos para máxima eficiência no estudo.',
            image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
            level: 'Todos os Níveis',
            category: 'featured',
            instructor: 'Dra. Jordana Silva',
            rating: 4.9,
            students: 2847,
            duration: '12h',
            modules: [
                {
                    title: 'Fundamentos da Neurociência',
                    lessons: [
                        { title: 'Como o Cérebro Aprende', type: 'video', duration: '15 min' },
                        { title: 'Plasticidade Cerebral', type: 'video', duration: '18 min' },
                        { title: 'Exercícios Práticos', type: 'exercise', duration: '20 min' }
                    ]
                },
                {
                    title: 'Neurotransmissores do Aprendizado',
                    lessons: [
                        { title: 'Dopamina e Motivação', type: 'video', duration: '12 min' },
                        { title: 'Acetilcolina e Foco', type: 'video', duration: '14 min' },
                        { title: 'Serotonina e Bem-estar', type: 'video', duration: '16 min' }
                    ]
                }
            ]
        },
        {
            id: 'ia-adaptativa',
            title: 'IA Adaptativa na Educação',
            description: 'Aprenda como a inteligência artificial pode personalizar e otimizar sua experiência de aprendizado.',
            image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
            level: 'Intermediário',
            category: 'featured',
            instructor: 'Prof. Carlos Mendes',
            rating: 4.8,
            students: 1923,
            duration: '16h',
            modules: [
                {
                    title: 'Fundamentos de IA Educacional',
                    lessons: [
                        { title: 'Introdução à IA na Educação', type: 'video', duration: '20 min' },
                        { title: 'Algoritmos de Personalização', type: 'video', duration: '25 min' },
                        { title: 'Casos Práticos', type: 'exercise', duration: '30 min' }
                    ]
                }
            ]
        },
        {
            id: 'gamificacao-neural',
            title: 'Gamificação Neurocognitiva',
            description: 'Descubra como a gamificação baseada em neurociência pode revolucionar seu aprendizado.',
            image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
            level: 'Avançado',
            category: 'featured',
            instructor: 'Dr. Roberto Lima',
            rating: 4.7,
            students: 1456,
            duration: '14h',
            modules: [
                {
                    title: 'Psicologia dos Jogos',
                    lessons: [
                        { title: 'Motivação Intrínseca vs Extrínseca', type: 'video', duration: '18 min' },
                        { title: 'Sistemas de Recompensa', type: 'video', duration: '22 min' }
                    ]
                }
            ]
        }
    ],
    fundamental: [
        {
            id: 'matematica-fund',
            title: 'Matemática Fundamental',
            description: 'Base sólida em matemática com metodologia neurocientífica para melhor compreensão.',
            image: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg',
            level: 'Fundamental',
            category: 'fundamental',
            instructor: 'Prof. Ana Santos',
            rating: 4.6,
            students: 3421,
            duration: '20h',
            modules: [
                {
                    title: 'Operações Básicas',
                    lessons: [
                        { title: 'Adição e Subtração', type: 'video', duration: '15 min' },
                        { title: 'Multiplicação e Divisão', type: 'video', duration: '18 min' },
                        { title: 'Exercícios Práticos', type: 'exercise', duration: '25 min' }
                    ]
                }
            ]
        },
        {
            id: 'portugues-fund',
            title: 'Língua Portuguesa',
            description: 'Domínio da língua portuguesa com foco em interpretação e produção textual.',
            image: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg',
            level: 'Fundamental',
            category: 'fundamental',
            instructor: 'Profa. Maria Oliveira',
            rating: 4.5,
            students: 2987,
            duration: '18h',
            modules: [
                {
                    title: 'Gramática Básica',
                    lessons: [
                        { title: 'Classes de Palavras', type: 'video', duration: '20 min' },
                        { title: 'Sintaxe Básica', type: 'video', duration: '22 min' }
                    ]
                }
            ]
        }
    ],
    medio: [
        {
            id: 'fisica-medio',
            title: 'Física para Ensino Médio',
            description: 'Conceitos fundamentais de física com experimentos virtuais e simulações.',
            image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
            level: 'Médio',
            category: 'medio',
            instructor: 'Prof. João Silva',
            rating: 4.7,
            students: 2156,
            duration: '24h',
            modules: [
                {
                    title: 'Mecânica Clássica',
                    lessons: [
                        { title: 'Cinemática', type: 'video', duration: '25 min' },
                        { title: 'Dinâmica', type: 'video', duration: '28 min' },
                        { title: 'Simulações Práticas', type: 'exercise', duration: '35 min' }
                    ]
                }
            ]
        },
        {
            id: 'quimica-medio',
            title: 'Química para Ensino Médio',
            description: 'Química moderna com laboratório virtual e experimentos interativos.',
            image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg',
            level: 'Médio',
            category: 'medio',
            instructor: 'Profa. Carla Ferreira',
            rating: 4.6,
            students: 1876,
            duration: '22h',
            modules: [
                {
                    title: 'Química Geral',
                    lessons: [
                        { title: 'Estrutura Atômica', type: 'video', duration: '20 min' },
                        { title: 'Tabela Periódica', type: 'video', duration: '18 min' }
                    ]
                }
            ]
        }
    ],
    enem: [
        {
            id: 'enem-completo',
            title: 'ENEM Completo 2025',
            description: 'Preparação completa para o ENEM com IA que adapta o conteúdo ao seu desempenho.',
            image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
            level: 'Médio',
            category: 'enem',
            instructor: 'Equipe Lumenis',
            rating: 4.9,
            students: 4521,
            duration: '80h',
            modules: [
                {
                    title: 'Matemática e suas Tecnologias',
                    lessons: [
                        { title: 'Álgebra', type: 'video', duration: '30 min' },
                        { title: 'Geometria', type: 'video', duration: '35 min' },
                        { title: 'Estatística', type: 'video', duration: '25 min' }
                    ]
                },
                {
                    title: 'Ciências da Natureza',
                    lessons: [
                        { title: 'Física', type: 'video', duration: '40 min' },
                        { title: 'Química', type: 'video', duration: '38 min' },
                        { title: 'Biologia', type: 'video', duration: '42 min' }
                    ]
                }
            ]
        }
    ],
    eja: [
        {
            id: 'eja-fundamental',
            title: 'EJA - Ensino Fundamental',
            description: 'Educação de Jovens e Adultos com metodologia adaptada e flexível.',
            image: 'https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg',
            level: 'Fundamental',
            category: 'eja',
            instructor: 'Prof. Pedro Alves',
            rating: 4.8,
            students: 1234,
            duration: '40h',
            modules: [
                {
                    title: 'Alfabetização Digital',
                    lessons: [
                        { title: 'Introdução à Informática', type: 'video', duration: '20 min' },
                        { title: 'Navegação na Internet', type: 'video', duration: '25 min' }
                    ]
                }
            ]
        }
    ],
    technology: [
        {
            id: 'python-completo',
            title: 'Python Completo - Do Zero ao Avançado',
            description: 'Aprenda Python com projetos práticos e metodologia baseada em neurociência.',
            image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
            level: 'Todos os Níveis',
            category: 'technology',
            instructor: 'Dr. Lucas Tech',
            rating: 4.9,
            students: 5432,
            duration: '60h',
            premium: true,
            price: 297,
            modules: [
                {
                    title: 'Fundamentos do Python',
                    lessons: [
                        { title: 'Instalação e Configuração', type: 'video', duration: '15 min' },
                        { title: 'Sintaxe Básica', type: 'video', duration: '25 min' },
                        { title: 'Primeiro Projeto', type: 'exercise', duration: '45 min' }
                    ]
                },
                {
                    title: 'Programação Orientada a Objetos',
                    lessons: [
                        { title: 'Classes e Objetos', type: 'video', duration: '30 min' },
                        { title: 'Herança e Polimorfismo', type: 'video', duration: '35 min' }
                    ]
                }
            ]
        },
        {
            id: 'web-development',
            title: 'Desenvolvimento Web Full Stack',
            description: 'Torne-se um desenvolvedor completo com HTML, CSS, JavaScript, React e Node.js.',
            image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
            level: 'Intermediário',
            category: 'technology',
            instructor: 'Prof. Marina Code',
            rating: 4.8,
            students: 3876,
            duration: '120h',
            premium: true,
            price: 297,
            modules: [
                {
                    title: 'Frontend Moderno',
                    lessons: [
                        { title: 'HTML5 Semântico', type: 'video', duration: '20 min' },
                        { title: 'CSS3 Avançado', type: 'video', duration: '30 min' },
                        { title: 'JavaScript ES6+', type: 'video', duration: '40 min' }
                    ]
                }
            ]
        },
        {
            id: 'data-science',
            title: 'Ciência de Dados com IA',
            description: 'Análise de dados, machine learning e inteligência artificial aplicada.',
            image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg',
            level: 'Avançado',
            category: 'technology',
            instructor: 'Dr. Rafael Data',
            rating: 4.9,
            students: 2341,
            duration: '80h',
            premium: true,
            price: 297,
            modules: [
                {
                    title: 'Análise Exploratória',
                    lessons: [
                        { title: 'Pandas e NumPy', type: 'video', duration: '35 min' },
                        { title: 'Visualização de Dados', type: 'video', duration: '40 min' }
                    ]
                }
            ]
        }
    ],
    autodidata: [
        {
            id: 'filosofia-avancada',
            title: 'Filosofia Avançada',
            description: 'Explore as principais correntes filosóficas com metodologia neurocientífica.',
            image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
            level: 'Avançado',
            category: 'autodidata',
            instructor: 'Prof. Sócrates Moderno',
            rating: 4.8,
            students: 1876,
            duration: '45h',
            premium: true,
            price: 497,
            modules: [
                {
                    title: 'Filosofia Antiga',
                    lessons: [
                        { title: 'Pré-Socráticos', type: 'video', duration: '30 min' },
                        { title: 'Platão e Aristóteles', type: 'video', duration: '45 min' }
                    ]
                }
            ]
        },
        {
            id: 'economia-comportamental',
            title: 'Economia Comportamental',
            description: 'Compreenda como a psicologia influencia decisões econômicas.',
            image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg',
            level: 'Avançado',
            category: 'autodidata',
            instructor: 'Dr. Adam Behavioral',
            rating: 4.7,
            students: 1432,
            duration: '35h',
            premium: true,
            price: 497,
            modules: [
                {
                    title: 'Fundamentos Comportamentais',
                    lessons: [
                        { title: 'Vieses Cognitivos', type: 'video', duration: '25 min' },
                        { title: 'Teoria dos Jogos', type: 'video', duration: '35 min' }
                    ]
                }
            ]
        },
        {
            id: 'neurociencia-avancada',
            title: 'Neurociência Avançada',
            description: 'Estudo profundo do cérebro humano e suas implicações para o aprendizado.',
            image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
            level: 'Avançado',
            category: 'autodidata',
            instructor: 'Dra. Jordana Silva',
            rating: 4.9,
            students: 987,
            duration: '50h',
            premium: true,
            price: 497,
            modules: [
                {
                    title: 'Neuroplasticidade Avançada',
                    lessons: [
                        { title: 'Mecanismos Moleculares', type: 'video', duration: '40 min' },
                        { title: 'Aplicações Clínicas', type: 'video', duration: '45 min' }
                    ]
                }
            ]
        }
    ]
};

// ===== DADOS DA BIBLIOTECA =====
const libraryData = {
    math: [
        {
            title: 'Cálculo Diferencial e Integral',
            author: 'James Stewart',
            type: 'PDF',
            pages: 1368,
            url: '#',
            description: 'Livro completo sobre cálculo para estudantes universitários.'
        },
        {
            title: 'Álgebra Linear e Suas Aplicações',
            author: 'David C. Lay',
            type: 'PDF',
            pages: 576,
            url: '#',
            description: 'Fundamentos de álgebra linear com aplicações práticas.'
        },
        {
            title: 'Estatística Básica',
            author: 'Wilton Bussab',
            type: 'PDF',
            pages: 540,
            url: '#',
            description: 'Introdução à estatística descritiva e inferencial.'
        }
    ],
    science: [
        {
            title: 'Física Conceitual',
            author: 'Paul Hewitt',
            type: 'PDF',
            pages: 816,
            url: '#',
            description: 'Física explicada de forma conceitual e intuitiva.'
        },
        {
            title: 'Química Geral',
            author: 'Raymond Chang',
            type: 'PDF',
            pages: 1152,
            url: '#',
            description: 'Fundamentos de química para estudantes universitários.'
        },
        {
            title: 'Biologia Molecular da Célula',
            author: 'Bruce Alberts',
            type: 'PDF',
            pages: 1464,
            url: '#',
            description: 'Estudo detalhado da biologia celular e molecular.'
        }
    ],
    tech: [
        {
            title: 'Clean Code',
            author: 'Robert C. Martin',
            type: 'PDF',
            pages: 464,
            url: '#',
            description: 'Guia para escrever código limpo e maintível.'
        },
        {
            title: 'Algoritmos e Estruturas de Dados',
            author: 'Thomas Cormen',
            type: 'PDF',
            pages: 1312,
            url: '#',
            description: 'Referência completa sobre algoritmos e estruturas de dados.'
        },
        {
            title: 'Inteligência Artificial Moderna',
            author: 'Stuart Russell',
            type: 'PDF',
            pages: 1152,
            url: '#',
            description: 'Abordagem abrangente da inteligência artificial.'
        }
    ],
    humanities: [
        {
            title: 'História da Filosofia Ocidental',
            author: 'Bertrand Russell',
            type: 'PDF',
            pages: 895,
            url: '#',
            description: 'Panorama completo da filosofia ocidental.'
        },
        {
            title: 'Sapiens: Uma Breve História da Humanidade',
            author: 'Yuval Noah Harari',
            type: 'PDF',
            pages: 512,
            url: '#',
            description: 'Análise da evolução da espécie humana.'
        },
        {
            title: 'O Capital no Século XXI',
            author: 'Thomas Piketty',
            type: 'PDF',
            pages: 696,
            url: '#',
            description: 'Análise econômica da desigualdade no mundo moderno.'
        }
    ]
};

// ===== DADOS DO FÓRUM =====
const forumData = {
    categories: [
        {
            name: 'Neurociência e Aprendizado',
            description: 'Discussões sobre como o cérebro aprende',
            threads: 156,
            posts: 892,
            icon: 'fas fa-brain'
        },
        {
            name: 'IA na Educação',
            description: 'Inteligência artificial aplicada ao ensino',
            threads: 89,
            posts: 445,
            icon: 'fas fa-robot'
        },
        {
            name: 'Gamificação',
            description: 'Jogos e elementos lúdicos no aprendizado',
            threads: 67,
            posts: 334,
            icon: 'fas fa-gamepad'
        },
        {
            name: 'Tecnologia',
            description: 'Programação, desenvolvimento e inovação',
            threads: 234,
            posts: 1456,
            icon: 'fas fa-code'
        },
        {
            name: 'Filosofia e Humanidades',
            description: 'Discussões filosóficas e humanísticas',
            threads: 123,
            posts: 678,
            icon: 'fas fa-book'
        }
    ],
    recentThreads: [
        {
            title: 'Como a dopamina afeta o aprendizado?',
            author: 'João Silva',
            category: 'Neurociência e Aprendizado',
            replies: 12,
            views: 234,
            lastActivity: '2 horas atrás',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=50'
        },
        {
            title: 'Melhores práticas para gamificação educacional',
            author: 'Maria Santos',
            category: 'Gamificação',
            replies: 8,
            views: 156,
            lastActivity: '4 horas atrás',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=50'
        },
        {
            title: 'IA pode substituir professores?',
            author: 'Carlos Mendes',
            category: 'IA na Educação',
            replies: 23,
            views: 567,
            lastActivity: '6 horas atrás',
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=50'
        }
    ]
};

// ===== DADOS DOS ARTIGOS =====
const articlesData = [
    {
        id: 'neuroplasticidade-aprendizado',
        title: 'Neuroplasticidade e Aprendizado Adaptativo',
        excerpt: 'Como a capacidade do cérebro de se reorganizar pode ser aproveitada para otimizar o processo educacional.',
        category: 'Neurociência',
        author: 'Dra. Jordana Silva',
        date: '15 de Janeiro, 2025',
        readTime: '8 min',
        image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
        content: `
        <h2>Introdução</h2>
        <p>A neuroplasticidade representa uma das descobertas mais revolucionárias da neurociência moderna...</p>
        
        <h2>Mecanismos da Neuroplasticidade</h2>
        <p>O cérebro humano possui a capacidade extraordinária de se reorganizar...</p>
        
        <h2>Aplicações Educacionais</h2>
        <p>Compreender os mecanismos da neuroplasticidade permite desenvolver estratégias educacionais mais eficazes...</p>
        `
    },
    {
        id: 'ia-personalizada-educacao',
        title: 'IA Personalizada na Educação: O Futuro do Aprendizado',
        excerpt: 'Análise de como algoritmos de inteligência artificial podem criar experiências educacionais únicas para cada estudante.',
        category: 'Tecnologia',
        author: 'Prof. Carlos Mendes',
        date: '10 de Janeiro, 2025',
        readTime: '12 min',
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
        content: `
        <h2>A Revolução da IA na Educação</h2>
        <p>A inteligência artificial está transformando fundamentalmente como aprendemos...</p>
        `
    },
    {
        id: 'gamificacao-neurocientifica',
        title: 'Gamificação Neurocientífica: Motivação e Engajamento',
        excerpt: 'Como elementos de jogos baseados em neurociência podem aumentar significativamente o engajamento dos estudantes.',
        category: 'Gamificação',
        author: 'Dr. Roberto Lima',
        date: '5 de Janeiro, 2025',
        readTime: '10 min',
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
        content: `
        <h2>Fundamentos Neurocientíficos da Gamificação</h2>
        <p>A gamificação eficaz deve estar fundamentada em princípios neurocientíficos sólidos...</p>
        `
    }
];

// ===== DADOS DOS TUTORES =====
const tutorsData = [
    {
        id: 'jordana-silva',
        name: 'Dra. Jordana Silva',
        specialty: 'Neurociência e Psicologia',
        bio: 'Neurocientista e psicóloga especializada em neuroplasticidade e aprendizado. Doutora pela USP com mais de 10 anos de experiência em pesquisa.',
        rating: 4.9,
        students: 1247,
        sessions: 3456,
        price: 150,
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        specialties: ['Neuroplasticidade', 'Psicologia Cognitiva', 'Metodologias de Aprendizado'],
        availability: ['Segunda', 'Quarta', 'Sexta']
    },
    {
        id: 'carlos-mendes',
        name: 'Prof. Carlos Mendes',
        specialty: 'Inteligência Artificial',
        bio: 'Especialista em IA aplicada à educação com mais de 15 anos de experiência em desenvolvimento de sistemas educacionais.',
        rating: 4.8,
        students: 892,
        sessions: 2134,
        price: 120,
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        specialties: ['Machine Learning', 'IA Educacional', 'Algoritmos Adaptativos'],
        availability: ['Terça', 'Quinta', 'Sábado']
    },
    {
        id: 'roberto-lima',
        name: 'Dr. Roberto Lima',
        specialty: 'Gamificação Educacional',
        bio: 'Doutor em Educação com especialização em gamificação e design instrucional. Consultor em diversas instituições educacionais.',
        rating: 4.7,
        students: 654,
        sessions: 1876,
        price: 100,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        specialties: ['Game Design', 'Motivação', 'Engajamento Estudantil'],
        availability: ['Segunda', 'Terça', 'Quinta']
    }
];

// ===== DADOS DE PROGRESSO DO USUÁRIO =====
const userProgressData = {
    neuralMetrics: {
        plasticidade: 85,
        dopamina: 78,
        acetilcolina: 92,
        serotonina: 76
    },
    achievements: [
        {
            id: 'mestre-quantico',
            name: 'Mestre Quântico',
            description: 'Completou 10 cursos avançados',
            icon: 'fas fa-star',
            unlocked: true,
            date: '15/12/2024'
        },
        {
            id: 'neuroplasticidade-maxima',
            name: 'Neuroplasticidade Máxima',
            description: '95% de desenvolvimento cognitivo',
            icon: 'fas fa-brain',
            unlocked: true,
            date: '20/12/2024'
        },
        {
            id: 'explorador-cosmico',
            name: 'Explorador Cósmico',
            description: 'Explorou todas as áreas de conhecimento',
            icon: 'fas fa-rocket',
            unlocked: false,
            progress: 75
        }
    ],
    coursesCompleted: 12,
    totalStudyTime: 156,
    currentStreak: 23,
    iotDevices: {
        neuroVision: {
            name: 'NeuroVision AR',
            status: 'connected',
            focus: 94,
            studyTime: 2.5
        },
        cogniSensor: {
            name: 'CogniSensor',
            status: 'connected',
            attention: 42,
            stress: -35
        },
        hubQuantico: {
            name: 'Hub Quântico',
            status: 'connected',
            dataPoints: 15200,
            accuracy: 98
        }
    }
};

// ===== CONFIGURAÇÕES GLOBAIS =====
const appConfig = {
    version: '2.0.0',
    apiUrl: 'https://api.lumenisacademy.com',
    features: {
        aiTutor: true,
        iotIntegration: true,
        gamification: true,
        neuralMetrics: true,
        premiumContent: true
    },
    pricing: {
        technology: 297,
        autodidata: 497,
        ultimate: 697
    },
    social: {
        instagram: 'https://www.instagram.com/lumenis_academy/',
        youtube: '#',
        linkedin: '#',
        twitter: '#'
    }
};

// Exportar dados para uso global
if (typeof window !== 'undefined') {
    window.LumenisData = {
        courses: coursesData,
        library: libraryData,
        forum: forumData,
        articles: articlesData,
        tutors: tutorsData,
        userProgress: userProgressData,
        config: appConfig
    };
}