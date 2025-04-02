use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::{anchor::commit, ephem::commit_and_undelegate_accounts};

use crate::{constant::{MAP_PDA_SEED, PLAYER_PDA_SEED}, state::{GameMap, Player}};

#[commit]
#[derive(Accounts)]
pub struct UndelegateAccount<'info> {
    pub payer: Signer<'info>,
    /// CHECK: Doing verifications in the handler
    #[account(mut)]
    pub pda: UncheckedAccount<'info>,
}

impl<'info> UndelegateAccount<'info> {
    pub fn map_handler(ctx: Context<Self>) -> Result<()> {
        let map = GameMap::try_deserialize(&mut ctx.accounts.pda.data.borrow_mut().as_ref())?;
        let (pk, bump) = Pubkey::find_program_address(&[MAP_PDA_SEED, map.hotel.as_ref(), map.id.as_ref()], ctx.program_id);
        assert_eq!(map.bump, bump);
        assert_eq!(ctx.accounts.pda.key().eq(&pk), true);

        commit_and_undelegate_accounts(
            &ctx.accounts.payer,
            vec![&ctx.accounts.pda.to_account_info()],
            &ctx.accounts.magic_context,
            &ctx.accounts.magic_program,
        )?;

        Ok(())
    }

    pub fn player_handler(ctx: Context<Self>) -> Result<()> {
        let player = Player::try_deserialize(&mut ctx.accounts.pda.data.borrow_mut().as_ref())?;
        let (pk, bump) = Pubkey::find_program_address(&[PLAYER_PDA_SEED, player.hotel.as_ref(), player.id.as_ref()], ctx.program_id);
        assert_eq!(player.bump, bump);
        assert_eq!(ctx.accounts.pda.key().eq(&pk), true);

        commit_and_undelegate_accounts(
            &ctx.accounts.payer,
            vec![&ctx.accounts.pda.to_account_info()],
            &ctx.accounts.magic_context,
            &ctx.accounts.magic_program,
        )?;

        Ok(())
    }
}
