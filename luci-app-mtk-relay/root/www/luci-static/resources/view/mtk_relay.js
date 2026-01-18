'use ui';
'use uci';
'use fs';

return L.view.extend({
    load: function() {
        return L.uci.load('mtk_relay').catch(function(e) { return null; });
    },

    render: function(data) {
        var m, s, o;

        m = new L.form.Map('mtk_relay', _('中继增强'), _('针对 MTK 闭源驱动优化的自动重连插件'));
        m.poll = 2; // 2秒同步一次数据，配合 Aurora 的动态刷新

        s = m.section(L.form.NamedSection, 'settings', 'global', _('运行状态'));
        
        o = s.option(L.form.DummyValue, '_status');
        o.rawhtml = true;
        o.cfgvalue = function() {
            return L.resolveDefault(L.fs.read('/tmp/mtk_relay_status.json'), '').then(function(res) {
                var content = (typeof(res) === 'object' && res.data) ? res.data : res;
                if (!content) return '<em>' + _('等待脚本启动...') + '</em>';

                try {
                    var json = JSON.parse(content);
                    var isOk = (json.status === 'Connected');
                    var displayStatus = isOk ? _('已连接') : _('已断开');
                    
                    /**
                     * 适配 Aurora/Argon 核心逻辑：
                     * 1. 使用 var(--sys-status-*) 获取系统当前主题定义的成功/失败色。
                     * 2. 背景设为非常淡的透明色 (8%)，这样在 Aurora 的深色背景下会显得有质感且透亮。
                     * 3. 文字色 var(--ifm-font-color-base) 确保无论背景多深都能看清。
                     */
                    var themeMainColor = isOk ? 'var(--sys-status-ok)' : 'var(--sys-status-warn)';

                    return '<div style="' +
                           'background: color-mix(in srgb, ' + themeMainColor + ', transparent 92%); ' +
                           'padding: 14px 18px; ' +
                           'border-left: 4px solid ' + themeMainColor + '; ' +
                           'border-radius: 6px; ' +
                           'margin: 10px 0; ' +
                           'color: var(--ifm-font-color-base); ' +
                           'backdrop-filter: blur(4px); ' + // 为 Aurora 等主题增加毛玻璃效果
                           'box-shadow: 0 2px 4px rgba(0,0,0,0.1); ' +
                           'transition: all 0.4s ease;">' +
                           
                           '<div style="margin-bottom: 8px; font-size: 1.1em; display: flex; justify-content: space-between; align-items: center;">' +
                           '<span><strong>' + _('当前状态') + ': </strong>' +
                           '<span style="color: ' + themeMainColor + '; font-weight: bold; margin-left: 4px;">' + displayStatus + '</span></span>' +
                           '</div>' +
                           
                           '<div style="margin-bottom: 6px; font-size: 0.95em; opacity: 0.9;">' +
                           '<span>' + _('网卡: ') + '<strong>' + json.device + '</strong></span>' +
                           '<span style="margin: 0 10px; opacity: 0.3;">|</span>' +
                           '<span>' + _('目标热点: ') + '<strong>' + json.ssid + '</strong></span>' +
                           '</div>' +
                           
                           '<div style="opacity: 0.5; font-size: 0.85em; border-top: 1px solid color-mix(in srgb, currentColor, transparent 80%); padding-top: 6px; margin-top: 6px;">' + 
                           _('更新时间: ') + json.time + '</div>' +
                           
                           '</div>';
                } catch(e) { return '<em>' + _('解析错误') + '</em>'; }
            });
        };

        // 基本设置
        o = s.option(L.form.Flag, 'enabled', _('启用自动重连'));
        o = s.option(L.form.Value, 'check_interval', _('检测间隔 (秒)'));
        o.datatype = 'uinteger'; o.default = '20';

        // 热点配置
        s = m.section(L.form.TypedSection, 'station', _('热点库配置'));
        s.anonymous = true; s.addremove = true;
        s.option(L.form.Value, 'ssid', _('SSID'));
        o = s.option(L.form.Value, 'key', _('无线密码')); o.password = true;
        o = s.option(L.form.ListValue, 'device', _('物理网卡'));
        o.value('apclix0', '5G (apclix0)'); o.value('apcli0', '2.4G (apcli0)');

        return m.render();
    }
});
