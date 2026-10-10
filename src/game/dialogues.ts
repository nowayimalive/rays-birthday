import { DialogueSequence } from './types';

export const DIALOGUES: Record<string, DialogueSequence> = {
  // ==========================================
  // PROLOGUE: THE WRONG STATION
  // ==========================================
  prologue_arrival: {
    id: 'prologue_arrival',
    lines: [
      {
        speaker: 'raynio_blue',
        speakerName: 'Raynio',
        expression: 'confused',
        text: 'Wait... I’m pretty sure the conductor never announced a stop out here. And why were the last three train carriages completely empty?',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        soundCue: 'transform',
        text: 'Whoa—?! Did my clothes just transform?! Since when does stepping off a train swap a blue shirt for full fantasy knight armor and a crimson cape?!',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'Okay... at least I still have my travel bag. Let’s walk to the right and see who’s sleeping on that station bench.',
      },
    ],
    onCompleteFlag: 'prologue_transformed',
  },

  station_train_inspect: {
    id: 'station_train_inspect',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'neutral',
        text: 'The carriage doors locked the second I stepped off. The brass destination plate inside the window just reads: "DESTINATION: SOMEWHERE TOWN."',
      },
    ],
  },

  station_sign_inspect: {
    id: 'station_sign_inspect',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'confused',
        text: 'A hand-painted wooden sign: "OFFICIAL TOWN GUIDE — PLEASE DO NOT FEED OR STARTLE." And there is a tiny round ghost snoring on the bench underneath it.',
      },
    ],
  },

  mallow_station_intro: {
    id: 'mallow_station_intro',
    lines: [
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'surprised',
        text: 'Gah! I’m awake! I wasn’t sleeping, I was inspecting the structural integrity of this bench with my eyelids! Who goes—wait a second. Messy curly black hair, forehead fringe, travel bag, confused posture...',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'confused',
        text: 'Did a floating marshmallow just profile me?',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'annoyed',
        text: 'Excuse you, I am a ghost, not a marshmallow! I’m Mallow, the Official Town Guide. And this bench is my only office because the municipal budget is currently zero dollars after a pigeon stole my last shirt button in April.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'neutral',
        text: 'Right, sorry, Mallow. I’m Raynio. Do you happen to know why my shirt turned into knight armor the moment I stepped off the train?',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'happy',
        text: 'Dramatic flair, probably! Nobody briefs the unpaid intern around here. All I know is someone left a sealed letter specifically for you on that Letter Stand to the right.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'Someone left a letter for me here? I didn’t even know this station existed five minutes ago.',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'neutral',
        text: 'Go read the letter on the Letter Stand to the right with [E]. Once you’ve read it, the Garden Gate at the far right end of the platform will unlock!',
      },
    ],
    onCompleteFlag: 'talked_mallow_station',
  },

  station_gate_locked: {
    id: 'station_gate_locked',
    lines: [
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'annoyed',
        text: 'Hold your horses, speedrunner! Talk to me by the bench and read the envelope on the Letter Stand before barging through the Garden Gate!',
      },
    ],
  },

  // ==========================================
  // CHAPTER 1: THE OVERGROWN GARDEN
  // ==========================================
  garden_entry_chat: {
    id: 'garden_entry_chat',
    lines: [
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'surprised',
        text: 'Okay, quick operational update: the sun is clocking out, the forest mushrooms are threatening to unionize, and I have zero accommodation budget if we get stuck out here after dark.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'happy',
        text: 'Do they really not pay you anything to be the Town Guide?',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'annoyed',
        text: 'They pay me in "exposure," Raynio, and exposure doesn’t buy croissants! Hop across those wooden ledges with [Space]—every time you collect Star Coins, the night-blooms in this garden wake up and glow!',
      },
    ],
    onCompleteFlag: 'garden_intro_done',
  },

  garden_midway_sign: {
    id: 'garden_midway_sign',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'neutral',
        text: 'The wooden signpost reads: "Upper Canopy Trail — Watch your step. A Secret Star shines on the highest cloud ledge above."',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'thoughtful',
        text: 'Ooh, that’s one of the 6 Secret Stars! They’re completely optional, but rumor has it that collecting all six unlocks a hidden Starlit Garden at the end of the world!',
      },
    ],
  },

  fragment_1_dialogue: {
    id: 'fragment_1_dialogue',
    lines: [
      {
        speaker: 'system',
        speakerName: 'Memory Fragment #1',
        expression: 'happy',
        soundCue: 'fragment',
        text: 'THE LITTLE STAR — “Some things don’t need a reason to make a day better.”',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: 'Whoa... the moment I touched that star shard, the entire clearing lit up, and the tangled briars blocking the Town Gate to the right pulled back on their own.',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'happy',
        text: 'One Memory Fragment down, five to go! Let’s head through the Town Gate on the far right—the streetlamps of Somewhere Town are just ahead!',
      },
    ],
    onCompleteFlag: 'fragment_1',
  },

  // ==========================================
  // CHAPTER 2: TOWN OF ODD JOBS
  // ==========================================
  locked_root_building: {
    id: 'locked_root_building',
    lines: [
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'sad',
        text: '“I’m sorry, Ray. [???] hasn’t granted access to this place yet.”',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'confused',
        text: 'Thick overgrown roots are sealing the door shut... Wait, who is "[???]"? Why does it sound like the universe is censoring a name every time someone says it?',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'embarrassed',
        text: 'Union rules, my lips are sealed! Check your Quest Scroll on the left side of the screen—as we progress through the story, the roots on the buildings we need will shrink away automatically.',
      },
    ],
  },

  mayor_cat_first_meeting: {
    id: 'mayor_cat_first_meeting',
    lines: [
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'happy',
        text: '“Ah! Raynio! There you are! [???] has prepared everything for you. Every little detail, every little arrangement…”',
      },
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'surprised',
        text: '“…Oh, dear. I really shouldn’t be telling you this.”',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'confused',
        text: 'Hold on—how do you know my name? And what do you mean someone "prepared everything" for me?',
      },
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'embarrassed',
        text: 'Prepared? Who said prepared?! I clearly said... "repaired"! Yes, the cobblestones were recently repaired! “Welcome back, by the way!”',
      },
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'surprised',
        text: '“…Oh, no. I did it again. [???] is going to be furious with me.”',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: '"Welcome back"?! I’ve never set foot in this town in my entire life!',
      },
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'annoyed',
        text: 'AHEM! Goodness, look at my pocket watch! Important mayoral paperwork awaits inside Town Hall! Your room at The Sleepy Inn (Southwest) is ready, and the Town Library next door is now open! Good evening!',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'happy',
        text: 'Ten out of ten poker face from Mayor Cat. Look, Ray—the overgrown roots sealing The Sleepy Inn, the Town Library, and the town shops just vanished! Let’s head Southwest (bottom-left) to The Sleepy Inn.',
      },
    ],
    onCompleteFlag: 'met_mayor_cat',
    onCompleteAction: 'unlock_town_phase_1',
  },

  mayor_cat_side_quest_start: {
    id: 'mayor_cat_side_quest_start',
    lines: [
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'sad',
        text: 'Since you’ve stepped inside Town Hall, Raynio... might I trouble you with a grave administrative emergency?',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'neutral',
        text: 'What kind of emergency are we talking about, Mayor?',
      },
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'annoyed',
        text: 'Three crises at once! First, a menace of a pigeon outside near the Town Fountain flew off with my Official Stamp. Second, someone hid my Desk Bell behind the velvet curtain in the top-left of this room. Third, please inspect the "Classified Document" on the left desk!',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'annoyed',
        text: 'THE PIGEON AGAIN?! Okay Raynio, this is personal now. Let’s get that stamp back!',
      },
    ],
    onCompleteFlag: 'started_mayor_quest',
  },

  mayor_cat_side_quest_complete: {
    id: 'mayor_cat_side_quest_complete',
    lines: [
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'happy',
        text: 'Splendid! My Official Stamp is recovered, my Desk Bell is back where it belongs, and you reviewed the Classified Document on the side desk!',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'confused',
        text: 'Mayor... that "Classified Document" on the desk was literally just a lunch order for a crispy tuna melt.',
      },
      {
        speaker: 'mayor_cat',
        speakerName: 'Mayor Cat',
        expression: 'embarrassed',
        text: 'The cheddar-to-tuna ratio is a matter of highest municipal security, Raynio! Thank you for your service!',
      },
    ],
    onCompleteFlag: 'completed_mayor_quest',
  },

  pigeon_stamp_dialogue: {
    id: 'pigeon_stamp_dialogue',
    lines: [
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'annoyed',
        text: 'Hand over the Mayor’s Official Stamp, you feathered kleptomaniac! I haven’t forgotten what your cousin did to my bench in April!',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'happy',
        text: 'The pigeon happily traded the Official Stamp for a crust of bread from my travel bag. Crisis averted.',
      },
    ],
    onCompleteFlag: 'got_pigeon_stamp',
  },

  mayor_bell_dialogue: {
    id: 'mayor_bell_dialogue',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'neutral',
        text: 'Found it! Mayor Cat’s brass Desk Bell was tucked behind the velvet curtain. There’s a sticky note attached: "Confiscated by staff because the Mayor rings this after every bad pun."',
      },
    ],
    onCompleteFlag: 'found_mayor_bell',
  },

  mayor_menu_dialogue: {
    id: 'mayor_menu_dialogue',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: '“TOP SECRET DECREE #404: 1x Crispy Tuna Melt, extra sharp cheddar, sliced diagonally, pickle on the side.”',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'annoyed',
        text: 'Unbelievable. Even the side pickle gets a municipal budget while my salary is still zero!',
      },
    ],
    onCompleteFlag: 'read_lunch_menu',
  },

  sleepy_inn_keeper: {
    id: 'sleepy_inn_keeper',
    lines: [
      {
        speaker: 'innkeeper',
        speakerName: 'Innkeeper Martha',
        expression: 'happy',
        text: 'Good evening, Raynio! Room #3 is aired out, extra pillows are fluffed, and a mug of warm spiced cider is waiting by the hearth—just as the reservation note requested.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: 'Wait—someone sent you a reservation note for me too? Who signed it?',
      },
      {
        speaker: 'innkeeper',
        speakerName: 'Innkeeper Martha',
        expression: 'embarrassed',
        text: 'Well, the person who built this town, of course! Very neat handwriting, though you could tell they crossed out the greeting three times so it wouldn’t sound too dramatic.',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'thoughtful',
        text: 'Rewriting an inn check-in note three times... whoever built this world is a certified overthinker. Let’s head out through the Exit Door at the bottom and visit the Town Library right next door!',
      },
    ],
    onCompleteFlag: 'visited_sleepy_inn',
  },

  inn_guest_ego: {
    id: 'inn_guest_ego',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'neutral',
        text: 'Excuse me, Barnaby—Postie asked me to deliver this parcel labeled "FRAGILE: EGO INSIDE" to your table.',
      },
      {
        speaker: 'innkeeper',
        speakerName: 'Barnaby (Inn Guest)',
        expression: 'embarrassed',
        text: 'At last! My commemorative plaque for "Third Most Punctual Resident in Somewhere Town"! Handle it with reverence!',
      },
    ],
    onCompleteFlag: 'delivered_ego_package',
  },

  librarian_lore_dialogue: {
    id: 'librarian_lore_dialogue',
    lines: [
      {
        speaker: 'librarian',
        speakerName: 'Town Librarian',
        expression: 'thoughtful',
        text: 'Shh, keep your voice down... even that little ghost beside you is hovering too loudly. Ah, so you are the traveler everyone has been waiting for.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'confused',
        text: 'I noticed almost every book on this reading table has its final chapter left blank.',
      },
      {
        speaker: 'librarian',
        speakerName: 'Town Librarian',
        expression: 'neutral',
        text: 'They aren’t damaged, Raynio. They were written that way on purpose. Not every story needs a rigid ending forced upon it—yet every index in this library points toward one place: the Observatory atop the mountain.',
      },
      {
        speaker: 'librarian',
        speakerName: 'Town Librarian',
        expression: 'happy',
        text: 'By the way, a crowd of townsfolk is laughing about something outside by the Town Square Fountain. Head out through the Exit Door below and see what’s glowing out there.',
      },
    ],
    onCompleteFlag: 'visited_library_lore',
  },

  rosa_quest_start: {
    id: 'rosa_quest_start',
    lines: [
      {
        speaker: 'rosa',
        speakerName: 'Rosa',
        expression: 'surprised',
        text: 'Oh, thank goodness you stopped by, Raynio! Two of my prized Night-Bloom flowers got stage fright and hopped right out of their pots into the town streets!',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'happy',
        text: 'Your flowers hopped out of their pots? Where did they run off to?',
      },
      {
        speaker: 'rosa',
        speakerName: 'Rosa',
        expression: 'happy',
        text: 'One is hiding along the southern lane just below The Sleepy Inn, and the other fled to the northeast lawn in the upper-right corner of town. Please coax them back!',
      },
    ],
    onCompleteFlag: 'talked_rosa',
  },

  rosa_quest_complete: {
    id: 'rosa_quest_complete',
    lines: [
      {
        speaker: 'rosa',
        speakerName: 'Rosa',
        expression: 'happy',
        text: 'Wonderful, both Night-Blooms are safe and sound! Look outside—all the flowerbeds around Town Square just burst into bloom too!',
      },
    ],
    onCompleteFlag: 'completed_rosa_quest',
  },

  bram_quest_start: {
    id: 'bram_quest_start',
    lines: [
      {
        speaker: 'bram',
        speakerName: 'Bram the Baker',
        expression: 'surprised',
        text: 'Quick, shut the door, Raynio! My freshly baked sourdough loaves just sprouted legs and marched right out of the brick oven!',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'confused',
        text: 'How does sourdough bread just sprout legs and walk out?!',
      },
      {
        speaker: 'bram',
        speakerName: 'Bram the Baker',
        expression: 'annoyed',
        text: 'I used too much wild starter, and now they’re demanding a Sourdough Union! One loaf is picketing right next to the Town Fountain outside, and the ringleader is hiding inside Mayor Cat’s spare hat inside Town Hall!',
      },
    ],
    onCompleteFlag: 'talked_bram',
  },

  bread_1_catch: {
    id: 'bread_1_catch',
    lines: [
      {
        speaker: 'bread',
        speakerName: 'Sourdough Loaf #1',
        expression: 'annoyed',
        text: '“NO SLICING WITHOUT REPRESENTATION! WE DEMAND ARTISANAL BUTTER BENEFITS!”',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'happy',
        text: 'Gotcha! That is easily the feistiest loaf of bread I’ve ever held.',
      },
    ],
    onCompleteFlag: 'caught_bread_1',
  },

  bread_2_catch: {
    id: 'bread_2_catch',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: 'There really is a runaway sourdough loaf hiding inside Mayor Cat’s spare top hat!',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'happy',
        text: 'Honestly, this bread has a clearer political platform than Mayor Cat. Let’s bring both loaves back to Bram at the Bakery.',
      },
    ],
    onCompleteFlag: 'caught_bread_2',
  },

  bram_quest_complete: {
    id: 'bram_quest_complete',
    lines: [
      {
        speaker: 'bram',
        speakerName: 'Bram the Baker',
        expression: 'happy',
        text: 'Bless you, Raynio! I reached a fair collective bargaining agreement with the loaves: warm linen baskets and zero slicing after 8 PM!',
      },
    ],
    onCompleteFlag: 'completed_bread_quest',
  },

  postie_quest_start: {
    id: 'postie_quest_start',
    lines: [
      {
        speaker: 'postie',
        speakerName: 'Postie',
        expression: 'neutral',
        text: 'Neither rain, nor sleet, nor existential dread shall stay this courier from his rounds! Except... my boxy metal frame gets wedged between the tables inside The Sleepy Inn.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'neutral',
        text: 'Want me to drop the parcel off inside The Sleepy Inn for you?',
      },
      {
        speaker: 'postie',
        speakerName: 'Postie',
        expression: 'happy',
        text: 'Yes, please! Deliver this package marked "FRAGILE: EGO INSIDE" to Barnaby at the right-hand table inside The Sleepy Inn, then report back to me!',
      },
    ],
    onCompleteFlag: 'talked_postie',
  },

  postie_quest_complete: {
    id: 'postie_quest_complete',
    lines: [
      {
        speaker: 'postie',
        speakerName: 'Postie',
        expression: 'happy',
        text: 'Delivery confirmed! Oh, and between you and me, Raynio... there was one special letter in my ledger that never went through normal postage.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'An unsent letter? Who wrote it?',
      },
      {
        speaker: 'postie',
        speakerName: 'Postie',
        expression: 'neutral',
        text: 'The sender locked the first draft inside the Star Vault at the back of the Clockwork Arcade, and placed the final letter at the summit of the Observatory. Keep going—you’ll read it soon.',
      },
    ],
    onCompleteFlag: 'completed_postie_quest',
  },

  fragment_2_dialogue: {
    id: 'fragment_2_dialogue',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'happy',
        text: 'Wait—the townsfolk by the Fountain are cracking up over an official petition to rename Tuesday to "Second Monday, But Worse."',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'embarrassed',
        text: 'Pffft—Ahem! I did NOT laugh at that. That was a dignified spectral cough.',
      },
      {
        speaker: 'system',
        speakerName: 'Memory Fragment #2',
        expression: 'happy',
        soundCue: 'fragment',
        text: 'THE FAMILIAR JOKE — “Some jokes are nonsense. Somehow, that is exactly the point.”',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'surprised',
        soundCue: 'rootShrink',
        text: 'Hey, did you hear that rumble in the Southeast corner of town?! The thorny roots sealing the Clockwork Arcade just pulled back! Let’s head Southeast (bottom-right)!',
      },
    ],
    onCompleteFlag: 'fragment_2',
    onCompleteAction: 'unlock_arcade',
  },

  // ==========================================
  // CHAPTER 3: THE CLOCKWORK ARCADE
  // ==========================================
  tock_arcade_intro: {
    id: 'tock_arcade_intro',
    lines: [
      {
        speaker: 'tock',
        speakerName: 'Tock the Clockmaker',
        expression: 'happy',
        text: 'Tick-tock, right on cue! Welcome to the Clockwork Arcade, Raynio. Everything in this hall runs on nostalgia and static electricity.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'neutral',
        text: 'There’s a 4-Symbol Star Vault built into the north wall with dials for Star, Moon, Sun, and Envelope.',
      },
      {
        speaker: 'tock',
        speakerName: 'Tock the Clockmaker',
        expression: 'thoughtful',
        text: 'That’s the Unsent Message Terminal! Opening it takes two steps: First, play the "GEAR RUNNER" cabinet on the top-left to collect 3 Power Batteries.',
      },
      {
        speaker: 'tock',
        speakerName: 'Tock the Clockmaker',
        expression: 'happy',
        text: 'Second, read the 4 Clue Plaques in this hall. The four dials follow the natural passage of time: from morning (SUN), to nightfall (MOON), to the guiding light (STAR), to the final message (ENVELOPE).',
      },
    ],
    onCompleteFlag: 'talked_tock',
  },

  arcade_clue_1: {
    id: 'arcade_clue_1',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'Clue Plaque I: "FIRST, the golden SUN rises to wake the sleeping gears of the morning." (Dial 1 = SUN)',
      },
    ],
  },

  arcade_clue_2: {
    id: 'arcade_clue_2',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'Clue Plaque II: "SECOND, the silver MOON climbs over the rooftops of Somewhere Town." (Dial 2 = MOON)',
      },
    ],
  },

  arcade_clue_3: {
    id: 'arcade_clue_3',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'Clue Plaque III: "THIRD, a single distant STAR steadies the traveler on the winter road." (Dial 3 = STAR)',
      },
    ],
  },

  arcade_clue_4: {
    id: 'arcade_clue_4',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'Clue Plaque IV: "FOURTH, the ENVELOPE holds the words that waited until the end." (Full Sequence: SUN -> MOON -> STAR -> ENVELOPE)',
      },
    ],
  },

  fragment_3_dialogue: {
    id: 'fragment_3_dialogue',
    lines: [
      {
        speaker: 'system',
        speakerName: 'Memory Fragment #3',
        expression: 'happy',
        soundCue: 'fragment',
        text: 'THE UNSENT MESSAGE — “I wanted to tell you something, but I didn’t know how to make it sound right…”',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'The vault printed that single line... and stamped underneath it: "FORWARDED TO THE QUIET SIDE OF WINTER (EAST DOOR)."',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'surprised',
        text: 'Look! The heavy wooden door on the right wall leading to the Winter Village just unlocked! Good thing ghosts don’t get frostbite. Let’s head through the East Door!',
      },
    ],
    onCompleteFlag: 'fragment_3',
  },

  // ==========================================
  // CHAPTER 4: THE QUIET SIDE OF WINTER
  // ==========================================
  winter_intro_dialogue: {
    id: 'winter_intro_dialogue',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: 'Wait—look at the warm window of that Winter Cabin up ahead. Someone in a dark hooded cloak was just watching us from behind the glass.',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'thoughtful',
        text: 'That’s The Keeper. He watches over the memories left behind in this world. Let’s inspect the clues in the snow and claim Memory Fragment #4 in front of the cabin porch.',
      },
    ],
    onCompleteFlag: 'winter_intro_seen',
  },

  winter_clue_ticket_dialogue: {
    id: 'winter_clue_ticket_dialogue',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'A punched train ticket resting beside the snow lantern: "ONE WAY — NO RETURN REQUIRED."',
      },
    ],
    onCompleteFlag: 'winter_clue_ticket',
  },

  winter_clue_photo_dialogue: {
    id: 'winter_clue_photo_dialogue',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'A frost-rimmed photograph resting on the stone well. The faces are blurred by snow, but the warm golden lantern light between them is unmistakable.',
      },
    ],
    onCompleteFlag: 'winter_clue_photo',
  },

  winter_clue_star_dialogue: {
    id: 'winter_clue_star_dialogue',
    lines: [
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'A constellation sketch carved into the wooden signpost. Its arrow points toward the Mountain Gate on the far right, leading up to the Observatory.',
      },
    ],
    onCompleteFlag: 'winter_clue_star',
  },

  fragment_4_dialogue: {
    id: 'fragment_4_dialogue',
    lines: [
      {
        speaker: 'system',
        speakerName: 'Memory Fragment #4',
        expression: 'happy',
        soundCue: 'fragment',
        text: 'A PLACE TO RETURN TO — “Maybe home isn’t always a place. Maybe it’s a moment you wish you could visit again.”',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'thoughtful',
        text: 'The cabin door just creaked open... and the hooded figure stepped out onto the snow beside the porch. Let’s talk to him.',
      },
    ],
    onCompleteFlag: 'fragment_4',
  },

  keeper_winter_encounter: {
    id: 'keeper_winter_encounter',
    lines: [
      {
        speaker: 'keeper_hooded',
        speakerName: 'The Keeper',
        expression: 'neutral',
        text: 'You followed the footprints through the snow all this way, Raynio.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: 'You were standing behind the cabin window just now. Are you "[???]"—the one Mayor Cat kept mentioning? Did you write the letter at the station?',
      },
      {
        speaker: 'keeper_hooded',
        speakerName: 'The Keeper',
        expression: 'thoughtful',
        text: 'No. I did not build this world, nor did I write that letter. I am only the Keeper—placed here to make sure these quiet moments weren’t buried under the snow.',
      },
      {
        speaker: 'keeper_hooded',
        speakerName: 'The Keeper',
        expression: 'neutral',
        text: '“You found everything except the thing you came for.”',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'confused',
        text: '“Then what am I looking for?”',
      },
      {
        speaker: 'keeper_hooded',
        speakerName: 'The Keeper',
        expression: 'thoughtful',
        text: '“It isn’t something to own. It isn’t an answer you’re owed. Some things only make sense when you stop trying to force them into a shape.”',
      },
      {
        speaker: 'keeper_hooded',
        speakerName: 'The Keeper',
        expression: 'neutral',
        text: 'Take this fifth Memory Fragment—an unfinished painting of the night sky. Pass through the Mountain Gate to the east and climb to the Observatory. I will meet you at the summit.',
      },
      {
        speaker: 'system',
        speakerName: 'Memory Fragment #5',
        expression: 'happy',
        soundCue: 'fragment',
        text: 'THE UNFINISHED PICTURE — A pixel-art canvas of two small figures beneath a starry sky, with the central constellation still waiting to be completed.',
      },
    ],
    onCompleteFlag: 'fragment_5',
    onCompleteAction: 'show_unfinished_picture',
  },

  // ==========================================
  // CHAPTER 5: THE PLACE AT THE END
  // ==========================================
  mountain_climb_mallow: {
    id: 'mountain_climb_mallow',
    lines: [
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'happy',
        text: 'Look at the sky, Raynio... The higher we climb up this ridge, the more the coins along the trail turn into real fallen stars.',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'embarrassed',
        text: 'By the way, according to my official calculations: you have now completed roughly 87% of a job I never applied for.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'happy',
        text: 'Only 87%? What did you do for the other 13%, Mallow?',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'happy',
        text: 'Moral support, witty commentary, and glaring at pigeons! Still... I’m really glad it was you who stepped off that dusk train, Ray. Come on, the Observatory doors are right at the summit ahead!',
      },
    ],
    onCompleteFlag: 'mountain_mallow_chat',
  },

  keeper_before_puzzle: {
    id: 'keeper_before_puzzle',
    lines: [
      {
        speaker: 'keeper_hooded',
        speakerName: 'The Keeper',
        expression: 'neutral',
        text: 'You have reached the Grand Observatory, Raynio. Step up to the Constellation Altar in the center of the dome to ignite the four starlight beacons and unite the Memory Fragments.',
      },
    ],
  },

  observatory_reveal_sequence: {
    id: 'observatory_reveal_sequence',
    lines: [
      {
        speaker: 'keeper_unhooded',
        speakerName: 'The Keeper',
        expression: 'neutral',
        soundCue: 'secret',
        text: 'All four Constellation Lights are lit, and the unfinished sky is finally whole. Look closely, Raynio.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: 'You lowered your hood... Those glowing cyan eyes and that scar—you really aren’t the person who wrote the letter.',
      },
      {
        speaker: 'keeper_unhooded',
        speakerName: 'The Keeper',
        expression: 'thoughtful',
        text: 'I told you in the snow: I am only the guardian of this place. Someone else stayed up late building these streets, planting the night-blooms, and placing every star in this sky for you.',
      },
      {
        speaker: 'keeper_unhooded',
        speakerName: 'The Keeper',
        expression: 'neutral',
        text: 'He built this world because sometimes it is much easier to create a whole place for someone than to say everything out loud. Here is the sixth and final Memory Fragment.',
      },
      {
        speaker: 'system',
        speakerName: 'Memory Fragment #6',
        expression: 'happy',
        soundCue: 'fragment',
        text: 'THE THINGS WORTH CELEBRATING — “I don’t know what the future will look like. But I know there are little things about you that deserve to be celebrated.”',
      },
      {
        speaker: 'system',
        speakerName: 'WORLD CREATED BY ALLAN',
        expression: 'happy',
        soundCue: 'finalReveal',
        text: '— WORLD CREATED BY ALLAN — Every "[???]" seal across Somewhere Town dissolves into warm golden starlight.',
      },
      {
        speaker: 'allan',
        speakerName: 'Allan',
        expression: 'happy',
        text: 'Hey, Raynio. You actually made it all the way up here and found every single piece.',
      },
      {
        speaker: 'raynio',
        speakerName: 'Raynio',
        expression: 'surprised',
        text: 'Allan?! You built this entire world? From the train station and Mayor Cat’s script to the arcade and this Observatory?!',
      },
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'happy',
        text: 'FINALLY! Do you have any idea how exhausting it was censoring your name into "[???]" for five whole chapters, Allan?!',
      },
      {
        speaker: 'allan',
        speakerName: 'Allan',
        expression: 'embarrassed',
        text: 'Good job, Mallow. Your bench budget is officially approved. And Raynio... I just wanted to make a little world to celebrate your birthday.',
      },
      {
        speaker: 'allan',
        speakerName: 'Allan',
        expression: 'happy',
        text: 'I’m so happy to be a part of your life. I’ll love you forever. Whenever you’re ready, read the letter I left for you on the lectern.',
      },
    ],
    onCompleteFlag: 'allan_reveal_complete',
    onCompleteAction: 'open_final_letter',
  },

  // ==========================================
  // SECRET GARDEN ENDING DIALOGUE
  // ==========================================
  secret_garden_dialogue: {
    id: 'secret_garden_dialogue',
    lines: [
      {
        speaker: 'mallow',
        speakerName: 'Mallow',
        expression: 'happy',
        text: 'All six Secret Stars collected! You really explored every hidden corner of this world, Raynio.',
      },
      {
        speaker: 'allan',
        speakerName: 'Allan',
        expression: 'happy',
        text: 'This Secret Starlit Garden is the last quiet corner I tucked away for you. No puzzles, no obstacles, no expectations.',
      },
      {
        speaker: 'allan',
        speakerName: 'Allan',
        expression: 'thoughtful',
        text: 'I’m so happy to be a part of your life, Raynio, and I’ll love you forever. Happy Birthday once again.',
      },
    ],
    onCompleteFlag: 'secret_garden_read',
  },
};
