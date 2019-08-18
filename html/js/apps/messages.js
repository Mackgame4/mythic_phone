function SetupMessages() {
    let defaultContacts = JSON.parse(window.localStorage.getItem('defaultContacts'));
    let contacts = JSON.parse(window.localStorage.getItem('contacts'));
    let myNumber = window.localStorage.getItem('myNumber');

    let convos = new Array();

    $.each(Messages, function(index, message) {
        let obj = {}
        if (message.sender === myNumber) {
            obj.number = message.receiver;
        } else {
            obj.number = message.sender;
        }

        obj.message = message.message;
        
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

    $('#message-container .inner-app .messages-list').html('');
    $.each(convos, function(index, message) {
        let contact = defaultContacts.filter(c => c.number == message.number)[0];

        if (contact == null) {
            contact = contacts.filter(c => c.number == message.number)[0];
        }

        // Not A Contact
        if (contact == null) {
            $('#message-container .inner-app .messages-list').append('<div class="message waves-effect"><div class="text-avatar">#</div><div class="text-name">' + message.number + '</div><div class="text-message">' + message.message + '</div><div class="text-time">' + moment([message.time[0], message.time[1] - 1, message.time[2], message.time[3], message.time[4], message.time[5]]).fromNow() + '</div></div>')
        } else {
            $('#message-container .inner-app .messages-list').append('<div class="message waves-effect"><div class="text-avatar ava-' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="text-name">' + contact.name + '</div><div class="text-message"> ' + message.message + '</div><div class="text-time">' + moment([message.time[0], message.time[1] - 1, message.time[2], message.time[3], message.time[4], message.time[5]]).fromNow() + '</div></div>')
        }
    })
}