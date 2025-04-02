use crate::{
    constant::*,
    state::{Cell, Hotel, GameMap},
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
        space = GameMap::space(hotel.map_size as usize),
        seeds = [MAP_PDA_SEED, hotel.key().as_ref(), args.id.as_ref()],
        bump,
    )]
    pub map: Account<'info, GameMap>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateMap<'info> {
    pub fn handler(ctx: Context<Self>, args: CreateMapArgs) -> Result<()> {
        let CreateMap { hotel, map, .. } = ctx.accounts;

        map.bump = ctx.bumps.map;
        map.hotel = hotel.key();
        map.id = args.id;
        map.cells = args.cells.into_iter().map(|tile| Cell { tile, occupant: None }).collect();
        map.connections = vec![];

        Ok(())
    }
}
