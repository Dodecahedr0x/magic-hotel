use anchor_lang::prelude::*;

use super::Position;

#[account]
pub struct GameMap {
    pub bump: u8,
    pub hotel: Pubkey,
    pub id: Pubkey,
    pub cells: Vec<Cell>,
    pub connections: Vec<(Position, Position)>,
}

impl GameMap {
    pub fn space(size: usize) -> usize { 8 + 1 + 32 + 32 + size * size * Cell::SPACE + 2 *size * size * Position::SPACE }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Cell {
    // Tile ID in the tileset
    pub tile: u8,
    pub occupant: Option<Pubkey>,
}

impl Cell {
    pub const SPACE: usize = 8 + 1 + 33;
}

