import Config from './config';

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

function StoreDataLua(key, data) {
    $.post(Config.ROOT_ADDRESS + '/RegiseterData', JSON.stringify({
        key: key,
        data: data
    }));
}

function GetDataLua(key) {
    $.post(Config.ROOT_ADDRESS + '/GetData', JSON.stringify({
        key: key
    }), function(data) {
        return data
    });
}

function ClearData() {
    window.localStorage.clear();
}

export default { SetupData, StoreData, GetData, ClearData, StoreDataLua, GetDataLua };
