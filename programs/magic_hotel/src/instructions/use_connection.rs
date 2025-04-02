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
        seeds = [MAP_PDA_SEED, source_map.hotel.as_ref(), source_map.id.as_ref()],
        bump = source_map.bump,
        has_one = hotel,
    )]
    pub source_map: Account<'info, Room>,
    #[account(
        mut,
        seeds = [MAP_PDA_SEED, destination_map.hotel.as_ref(), destination_map.id.as_ref()],
        bump = destination_map.bump,
        has_one = hotel,
    )]
    pub destination_map: Account<'info, Room>,
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
            source_map,
            destination_map,
            owner,
            ..
        } = ctx.accounts;
        let (source_position, destination_position) = source_map.connections[args.connection_index as usize].clone().tuple();

        let Some(position) = &player.position else {
            return err!(HotelError::InvalidMap);
        };
        if !position.map.eq(&source_map.key()) {
            return err!(HotelError::InvalidMap);
        }
        if position.cell_index != source_position.cell_index {
            return err!(HotelError::PlayerNotAtSource);
        }
        if destination_map.cells[destination_position.cell_index as usize].occupant.is_some() {
            return err!(HotelError::CrowdedDestination);
        }
        if player.owner != owner.key() {
            return err!(HotelError::InvalidOwner);
        }

        source_map.cells[position.cell_index as usize].occupant = None;
        destination_map.cells[destination_position.cell_index as usize].occupant = Some(player.id);
        player.position = Some(Position {
            map: destination_map.key(),
            cell_index: destination_position.cell_index,
        });

        Ok(())
    }
}
