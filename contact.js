// Inicializar EmailJS
(function () {
  emailjs.init('bfRBquHRcUQIMGpTO');
})();

// Enviar el formulario
document
  .getElementById('contact-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();

    const status = document.getElementById('contact-status');
    status.textContent = 'Enviando mensaje...';

    emailjs
      .send('service_3q7yl95', 'template_ke974hs', {
        from_name: document.getElementById('name').value,
        reply_to: document.getElementById('email').value,
        message: document.getElementById('message').value,
      })
      .then(function () {
        status.textContent = 'Mensaje enviado con éxito ✔️';
        status.style.color = 'green';
        document.getElementById('contact-form').reset();
      })
      .catch(function (error) {
        status.textContent = 'Ocurrió un error al enviar ❌';
        status.style.color = 'red';
        console.error('EmailJS Error:', error);
      });
  });
