
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()



document.addEventListener("DOMContentLoaded", () => {
  const flashSuccess = document.getElementById('flash-success');
  const flashError = document.getElementById('flash-error');

  [flashSuccess, flashError].forEach(flash => {
    if (flash) {
      setTimeout(() => {
        flash.classList.remove('show');
        flash.classList.add('fade');
        setTimeout(() => {
          flash.remove();
        }, 500);
      }, 3000);
    }
  });
});
