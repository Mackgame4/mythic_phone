RegisterServerEvent('mythic_characters:server:CharacterSpawned')
AddEventHandler('mythic_characters:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    Citizen.CreateThread(function()
        exports['ghmattimysql']:execute('SELECT * FROM phone_texts WHERE charid = @charid', { ['charid'] = cData.id }, function(messages) 
            TriggerClientEvent('mythic_phone:client:SetupData', src, messages)
        end)
    end)
end)