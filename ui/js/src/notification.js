var notifTimer = null;

function Show(text, timer) {
    $('.phone-notif-container').html(text).show('slide', { direction: 'up' }, 500, function() {
        notifTimer = setTimeout(function() {
            $('.phone-notif-container').hide('slide', { direction: 'up' }, 500, function() {
                $('.phone-notif-container').html('');
                notifTimer = null;
            });
        }, timer == null ? 2500 : timer);
    });
}

function Alert(text, timer) {
    if (notifTimer != null) {
        clearTimeout(notifTimer);
        notifTimer = null;
        $('.phone-notif-container').hide('slide', { direction: 'up' }, 100, function() {
            Show(text, timer);
        });
    } else {
        Show(text, timer);
    }
}

export default { Alert }