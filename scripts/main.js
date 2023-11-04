$(document).ready(function() {


    $('#signupForm').submit(function(event) {

        event.preventDefault();
        
        if (this.checkValidity() === false) {
            event.stopPropagation();
        } else {
            
            window.location.href = 'index.html';
        }
        $(this).addClass('was-validated');
    });
});