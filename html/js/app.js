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

$('#home-container').on('click', '.app-button', function(event) {
    OpenApp($(this).data('container'));
});

function ClosePhone() {
    $('#toast-container').remove();
    $('.material-tooltip').remove();
    $('#cursor').hide();
    $('.wrapper').hide("slide", { direction: "down" }, 500);
    $.post('http://mythic_phone2/ClosePhone', JSON.stringify({}));
}

function SetupApps() {
    $('#home-container .inner-app').html('');
    $.each(Apps, function(index, app) {
        if (app.enabled) {
            if (app.unread > 0) {
                $('#home-container .inner-app').append('<div class="app-button" data-tooltip="' + app.name + '"><div class="app-icon" id="' + app.container + '-app" style="background-color: ' + app.color + '"> ' + app.icon + '<div class="badge pulse">' + app.unread + '</div></div></div>')
            } else {
                $('#home-container .inner-app').append('<div class="app-button" data-tooltip="' + app.name + '"><div class="app-icon" id="' + app.container + '-app" style="background-color: ' + app.color + '"> ' + app.icon + '</div></div>')
            }
            let $app = $('#home-container .app-button:last-child');

            $app.tooltip( {
                enterDelay: 0,
                exitDelay: 0,
                inDuration: 0,
            } );
    
            $app.data('container', app.container);
        }
    });
}

function ToggleApp(name, status) {
    let pApp = Apps.filter(app => app.container === name)[0];

    if (!status) {
        $('#' + pApp.container + '-app').parent().fadeOut();
        pApp.enabled = false;
    } else {
        pApp.enabled = true;
        SetupApps()
    }
}

function OpenApp(app, data) {
    if (currentApp !== app) {
        $('#' + app + '-container').fadeIn('normal', function() {
            $('#' + currentApp + '-container').fadeOut();

            $('.active-container').removeClass('active-container');
            $('#' + app + '-container').addClass('active-container');

            currentApp = app;

            let pApp = Apps.filter(abc => abc.container === app)[0];
            if (pApp !== undefined) {
                if (pApp.unread > 0) {
                    pApp.unread = 0;
                }
            }
        });
    }

    $('.material-tooltip').remove();
    switch(app) {
        case 'home':
            SetupApps(data)
            break;
        case 'contacts':
            SetupContacts(data);
            break;
        case 'message':
            SetupData( [ { name: 'defaultContacts', data: DefContacts }, { name: 'contacts', data: Contacts }, { name: 'myNumber', data: '111-111-1111' } ] );
            SetupMessages(data);
            break;
        case 'message-convo':
            SetupConvo(data);
            break;
    }
}

function SetupData(data) {
    window.localStorage.clear();   
    $.each(data, function(index, item) {
        window.localStorage.setItem(item.name, JSON.stringify(item.data));
    });
}