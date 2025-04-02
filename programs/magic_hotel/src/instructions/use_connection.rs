use crate::{
    constant::*,
    errors::HotelError,
    state::{Hotel, Room, Player, Position},
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UseConnectionArgs {
    pub connection_index: u16,
}

#[derive(Accounts)]
#[instruction(args: UseConnectionArgs)]
pub struct UseConnection<'info> {
    #[account(
        seeds = [HOTEL_PDA_SEED, hotel.id.as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        mut,
        seeds = [ROOM_PDA_SEED, source_room.hotel.as_ref(), source_room.id.as_ref()],
        bump = source_room.bump,
        has_one = hotel,
    )]
    pub source_room: Account<'info, Room>,
    #[account(
        mut,
        seeds = [ROOM_PDA_SEED, destination_room.hotel.as_ref(), destination_room.id.as_ref()],
        bump = destination_room.bump,
        has_one = hotel,
    )]
    pub destination_room: Account<'info, Room>,
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

impl<'info> UseConnection<'info> {
    pub fn handler(ctx: Context<Self>, args: UseConnectionArgs) -> Result<()> {
        let UseConnection {
            player,
            source_room,
            destination_room,
            owner,
            ..
        } = ctx.accounts;
        let (source_position, destination_position) = source_room.connections[args.connection_index as usize].clone().tuple();

        let Some(position) = &player.position else {
            return err!(HotelError::InvalidRoom);
        };
        if !position.room.eq(&source_room.key()) {
            return err!(HotelError::InvalidRoom);
        }
        if position.cell_index != source_position.cell_index {
            return err!(HotelError::PlayerNotAtSource);
        }
        if destination_room.cells[destination_position.cell_index as usize].occupant.is_some() {
            return err!(HotelError::CrowdedDestination);
        }
        if player.owner != owner.key() {
            return err!(HotelError::InvalidOwner);
        }

        source_room.cells[position.cell_index as usize].occupant = None;
        destination_room.cells[destination_position.cell_index as usize].occupant = Some(player.id);
        player.position = Some(Position {
            room: destination_room.key(),
            cell_index: destination_position.cell_index,
        });

        Ok(())
    }
}
