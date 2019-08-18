var documentWidth = document.documentElement.clientWidth;
var documentHeight = document.documentElement.clientHeight;
var cursorX = documentWidth / 2;
var cursorY = documentHeight / 2;

var currentApp = null;

var navDisabled = false;

$( function() {
    SetupData( [ { name: 'myNumber', data: '111-111-1111' }, { name: 'contacts', data: Contacts }, { name: 'messages', data: Messages } ] );
    OpenApp('home');
});

moment.fn.fromNowOrNow = function (a) {
    if (Math.abs(moment().diff(this)) < 60000) {
        return 'just now';
    }
    return this.fromNow(a);
}

function UpdateCursorPos() {
    $('#cursor').css('left', cursorX + 2);
    $('#cursor').css('top', cursorY + 2);
}

function triggerClick(x, y) {
    var element = $(document.elementFromPoint(x, y)); 
    element.focus().click();
    return true;
}

$(document).mousemove(function(event) {
    cursorX = event.pageX;
    cursorY = event.pageY;
    UpdateCursorPos();
});

window.addEventListener('message', function(event) {
    switch(event.data.action) {
        case 'setup':
            SetupData(event.data.data);
            break;
        case 'show':
            $('.wrapper').show("slide", { direction: "down" }, 500);
            $('#cursor').show();
            OpenApp('home');
            break;
        case 'hide':
            ClosePhone();
            currentApp = null;
            break;
    }
});

$(document).ready(function(){
    $('.modal').modal();
    $('#convo-input').characterCounter();
    $('#message-new-body').characterCounter();
});

$( function() {
    document.onkeyup = function ( data ) {
        if ( data.which == 114 || data.which == 27 ) { // F3 key
            ClosePhone();
        }
    };
});

$('#back-button').click(function(event) {
    if (!navDisabled) {
        GoBack();
        navDisabled = true;
        setTimeout(function() {
            navDisabled = false;
        }, 500);
    }
});

$('#home-button').click(function(event) {
    if (!navDisabled) {
        GoHome();
        navDisabled = true;
        setTimeout(function() {
            navDisabled = false;
        }, 500);
    }
});

function ClosePhone() {
    $('#toast-container').remove();
    $('.material-tooltip').remove();
    $('#cursor').hide();
    $('.wrapper').hide("slide", { direction: "down" }, 500);
    $.post('http://mythic_phone2/ClosePhone', JSON.stringify({}));
}

function OpenApp(app, data) {
    if (currentApp !== app) {
        $('#' + app + '-container').fadeIn('fast', function() {
            $('#' + currentApp + '-container').fadeOut('fast');

            $('.active-container').removeClass('active-container');
            $('#' + app + '-container').addClass('active-container');

            currentApp = app;
        });
    }

    $('.material-tooltip').remove();
    switch(app) {
        case 'home':
            SetupHome()
            break;
        case 'contacts':
            SetupContacts();
            break;
        case 'message':
            SetupMessages();
            SetupNewMessage();
            break;
        case 'message-convo':
            SetupConvo(data);
            break;
    }
}

function CloseApp(app) {
    switch(app) {
        case 'home':
            CloseHome();
            break;
        case 'contacts':
            CloseContacts();
            break;
        case 'messages':
            CloseMessages();
            break;
        case 'message-convo':
            CloseConvo();
            break;
    }
}

function GoHome() {
    if (currentApp !== 'home') {
        OpenApp('home');
    }
}

function GoBack() {
    if (currentApp !== 'home') {
        OpenApp($('.active-container').data('back'))
    }
}

function SetupData(data) {
    window.localStorage.clear();   
    $.each(data, function(index, item) {
        window.localStorage.setItem(item.name, JSON.stringify(item.data));
    });
}

function StoreData(data) { 
    $.each(data, function(index, item) {
        window.localStorage.setItem(item.name, JSON.stringify(item.data));
    });
}