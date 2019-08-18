var documentWidth = document.documentElement.clientWidth;
var documentHeight = document.documentElement.clientHeight;
var cursorX = documentWidth / 2;
var cursorY = documentHeight / 2;

var currentApp = null;

$( function() {
    OpenApp('home');
});

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

$( function() {
    document.onkeyup = function ( data ) {
        if ( data.which == 114 ) { // Escape key
            ClosePhone();
        }
    };
});

$('#back-button').click(function(event) {
    if (currentApp !== 'home') {
        OpenApp($('.active-container').data('back'))
    }
});

$('#home-button').click(function(event) {
    if (currentApp !== 'home') {
        OpenApp('home');
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
        $('#' + app + '-container').fadeIn('normal', function() {
            $('#' + currentApp + '-container').fadeOut();

            $('.active-container').removeClass('active-container');
            $('#' + app + '-container').addClass('active-container');

            currentApp = app;
        });
    }

    $('.material-tooltip').remove();
    switch(app) {
        case 'home':
            SetupHome(data)
            break;
        case 'contacts':
            SetupContacts(data);
            break;
        case 'message':
            SetupData( [ { name: 'contacts', data: Contacts }, { name: 'myNumber', data: '111-111-1111' } ] );
            SetupMessages(data);
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
            CloseMessages()
            break;
        case 'message-convo':
            CloseConvo();
            break;
    }
}

function SetupData(data) {
    window.localStorage.clear();   
    $.each(data, function(index, item) {
        window.localStorage.setItem(item.name, JSON.stringify(item.data));
    });
}