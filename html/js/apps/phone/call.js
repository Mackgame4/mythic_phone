// TODO : Need To Verify Flow Works As It Should Once Back-End Communication Is Setup

(function(exports){

    var myNumber = null;
    var contacts = null;

    var callPending = null;
    var activeCallTimer = null;
    var activeCallDigits = new Object();

    var callData = null;
    var isCallActive = null;

    $('.call-action-mutesound').on('click', function(e) {
        let muted = $(this).data('active');
        if (muted) {
            $(this).html(`<i class="fas fa-volume-mute"></i><span>Mute Sound</span>`);
            $(this).data('active', false);
        } else {
            $(this).html(`<i class="fas fa-volume-up"></i><span>Unmute Sound</span>`);
            $(this).data('active', true);
        }
    });

    $('.call-action-mutemic').on('click', function(e) {
        let muted = $(this).data('active');
        if (muted) {
            $(this).html(`<i class="fas fa-microphone-slash"></i><span>Mute Mic</span>`);
            $(this).data('active', false);
        } else {
            $(this).html(`<i class="fas fa-microphone"></i><span>Unmute Mic</span>`);
            $(this).data('active', true);
        }
    });

    $('.call-action-hangup').on('click', function(e) {
        if (isCallActive == null) {
            // Need To Send Cancel To Other Client
            console.log('Send To Other Client That Call Was Cancelled');
            CallHungUp(false);
        } else if (callPending != null) {
            // Need To Send Disconnect To Other Client
            console.log('Send To Other Client That Call Was Disconnected');
            CallHungUp(true);
        }
    });

    exports.CallAnswered = function() {
        this.clearInterval(callPending);
        $('.call-avatar').addClass('call-connected').removeClass('call-pending');

        $('.phone-header').addClass('in-call');

        activeCallDigits.seconds = 0;
        activeCallDigits.minutes = 0;
        activeCallDigits.hours = 0;

        isCallActive = callData;
        callData = null;

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

            $('.call-number .call-timer').html(activeCallDigits.hours + ':' + min + ':' + sec);

            
            $('.phone-header .in-call').html(`<i class="fas fa-phone"></i> ${activeCallDigits.hours}:${min}:${sec}`);
        }, 1000);

        $('.phone-header .in-call').fadeIn();
    }

    exports.CallHungUp = function(state) {
        if (state) {
            $('.call-number .call-timer').html('DISCONNECTED');
        } else {
            $('.call-number .call-timer').html('NO ANSWER');
        }

        isCallActive = null;

        this.clearInterval(activeCallTimer);
        this.clearInterval(callPending);
        activeCallTimer = null;
        callPending = null;

        $('.call-avatar').addClass('call-disconnected').removeClass('call-connected').removeClass('call-pending');

        $('.phone-header').attr('class', 'phone-header');
        $('.phone-header .in-call').fadeOut('fast', function() {
            $('.phone-header .in-call').html(`<i class="fas fa-phone"></i>`);
        });

        this.console.log('hello?');

        this.setTimeout(function() {
            $('.call-number .call-timer').html('Calling');
            $('.call-avatar').attr('class', 'call-avatar');
            GoBack();
        }, 2500);
        this.console.log('hello?');
    }

    exports.SetupCallActive = function(data){
        if (isCallActive != null) CallAnswered();
        myNumber = GetData('myNumber');
        contacts = GetData('contacts');

        $('#phone-call-container').data('data', data);

        let contact = contacts.filter(c => c.number == data.number)[0];

        if (contact != null) {
            $('#phone-call-container').addClass('other-' + contact.name[0].toString().toLowerCase());
            $('.call-number .call-number-text').html(contact.name);
            $('.call-number .call-subnumber').html(contact.number);
            $('.call-header .call-avatar').html(contact.name[0])
        } else {
            $('.call-number .call-number-text').html(data.number);
            $('.call-number .call-subnumber').html('');
            $('.call-header .call-avatar').html('#')
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
        }, 500);

        callData = data
    }

    exports.CloseCallActive = function() {
        if (isCallActive != null) return;

        /*if (callPending != null && is`C`allActive == null && callData != null) {
            this.console.log('fuck me');
            $.post(ROOT_ADDRESS + '/CancelCall', JSON.stringify({
                
            }));
        } */

        myNumber = null;
        contacts = null;
        callData = null;

        this.clearInterval(activeCallTimer);
        this.clearInterval(callPending);
        callPending = null;

        $('#phone-call-container').attr('class', 'app-container');
        $('.call-avatar').attr('class', 'call-avatar');
        $('.call-number .call-timer').html('Calling');
        $('#phone-call-container').removeData('data');
        $('.call-number .call-number-text').html('');
        $('.call-number .call-subnumber').html('');

        $('.call-action-mutemic').html(`<i class="fas fa-microphone-slash"></i><span>Mute Mic</span>`);
        $('.call-action-mutesound').html(`<i class="fas fa-volume-mute"></i><span>Mute Sound</span>`);
    }

})(window)