use crate::{
    constant::*,
    state::{Cell, Hotel, Room},
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateMapArgs {
    pub id: Pubkey,
    pub cells: Vec<u8>,
}

#[derive(Accounts)]
#[instruction(args: CreateMapArgs)]
pub struct CreateMap<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        seeds = [HOTEL_PDA_SEED, hotel.id.as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        init,
        payer = payer,
        space = Room::space(hotel.room_size as usize),
        seeds = [ROOM_PDA_SEED, hotel.key().as_ref(), args.id.as_ref()],
        bump,
    )]
    pub room: Account<'info, Room>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateMap<'info> {
    pub fn handler(ctx: Context<Self>, args: CreateMapArgs) -> Result<()> {
        let CreateMap { hotel, room, .. } = ctx.accounts;

        room.bump = ctx.bumps.room;
        room.hotel = hotel.key();
        room.id = args.id;
        room.cells = args.cells.into_iter().map(|tile| Cell { tile, occupant: None }).collect();
        room.connections = vec![];

        Ok(())
    }
}
