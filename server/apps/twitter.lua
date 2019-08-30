RegisterNetEvent('mythic_phone:server:NewTweet')
AddEventHandler('mythic_phone:server:NewTweet', function(token, author, message, mentions, hashtags)
    local src = source
    local users = exports['mythic_base']:FetchComponent('Fetch').All()

    Citizen.CreateThread(function()
        for k, v in pairs(mentions) do
            for k2, v2 in pairs(users) do
                local cData = v2:GetData('character'):GetData()

                if (cData.firstName .. '_' .. cData.lastName) == v then
                    TriggerClientEvent('mythic_notify:client:SendAlert', v2:GetData('source'), { type = 'inform', text = 'You Were Mentioned In A Tweet' })
                end
            end
        end

        exports['ghmattimysql']:execute('INSERT INTO phone_tweets (`author`, `message`) VALUES(@author, @message)', { ['author'] = author, ['message'] = message }, function(status)
            if status.affectedRows > 0 then
                TriggerClientEvent('mythic_phone:client:RecieveNewTweet', -1, { author = author, message = message, mentions = mentions, hashtags = hashtags })
                TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
            else
                TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
            end
        end)
    end)
end)