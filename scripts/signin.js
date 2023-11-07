$(document).ready(function(){

    // Hide inout fields unnecessary for login 
    $('#name').closest('.form-group').toggle();
    $('#surname').closest('.form-group').toggle();

    // Event listener for the login radio button
    $('#login-radio-btn').click(function() {
        // Hide the name and surname fields with an animation
        $('#name').closest('.form-group').slideUp();
        $('#surname').closest('.form-group').slideUp();
        // Change the sign-in text
        $('#signInTypeText').text('Log in');
        $('.sign-in-btn').text('Log in');
    });

    // Event listener for the signup radio button
    $('#signup-radio-btn').click(function() {
        // Show the name and surname fields with an animation
        $('#name').closest('.form-group').slideDown();
        $('#surname').closest('.form-group').slideDown();
        // Change the sign-in text
        $('#signInTypeText').text('Sign up');
        $('.sign-in-btn').text('Sign up');
    });


    // function for when "log in button" is clicked
    // Note: code from line 30-36 and >43 was added by Tertius (copied from his commit)
    // also, invalid input text (html) was added by him
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
        $(this).addClass('was-validated');
    });

});

