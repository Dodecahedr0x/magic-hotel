use anchor_lang::prelude::*;

use super::Position;

#[account]
pub struct Hotel {
    pub bump: u8,
    pub id: Pubkey,
    pub map_size: u16,
    pub genesis: Position,
}

impl Hotel {
    pub const SPACE: usize = 8 + 1 + 32 + 2 + Position::SPACE;
}

