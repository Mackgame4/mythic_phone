PendingCalls = {}
ActiveCalls = {}

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

RegisterServerEvent('mythic_phone:server:CreateCall')
AddEventHandler('mythic_phone:server:CreateCall', function(token, identifier, number)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    local tPlayer = exports['mythic_base']:getPlayerFromPhone(number)
    print(number)
    print(tPlayer ~= nil)
    if tPlayer ~= nil then
        print(PendingCalls[number] ~= nil)
        print(ActiveCalls[number] ~= nil)
        if PendingCalls[number] ~= nil or ActiveCalls[number] ~= nil then
            print(-2)
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -2)
            TriggerClientEvent('mythic_notify:client:SendAlert', tPlayer.getSource(), { type = 'inform', text = char.getFullName() .. ' Tried Calling You But You\'re Already In A Call, Sending Busy Response'})
        else
            print(1)
            TriggerClientEvent('mythic_notify:client:PersistentAlert', tPlayer.getSource(), { id = 'incoming-call', action = 'start', type = 'inform', text = char.getFullName() .. ' Is Calling You'})
            TriggerClientEvent('mythic_phone:client:ReceiveCall', tPlayer.getSource(), char.getFullName(), cData.phone)
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, 1)
            PendingCalls[cData.phone] = {
                number = number,
            }
        end
    else
        print(-1)
        PendingCalls[cData.phone] = nil
        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -1)
    end
end)

RegisterServerEvent('mythic_phone:server:AcceptCall')
AddEventHandler('mythic_phone:server:AcceptCall', function(token, identifier, number)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()
    local call = nil

    for k, v in pairs(PendingCalls) do
        if v.number == cData.number then
            call = k
        end
    end

    if k ~= nil then
        local tPlayer = exports['mythic_base']:getPlayerFromPhone(k)
        if tPlayer ~= nil then
            TriggerClientEvent('mythic_phone:client:AcceptCall', src, tPlayer.getSource(), cData.phone)
            TriggerClientEvent('mythic_phone:client:AcceptCall', tPlayer.getSource(), tPlayer.getSource(), k)
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
            PendingCalls[cData.phone] = nil

            ActiveCalls[k] = {
                number = cData.phone
            }
        else
            PendingCalls[k] = nil
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
        end
    else
        PendingCalls[k] = nil
        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
    end
end)

RegisterServerEvent('mythic_phone:server:RejectCall')
AddEventHandler('mythic_phone:server:RejectCall', function(token, identifier, number)
    local src = source
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    local tPlayer = exports['mythic_base']:getPlayerFromPhone(number)
    if tPlayer ~= nil then
        PendingCalls[cData.phone] = nil
        PendingCalls[number] = nil
        TriggerClientEvent('mythic_phone:client:EndCall', tPlayer.getSource(), false)
        TriggerClientEvent('mythic_phone:client:RejectCall', src, false)
        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
    else
        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
    end
end)