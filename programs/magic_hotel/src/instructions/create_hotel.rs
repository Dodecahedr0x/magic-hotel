use crate::{constant::*, state::{Cell, Hotel, Room, Position}};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateHotelArgs {
    pub hotel_id: Pubkey,
    pub room_id: Pubkey,
    pub room_size: u16,
    pub genesis_room: Vec<u8>,
    pub genesis_position: u16,
}

#[derive(Accounts)]
#[instruction(args: CreateHotelArgs)]
pub struct CreateHotel<'info> {
    #[account(
        init,
        payer = payer,
        space = Hotel::SPACE,
        seeds = [HOTEL_PDA_SEED, args.hotel_id.as_ref()],
        bump,
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        init,
        payer = payer,
        space = Room::space(args.room_size as usize),
        seeds = [ROOM_PDA_SEED, hotel.key().as_ref(), args.room_id.as_ref()],
        bump,
    )]
    pub room: Account<'info, Room>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateHotel<'info> {
    pub fn handler(ctx: Context<Self>, args: CreateHotelArgs) -> Result<()> {
        let CreateHotel { hotel, room, .. } = ctx.accounts;
        
        hotel.bump = ctx.bumps.hotel;
        hotel.id = args.hotel_id;
        hotel.room_size = args.room_size;
        hotel.genesis = Position {
            room: room.key(),
            cell_index: args.genesis_position
        };

        room.bump = ctx.bumps.room;
        room.hotel = hotel.key();
        room.id = args.room_id;
        room.cells = args.genesis_room.into_iter().map(|tile| Cell { tile, occupant: None }).collect();
        room.connections = vec![];

        Ok(())
    }
}
