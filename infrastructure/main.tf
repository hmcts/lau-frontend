provider "azurerm" {
  features {}
}

locals {
  aseName   = "core-compute-${var.env}"
  vaultName = "${var.product}-${var.env}"
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
}


module "lau-frontend-session-storage" {
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=4.x"
  product                       = "${var.product}-${var.component}-session-storage"
  location                      = var.location
  env                           = var.env
  common_tags                   = var.common_tags
  redis_version                 = "6"
  business_area                 = "cft"
  private_endpoint_enabled      = true
  public_network_access_enabled = false
  sku_name                      = var.sku_name
  family                        = var.family
  capacity                      = var.capacity
}

module "lau-frontend-managed-redis" {
  source      = "git@github.com:hmcts/terraform-module-azure-managed-redis?ref=main"
  product     = var.product
  location    = var.location
  env         = var.env
  common_tags = var.common_tags
  component   = var.component

  sku_name = var.managed_sku_name

  public_network_access   = "Disabled"
  create_private_endpoint = true
  subnet_id               = data.azurerm_subnet.core_infra_redis_subnet.id
  private_dns_zone_ids    = ["/subscriptions/${var.private_dns_subscription_id}/resourceGroups/core-infra-intsvc-rg/providers/Microsoft.Network/privateDnsZones/privatelink.redis.azure.net"]

  access_keys_authentication_enabled = true
}

data "azurerm_key_vault" "key_vault" {
  name                = local.vaultName
  resource_group_name = local.vaultName
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "${var.component}-redis-access-key"
  value        = module.lau-frontend-session-storage.access_key
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "managed_redis_connection_string" {
  name         = "managed-redis-connection-string"
  value        = "rediss://:${urlencode(module.lau-frontend-managed-redis.primary_access_key)}@${module.lau-frontend-managed-redis.hostname}:${module.lau-frontend-managed-redis.port}?tls=true"
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "session_secret" {
  name         = "session-secret"
  value        = random_password.session_secret.result
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "random_password" "session_secret" {
  length           = 32
  override_special = "()-_"

  keepers = {
    rotation = var.session_secret_rotation
  }
}
