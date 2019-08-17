var appTrail = {}

var currentApp = 'home';

$( function() {
    SetupApps()

    $('#home-container').show();
});

window.addEventListener('message', function(event) {
    switch(event.data.action) {
        case 'setup':
            SetupData(event.data.data);
            break;
        case 'show':
            $('.wrapper').show("slide", { direction: "down" }, 500);
            break;
        case 'hide':
            ClosePhone();
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
        $('.active-container').fadeOut('normal', function() {
            $('#home-container').fadeIn('fast', function() {
                $('.active-container').removeClass('active-container');
            })
        });
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

function OpenApp(app) {
    if (currentApp !== app) {
        $('#' + app + '-container').fadeIn('fast', function() {
            $('#' + currentApp + '-container').hide();
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
            SetupApps()
            break;
        case 'contacts':
            SetupContacts(Contacts);
            break;
    }
}

function SetupData(data) {
    window.localStorage.clear();   
    $.each(data, function(index, item) {
        window.localStorage.setItem(item.name, JSON.stringify(item.data));
    });
}