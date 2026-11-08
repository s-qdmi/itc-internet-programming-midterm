// Handle Contact Form Submission
$('#contactForm').on('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    // Get form element
    var form = this;

    // Check if form is valid using Bootstrap's validation
    if (!form.checkValidity()) {
        e.stopPropagation();
        $(form).addClass('was-validated');
        return;
    }

    // Form is valid - capture the data
    var formData = {
        name: $('#contactName').val().trim(),
        email: $('#contactEmail').val().trim(),
        subject: $('#contactSubject').val().trim(),
        message: $('#contactMessage').val().trim()
    };

    // Display data in a simple alert
    var alertMessage = `Your message has been sent!\n\n`;
    alertMessage += `Name: ${formData.name}\n`;
    alertMessage += `Email: ${formData.email}\n`;
    alertMessage += `Subject: ${formData.subject}\n`;
    alertMessage += `Message: ${formData.message}`;

    alert(alertMessage);

    // Reset the form
    form.reset();
    $(form).removeClass('was-validated');
});