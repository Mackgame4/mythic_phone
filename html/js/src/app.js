import Config from './config';
import Data from './data';
import Utils from './utils';
import Home from './apps/home';
import Contacts from './apps/contacts';
import Phone from './apps/phone/phone';
import Messages from './apps/messages/messages';
import Twitter from './apps/twitter';
import Adverts from './apps/yp';
import Tuner from './apps/tuner/home';

import Test from './test';

var appTrail = [
    {
        app: null,
        data: null,
        fade: null
    }
];

var navDisabled = false;

moment.fn.fromNowOrNow = function(a) {
    if (Math.abs(moment().diff(this)) < 60000) {
        return 'just now';
    }
    return this.fromNow(a);
};

$(function() {
    $('.wrapper').fadeIn();
    Data.ClearData();
    Data.SetupData([
        { name: 'myData', data: Test.PlayerDetails },
        { name: 'contacts', data: Test.Contacts },
        { name: 'messages', data: Test.Messages },
        { name: 'history', data: Test.Calls },
        { name: 'apps', data: Config.Apps },
        { name: 'muted', data: false },
        { name: 'tweets', data: Test.Tweets },
        { name: 'adverts', data: Test.Adverts }
    ]);

    OpenApp('home', null, true);
});

window.addEventListener('message', function(event) {
    switch (event.data.action) {
        case 'setup':
            Data.SetupData(event.data.data);
            break;
        case 'show':
            $('.wrapper').show('slide', { direction: 'down' }, 500);

            if (!Phone.Call.IsCallPending()) {
                OpenApp('home', null, true);
            } else {
                appTrail = [
                    {
                        app: 'home',
                        data: null,
                        fade: false
                    }
                ];
                OpenApp(
                    'phone-call',
                    {
                        number: event.data.number,
                        receiver: !event.data.initiator
                    },
                    false
                );
            }

            break;
        case 'hide':
            ClosePhone();
            break;
        case 'logout':
            Data.ClearData();
            break;
        case 'setmute':
            Utils.SetMute(event.data.muted);
            break;
        case 'updateTime':
            Utils.UpdateClock(event.data.time);
            break;
        case 'updateUnread':
            Home.UpdateUnread(event.data.app, event.data.unread);
            break;
        case 'receiveText':
            Messages.Convo.ReceiveText(
                event.data.data.sender,
                event.data.data.text
            );
            break;
        case 'receiveCall':
            OpenApp(
                'phone-call',
                { number: event.data.number, receiver: true },
                false
            );
            break;
        case 'acceptCallSender':
            Phone.Call.CallAnswered();
            break;
        case 'acceptCallReceiver':
            Phone.Call.CallAnswered();
            break;
        case 'endCall':
            Phone.Call.CallHungUp();
            break;
        case 'ReceiveNewTweet':
            Twitter.ReceiveNewTweet(event.data.tweet);
            break;
    }
});

$(document).ready(function() {
    $('.modal').modal();
    $('.dropdown-trigger').dropdown({
        constrainWidth: false
    });
    $('.tabs').tabs();
    $('.char-count-input').characterCounter();
    $('.phone-number').mask('000-000-0000', { placeholder: '###-###-####' });
});

$(function() {
    document.onkeyup = function(data) {
        if (data.which == 114 || data.which == 27) {
            ClosePhone();
        }
    };
});

$('.phone-header').on('click', '.in-call', function(e) {
    if (appTrail[appTrail.length - 1].app != 'phone-call') {
        OpenApp('phone-call', null, false);
    }
});

$('.back-button').on('click', function(e) {
    if (!navDisabled) {
        GoBack();
        navDisabled = true;
        setTimeout(function() {
            navDisabled = false;
        }, 500);
    }
});

$('.home-button').on('click', function(e) {
    if (!navDisabled) {
        GoHome();
        navDisabled = true;
        setTimeout(function() {
            navDisabled = false;
        }, 500);
    }
});

$('.close-button').on('click', function(e) {
    ClosePhone();
});

$('#remove-sim-card').on('click', function(e) {
    var modal = M.Modal.getInstance($('#remove-sim-conf'));
    modal.close();
    Utils.NotifyAltSim(false);
    M.toast({ html: 'Sim Removed' });
});

$('.mute').on('click', function(e) {
    let muted = Data.GetData('muted');
    Utils.SetMute(!muted);
});

function ClosePhone() {
    $.post(Config.ROOT_ADDRESS + '/ClosePhone', JSON.stringify({}));
    $('.wrapper').hide('slide', { direction: 'down' }, 500, function() {
        $('#toast-container').remove();
        $('.material-tooltip').remove();
        $('.app-container').hide();
        appTrail = [
            {
                app: null,
                data: null,
                fade: null
            }
        ];
    });
}

function OpenApp(app, data = null, pop = false, disableFade = false) {
    if ($('#' + app + '-container').length == 0 || appTrail.length == 0) return;

    if (appTrail[appTrail.length - 1].app !== app) {
        if ($('.active-container').length > 0) {
            if (disableFade) {
                $('.active-container').hide();
                $('.active-container').removeClass('active-container');
                $('#' + app + '-container').show()
                $('#' + app + '-container').addClass('active-container');

                CloseAppAction(appTrail[appTrail.length - 1].app);
                if (pop) {
                    appTrail.pop();
                    disableFade = appTrail[appTrail.length - 1].fade;
                    appTrail.pop();
                }

                appTrail.push({
                    app: app,
                    data: data,
                    fade: disableFade
                });

                $('.material-tooltip').remove();
                OpenAppAction(app, data);
            } else {
                $('.active-container').fadeOut('fast', function() {
                    $('.active-container').removeClass('active-container');
    
                    $('#' + app + '-container').fadeIn('fast', function() {
                        $('.active-container').removeClass('active-container');
                        $('#' + app + '-container').addClass('active-container');
    
                        CloseAppAction(appTrail[appTrail.length - 1].app);
                        if (pop) {
                            appTrail.pop();
                            appTrail.pop();
                        }
    
                        appTrail.push({
                            app: app,
                            data: data,
                            fade: disableFade
                        });
                    });
    
                    $('.material-tooltip').remove();
                    OpenAppAction(app, data);
                });
            }
        } else {
            $('#' + app + '-container').fadeIn('fast', function() {
                $('.active-container').removeClass('active-container');
                $('#' + app + '-container').addClass('active-container');

                CloseAppAction(appTrail[appTrail.length - 1].app);
                if (pop) {
                    appTrail.pop();
                    appTrail.pop();
                }

                appTrail.push({
                    app: app,
                    data: data,
                    fade: disableFade
                });
            });

            $('.material-tooltip').remove();
            OpenAppAction(app, data);
        }
    }
}

function RefreshApp() {
    $('.material-tooltip').remove();
    OpenAppAction(
        appTrail[appTrail.length - 1].app,
        appTrail[appTrail.length - 1].data
    );
}

function OpenAppAction(app, data) {
    switch (app) {
        case 'home':
            Home.OpenApp();
            break;
        case 'contacts':
            Contacts.OpenApp();
            break;
        case 'message':
            Messages.OpenApp();
            Messages.SetupNewMessage();
            break;
        case 'message-convo':
            Messages.Convo.OpenApp(data);
            break;
        case 'phone':
            Phone.OpenApp();
            break;
        case 'phone-call':
            Phone.Call.OpenApp(data);
            break;
        case 'twitter':
            Twitter.OpenApp();
            break;
        case 'ads':
            Adverts.OpenApp();
            break;
        case 'tuner':
            Tuner.OpenApp(true);
            break;
        case 'tuner-quick':
            Tuner.Quick.OpenApp();
            break;
    }
}

function CloseAppAction(app) {
    switch (app) {
        case 'message-convo':
            Messages.Convo.CloseApp();
            break;
        case 'phone-call':
            Phone.Call.CloseApp();
            break;
        case 'tuner':
            Tuner.CloseApp();
            break;
        case 'tuner-quick':
            Tuner.Quick.CloseApp();
            break;
    }
}

function GoHome() {
    if (appTrail.length > 1) {
        if (appTrail[appTrail.length - 1].app !== 'home') {
            OpenApp('home');
        }
    }
}

function GoBack() {
    if (appTrail[appTrail.length - 1].app !== 'home') {
        if (appTrail.length > 1) {
            OpenApp(
                appTrail[appTrail.length - 2].app,
                appTrail[appTrail.length - 2].data,
                true,
                appTrail[appTrail.length - 1].fade
            );
        } else {
            GoHome();
        }
    }
}

function GetCurrentApp() {
    return appTrail[appTrail.length - 1].app;
}

export default { GoHome, GoBack, OpenApp, RefreshApp, GetCurrentApp };
