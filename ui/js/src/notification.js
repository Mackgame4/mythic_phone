var notifTimer = null;

function Alert(text, timer) {
    if (notifTimer != null) {
        // Need to hide shit
    } else {
        $('.phone-notif-container').html(text).show('slide', { direction: 'up' }, 500, function() {
            notifTimer = setTimeout(function() {
                $('.phone-notif-container').hide('slide', { direction: 'up' }, 500, function() {
                    $('.phone-notif-container').html('');
                    notifTimer = null;
                });
            }, timer == null ? 2500 : timer);
        });
    }
}

export default { Alert }