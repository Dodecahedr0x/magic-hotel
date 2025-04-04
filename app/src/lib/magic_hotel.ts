/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/magic_hotel.json`.
 */
export type MagicHotel = {
  "address": "H9NwTUnwjNGKAmST8eVBLnvStnCuMPvkfqT9WTYMXGjE",
  "metadata": {
    "name": "magicHotel",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createConnection",
      "discriminator": [
        107,
        30,
        231,
        166,
        113,
        240,
        77,
        88
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "hotel",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  116,
                  101,
                  108,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel.id",
                "account": "hotel"
              }
            ]
          }
        },
        {
          "name": "sourceRoom",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel"
              },
              {
                "kind": "account",
                "path": "source_room.id",
                "account": "room"
              }
            ]
          }
        },
        {
          "name": "destinationRoom",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel"
              },
              {
                "kind": "account",
                "path": "destination_room.id",
                "account": "room"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createConnectionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createHotel",
      "discriminator": [
        77,
        91,
        26,
        46,
        178,
        253,
        117,
        234
      ],
      "accounts": [
        {
          "name": "hotel",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  116,
                  101,
                  108,
                  58
                ]
              },
              {
                "kind": "arg",
                "path": "args.hotel_id"
              }
            ]
          }
        },
        {
          "name": "room",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel"
              },
              {
                "kind": "arg",
                "path": "args.room_id"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createHotelArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createMap",
      "discriminator": [
        119,
        8,
        165,
        241,
        187,
        193,
        182,
        112
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "hotel",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  116,
                  101,
                  108,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel.id",
                "account": "hotel"
              }
            ]
          }
        },
        {
          "name": "room",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createMapArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createPlayer",
      "discriminator": [
        19,
        178,
        189,
        216,
        159,
        134,
        0,
        192
      ],
      "accounts": [
        {
          "name": "hotel",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  116,
                  101,
                  108,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel.id",
                "account": "hotel"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel"
              },
              {
                "kind": "arg",
                "path": "args.player_id"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createPlayerArgs"
            }
          }
        }
      ]
    },
    {
      "name": "delegatePlayer",
      "discriminator": [
        235,
        159,
        245,
        102,
        161,
        199,
        254,
        89
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "bufferPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  102,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ]
          }
        },
        {
          "name": "delegationRecordPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "delegationMetadataPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "pda",
          "writable": true
        },
        {
          "name": "ownerProgram",
          "address": "H9NwTUnwjNGKAmST8eVBLnvStnCuMPvkfqT9WTYMXGjE"
        },
        {
          "name": "delegationProgram",
          "address": "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "delegatePlayerArgs"
            }
          }
        }
      ]
    },
    {
      "name": "delegateRoom",
      "discriminator": [
        39,
        6,
        122,
        70,
        65,
        76,
        166,
        26
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "bufferPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  102,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ]
          }
        },
        {
          "name": "delegationRecordPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "delegationMetadataPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "pda",
          "writable": true
        },
        {
          "name": "ownerProgram",
          "address": "H9NwTUnwjNGKAmST8eVBLnvStnCuMPvkfqT9WTYMXGjE"
        },
        {
          "name": "delegationProgram",
          "address": "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "delegateRoomArgs"
            }
          }
        }
      ]
    },
    {
      "name": "enterHotel",
      "discriminator": [
        83,
        194,
        31,
        67,
        22,
        16,
        61,
        111
      ],
      "accounts": [
        {
          "name": "hotel",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  116,
                  101,
                  108,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel.id",
                "account": "hotel"
              }
            ]
          },
          "relations": [
            "room"
          ]
        },
        {
          "name": "room",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel"
              },
              {
                "kind": "account",
                "path": "room.id",
                "account": "room"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel"
              },
              {
                "kind": "account",
                "path": "player.id",
                "account": "player"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "movePlayer",
      "discriminator": [
        17,
        58,
        68,
        221,
        186,
        117,
        140,
        231
      ],
      "accounts": [
        {
          "name": "hotel",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  116,
                  101,
                  108,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel.id",
                "account": "hotel"
              }
            ]
          },
          "relations": [
            "room",
            "player"
          ]
        },
        {
          "name": "room",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "room.hotel",
                "account": "room"
              },
              {
                "kind": "account",
                "path": "room.id",
                "account": "room"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "player.hotel",
                "account": "player"
              },
              {
                "kind": "account",
                "path": "player.id",
                "account": "player"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "player"
          ]
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "movePlayerArgs"
            }
          }
        }
      ]
    },
    {
      "name": "processUndelegation",
      "discriminator": [
        196,
        28,
        41,
        206,
        48,
        37,
        51,
        167
      ],
      "accounts": [
        {
          "name": "baseAccount",
          "writable": true
        },
        {
          "name": "buffer"
        },
        {
          "name": "payer",
          "writable": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "accountSeeds",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    },
    {
      "name": "undelegatePlayer",
      "discriminator": [
        230,
        242,
        176,
        199,
        120,
        26,
        119,
        243
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "pda",
          "writable": true
        },
        {
          "name": "magicProgram",
          "address": "Magic11111111111111111111111111111111111111"
        },
        {
          "name": "magicContext",
          "writable": true,
          "address": "MagicContext1111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "undelegateRoom",
      "discriminator": [
        151,
        179,
        196,
        11,
        39,
        232,
        174,
        131
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "pda",
          "writable": true
        },
        {
          "name": "magicProgram",
          "address": "Magic11111111111111111111111111111111111111"
        },
        {
          "name": "magicContext",
          "writable": true,
          "address": "MagicContext1111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "useConnection",
      "discriminator": [
        117,
        120,
        69,
        80,
        49,
        26,
        101,
        9
      ],
      "accounts": [
        {
          "name": "hotel",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  116,
                  101,
                  108,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "hotel.id",
                "account": "hotel"
              }
            ]
          },
          "relations": [
            "sourceRoom",
            "destinationRoom",
            "player"
          ]
        },
        {
          "name": "sourceRoom",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "source_room.hotel",
                "account": "room"
              },
              {
                "kind": "account",
                "path": "source_room.id",
                "account": "room"
              }
            ]
          }
        },
        {
          "name": "destinationRoom",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "destination_room.hotel",
                "account": "room"
              },
              {
                "kind": "account",
                "path": "destination_room.id",
                "account": "room"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114,
                  58
                ]
              },
              {
                "kind": "account",
                "path": "player.hotel",
                "account": "player"
              },
              {
                "kind": "account",
                "path": "player.id",
                "account": "player"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "player"
          ]
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "useConnectionArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "hotel",
      "discriminator": [
        106,
        159,
        170,
        202,
        103,
        172,
        199,
        81
      ]
    },
    {
      "name": "player",
      "discriminator": [
        205,
        222,
        112,
        7,
        165,
        155,
        206,
        218
      ]
    },
    {
      "name": "room",
      "discriminator": [
        156,
        199,
        67,
        27,
        222,
        23,
        185,
        94
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidDestination",
      "msg": "Invalid destination"
    },
    {
      "code": 6001,
      "name": "invalidRoom",
      "msg": "Invalid room"
    },
    {
      "code": 6002,
      "name": "crowdedDestination",
      "msg": "Crowded destination"
    },
    {
      "code": 6003,
      "name": "playerNotAtSource",
      "msg": "Player not at source"
    },
    {
      "code": 6004,
      "name": "invalidOwner",
      "msg": "Invalid owner"
    },
    {
      "code": 6005,
      "name": "playerAlreadyInHotel",
      "msg": "Player already in hotel"
    }
  ],
  "types": [
    {
      "name": "cell",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tile",
            "type": "u8"
          },
          {
            "name": "occupant",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "connection",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "source",
            "type": {
              "defined": {
                "name": "position"
              }
            }
          },
          {
            "name": "destination",
            "type": {
              "defined": {
                "name": "position"
              }
            }
          }
        ]
      }
    },
    {
      "name": "createConnectionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "originCellIndex",
            "type": "u16"
          },
          {
            "name": "destinationCellIndex",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "createHotelArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hotelId",
            "type": "pubkey"
          },
          {
            "name": "roomId",
            "type": "pubkey"
          },
          {
            "name": "roomSize",
            "type": "u16"
          },
          {
            "name": "genesisRoom",
            "type": "bytes"
          },
          {
            "name": "genesisPosition",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "createMapArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "cells",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "createPlayerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerId",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "delegatePlayerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hotel",
            "type": "pubkey"
          },
          {
            "name": "playerId",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "delegateRoomArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hotel",
            "type": "pubkey"
          },
          {
            "name": "roomId",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "hotel",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "roomSize",
            "type": "u16"
          },
          {
            "name": "genesis",
            "type": {
              "defined": {
                "name": "position"
              }
            }
          }
        ]
      }
    },
    {
      "name": "movePlayerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "destinationIndex",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "hotel",
            "type": "pubkey"
          },
          {
            "name": "position",
            "type": {
              "option": {
                "defined": {
                  "name": "position"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "room",
            "type": "pubkey"
          },
          {
            "name": "cellIndex",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "room",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "hotel",
            "type": "pubkey"
          },
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "cells",
            "type": {
              "vec": {
                "defined": {
                  "name": "cell"
                }
              }
            }
          },
          {
            "name": "connections",
            "type": {
              "vec": {
                "defined": {
                  "name": "connection"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "useConnectionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "connectionIndex",
            "type": "u16"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "hotelPdaSeed",
      "type": "bytes",
      "value": "[104, 111, 116, 101, 108, 58]"
    },
    {
      "name": "playerPdaSeed",
      "type": "bytes",
      "value": "[112, 108, 97, 121, 101, 114, 58]"
    },
    {
      "name": "roomPdaSeed",
      "type": "bytes",
      "value": "[114, 111, 111, 109, 58]"
    }
  ]
};
