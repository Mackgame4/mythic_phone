RegisterServerEvent('mythic_characters:server:CharacterSpawned')
AddEventHandler('mythic_characters:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    TriggerClientEvent('mythic_phone:client:SetupData', src, { name = 'myNumber', data = cData.phone })
end)