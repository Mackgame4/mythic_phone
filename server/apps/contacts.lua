RegisterServerEvent('mythic_characters:server:CharacterSpawned')
AddEventHandler('mythic_characters:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()


    Citizen.CreateThread(function()
        local contactData = {}
    
        for k, v in pairs(Config.DefaultContacts) do
            table.insert(contactData, v)
        end

        exports['ghmattimysql']:execute('SELECT display AS name, number AS number, id AS id FROM phone_users_contacts WHERE charid = @charid', { ['charid'] = cData.id }, function(contacts) 
            for k, v in pairs(contacts) do
                table.insert(contactData, v)
            end

            TriggerClientEvent('mythic_phone:client:SetupData', src, contactData)
        end)
    end)
end)

RegisterServerEvent('mythic_phone:server:CreateContact')
AddEventHandler('mythic_phone:server:CreateContact', function(token, name, number)
    print(token, name, number)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end

    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    exports['ghmattimysql']:execute('INSERT INTO phone_users_contacts (`charid`, `number`, `display`) VALUES(@charid, @number, @display)', { ['charid'] = cData.id, ['number'] = number, ['display'] = name }, function(status) 
        if status.affectedRows > 0 then
            TriggerClientEvent('mythic_phone:client:ContactActionCallback', src, status.insertId)
        else
            TriggerClientEvent('mythic_phone:client:ContactActionCallback', src, false)
        end
    end)
end)

RegisterServerEvent('mythic_phone:server:UpdateContact')
AddEventHandler('mythic_phone:server:UpdateContact', function(token, id, name, number)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    exports['ghmattimysql']:execute('UPDATE phone_users_contacts SET display = @display, number = @number WHERE id = @id AND charid = @charid', { ['display'] = name, ['number'] = number, ['id'] = id, ['charid'] = cData.id }, function(status) 
        if status.affectedRows > 0 then
            TriggerClientEvent('mythic_phone:client:ContactActionCallback', src, true)
        else
            TriggerClientEvent('mythic_phone:client:ContactActionCallback', src, false)
        end
    end)
end)

RegisterServerEvent('mythic_phone:server:DeleteContact')
AddEventHandler('mythic_phone:server:DeleteContact', function(token, id)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    exports['ghmattimysql']:execute('DELETE FROM phone_users_contacts WHERE id = @id AND charid = @charid', { ['id'] = id, ['charid'] = cData.id }, function(status) 
        if status.affectedRows > 0 then
            TriggerClientEvent('mythic_phone:client:ContactActionCallback', src, true)
        else
            TriggerClientEvent('mythic_phone:client:ContactActionCallback', src, false)
        end
    end)
end)