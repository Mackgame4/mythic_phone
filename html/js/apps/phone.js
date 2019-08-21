(function(exports){

    var myNumber = null;
    var contacts = null;
    var history = null;

    var delHold = null;

    $('[data-section=keypad').on('click', '.keypad-top .delete-num-btn', function(e) {
        let number = $('.keypad-top input').val();
        if (number.length > 0) {
            let delNum = number.substring(0, number.length - 1);
            $('.keypad-top input').val(delNum);
            SetupCallType();
        }
    });

    $('[data-section=keypad').on('mousedown', '.keypad-top .delete-num-btn', function(e) {
        let number = $('.keypad-top input').val();
        delHold = setInterval(function(){
            if (number.length > 0) {
                let delNum = number.substring(0, number.length - 1);
                $('.keypad-top input').val(delNum);
                SetupCallType();

                if (delNum[0] === '#' || delNum[0] === '*') {
                    CheckIfContact(delNum.substr(1));
                } else {
                    CheckIfContact(delNum);
                }
                number = delNum;
            }
        }, 250);

        return false;
    });

    $('[data-section=keypad').on('submit', '#call-number', function(e) {
        e.preventDefault();

        let data = $(this).serializeArray();

        console.log(data);
    });

    $(document).mouseup(function(){
        clearInterval(delHold);
        return false;
    });

    $('[data-section=keypad').on('click', '.keypad-key', function(e) {
        if (!$(this).hasClass('key-call')) {
            let key = $(this).data('value');
            let exist = $('.keypad-top input').val();
            if (key === '#' || key === '*') {
                if (exist.length <= 12 && (exist[0] != '#' && exist[0] != '*')) {
                    let format = formatUSPhoneNumber(exist);
                    format = key + format
                    $('.keypad-top input').val(format).trigger('input');
                } else {
                    let format = formatUSPhoneNumber(exist.substr(1));
                    format = key + format
                    $('.keypad-top input').val(format).trigger('input');
                }
                // Remove Symbol from number and check if that is a contact
                CheckIfContact($('.keypad-top input').val().substr(1));
            }
            else if ((exist.length < 12) || (exist.length < 13 && (exist[0] === '#' || exist[0] === '*') )) {
                let substr = ''
                exist = exist + key
                let format = formatUSPhoneNumber(exist);

                if (format[0] === '#' || format[0] === '*') {
                    substr = format[0]
                    format = format.substring(1);
                }

                CheckIfContact(format);
                $('.keypad-top input').val(substr + format);
            }
        }

        SetupCallType();
        $('.keypad-top input').get(0).focus();
    });

    $('[data-section=keypad').on('keydown', '.keypad-top input', function(e) {
        switch (e.which) {
            case 8:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 96:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
                break;
            default:
                e.preventDefault();
                break;
        }
    });

    $('[data-section=keypad').on('change, keyup', '.keypad-top input', function(e) {
        let number = $(this).val();
        CheckIfContact(number);
    });

    $('[data-section=keypad').on('keyup', '.keypad-top input', function(e) {
        $(this).val(formatUSPhoneNumber($(this).val()));
    });

    $('[data-section=history').on('click', '.call', function(event) {
        if ($(this).find('.call-actions').is(":visible")) {
            $(this).find('.call-actions').slideUp();
        } else {
            $(this).parent().find('.call-actions').slideUp();
            $(this).find('.call-actions').slideDown();
        }
    });

    $('[data-section=history').on('click', '.call-actions .call-action-text', function(e) {
        let data = $(this).parent().parent().data('data');
        let number = data.sender;

        if (data.sender == myNumber) {
            number = data.receiver;
        }

        OpenApp('message-convo', { number: number });
    });

    $('[data-section=history').on('click', '.call-actions .call-action-delete', function(e) {
        let data = $(this).parent().parent().data('data');
        M.toast({html: 'Call Record Deleted'});
        $.post(ROOT_ADDRESS + '/DeleteCallRecord', JSON.stringify({
            id: data.id
        }), function(status) {
            if (status) {
                $(this).parent().parent().fadeOut('normal', function() {
                    history.splice(data.index, 1);
                    StoreData('history', history);
                    RefreshApp();
                });
            } else {
                M.toast({html: 'Error Deleting Call Record'});
            }
        })
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

    function CheckIfContact(number) {
        let contact = contacts.filter(c => c.number == number)[0];
        if (contact != null) {
            $('.keypad-top .contact-display').html(contact.name);
            $('.keypad-top .contact-display').fadeIn();
        } else {
            $('.keypad-top .contact-display').fadeOut();
        }
    }

    function SetupCallType() {
        let number = $('.keypad-top input').val();

        if (number[0] === '#') {
            $('.keypad-top .call-type').html('Calling Anonymously');
            if ($('.keypad-top .call-type').is(":hidden")) {
                $('.keypad-top .call-type').fadeIn();
            }
        } else if (number[0] == '*') {
            $('.keypad-top .call-type').html('Calling UNK');
            if ($('.keypad-top .call-type').is(":hidden")) {
                $('.keypad-top .call-type').fadeIn();
            }
        } else {
            if ($('.keypad-top .call-type').is(":visible")) {
                $('.keypad-top .call-type').fadeOut('fast', function() {
                    $('.keypad-top .call-type').html('CALL TYPE');
                });
            }
        }
    }

    exports.SetupCallHistory = function() {
        myNumber = GetData('myNumber');
        contacts = GetData('contacts');
        history = GetData('history');


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
                if (call.anon == 0) {
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
                } else {
                    if (call.status == 0) {
                        $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming"></i><span>Unknown Number</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume action-disabled"></i><i class="fas fa-sms action-disabled"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                    } else {
                        $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming"></i><span>Unknown Number</span><div class="timestamp">' + moment(call.time).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume action-disabled"></i><i class="fas fa-sms action-disabled"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                    }
                }
            }

            call.index = index;
            $('[data-section=history').find('.call:first-child').data('data', call);
        });
        setTimeout(function() { $('.keypad-top input').get(0).focus(); }, 1500);
    }

    exports.SetupCallContacts = function() {

    }

    exports.MakeCall = function() {

    }

    exports.StartCall = function() {
        
    }

    exports.EndCall = function() {

    }

})(window);