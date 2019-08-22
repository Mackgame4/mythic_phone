(function(exports){

    var myNumber = null;
    var contacts = null;

    var callPending = null;
    var activeCallTimer = null;
    var activeCallDigits = new Object();

    var isCallActive = false;

    $('.call-action-hangup').on('click', function(e) {
        if (isCallActive) {
            // Need To Send Disconnect To Other Client
            CallHungUp(false);
        } else {
            CallHungUp(true);
        }
    })

    exports.CallAnswered = function() {
        this.clearInterval(callPending);
        $('.call-avatar').addClass('call-connected').removeClass('call-pending');

        activeCallDigits.seconds = 0;
        activeCallDigits.minutes = 0;
        activeCallDigits.hours = 0;

        isCallActive = true;

        activeCallTimer = this.setInterval(function() {
            if (activeCallDigits.seconds < 59) {
                activeCallDigits.seconds++;
            } else if (activeCallDigits.minutes < 60) {
                activeCallDigits.seconds = 0;
                activeCallDigits.minutes++;
            } else {
                activeCallDigits.seconds = 0;
                activeCallDigits.minutes = 0;
                activeCallDigits.hours++;
            }

            let sec = activeCallDigits.seconds;
            let min = activeCallDigits.minutes;

            if (sec < 10) { sec = '0' + sec }
            if (min < 10) { min = '0' + min }

            $('.call-number .call-timer').html(activeCallDigits.hours + ':' + min + ':' + sec)
        }, 1000);

    }

    exports.CallHungUp = function(state) {
        this.clearInterval(activeCallTimer);
        this.clearInterval(callPending);
        $('.call-avatar').addClass('call-disconnected').removeClass('call-connected').removeClass('call-pending');

        if (state) {
            $('.call-number .call-timer').html('NO ANSWER');
        } else {
            $('.call-number .call-timer').html('DISCONNECTED');
        }

        this.setTimeout(function() {
            GoBack();
        }, 2500);
    }

    exports.SetupCallActive = function(data){
        myNumber = GetData('myNumber');
        contacts = GetData('contacts');

        this.console.log(data);
        let contact = contacts.filter(c => c.number == data.number)[0];

        this.console.log(contact != null);
        if (contact != null) {
            $('#phone-call-container').addClass('other-' + contact.name[0]);
            $('.call-number .call-number-text').html(contact.name);
            $('.call-number .call-subnumber').html(contact.number);
        } else {
            $('.call-number .call-number-text').html(data.number);
            $('.call-number .call-subnumber').html('');
        }

        $('.call-avatar').addClass('call-pending');

        let dots = '';
        callPending = this.setInterval(function() {
            if (dots === '...') {
                dots = '';
            } else {
                dots = dots + '.'
            }

            $('.call-number .call-timer').html('Calling ' + dots);
        }, 500)

        this.setTimeout(function() {
            CallAnswered();
        }, 10000);
    }

    exports.CloseCallActive = function() {
        myNumber = null;
        contacts = null;
        $('#phone-call-container').attr('class', 'app-container');
        $('.call-number .call-number-text').html('');
        $('.call-number .call-subnumber').html('');
    }

})(window)