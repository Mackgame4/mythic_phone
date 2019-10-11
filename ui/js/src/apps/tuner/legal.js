
$('#screen-content').on('tuner-legal-open-app', function() {
    $('#tuner-legal-container .inner-app').fadeIn();
});

$('#screen-content').on('tuner-legal-close-app', function() {
    $('#tuner-legal-container .inner-app').fadeOut();
});