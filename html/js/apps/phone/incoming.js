// TODO : Need To Verify Flow Works As It Should Once Back-End Communication Is Setup

(function(exports){

    var contacts = null;
    var callPending = null;

    $('.call-action-decline').on('click', function(e) {
        $.post(ROOT_ADDRESS + '/RejectCall', JSON.stringify({}));
    });

    $('.call-action-answer').on('click', function(e) {
        AcceptIncomingCall();
    });

    exports.AcceptIncomingCall = function() {
        let data = $('#phone-incoming-container').data('data');
        OpenApp('phone-call', data, true);
        clearInterval(callPending);
        callPending = null;
    }

    exports.RejectIncomingCall = function() {
        if (callPending == null) return;
        $('.call-avatar').addClass('call-disconnected').removeClass('call-connected').removeClass('call-pending');
        $('.call-number .call-timer').html('NO ANSWER');

        clearInterval(callPending);
        callPending = null;

        setTimeout(function() {
            GoBack();
        }, 1000);
    }

    exports.IsCallPending = function() {
        return (callPending != null)
    }

    exports.SetupIncomingCall = function(data) {
        contacts = GetData('contacts');
        let contact = contacts.filter(c => c.number == data.number)[0];

        $('#phone-incoming-container').data('data', data);

        if (contact != null) {
            $('#phone-incoming-container').addClass('other-' + contact.name[0]);
            $('.call-number .inc-number-text').html(contact.name);
            $('.call-number .inc-subnumber').html(contact.number);
        } else {
            $('.call-number .inc-number-text').html(data.number);
            $('.call-number .inc-subnumber').html('');
        }

        callPending = data
    }

    exports.CloseIncomingCall = function() {
        contacts = null;
        $('#phone-incoming-container').attr('class', 'app-container');
        $('#phone-incoming-container').removeData('data');
        $('.call-number .inc-number-text').html(contact.name);
        $('.call-number .inc-subnumber').html(contact.number);
    }

})(window)