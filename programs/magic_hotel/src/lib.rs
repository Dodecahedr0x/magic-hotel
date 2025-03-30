use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::anchor::ephemeral;

mod constant;
mod errors;
mod instructions;
mod state;

use instructions::*;

declare_id!("H9NwTUnwjNGKAmST8eVBLnvStnCuMPvkfqT9WTYMXGjE");

#[ephemeral]
#[program]
pub mod magic_hotel {
    use super::*;

    /* Create hotel, player, map, and connections */

    pub fn create_hotel(
        ctx: Context<CreateHotel>,
        args: CreateHotelArgs,
    ) -> Result<()> {
        CreateHotel::handler(ctx, args)
    }

    pub fn create_player(ctx: Context<CreatePlayer>, args: CreatePlayerArgs) -> Result<()> {
        CreatePlayer::handler(ctx, args)
    }

    pub fn create_map(ctx: Context<CreateMap>, args: CreateMapArgs) -> Result<()> {
        CreateMap::handler(ctx, args)
    }

    pub fn create_connection(ctx: Context<CreateConnection>, args: CreateConnectionArgs) -> Result<()> {
        CreateConnection::handler(ctx, args)
    }

    /* Delegate and undelegate accounts */

    pub fn delegate_map(ctx: Context<DelegateAccount>, args: DelegateMapArgs) -> Result<()> {
        DelegateAccount::map_handler(ctx, args)
    }

    pub fn delegate_player(ctx: Context<DelegateAccount>, args: DelegatePlayerArgs) -> Result<()> {
        DelegateAccount::player_handler(ctx, args)
    }

    pub fn undelegate_map(ctx: Context<UndelegateAccount>) -> Result<()> {
        UndelegateAccount::map_handler(ctx)
    }

    pub fn undelegate_player(ctx: Context<UndelegateAccount>) -> Result<()> {
        UndelegateAccount::player_handler(ctx)
    }

    /* Update players */

    pub fn move_player(ctx: Context<MovePlayer>, args: MovePlayerArgs) -> Result<()> {
        MovePlayer::handler(ctx, args)
    }

    pub fn use_connection(ctx: Context<UseConnection>, args: UseConnectionArgs) -> Result<()> {
        UseConnection::handler(ctx, args)
    }
}
