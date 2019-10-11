resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'

name 'Mythic Phone'
description 'Custom Phone Written For Mythic Roleplay'
author 'Alzar - https://github.com/Alzar'
version 'v1.0.0'
url 'https://github.com/mythicrp/mythic_phone'

ui_page 'ui/index.html'

files {
	'ui/index.html',
	'ui/css/*.min.css',
	'ui/html/apps/*.html',
    
    'ui/js/build.js',

    'ui/libs/*.min.css',
    'ui/libs/*.min.js',

    'ui/webfonts/fa-brands-400.eot',
    'ui/webfonts/fa-brands-400.svg',
    'ui/webfonts/fa-brands-400.ttf',
    'ui/webfonts/fa-brands-400.woff',
    'ui/webfonts/fa-brands-400.woff2',
    'ui/webfonts/fa-regular-400.eot',
    'ui/webfonts/fa-regular-400.svg',
    'ui/webfonts/fa-regular-400.ttf',
    'ui/webfonts/fa-regular-400.woff',
    'ui/webfonts/fa-regular-400.woff2',
    'ui/webfonts/fa-solid-900.eot',
    'ui/webfonts/fa-solid-900.svg',
    'ui/webfonts/fa-solid-900.ttf',
    'ui/webfonts/fa-solid-900.woff',
    'ui/webfonts/fa-solid-900.woff2',

    'ui/imgs/back001.png',
    'ui/imgs/back002.png',
    'ui/imgs/back003.png',
    'ui/imgs/iphonex.png',
    'ui/imgs/s8.png',
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