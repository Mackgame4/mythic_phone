RegisterServerEvent('mythic_characters:server:CharacterSpawned')
AddEventHandler('mythic_characters:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    Citizen.CreateThread(function()
        exports['ghmattimysql']:execute('SELECT * FROM phone_texts WHERE sender = @number OR receiver = @number', { ['number'] = cData.phone }, function(messages) 
            TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'messages', data = messages } })
        end)
    end)
end)

RegisterServerEvent('mythic_phone:server:SendText')
AddEventHandler('mythic_phone:server:SendText', function(token, identifier, receiver, message)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    exports['ghmattimysql']:execute('INSERT INTO phone_texts (`sender`, `receiver`, `message`) VALUES(@sender, @receiver, @message)', { ['sender'] = cData.phone, ['receiver'] = receiver, ['message'] = message }, function(status)
        if status.affectedRows > 0 then
            exports['ghmattimysql']:execute('SELECT * FROM phone_texts WHERE id = @id', { ['id'] = status.insertId }, function(text)
                if text[1] ~= nil then
                    exports['ghmattimysql']:execute('SELECT id FROM characters WHERE phone_number = @phone', { ['phone'] = receiver }, function(rChar)
                        if rChar[0] ~= nil then

                        end

                    end)
                    TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, text[1])
                else
                    TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
                end
            end)
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
        end
    end)
end)

RegisterServerEvent('mythic_phone:server:DeleteConversation')
AddEventHandler('mythic_phone:server:DeleteConversation', function(token, identifier, number)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    exports['ghmattimysql']:execute('DELETE FROM phone_texts WHERE (sender = @me AND receiver = @other) OR (sender = @other AND receiver = @me)', { ['me'] = cData.phone, ['other'] = number }, function(status)
        if status.affectedRows > 0 then
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
        end
    end)
end)