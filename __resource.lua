resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'

name 'Mythic Phone'
description 'Custom Phone Written For Mythic Roleplay'
author 'Alzar - https://github.com/Alzar'
version 'v1.0.0'
url 'https://github.com/mythicrp/mythic_phone'

ui_page 'html/index.html'

files {
	'html/index.html',
	'html/css/*.min.css',
    
    'html/js/build.js',

    'html/libs/*.min.css',
    'html/libs/*.min.js',

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
	'@salty_tokenizer/init.lua',
    'config/*.lua',

    'client/main.lua',
    'client/animation.lua',
    
	'client/apps/*.lua',
}

server_script {
	'@salty_tokenizer/init.lua',
    'config/*.lua',

    'server/main.lua',
    'server/commands.lua',
    
	'server/apps/*.lua',
}

dependencies {
    'salty_tokenizer',
    'mythic_base',
    'mythic_inventory',
}