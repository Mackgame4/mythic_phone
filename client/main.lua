local isLoggedIn = false

CharData = nil
Callbacks = nil
actionCb = {}
isPhoneOpen = false

Death = nil
Callbacks = nil
AddEventHandler('mythic_base:shared:ComponentsReady', function()
  Callbacks = exports['mythic_base']:FetchComponent('Callbacks')
  Death = exports['mythic_base']:FetchComponent('Death')
  
  Citizen.CreateThread(function()
		while CharData == nil do
			CharData = exports['mythic_base']:FetchComponent('Character')
			Citizen.Wait(250)
    end
	end)
end)

RegisterNetEvent('mythic_base:client:CharacterDataChanged')
AddEventHandler('mythic_base:client:CharacterDataChanged', function(charData)
    CharData = charData
end)

RegisterNetEvent('mythic_phone:client:ActionCallback')
AddEventHandler('mythic_phone:client:ActionCallback', function(identifier, data)
  if actionCb[identifier] ~= nil then
    actionCb[identifier](data)
    actionCb[identifier] = nil
  end
end)

RegisterNetEvent('mythic_phone:client:TogglePhone')
AddEventHandler('mythic_phone:client:TogglePhone', function(identifier, data)
  TogglePhone()
end)

RegisterNetEvent('mythic_phone:client:SetupData')
AddEventHandler('mythic_phone:client:SetupData', function(data)
  SendNUIMessage({
    action = 'setup',
    data = data
  })
end)

function DrawUIText(text, font, centre, x, y, scale, r, g, b, a)
    SetTextFont(font)
    SetTextProportional(0)
    SetTextScale(scale, scale)
    SetTextColour(r, g, b, a)
    SetTextDropShadow(0, 0, 0, 0,255)
    SetTextEdge(1, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextOutline()
    SetTextCentre(centre)
    SetTextEntry("STRING")
    AddTextComponentString(text)
    DrawText(x , y) 
end

function CalculateTimeToDisplay()
  hour = GetClockHours()
  minute = GetClockMinutes()
  
  local obj = {}
  
  if hour <= 9 then
    hour = "0" .. hour
  end
  
  if minute <= 9 then
    minute = "0" .. minute
  end
  
  obj.hour = hour
  obj.minute = minute

  return obj
end

AddEventHandler('mythic_base:shared:ComponentsReady', function()
	Callbacks = exports['mythic_base']:FetchComponent('Callbacks')
end)

function hasPhone(cb)
  Callbacks:ServerCallback('mythic_inventory:server:CheckItem', { { item = 'phone', count = 1 } }, cb)
end

function hasDecrypt(cb)
  Callbacks:ServerCallback('mythic_inventory:server:CheckItem', { { item = 'decryptor', count = 1 } }, cb)
end
  
function toggleIrc(status)
  if not status then
    TriggerEvent('mythic_phone:client:setEnableApp', 'IRC', false)
  else
    TriggerEvent('mythic_phone:client:setEnableApp', 'IRC', true)
  end
end

function ShowNoPhoneWarning()
  exports['mythic_notify']:SendAlert('error', 'You Don\'t Have a Phone')
end

RegisterNetEvent('mythic_base:client:Logout')
AddEventHandler('mythic_base:client:Logout', function()
  isLoggedIn = false
end)

AddEventHandler('mythic_base:client:CharacterSpawned', function()
  isLoggedIn = true
end)

local counter = 0
Citizen.CreateThread(function()
  while true do
    if IsDisabledControlJustReleased(1, 170) or IsControlJustReleased(1, 170) then
      print("???")
      TogglePhone()
    end

    if counter <= 0 then
      local time = CalculateTimeToDisplay()
      SendNUIMessage({
        action = 'updateTime',
        time = time.hour .. ':' .. time.minute
      })
      counter = 100
    else
      counter = counter - 1
    end

    Citizen.Wait(1)
  end
end)

function TogglePhone()
  if not openingCd or isPhoneOpen then
    isPhoneOpen = not isPhoneOpen
    if isPhoneOpen == true then
      hasPhone(function(hasPhone)
        if hasPhone then
          PhonePlayIn()
          SetNuiFocus(true, true)
          if Call ~= nil then
            SendNUIMessage( { action = 'show', number = Call.number, initiator = Call.initiator } )
          else
            SendNUIMessage( { action = 'show' } )
          end
          DisableControls()
        else
          isPhoneOpen = false
        end
      end)
    else
      SetNuiFocus(false, false)
      if not IsInCall() then
        PhonePlayOut()
      end
      SendNUIMessage( { action = 'hide' } )
    end

    openingCd = true
  end

  Citizen.CreateThread(function()
    Citizen.Wait(2000)
    openingCd = false
  end)
end

function ForceClosePhone()
  isPhoneOpen = false
  SetNuiFocus(isPhoneOpen, isPhoneOpen)
  if not IsInCall() then
    PhonePlayOut()
  end
  SendNUIMessage( { action = 'hide' } )
end

function DisableControls()
  Citizen.CreateThread(function()
      while isPhoneOpen do
          DisableControlAction(0, 1, true) -- LookLeftRight
          DisableControlAction(0, 2, true) -- LookUpDown
          DisableControlAction(0, 106, true) -- VehicleMouseControlOverride
          DisableControlAction(0, 30, true) -- disable left/right
          DisableControlAction(0, 31, true) -- disable forward/back
          DisableControlAction(0, 36, true) -- INPUT_DUCK
          DisableControlAction(0, 21, true) -- disable sprint
          DisableControlAction(0, 63, true) -- veh turn left
          DisableControlAction(0, 64, true) -- veh turn right
          DisableControlAction(0, 71, true) -- veh forward
          DisableControlAction(0, 72, true) -- veh backwards
          DisableControlAction(0, 75, true) -- disable exit vehicle

          DisablePlayerFiring(PlayerId(), true) -- Disable weapon firing
          DisableControlAction(0, 24, true) -- disable attack
          DisableControlAction(0, 25, true) -- disable aim
          DisableControlAction(1, 37, true) -- disable weapon select
          DisableControlAction(0, 47, true) -- disable weapon
          DisableControlAction(0, 58, true) -- disable weapon
          DisableControlAction(0, 140, true) -- disable melee
          DisableControlAction(0, 141, true) -- disable melee
          DisableControlAction(0, 142, true) -- disable melee
          DisableControlAction(0, 143, true) -- disable melee
          DisableControlAction(0, 263, true) -- disable melee
          DisableControlAction(0, 264, true) -- disable melee
          DisableControlAction(0, 257, true) -- disable melee
          Citizen.Wait(1)
      end
  end)
end

RegisterNUICallback( 'RegisterData', function( data, cb )
  Callbacks:ServerCallback('mythic_phone:server:RegisterData', {
    key = data.key,
    data = data.data
  })
  cb(true)
end)

RegisterNUICallback( 'GetData', function( data, cb )
  Callbacks:ServerCallback('mythic_phone:server:GetData', {
    key = data.key
  }, function(data)
    cb(data)
  end)
end)

RegisterNUICallback( "ClosePhone", function( data, cb )
  TogglePhone()
end)