$('#home-container').on('click', '.app-button', function(event) {
    OpenApp($(this).data('container'));
});

function SetupHome() {
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
        SetupHome()
    }
}