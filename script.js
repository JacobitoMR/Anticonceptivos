document.addEventListener('DOMContentLoaded', () => {
    // Mostrar el contenido principal al hacer clic en "Entrar"
    document.getElementById('enter-button').addEventListener('click', () => {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    });

    // Resaltar sección activa en el menú
    const enlaces = document.querySelectorAll('nav a[href^="#"]');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            const seccionDestino = document.querySelector(enlace.getAttribute('href'));
            window.scrollTo({
                top: seccionDestino.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Procesar el formulario de cuestionario
    document.getElementById('quiz-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const respuestas = [];
        
        // Recopilar respuestas
        for (let i = 1; i <= 15; i++) {
            const respuesta = e.target[`question${i}`].value.trim();
            respuestas.push(respuesta);
        }
        
        // Proporcionar retroalimentación
        let correctas = 0; // Para contar respuestas correctas, si quisieras implementar la lógica
        const resultadoTexto = `¡Gracias por participar! Has respondido todas las preguntas.`;
        
        document.getElementById('quiz-result').innerText = resultadoTexto;
    });
});
