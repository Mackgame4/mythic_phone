$('[data-section=history').on('click', '.call', function(event) {
    if ($(this).find('.call-actions').is(":visible")) {
        $(this).find('.call-actions').slideUp();
    } else {
        $(this).parent().find('.call-actions').slideUp();
        $(this).find('.call-actions').slideDown();
    }
});

$('[data-section=history').on('click', '.call-actions .call-action-text', function(e) {
    let myNumber = GetData('myNumber');
    let data = $(this).parent().parent().data('data');
    let number = data.sender;

    if (data.sender == myNumber) {
        number = data.receiver;
    }

    OpenApp('message-convo', { number: number });
});

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
    let myNumber = GetData('myNumber');
    let contacts = GetData('contacts');
    let history = GetData('history');

    history.sort(dateSortOldest);

    $('[data-section=history').html('');
    $.each(history, function(index, call) {
        if (call.sender == myNumber) {
            let contact = contacts.filter(c => c.number == call.receiver)[0];

            if (call.status == 0) {
                if (contact != null) {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone icon-outgoing-missed"></i><span>' + contact.name + '</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                } else {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone icon-outgoing-missed"></i><span>' + call.receiver + '</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                }
            } else if (call.status == 1) {
                if (contact != null) {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone icon-outgoing"></i><span>' + contact.name + '</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                } else {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone icon-outgoing"></i><span>' + call.receiver + '</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                }
            }
        } else {
            let contact = contacts.filter(c => c.number == call.sender)[0];

            if (call.status == 0) {
                if (contact != null) {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming-missed"></i><span>' + contact.name + '</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                } else {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming-missed"></i><span>' + call.sender + '</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                }
            } else if (call.status == 1) {
                if (contact != null) {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming"></i><span>' + contact.name + '</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                } else {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming"></i><span>' + call.sender + '</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                }
            }
        }

        $('[data-section=history').find('.call:first-child').data('data', call);
    })
}

function SetupCallContacts() {

}