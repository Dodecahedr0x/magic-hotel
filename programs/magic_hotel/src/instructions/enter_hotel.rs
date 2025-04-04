use crate::{
    constant::*, errors::HotelError, state::{Hotel, Room, Player}
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct EnterHotel<'info> {
    #[account(
        seeds = [HOTEL_PDA_SEED, hotel.id.as_ref()],
        bump = hotel.bump,
        constraint = hotel.genesis.room.eq(&room.key()),
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        mut,
        seeds = [ROOM_PDA_SEED, hotel.key().as_ref(), room.id.as_ref()],
        bump = room.bump,
        has_one = hotel,
    )]
    pub room: Account<'info, Room>,
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
        let EnterHotel {player, hotel, room, user} = ctx.accounts;
        
        if player.owner != user.key() {
            return err!(HotelError::InvalidOwner);
        }
        if player.position.is_some() {
            return err!(HotelError::PlayerAlreadyInHotel);
        }
        room.cells[hotel.genesis.cell_index as usize].occupant = Some(player.key());
        player.position = Some(hotel.genesis.clone());

        Ok(())
    }
}
