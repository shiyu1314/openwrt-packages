#
# Copyright (C) 2007-2021 OpenWrt.org
# Copyright (C) 2010 Vertical Communications
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=my-default-settings
PKG_RELEASE:=1

PKG_LICENSE:=GPL-3.0

include $(INCLUDE_DIR)/package.mk


define Package/my-default-settings
	SECTION:=luci
	CATEGORY:=LuCI
	TITLE:=LuCI support for my default settings
	PKGARCH:=all
	DEPENDS:= \
		+luci-compat \
		+@LUCI_LANG_zh_Hans \
		+luci-i18n-base-zh-cn
endef

define Build/Compile
endef

define Package/my-default-settings/install
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./files/zzz-default-settings $(1)/etc/uci-defaults/99-default-settings
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/i18n
	po2lmo ./i18n/default.zh_Hans.po $(1)/usr/lib/lua/luci/i18n/default.zh-cn.lmo
endef

$(eval $(call BuildPackage,my-default-settings))
