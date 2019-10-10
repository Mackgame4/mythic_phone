local TunedVehs = {}
local currentVehicle = nil

RegisterNetEvent('mythic_veh:client:EnteredVehicle')
AddEventHandler('mythic_veh:client:EnteredVehicle', function(currVeh, currSeat, name)
    if currentVehicle ~= currVeh then  
        SendNUIMessage({
            action = 'ResetVehicle'
        })

        currentVehicle = currVeh
    end
end)

RegisterNUICallback( 'SetupTuner', function( data, cb )
    local veh = GetVehiclePedIsUsing(PlayerPedId())
    print(veh)
    if veh ~= 0 then
        exports['mythic_base']:FetchComponent('Progress'):Progress({
            name = "tuner_action",
            duration = 5000,
            label = 'Scanning For Chip',
            useWhileDead = false,
            canCancel = true,
            controlDisables = {
                disableMovement = true,
                disableCarMovement = true,
                disableMouse = false,
                disableCombat = true,
            },
        }, function(status)
            if not status then
                if GetPedInVehicleSeat(veh, -1) == PlayerPedId() and DecorExistOn(veh, 'MTYH_TUNER_CHIP') then
                    local plate = GetVehicleNumberPlateText(veh)
                    local data = {
                        id = NetworkGetNetworkIdFromEntity(veh),
                        model = GetDisplayNameFromVehicleModel(GetEntityModel(veh)):upper(),
                        plate = plate,
                        tune = TunedVehs[plate]
                    }
                    currentVehicle = veh
                    cb(data)
                else
                    cb(nil)
                end
            else
                cb(nil)
            end
        end)
    else
        cb(nil)
    end
end)

RegisterNUICallback( 'CheckInVeh', function( data, cb )
    local veh = GetVehiclePedIsUsing(PlayerPedId()) 
    if veh ~= 1 then 
        if GetPedInVehicleSeat(veh, -1) == PlayerPedId() and DecorExistOn(veh, 'MTYH_TUNER_CHIP') then
            if currentVehicle ~= veh then
                local plate = GetVehicleNumberPlateText(veh)
                local data = {
                    id = veh,
                    model = GetDisplayNameFromVehicleModel(GetEntityModel(veh)):upper(),
                    plate = plate,
                    tune = TunedVehs[plate]
                }
                currentVehicle = veh
                cb(data)
            else
                cb({ sameVeh = true })
            end
        else
            cb(nil)
        end
    else
        cb(nil)
    end
end)

RegisterNUICallback( 'ApplyTune', function( data, cb )

end)

RegisterNUICallback( 'SaveTune', function( data, cb )
    Callbacks:ServerCallback('mythic_phone:server:SaveTune', {  }, function(status)
        cb(status)
    end)
end)

RegisterNUICallback( 'DeleteTune', function( data, cb )
    Callbacks:ServerCallback('mythic_phone:server:DeleteTune', {  }, function(status)
        cb(status)
    end)
end)