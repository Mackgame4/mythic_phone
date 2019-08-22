RegisterServerEvent('mythic_characters:server:CharacterSpawned')
AddEventHandler('mythic_characters:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    Citizen.CreateThread(function()
        exports['ghmattimysql']:execute('SELECT * FROM phone_calls WHERE (sender = @number AND sender_deleted = 0) OR (receiver = @number AND receiver_deleted = 0)', { ['number'] = cData.phone }, function(history) 
            TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'history', data = history } })
        end)
    end)
end)

RegisterServerEvent('mythic_phone:server:DeleteCallRecord')
AddEventHandler('mythic_phone:server:DeleteCallRecord', function(token, identifier, id)
    print(identifier, id)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    exports['ghmattimysql']:execute('SELECT * FROM phone_calls WHERE id = @id', { ['id'] = id }, function(record)
        if record[1] ~= nil then
            if record[1].sender == cData.phone then
                exports['ghmattimysql']:execute('UPDATE phone_calls SET sender_deleted = 1 WHERE id = @id AND sender = @phone', { ['id'] = id, ['phone'] = cData.phone }, function(status)
                    if status.affectedRows > 0 then
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
                    else
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
                    end
                end)
            else
                exports['ghmattimysql']:execute('UPDATE phone_calls SET receiver_deleted = 1 WHERE id = @id AND receiver = @phone', { ['id'] = id, ['phone'] = cData.phone }, function(status)
                    if status.affectedRows > 0 then
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
                    else
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
                    end
                end)
            end
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
        end
    end)
end)