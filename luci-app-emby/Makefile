

include $(TOPDIR)/rules.mk


PKG_VERSION:=1.0.0
PKG_RELEASE:=1
LUCI_TITLE:=LuCI support for Emby
LUCI_PKGARCH:=all
LUCI_DEPENDS:=+lsblk +coreutils +docker +dockerd +luci-lib-taskd

define Package/luci-app-emby/conffiles
/etc/config/emby
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
