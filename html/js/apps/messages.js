$('.messages-list').on('click', '.message', function(e) {
    console.log($(this).data('message'));

    OpenApp('message-convo', $(this).data('message'));
});

$('#convo-new-text').on('submit', function(e) {
    e.preventDefault();
    let convoData = $('#message-convo-container').data('data');
    let data = $(this).serializeArray();
    
    let text = [
        {
            value: convoData.number,
        },
        {
            value: data[0].value
        }
    ]

    SendNewText(text, function() {
        $('.convo-texts-list').append('<div class="text me-sender"><span>' + data[0].value + '</span><p>' + moment(Date.now()).fromNowOrNow() + '</p></div>');

        // Just incase losers wanna send themselves a text
        let myNumber = GetData('myNumber');
        let contacts = GetData('contacts');
        let contact = contacts.filter(c => c.number == convoData.number)[0];
        if (convoData.number == myNumber) {
            if (contact != null) {
                $('.convo-texts-list').append('<div class="text other-sender"><span class=" other-' + contact.name[0] + '">' + data[0].value + '</span><p>' + moment(Date.now()).fromNowOrNow() + '</p></div>')
            } else {
                $('.convo-texts-list').append('<div class="text other-sender"><span>' + data[0].value + '</span><p>' + moment(Date.now()).fromNowOrNow() + '</p></div>')
            }
        }
        
        $('#convo-input').val('');
        $('.convo-texts-list').animate({
            scrollTop: $(".convo-texts-list .text:last-child").offset().top
        }, 25);
    });
});

$('#convo-delete-all').on('click', function(e) {
    e.preventDefault();
    let convoData = $('#message-convo-container').data('data');

    $.post('http://mythic_phone2/DeleteConversation', JSON.stringify({
        number: convoData.number
    }), function(status) {
        if (status) {
            let messages = GetData('messages');
            let cleanedMsgs = messages.filter(m => (m.sender != convoData.number) && (m.receiver != convoData.number));
            StoreData('messages', cleanedMsgs);
            M.toast({html: 'Conversation Deleted'});
            GoBack();
        } else {
            M.toast({html: 'Error Deleting Conversation'});
        }
    });
});

$("#message-new-number").on('keyup', function(e) {
    $(this).val($(this).val().replace(/^(\d{3})(\d{3})(\d)+$/, "$1-$2-$3"));
});

$('#message-new-contact').on('change', function(e) {
    let data = $(this).val();
    $('#message-new-number').val(data);
});

$('#message-new-msg').on('submit', function(e) {
    e.preventDefault();
    let data = $(this).serializeArray();

    SendNewText(data, function() {
        var modal = M.Modal.getInstance($('#messages-new-modal'));
        modal.close();
    
        M.toast({html: 'Message Sent'});
    
        RefreshApp();
    });
});

function ReceiveText(sender, text) {
    console.log(sender, text);
}

function SetupConvo(data) {
    $('#message-convo-container').data('data', data);
    let myNumber = GetData('myNumber');
    let contacts = GetData('contacts');
    let messages = GetData('messages');

    let texts = messages.filter(c => c.sender == data.number && c.receiver == myNumber || c.sender == myNumber && c.receiver == data.number);
    let contact = contacts.filter(c => c.number == data.number)[0];

    if (contact != null) {
        $('.convo-top-number').html(contact.name);
        $('.convo-top-bar').attr('class', 'convo-top-bar other-' + contact.name[0]);
    } else {
        $('.convo-top-number').html(data.number);
        $('.convo-top-bar').attr('class', 'convo-top-bar');
    }

    
    $('.convo-texts-list').html('');
    $.each(texts, function(index, text) {
        var d = new Date(text.sent_time);

        if (text.sender == myNumber) {
            $('.convo-texts-list').append('<div class="text me-sender"><span>' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>');

            // Just incase losers wanna send themselves a text
            if (text.receiver == myNumber) {
                if (contact != null) {
                    $('.convo-texts-list').append('<div class="text other-sender"><span class=" other-' + contact.name[0] + '">' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
                } else {
                    $('.convo-texts-list').append('<div class="text other-sender"><span>' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
                }
            }
        } else {
            if (contact != null) {
                $('.convo-texts-list').append('<div class="text other-sender"><span class=" other-' + contact.name[0] + '">' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
            } else {
                $('.convo-texts-list').append('<div class="text other-sender"><span>' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
            }
            
        }
    });

    
    $('.convo-texts-list').animate({
        scrollTop: $(".convo-texts-list .text:last-child").offset().top
    }, 25);
}

function SetupMessages() {
    let myNumber = GetData('myNumber');
    let contacts = GetData('contacts');
    let messages = GetData('messages');

    let convos = new Array();

    console.log(messages);

    $.each(messages, function(index, message) {
        let obj = new Object();

        if (message.sender == myNumber) {
            obj.number = message.receiver;
        } else {
            obj.number = message.sender;
        }

        obj.message = message.message;
        obj.receiver = message.receiver;
        obj.sender = message.sender;
        
        obj.time = new Date(message.sent_time);

        let convo = convos.filter(c => c.number === obj.number)[0]
        
        if (convo == null) {
            convos.push(obj);
        } else {
            if ( obj.time > convo.time ) {
                $.each(convos, function(index, c) {
                    if (c == convo) {
                        convos[index] = obj;
                    }
                })
                convos[convo.number] = obj;
            }
        }
    });

    convos.sort(sortFunction);

    $('#message-container .inner-app .messages-list').html('');
    $.each(convos, function(index, message) {
        let contact = null;
        if (contacts != null) {
            contact = contacts.filter(c => c.number == message.number)[0];
        } else {
        }

        // Not A Contact
        if (contact == null) {
            $('#message-container .inner-app .messages-list').append('<div class="message waves-effect"><div class="text-avatar">#</div><div class="text-name">' + message.number + '</div><div class="text-message">' + message.message + '</div><div class="text-time">' + moment(message.time).fromNowOrNow() + '</div></div>');
        } else {
            $('#message-container .inner-app .messages-list').append('<div class="message waves-effect"><div class="text-avatar other-' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="text-name">' + contact.name + '</div><div class="text-message"> ' + message.message + '</div><div class="text-time">' + moment(message.time).fromNowOrNow() + '</div></div>')
        }

        $('.messages-list .message:last-child').data('message', message);
    });
}

function SetupNewMessage() {
    let contacts = GetData('contacts');

    $('#message-new-contact').html('');
    $('#message-new-contact').append('<option value="">Choose Contact</option>');
    $.each(contacts, function(index, contact) {
        $('#message-new-contact').append('<option value="' + contact.number + '">' + contact.name + ' (' + contact.number +')</option>');
    });

    $('#message-new-number').val('');
    $('#message-new-body').val('');

    $('#message-new-contact').formSelect();
}

function SendNewText(data, cb) {
    $.post('http://mythic_phone2/SendText', JSON.stringify({
        receiver: data[0].value,
        message: data[1].value,
    }), function(textData) {
        if (textData) {
            let myNumber = GetData('myNumber');
            let messages = GetData('messages');
        
            if (messages == null) {
                messages = new Array();
            }

            messages.push({
                id: textData.id,
                sender: myNumber,
                receiver: textData.receiver,
                message: textData.message,
                sent_time: textData.sent_time,
                sender_read: 0,
                receiver_read: 0
            });

            StoreData('messages', messages);

            cb();
        } else {
            M.toast({html: 'Unable To Send Text'});

            cb();
        }
    });
}

function sortFunction(a,b){
    return a.time < b.time ? 1 : -1;  
}; 