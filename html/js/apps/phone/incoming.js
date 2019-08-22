// TODO : Need To Verify Flow Works As It Should Once Back-End Communication Is Setup

(function(exports){

    var contacts = null;

    var callPending = null;

    $('.call-action-decline').on('click', function(e) {
        RejectIncomingCall(true);
    });

    $('.call-action-answer').on('click', function(e) {
        AcceptIncomingCall();
    });

    exports.AcceptIncomingCall = function() {
        let data = $('#phone-incoming-container').data('data');

        OpenApp('phone-call', data, true);
    }

    exports.RejectIncomingCall = function() {
        $('.call-avatar').addClass('call-disconnected').removeClass('call-connected').removeClass('call-pending');
        $('.call-number .call-timer').html('NO ANSWER');

        this.setTimeout(function() {
            GoBack();
        }, 2500);
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

        let counter = 0;
        callPending = this.setInterval(function() {
            if (counter < 30) {
                counter++;
            } else {
                RejectIncomingCall();
                clearInterval(callPending);
            }
        }, 1000);
    }

    exports.CloseIncomingCall = function() {
        contacts = null;
        $('#phone-incoming-container').attr('class', 'app-container');
        $('#phone-incoming-container').removeData('data');
        $('.call-number .inc-number-text').html(contact.name);
        $('.call-number .inc-subnumber').html(contact.number);
    }

})(window)