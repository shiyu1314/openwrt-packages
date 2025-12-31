# SPDX-License-Identifier: GPL-3.0-only
#
# Copyright (C) 2022-2023 ImmortalWrt.org

include $(TOPDIR)/rules.mk

PKG_NAME:=sing-box
PKG_VERSION:=1.12.14-reF1nd
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/reF1nd/sing-box/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=ef3b4edff1231cbb44be1ce728567ce9f61eac94cb0e2d8e8413d424bc4a4c0b

PKG_LICENSE:=GPL-3.0-or-later
PKG_LICENSE_FILES:=LICENSE
PKG_MAINTAINER:=Tianling Shen <cnsztl@immortalwrt.org>

PKG_CONFIG_DEPENDS:= \
	CONFIG_SING_BOX_BUILD_ACME \
	CONFIG_SING_BOX_BUILD_CLASH_API \
	CONFIG_SING_BOX_BUILD_DHCP \
	CONFIG_SING_BOX_BUILD_GRPC \
	CONFIG_SING_BOX_BUILD_GVISOR \
	CONFIG_SING_BOX_BUILD_QUIC \
	CONFIG_SING_BOX_BUILD_TAILSCALE \
	CONFIG_SING_BOX_BUILD_UTLS \
	CONFIG_SING_BOX_BUILD_V2RAY_API \
	CONFIG_SING_BOX_BUILD_WIREGUARD

PKG_BUILD_DEPENDS:=golang/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

GO_PKG:=github.com/reF1nd/sing-box
GO_PKG_BUILD_PKG:=$(GO_PKG)/cmd/sing-box
GO_PKG_LDFLAGS_X:=$(GO_PKG)/constant.Version=$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/golang/golang-package.mk

define Package/sing-box
  SECTION:=net
  CATEGORY:=Network
  SUBMENU:=Web Servers/Proxies
  TITLE:=The universal proxy platform
  URL:=https://sing-box.sagernet.org/
  DEPENDS:=$(GO_ARCH_DEPENDS) \
	+ca-bundle \
	+kmod-inet-diag \
	+kmod-netlink-diag \
	$(if $(CONFIG_SING_BOX_BUILD_GVISOR),+kmod-tun)
endef

define Package/sing-box/description
  Sing-box is a universal proxy platform which supports hysteria, SOCKS, Shadowsocks,
  ShadowTLS, Tor, trojan, VLess, VMess, WireGuard and so on.
endef

define Package/sing-box/config
  if PACKAGE_sing-box
	config SING_BOX_BUILD_ACME
		bool "Build with ACME TLS certificate issuer support"
		default y
	
	config SING_BOX_BUILD_CLASH_API
		bool "Build with Clash API support"
		default y
	
	config SING_BOX_BUILD_DHCP
		bool "Build with DHCP support"
		default n
	
	config SING_BOX_BUILD_GRPC
		bool "Build with standard gPRC support"
		default n
		help
		  Standard gRPC has good compatibility but poor performance.
	
	config SING_BOX_BUILD_GVISOR
		bool "Build with gVisor support"
		default y
	
	config SING_BOX_BUILD_QUIC
		bool "Build with QUIC support"
		default y
		help
		  Required by HTTP3 DNS transports, Naive inbound,
		  Hysteria inbound / outbound, and v2ray QUIC transport.
	
	config SING_BOX_BUILD_TAILSCALE
		bool "Build with Tailscale support"
		default y
	
	config SING_BOX_BUILD_UTLS
		bool "Build with uTLS support"
		default y
	
	config SING_BOX_BUILD_V2RAY_API
		bool "Build with V2Ray API support"
		default n
	
	config SING_BOX_BUILD_WIREGUARD
		bool "Build with WireGuard support"
		default y
  endif
endef

# 构建标签设置
GO_PKG_TAGS:=
ifdef CONFIG_SING_BOX_BUILD_ACME
GO_PKG_TAGS+=with_acme
endif
ifdef CONFIG_SING_BOX_BUILD_CLASH_API
GO_PKG_TAGS+=with_clash_api
endif
ifdef CONFIG_SING_BOX_BUILD_DHCP
GO_PKG_TAGS+=with_dhcp
endif
ifdef CONFIG_SING_BOX_BUILD_GRPC
GO_PKG_TAGS+=with_grpc
endif
ifdef CONFIG_SING_BOX_BUILD_GVISOR
GO_PKG_TAGS+=with_gvisor
endif
ifdef CONFIG_SING_BOX_BUILD_QUIC
GO_PKG_TAGS+=with_quic
endif
ifdef CONFIG_SING_BOX_BUILD_TAILSCALE
GO_PKG_TAGS+=with_tailscale
endif
ifdef CONFIG_SING_BOX_BUILD_UTLS
GO_PKG_TAGS+=with_utls
endif
ifdef CONFIG_SING_BOX_BUILD_V2RAY_API
GO_PKG_TAGS+=with_v2ray_api
endif
ifdef CONFIG_SING_BOX_BUILD_WIREGUARD
GO_PKG_TAGS+=with_wireguard
endif

ifeq ($(strip $(GO_PKG_TAGS)),)
else
GO_PKG_TAGS:=$(subst $(space),$(comma),$(strip $(GO_PKG_TAGS)))
endif

define Build/Prepare
	$(call Build/Prepare/Default)
	cd $(PKG_BUILD_DIR) && \
	$(GO_PKG_VARS) go mod download
endef

define Build/Compile
	( \
		cd $(PKG_BUILD_DIR) && \
		$(GO_PKG_VARS) \
		CGO_ENABLED=0 \
		go build \
			$(if $(GO_PKG_TAGS),-tags "$(GO_PKG_TAGS)") \
			-ldflags "-X $(GO_PKG)/constant.Version=$(PKG_VERSION) -s -w -buildid=" \
			-o bin/sing-box ./cmd/sing-box ; \
	)
endef

define Package/sing-box/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/bin/sing-box $(1)/usr/bin/sing-box
	$(INSTALL_DIR) $(1)/etc/sing-box
endef

$(eval $(call BuildPackage,sing-box))