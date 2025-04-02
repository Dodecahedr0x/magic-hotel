use anchor_lang::prelude::*;

use super::Position;

#[account]
pub struct Room {
    pub bump: u8,
    pub hotel: Pubkey,
    pub id: Pubkey,
    pub cells: Vec<Cell>,
    pub connections: Vec<Connection>,
}

impl Room {
    pub fn space(size: usize) -> usize { 8 + 1 + 32 + 32 + 8 + size * size * (Cell::SPACE + 2 * Position::SPACE) }
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Connection {
    pub source: Position,
    pub destination: Position,
}

impl Connection {
    pub const SPACE: usize = 2 * Position::SPACE;

    pub fn tuple(self) -> (Position, Position) {
        (self.source, self.destination)
    }
}
