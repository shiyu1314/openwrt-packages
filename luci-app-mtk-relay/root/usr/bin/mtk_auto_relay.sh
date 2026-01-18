#!/bin/sh

STATUS_FILE="/tmp/mtk_relay_status.json"

update_status() {
    echo "{\"device\": \"$1\", \"ssid\": \"$2\", \"status\": \"$3\", \"time\": \"$(date '+%Y-%m-%d %H:%M:%S')\"}" > "$STATUS_FILE"
}

to_hex() { echo -n "0x$(echo -n "$1" | hexdump -ve '1/1 "%02X"')"; }

do_connect() {
    local dev="$1" ssid="$2" key="$3"
    local radio=$(echo "$dev" | sed 's/apclix/rai/;s/apcli/ra/')
    
    update_status "$dev" "$ssid" "Scanning"
    iwpriv "$dev" set SiteSurvey=1 && sleep 3
    
    local line=$(iwpriv "$dev" get_site_survey | grep -i "$(to_hex "$ssid")" | head -n 1)
    [ -z "$line" ] && line=$(iwpriv "$dev" get_site_survey | grep -i "$ssid" | head -n 1)
    
    if [ -n "$line" ]; then
        local ch=$(echo "$line" | awk '{print $2}')
        local bssid=$(echo "$line" | awk '{print $4}')
        
        update_status "$dev" "$ssid" "Connecting"
        iwpriv "$dev" set ApCliEnable=0
        iwpriv "$radio" set Channel="$ch"
        iwpriv "$dev" set ApCliAuthMode=WPA2PSK
        iwpriv "$dev" set ApCliEncrypType=AES
        iwpriv "$dev" set ApCliSsid="$ssid"
        iwpriv "$dev" set ApCliWPAPSK="$key"
        iwpriv "$dev" set ApCliBssid="$bssid"
        iwpriv "$dev" set ApCliEnable=1
        
        # 给驱动一定的关联时间
        sleep 15
        # 尝试触发 DHCP 获取 IP
        /sbin/udhcpc -i "$dev" -n -q -T 2 -s /lib/netifd/dhcp.script >/dev/null 2>&1 &
    else
        update_status "$dev" "$ssid" "Not Found"
        sleep 5
    fi
}

while true; do
    enabled=$(uci -q get mtk_relay.settings.enabled)
    [ "$enabled" != "1" ] && update_status "none" "none" "Disabled" && sleep 30 && continue
    
    idx=0
    while true; do
        s=$(uci -q get mtk_relay.@station[$idx].ssid)
        [ -z "$s" ] && break
        k=$(uci -q get mtk_relay.@station[$idx].key)
        d=$(uci -q get mtk_relay.@station[$idx].device)

        # 强化检测：排除 Not-Associated 和 全0 MAC
        # 某些驱动连接成功但未关联时会显示 00:00:00...
        check_conn=$(iwconfig "$d" 2>/dev/null | grep "Access Point" | grep -v "Not-Associated" | grep -v "00:00:00:00:00:00")
        
        if [ -n "$check_conn" ]; then
            update_status "$d" "$s" "Connected"
        else
            do_connect "$d" "$s" "$k"
        fi
        idx=$((idx+1))
    done
    
    interval=$(uci -q get mtk_relay.settings.check_interval || echo 30)
    sleep "$interval"
done
