include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-mtk-relay
PKG_VERSION:=1.0
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-mtk-relay
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=Auto Relay for MT7981
  DEPENDS:=+uci
  PKGARCH:=all
endef

define Build/Prepare
endef

define Build/Compile
endef

define Package/luci-app-mtk-relay/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view

	$(INSTALL_BIN) ./root/usr/bin/mtk_auto_relay.sh $(1)/usr/bin/
	$(INSTALL_BIN) ./root/etc/init.d/mtk_relay $(1)/etc/init.d/
	$(INSTALL_CONF) ./root/etc/config/mtk_relay $(1)/etc/config/
	$(INSTALL_DATA) ./usr/share/luci/menu.d/luci-app-mtk-relay.json $(1)/usr/share/luci/menu.d/
	$(INSTALL_DATA) ./usr/share/rpcd/acl.d/luci-app-mtk-relay.json $(1)/usr/share/rpcd/acl.d/
	$(INSTALL_DATA) ./root/www/luci-static/resources/view/mtk_relay.js $(1)/www/luci-static/resources/view/
endef

define Package/luci-app-mtk-relay/postinst
#!/bin/sh
if [ -z "$${IPKG_INSTROOT}" ]; then
	rm -f /tmp/luci-indexcache
	/etc/init.d/mtk_relay enable
	/etc/init.d/mtk_relay start
fi
exit 0
endef

$(eval $(call BuildPackage,luci-app-mtk-relay))