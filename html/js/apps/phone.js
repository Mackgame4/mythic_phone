$('.phone-nav-button').on('click', function(e) {
    if (!($(this).hasClass('active-nav'))) {
        let activeSection = $('.active-nav').data('nav');
        $('.active-nav').removeClass('active-nav');
    
        let section = $(this).data('nav');
        $(this).addClass('active-nav');
        $('[data-section=' + activeSection + ']').fadeOut('fast', function() {
            $('[data-section=' + section + ']').fadeIn();
        });
    }
});

function SetupCallHistory() {
    $.each(Calls, function(index, call) {
        $('[data-section=history').append('<div class="call">' + call.sender + '</div>');
    })
}

function SetupCallContacts() {

}