RegisterServerEvent('mythic_characters:server:CharacterSpawned')
AddEventHandler('mythic_characters:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()


    Citizen.CreateThread(function()
        local contactData = {}

        exports['ghmattimysql']:execute('SELECT name, number FROM phone_contacts WHERE charid = @charid', { ['charid'] = cData.id }, function(contacts) 
            for k, v in pairs(contacts) do
                table.insert(contactData, v)
            end

            TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'contacts', data = contactData } })
        end)
    end)
end)

RegisterServerEvent('mythic_phone:server:CreateContact')
AddEventHandler('mythic_phone:server:CreateContact', function(token, identifier, name, number)
    local src = source
    --[[if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end ]]--

    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    exports['ghmattimysql']:execute('INSERT INTO phone_contacts (`charid`, `number`, `name`) VALUES(@charid, @number, @name)', { ['charid'] = cData.id, ['number'] = number, ['name'] = name }, function(status) 
        if status.affectedRows > 0 then
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
        end
    end)
end)

RegisterServerEvent('mythic_phone:server:EditContact')
AddEventHandler('mythic_phone:server:EditContact', function(token, identifier, originName, originNumber, name, number)
    local src = source
    --[[if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end ]]--
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    print(originName, originNumber, name, number)

    exports['ghmattimysql']:execute('UPDATE phone_contacts SET name = @name, number = @number WHERE charid = @charid AND name = @oName AND number = @oNumber', { ['name'] = name, ['number'] = number, ['id'] = id, ['charid'] = cData.id, ['oName'] = originName, ['oNumber'] = originNumber }, function(status) 
        if status.affectedRows > 0 then
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
        end
    end)
end)

RegisterServerEvent('mythic_phone:server:DeleteContact')
AddEventHandler('mythic_phone:server:DeleteContact', function(token, identifier, name, number)
    local src = source
    --[[if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end ]]--
    
    local char = exports['mythic_base']:getPlayerFromId(src).getChar()
    local cData = char.getCharData()

    print(name, number)

    exports['ghmattimysql']:execute('DELETE FROM phone_contacts WHERE charid = @charid AND name = @name AND number = @number', { ['charid'] = cData.id, ['name'] = name, ['number'] = number }, function(status) 
        if status.affectedRows > 0 then
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
        end
    end)
end)