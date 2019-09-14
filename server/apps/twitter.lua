AddEventHandler('mythic_base:shared:ComponentsReady', function()
    while Callbacks == nil do
        Citizen.Wait(100)
    end

    Callbacks:RegisterServerCallback('mythic_phone:server:NewTweet', function(source, event, data)
        Citizen.CreateThread(function()
            local returnData = nil
            local char = exports['mythic_base']:FetchComponent('Fetch'):Source(source):GetData('character')
            local author = char:GetData('firstName') .. '_' .. char:GetData('lastName')
            local message = data.message
            local mentions = data.mentions
            local hashtags = data.hashtags
            local users = exports['mythic_base']:FetchComponent('Fetch'):All()

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
                    returnData = true
                else
                    returnData = false
                end
            end)

            while returnData == nil do
                Citizen.Wait(100)
            end

            return returnData
        end)
    end)
end)