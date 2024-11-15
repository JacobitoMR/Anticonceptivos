document.addEventListener('DOMContentLoaded', () => {
    // Cache de elementos DOM
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');
    const quizForm = document.getElementById('quiz-form');
    const quizResult = document.getElementById('quiz-result');
    const progressBar = document.querySelector('.progress-bar .progress');
    const backToTopBtn = document.getElementById('back-to-top');

    // Gestión del LocalStorage
    const saveProgress = (data) => {
        try {
            localStorage.setItem('quizProgress', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error al guardar progreso:', error);
            return false;
        }
    };

    const loadProgress = () => {
        try {
            const progress = localStorage.getItem('quizProgress');
            return progress ? JSON.parse(progress) : null;
        } catch (error) {
            console.error('Error al cargar progreso:', error);
            return null;
        }
    };

    // Mostrar el contenido principal al hacer clic en "Entrar"
    document.getElementById('enter-button').addEventListener('click', () => {
        welcomeScreen.style.display = 'none';
        mainContent.style.display = 'block';
        mainContent.classList.add('fade-in');
        updateProgressBar();
    });

    // Navegación suave
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Actualizar navegación activa
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    });

    // Observador de Intersección para animaciones
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                updateProgressBar();
            }
        });
    }, {
        threshold: 0.1
    });

    // Observar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        sectionObserver.observe(section);
    });

    // Actualizar barra de progreso
    const updateProgressBar = () => {
        const sections = document.querySelectorAll('.section-content');
        const visibleSections = Array.from(sections).filter(section => 
            section.classList.contains('visible')
        );
        const progress = (visibleSections.length / sections.length) * 100;
        progressBar.style.width = `${progress}%`;
    };

    // Manejo del formulario de cuestionario
    if (quizForm) {
        // Cargar progreso anterior si existe
        const savedProgress = loadProgress();
        if (savedProgress) {
            Object.keys(savedProgress).forEach(questionId => {
                const input = quizForm.querySelector(`[name="${questionId}"]`);
                if (input) {
                    input.value = savedProgress[questionId];
                }
            });
        }

        // Validación de formulario
        const validateForm = () => {
            let isValid = true;
            const answers = {};
            
            quizForm.querySelectorAll('input[type="text"]').forEach(input => {
                const value = input.value.trim();
                const validationMessage = input.parentElement.querySelector('.validation-message');
                
                if (!value) {
                    isValid = false;
                    input.classList.add('error');
                    validationMessage.textContent = 'Este campo es requerido';
                } else {
                    input.classList.remove('error');
                    validationMessage.textContent = '';
                    answers[input.name] = value;
                }
            });

            return { isValid, answers };
        };

        // Manejo del envío del formulario
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const { isValid, answers } = validateForm();
            
            if (isValid) {
                // Guardar progreso
                saveProgress(answers);
                
                // Calcular puntuación (ejemplo simple)
                const totalQuestions = Object.keys(answers).length;
                const score = Math.floor(Math.random() * 100); // Simulación de puntuación
                
                // Mostrar resultado
                quizResult.innerHTML = `
                    <div class="result-card">
                        <h3>¡Gracias por completar el cuestionario!</h3>
                        <p>Has respondido ${totalQuestions} preguntas.</p>
                        <p>Tu puntuación: ${score}%</p>
                        <div class="feedback">
                            ${score >= 70 
                                ? '¡Excelente trabajo! Tienes un buen entendimiento del tema.' 
                                : 'Sigue aprendiendo. ¡Puedes mejorar!'}
                        </div>
                    </div>
                `;
                quizResult.classList.add('show');
                
                // Scroll suave al resultado
                quizResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Guardar progreso automáticamente
        quizForm.querySelectorAll('input[type="text"]').forEach(input => {
            input.addEventListener('blur', () => {
                const currentAnswers = {};
                quizForm.querySelectorAll('input[type="text"]').forEach(input => {
                    if (input.value.trim()) {
                        currentAnswers[input.name] = input.value.trim();
                    }
                });
                saveProgress(currentAnswers);
            });
        });
    }

    // Botón "Volver arriba"
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Manejo de errores global
    window.addEventListener('error', (event) => {
        console.error('Error capturado:', event.error);
        // Aquí podrías implementar un sistema de registro de errores
    });
});
