use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::{anchor::delegate, cpi::DelegateConfig};

use crate::constant::{MAP_PDA_SEED, PLAYER_PDA_SEED};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct DelegateMapArgs {
    pub hotel: Pubkey,
    pub map_id: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct DelegatePlayerArgs {
    pub hotel: Pubkey,
    pub player_id: Pubkey,
}

#[delegate]
#[derive(Accounts)]
pub struct DelegateAccount<'info> {
    pub payer: Signer<'info>,
    /// CHECK: The pda
    #[account(mut, del)]
    pub pda: AccountInfo<'info>,
}

impl<'info> DelegateAccount<'info> {
    pub fn map_handler(ctx: Context<Self>, args: DelegateMapArgs) -> Result<()> {
        ctx.accounts.delegate_pda(
            &ctx.accounts.payer,
            &[
                MAP_PDA_SEED,
                args.hotel.as_ref(),
                args.map_id.as_ref(),
            ],
            DelegateConfig::default(),
        )?;

        Ok(())
    }
    
    pub fn player_handler(ctx: Context<Self>, args: DelegatePlayerArgs) -> Result<()> {
        ctx.accounts.delegate_pda(
            &ctx.accounts.payer,
            &[
                PLAYER_PDA_SEED,
                args.hotel.as_ref(),
                args.player_id.as_ref(),
            ],
            DelegateConfig::default(),
        )?;

        Ok(())
    }
}
