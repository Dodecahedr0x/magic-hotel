use crate::{
    constant::*, errors::HotelError, state::{Hotel, Room, Player}
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
        let CreatePlayer {player, hotel, user, ..} = ctx.accounts;
        
        player.bump = ctx.bumps.player;
        player.id = args.player_id;
        player.owner = user.key();
        player.hotel = hotel.key();

        Ok(())
    }
}
