use crate::{
    constant::*, errors::HotelError, state::{Hotel, Map, Player}
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreatePlayerArgs {
    pub player_id: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: CreatePlayerArgs)]
pub struct CreatePlayer<'info> {
    #[account(
        seeds = [HOTEL_PDA_SEED, hotel.id.as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        seeds = [MAP_PDA_SEED, hotel.key().as_ref(), genesis_map.id.as_ref()],
        bump,
        constraint = genesis_map.key() == hotel.genesis.map,
    )]
    pub genesis_map: Account<'info, Map>,
    #[account(
        init,
        payer = user,
        space = Player::SPACE,
        seeds = [PLAYER_PDA_SEED, hotel.key().as_ref(), args.player_id.as_ref()],
        bump,
    )]
    pub player: Account<'info, Player>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreatePlayer<'info> {
    pub fn handler(ctx: Context<Self>, args: CreatePlayerArgs) -> Result<()> {
        let CreatePlayer {player, hotel, genesis_map, ..} = ctx.accounts;

        if genesis_map.cells[hotel.genesis.cell_index as usize].occupant != None {
            return err!(HotelError::CrowdedDestination);
        }
        
        player.bump = ctx.bumps.player;
        player.id = args.player_id;
        player.hotel = hotel.key();
        player.position = hotel.genesis.clone();

        Ok(())
    }
}
