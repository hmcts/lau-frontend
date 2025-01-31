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

data "azurerm_key_vault" "key_vault" {
  name                = local.vaultName
  resource_group_name = local.vaultName
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "${var.component}-redis-access-key"
  value        = module.lau-frontend-session-storage.access_key
  key_vault_id = data.azurerm_key_vault.key_vault.id
}
