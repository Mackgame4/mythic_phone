resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'

name 'Mythic Phone'
description 'Custom Phone Written For Mythic Roleplay'
author 'Alzar - https://github.com/Alzar'
version 'v1.0.0'
url 'https://github.com/mythicrp/mythic_phone'

ui_page 'html/index.html'

files {
	'html/index.html',
	'html/css/materialize.min.css',
	'html/css/style.min.css',
    'html/libs/jquery-ui.min.css',
	'html/js/app.js',
    'html/js/phone_apps.js',
    'html/js/test.js',

    'html/js/apps/contacts.js',
    
    'html/libs/all.min.css',
    'html/libs/jquery.min.js',
    'html/libs/jquery-ui.min.js',
    'html/libs/jquery.inputmask.bundle.min.js',
    'html/libs/materialize.min.js',

    'html/webfonts/fa-brands-400.eot',
    'html/webfonts/fa-brands-400.svg',
    'html/webfonts/fa-brands-400.ttf',
    'html/webfonts/fa-brands-400.woff',
    'html/webfonts/fa-brands-400.woff2',
    'html/webfonts/fa-regular-400.eot',
    'html/webfonts/fa-regular-400.svg',
    'html/webfonts/fa-regular-400.ttf',
    'html/webfonts/fa-regular-400.woff',
    'html/webfonts/fa-regular-400.woff2',
    'html/webfonts/fa-solid-900.eot',
    'html/webfonts/fa-solid-900.svg',
    'html/webfonts/fa-solid-900.ttf',
    'html/webfonts/fa-solid-900.woff',
    'html/webfonts/fa-solid-900.woff2',

    'html/imgs/back001.png',
    'html/imgs/back002.png',
    'html/imgs/back003.png',
    'html/imgs/iphonex.png',
    'html/imgs/s8.png',
}

client_script {
	"client/main.lua",
}

server_script {
	"server/main.lua",
}

dependencies {
    'mythic_base',
    'mythic_inventory',
}