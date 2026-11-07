// 1. Load Header and Footer dynamically using jQuery's .load()
$('#header-placeholder').load('components/header.html', function() {
    // Once the header is loaded, initialize the navbar logic
    initializeNavbar();
});

$('#footer-placeholder').load('components/footer.html');


// 2. Initialize Navbar (Active links & Dark Mode)
function initializeNavbar() {
    // Highlight current page in navbar
    var currentLocation = location.pathname.split('/').pop();
    
    $('.navbar-nav .nav-link').each(function() {
        if ($(this).attr('href') === currentLocation) {
            $(this).addClass('active');
        }
    });

    // Dark Mode Toggle Logic
    var savedTheme = localStorage.getItem('theme') || 'light';
    $('html').attr('data-bs-theme', savedTheme);
    updateToggleIcon(savedTheme);

    $('#darkModeToggle').on('click', function() {
        var currentTheme = $('html').attr('data-bs-theme');
        var newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        $('html').attr('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });
}

// Helper function to change the Dark Mode icon
function updateToggleIcon(theme) {
    var $icon = $('#darkModeToggle i');
    if (theme === 'dark') {
        $icon.removeClass('bi-moon-stars-fill').addClass('bi-sun-fill');
    } else {
        $icon.removeClass('bi-sun-fill').addClass('bi-moon-stars-fill');
    }
}