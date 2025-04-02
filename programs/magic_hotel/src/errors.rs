use anchor_lang::prelude::*;

#[error_code]
pub enum HotelError {
    #[msg("Invalid destination")]
    InvalidDestination,
    #[msg("Invalid room")]
    InvalidRoom,
    #[msg("Crowded destination")]
    CrowdedDestination,
    #[msg("Player not at source")]
    PlayerNotAtSource,
    #[msg("Invalid owner")]
    InvalidOwner,
    #[msg("Player already in hotel")]
    PlayerAlreadyInHotel,
}
