$('.messages-list').on('click', '.message', function(e) {
    console.log($(this).data('message'));

    OpenApp('message-convo', $(this).data('message'));
});

$('#convo-new-text').on('submit', function(e) {
    e.preventDefault();
    let convoData = $(this).parent().parent().parent().data('data');
    let data = $(this).serializeArray();

    let myNumber = JSON.parse(window.localStorage.getItem('myNumber'));
    let messages = JSON.parse(window.localStorage.getItem('messages'));

    let now = new Date();

    messages.push({
        id: messages[messages.length - 1].id + 1,
        sender: myNumber,
        receiver: convoData.number,
        message: data[0].value,
        sent_time: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds(),
        actual_sender: null,
        isRead: true,
        owner: 0
    });

    console.log(messages[messages.length - 1].sent_time);

    window.localStorage.setItem('messages', JSON.stringify(messages));

    $('.convo-texts-list').append('<div class="text me-sender"><span>' + data[0].value + '</span><p>' + moment(Date.now()).fromNowOrNow() + '</p></div>');

    $('#convo-input').val('');

    
    $('.convo-texts-list').animate({
        scrollTop: $(".convo-texts-list .text:last-child").offset().top
    }, 25);
})

function SetupConvo(data) {
    $('#message-convo-container').data('data', data);
    let myNumber = JSON.parse(window.localStorage.getItem('myNumber'));
    let contacts = JSON.parse(window.localStorage.getItem('contacts'));
    let messages = JSON.parse(window.localStorage.getItem('messages'));

    let texts = messages.filter(c => c.sender == data.number || c.receiver == data.number);
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
        var t = text.sent_time.split(/[- :]/);
        var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));

        if (text.sender == myNumber) {
            $('.convo-texts-list').append('<div class="text me-sender"><span>' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
        } else {
            if (contact != null) {
                $('.convo-texts-list').append('<div class="text other-sender"><span class=" other-' + contact.name[0] + '">' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
            } else {
                $('.convo-texts-list').append('<div class="text other-sender"><span>' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
            }
            
        }
    });
}

$("#message-new-number").on('keyup', function(e) {
    $(this).val($(this).val().replace(/^(\d{3})(\d{3})(\d)+$/, "$1-$2-$3"));
});

$('#message-new-contact').on('change', function(e) {
    let data = $(this).val();

    $('#message-new-number').val(data);
})

function SetupMessages() {
    let myNumber = JSON.parse(window.localStorage.getItem('myNumber'));
    let contacts = JSON.parse(window.localStorage.getItem('contacts'));
    let messages = JSON.parse(window.localStorage.getItem('messages'));

    let convos = new Array();

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
        
        var t = message.sent_time.split(/[- :]/);

        obj.time = t;

        let convo = convos.filter(c => c.number === obj.number)[0]
        
        if (convo == null) {
            convos.push(obj);
        } else {
            var d = new Date(Date.UTC(obj.time[0], obj.time[1] - 1, obj.time[2], obj.time[3], obj.time[4], obj.time[5]));
            var d2 = new Date(Date.UTC(convo.time[0], convo.time[1] - 1, convo.time[2], convo.time[3], convo.time[4], convo.time[5]));
            if ( d > d2 ) {
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
        let contact = contacts.filter(c => c.number == message.number)[0];

        // Not A Contact
        if (contact == null) {
            $('#message-container .inner-app .messages-list').append('<div class="message waves-effect"><div class="text-avatar">#</div><div class="text-name">' + message.number + '</div><div class="text-message">' + message.message + '</div><div class="text-time">' + moment([message.time[0], message.time[1] - 1, message.time[2], message.time[3], message.time[4], message.time[5]]).fromNowOrNow() + '</div></div>');
        } else {
            $('#message-container .inner-app .messages-list').append('<div class="message waves-effect"><div class="text-avatar other-' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="text-name">' + contact.name + '</div><div class="text-message"> ' + message.message + '</div><div class="text-time">' + moment([message.time[0], message.time[1] - 1, message.time[2], message.time[3], message.time[4], message.time[5]]).fromNowOrNow() + '</div></div>')
        }

        $('.messages-list .message:last-child').data('message', message);
    });
}

function SetupNewMessage() {
    let contacts = JSON.parse(window.localStorage.getItem('contacts'));

    $.each(contacts, function(index, contact) {
        $('#message-new-contact').append('<option value="' + contact.number + '">' + contact.name + ' (' + contact.number +')</option>');
    });

    $('#message-new-contact').formSelect();
}

function sortFunction(a,b){  
    var dateA = new Date(Date.UTC(a.time[0], a.time[1] - 1, a.time[2], a.time[3], a.time[4], a.time[5]));
    var dateB = new Date(Date.UTC(b.time[0], b.time[1] - 1, b.time[2], b.time[3], b.time[4], b.time[5]));
    return dateA < dateB ? 1 : -1;  
}; 