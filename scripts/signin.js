$(document).ready(function(){


    signForm
    $('#signForm').submit(function(event) {

        event.preventDefault();
        
        if (this.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let username = $(this).find("#name").val();
            
            localStorage.setItem("username", username);
            let userLogged = true;
            localStorage.setItem("userLogged", userLogged);
            window.location.href = '../index.html';
        }
    });

});