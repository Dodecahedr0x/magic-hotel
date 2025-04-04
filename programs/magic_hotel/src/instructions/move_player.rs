use crate::{
    constant::*,
    errors::HotelError,
    state::{Room, Hotel, Player, Position},
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MovePlayerArgs {
    pub destination_index: u16,
}

#[derive(Accounts)]
#[instruction(args: MovePlayerArgs)]
pub struct MovePlayer<'info> {
    #[account(
        seeds = [HOTEL_PDA_SEED, hotel.id.as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        mut,
        seeds = [ROOM_PDA_SEED, room.hotel.as_ref(), room.id.as_ref()],
        bump = room.bump,
        has_one = hotel,
    )]
    pub room: Account<'info, Room>,
    #[account(
        mut,
        seeds = [PLAYER_PDA_SEED, player.hotel.as_ref(), player.id.as_ref()],
        bump = player.bump,
        has_one = hotel,
        has_one = owner,
    )]
    pub player: Account<'info, Player>,
    pub owner: Signer<'info>,
}

impl<'info> MovePlayer<'info> {
    pub fn handler(ctx: Context<Self>, args: MovePlayerArgs) -> Result<()> {
        let MovePlayer {
            player,
            room    ,
            hotel,
            owner,
        } = ctx.accounts;

        let Some(position) = &player.position else {
            return err!(HotelError::InvalidRoom);
        };
        if !position.room.eq(&room.key()) || room.cells[position.cell_index as usize].occupant != Some(player.key()) {
            return err!(HotelError::InvalidRoom);
        }
        if !position.is_adjacent(args.destination_index, hotel.room_size) {
            return err!(HotelError::InvalidDestination);
        }
        if player.owner != owner.key() {
            return err!(HotelError::InvalidOwner);
        }

        room.cells[position.cell_index as usize].occupant = None;
        room.cells[args.destination_index as usize].occupant = Some(player.key());
        player.position = Some(Position { room: room.key(), cell_index: args.destination_index });

        Ok(())
    }
}
