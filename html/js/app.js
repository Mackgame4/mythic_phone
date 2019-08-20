var appTrail = [{
    app: null,
    data: null
}];

var navDisabled = false;

$( function() {
    window.localStorage.clear(); 
});

$( function() {
    $('.wrapper').fadeIn();
    SetupData( [ { name: 'myNumber', data: '111-111-1111' }, { name: 'contacts', data: Contacts }, { name: 'messages', data: Messages }, { name: 'history', data: Calls } ] );
    OpenApp('home', null, true);
});

moment.fn.fromNowOrNow = function (a) {
    if (Math.abs(moment().diff(this)) < 60000) {
        return 'just now';
    }
    return this.fromNow(a);
}

window.addEventListener('message', function(event) {
    switch(event.data.action) {
        case 'setup':
            SetupData(event.data.data);
            break;
        case 'show':
            $('.wrapper').show("slide", { direction: "down" }, 500);
            OpenApp('home', null, true);
            break;
        case 'hide':
            ClosePhone();
            break;
        case 'receiveText':
            ReceiveText(event.data.data.sender, event.data.data.text);
            break;
    }
});

$(document).ready(function(){
    $('.modal').modal();
    $('.dropdown-trigger').dropdown({
        constrainWidth: false
    });
    $('.tabs').tabs({
        swipeable: true
    });
    $('.char-count-input').characterCounter();
});

$( function() {
    document.onkeyup = function ( data ) {
        if ( data.which == 114 || data.which == 27 ) {
            ClosePhone();
        }
    };
});

$('.back-button').click(function(event) {
    if (!navDisabled) {
        GoBack();
        navDisabled = true;
        setTimeout(function() {
            navDisabled = false;
        }, 500);
    }
});

$('.home-button').click(function(event) {
    if (!navDisabled) {
        GoHome();
        navDisabled = true;
        setTimeout(function() {
            navDisabled = false;
        }, 500);
    }
});

$('.close-button').click(function(event) {
    ClosePhone()
});

function dateSortNewest(a,b){
    return a.time < b.time ? 1 : -1;  
}; 

function dateSortOldest(a,b){
    return a.time > b.time ? 1 : -1;  
}; 

function ClosePhone() {
    $.post('http://mythic_phone2/ClosePhone', JSON.stringify({}));
    $('.wrapper').hide("slide", { direction: "down" }, 500, function() {
        $('#toast-container').remove();
        $('.material-tooltip').remove();
        $('.app-container').hide();
        appTrail = [{
            app: null,
            data: null
        }];
    });
}

function OpenApp(app, data = null, pop = false) {
    if (appTrail[appTrail.length - 1].app !== app) {
        $('#' + app + '-container').fadeIn('fast', function() {
            $('#' + appTrail[appTrail.length - 1].app + '-container').fadeOut('fast');

            $('.active-container').removeClass('active-container');
            $('#' + app + '-container').addClass('active-container');

            if (pop) {
                appTrail.pop();
                appTrail.pop();
            }
            
            appTrail.push({
                app: app,
                data: data
            });
        });

        $('.material-tooltip').remove();
        OpenAppAction(app, data);
    }
}

function RefreshApp() {
    $('.material-tooltip').remove();
    OpenAppAction(appTrail[appTrail.length - 1].app, appTrail[appTrail.length - 1].data)
}

function OpenAppAction(app, data) {
    switch(app) {
        case 'home':
            SetupHome();
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
        case 'phone':
            SetupCallContacts();
            SetupCallHistory();
            break;
    }
}

function GoHome() {
    if (appTrail[appTrail.length - 1].app !== 'home') {
        OpenApp('home');
    }
}

function GoBack() {
    if (appTrail[appTrail.length - 1].app !== 'home') {
        OpenApp(appTrail[appTrail.length - 2].app, appTrail[appTrail.length - 2].data, true);
    }
}

function SetupData(data) {  
    $.each(data, function(index, item) {
        window.localStorage.setItem(item.name, JSON.stringify(item.data));
    });
}

function StoreData(name, data) { 
    window.localStorage.setItem(name, JSON.stringify(data));
}

function GetData(name) {
    return JSON.parse(window.localStorage.getItem(name));
}