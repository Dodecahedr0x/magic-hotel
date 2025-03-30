use crate::{constant::*, state::{Cell, Hotel, Map, Position}};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateHotelArgs {
    pub hotel_id: Pubkey,
    pub map_id: Pubkey,
    pub map_size: u16,
    pub genesis_map: Vec<u8>,
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
        space = Map::space(args.map_size as usize),
        seeds = [MAP_PDA_SEED, hotel.key().as_ref(), args.map_id.as_ref()],
        bump,
    )]
    pub map: Account<'info, Map>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateHotel<'info> {
    pub fn handler(ctx: Context<Self>, args: CreateHotelArgs) -> Result<()> {
        let CreateHotel { hotel, map, .. } = ctx.accounts;
        
        hotel.bump = ctx.bumps.hotel;
        hotel.id = args.hotel_id;
        hotel.map_size = args.map_size;
        hotel.genesis = Position {
            map: map.key(),
            cell_index: args.genesis_position
        };

        map.bump = ctx.bumps.map;
        map.hotel = hotel.key();
        map.id = args.map_id;
        map.cells = args.genesis_map.into_iter().map(|tile| Cell { tile, occupant: None }).collect();
        map.connections = vec![];

        Ok(())
    }
}
