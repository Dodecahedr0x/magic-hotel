use anchor_lang::prelude::*;

#[account]
pub struct Player {
    pub bump: u8,
    pub id: Pubkey,
    pub owner: Pubkey,
    pub hotel: Pubkey,
    pub position: Option<Position>,
}

impl Player {
    pub const SPACE: usize = 8 + 1 + 32 + 32 + 32 + 1 + Position::SPACE;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Position {
    pub room: Pubkey,
    pub cell_index: u16,
}

impl PartialEq for Position {
    fn eq(&self, other: &Self) -> bool {
        self.room.eq(&other.room) && self.cell_index == other.cell_index
    }
}

impl Position {
    pub const SPACE: usize = 32 + 2;

    /// Check if the position is adjacent to the given index on the room.
    /// 
    /// The position is adjacent to the given index if the difference between the x and y coordinates is 1.
    /// # Arguments
    /// 
    /// * `index` - The index of the cell on the room
    /// * `room_size` - The size of the room
    /// 
    /// # Returns 
    /// 
    /// * `true` - If the position is adjacent to the given index
    /// * `false` - If the position is not adjacent to the given index
    pub fn is_adjacent(&self, index: u16, room_size: u16) -> bool {
        let x_diff = self.cell_index % room_size;
        let y_diff = self.cell_index / room_size;
        let other_x_diff = index % room_size;
        let other_y_diff = index / room_size;
        (x_diff.abs_diff(other_x_diff) + y_diff.abs_diff(other_y_diff)) == 1
    }
}
