import Config from './config';

function SetupData(data) {
    $.each(data, function(index, item) {
        window.localStorage.setItem(item.name, JSON.stringify(item.data));
    });
}

function StoreData(name, data) {
    window.localStorage.setItem(name, JSON.stringify(data));
}

function AddData(name, value) {
    let arr = GetData(name);
    arr.push(value);
    StoreData(name, arr);
}

function RemoveData(name, index) {
    let arr = GetData(name);
    arr.splice(index, 1);
    StoreData(name, arr);
}

function RemoveObjectData(name, key, value) {
    let arr = GetData(name);
    $.each(arr, function(index, item) {
        if (item[key] == value) {
            RemoveData(name, index);
            return false;
        }
    });
}

function UpdateData(name, index, data) {
    let arr = GetData(name);
    arr[index] = data;
    StoreData(name, arr);
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

export default { SetupData, StoreData, AddData, RemoveData, RemoveObjectData, UpdateData, GetData, ClearData, StoreDataLua, GetDataLua };
