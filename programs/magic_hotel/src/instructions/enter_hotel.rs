use crate::{
    constant::*, errors::HotelError, state::{Hotel, GameMap, Player}
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct EnterHotel<'info> {
    #[account(
        seeds = [HOTEL_PDA_SEED, hotel.id.as_ref()],
        bump = hotel.bump,
        constraint = hotel.genesis.map.eq(&map.key()),
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        mut,
        seeds = [MAP_PDA_SEED, hotel.key().as_ref(), map.id.as_ref()],
        bump = map.bump,
        has_one = hotel,
    )]
    pub map: Account<'info, GameMap>,
    #[account(
        mut,
        seeds = [PLAYER_PDA_SEED, hotel.key().as_ref(), player.id.as_ref()],
        bump,
    )]
    pub player: Account<'info, Player>,
    #[account(mut)]
    pub user: Signer<'info>,
}

impl<'info> EnterHotel<'info> {
    pub fn handler(ctx: Context<Self>) -> Result<()> {
        let EnterHotel {player, hotel, map, user} = ctx.accounts;
        
        if player.owner != user.key() {
            return err!(HotelError::InvalidOwner);
        }
        if player.position.is_some() {
            return err!(HotelError::PlayerAlreadyInHotel);
        }
        map.cells[hotel.genesis.cell_index as usize].occupant = Some(player.id);
        player.position = Some(hotel.genesis.clone());

        Ok(())
    }
}
