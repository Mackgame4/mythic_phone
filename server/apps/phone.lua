Calls = {}

function CreateCallRecord(sender, receiver, state)

end

RegisterServerEvent('mythic_characters:server:CharacterSpawned')
AddEventHandler('mythic_characters:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:FetchComponent('Fetch'):Source(src):GetData('character')
    local cData = char:GetData()

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
    
    local char = exports['mythic_base']:FetchComponent('Fetch'):Source(src):GetData('character')
    local cData = char:GetData()

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
AddEventHandler('mythic_phone:server:CreateCall', function(token, identifier, number, nonStandard)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:FetchComponent('Fetch'):Source(src):GetData('character')
    local cData = char:GetData()

    local tPlayer = exports['mythic_base']:FetchComponent('Fetch').Phone(number)
    if tPlayer ~= nil then
        if tPlayer:GetData('source') ~= src then
            if Calls[number] ~= nil then
                TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -3)
                TriggerClientEvent('mythic_notify:client:SendAlert', tPlayer:GetData('source'), { type = 'inform', text = char:getFullName() .. ' Tried Calling You, Sending Busy Response'})
            else
                exports['ghmattimysql']:execute('INSERT INTO phone_calls (sender, receiver, status, anon) VALUES(@sender, @receiver, @status, @anon)', { ['sender'] = cData.phone, ['receiver'] = number, ['status'] = 0, ['anon'] = nonStandard}, function(status)
                    if status.affectedRows > 0 then
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, 1)
        
                        TriggerClientEvent('mythic_phone:client:CreateCall', src, cData.phone)

                        if nonStandard then
                            TriggerClientEvent('mythic_phone:client:ReceiveCall', tPlayer:GetData('source'), 'Anonymous Caller')
                        else
                            TriggerClientEvent('mythic_phone:client:ReceiveCall', tPlayer:GetData('source'), cData.phone)
                        end
        
                        TriggerClientEvent('mythic_notify:client:PersistentAlert', tPlayer:GetData('source'), { id = 'incoming-call', action = 'start', type = 'inform', text = char:getFullName() .. ' Is Calling You'})
                        Calls[cData.phone] = {
                            number = number,
                            status = 0,
                            record = status.insertId
                        }
                        Calls[number] = {
                            number = cData.phone,
                            status = 0,
                            record = status.insertId
                        }
                    else
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -1)
                    end
                end)
            end
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -2)
        end
    else
        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -1)
    end
end)

RegisterServerEvent('mythic_phone:server:AcceptCall')
AddEventHandler('mythic_phone:server:AcceptCall', function(token)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:FetchComponent('Fetch'):Source(src):GetData('character')
    local cData = char:GetData()

    local tPlayer = exports['mythic_base']:FetchComponent('Fetch').Phone(Calls[cData.phone].number)
    print(tPlayer ~= nil)
    if tPlayer ~= nil then
        if (Calls[cData.phone].number ~= nil) and (Calls[Calls[cData.phone].number].number ~= nil) then
            Calls[Calls[cData.phone].number].status = 1
            Calls[cData.phone].status = 1

            print('end my life jesus christ')

            TriggerClientEvent('mythic_phone:client:AcceptCall', src, tPlayer:GetData('source'), false)
            TriggerClientEvent('mythic_phone:client:AcceptCall', tPlayer:GetData('source'), tPlayer:GetData('source'), true)
        else
            Calls[Calls[cData.phone].number] = nil
            Calls[cData.phone] = nil
            TriggerClientEvent('mythic_phone:client:EndCall', src)
            TriggerClientEvent('mythic_phone:client:EndCall', tPlayer:GetData('source'))
        end
    else
        TriggerClientEvent('mythic_phone:client:EndCall', src)
    end
end)

RegisterServerEvent('mythic_phone:server:EndCall')
AddEventHandler('mythic_phone:server:EndCall', function(token)
    local src = source
    
    local char = exports['mythic_base']:FetchComponent('Fetch'):Source(src):GetData('character')
    local cData = char:GetData()

    if Calls[cData.phone] ~= nil then
        local tPlayer = exports['mythic_base']:FetchComponent('Fetch').Phone(Calls[cData.phone].number)
        if tPlayer ~= nil then
            Calls[Calls[cData.phone].number] = nil
            Calls[cData.phone] = nil

            TriggerClientEvent('mythic_phone:client:EndCall', src)
            TriggerClientEvent('mythic_phone:client:EndCall', tPlayer:GetData('source'))
        end
    end
end)