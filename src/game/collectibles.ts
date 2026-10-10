import { MemoryFragmentInfo, SecretStarInfo, QuestInfo } from './types';

export const MEMORY_FRAGMENTS: MemoryFragmentInfo[] = [
  {
    id: 1,
    title: 'THE LITTLE STAR',
    chapter: 'Chapter 1: The Overgrown Garden',
    message: 'Some things don’t need a reason to make a day better.',
    description:
      'A warm, pulsing star shard found resting in the quiet clearing at the end of the Overgrown Garden. Touching it caused the surrounding night-blooms to open all at once.',
  },
  {
    id: 2,
    title: 'THE FAMILIAR JOKE',
    chapter: 'Chapter 2: Town of Odd Jobs',
    message: 'Some jokes are nonsense. Somehow, that is exactly the point.',
    description:
      'Discovered in the center of Somewhere Town Square after a series of suspiciously specific errands—from unionizing sourdough loaves to an inn room already booked in your name.',
  },
  {
    id: 3,
    title: 'THE UNSENT MESSAGE',
    chapter: 'Chapter 3: The Clockwork Arcade',
    message: 'I wanted to tell you something, but I didn’t know how to make it sound right…',
    description:
      'Retrieved from the humming brass memory vault at the back of the Clockwork Arcade once all four celestial dials were aligned.',
  },
  {
    id: 4,
    title: 'A PLACE TO RETURN TO',
    chapter: 'Chapter 4: The Quiet Side of Winter',
    message: 'Maybe home isn’t always a place. Maybe it’s a moment you wish you could visit again.',
    description:
      'Found outside the warm lantern-lit cabin where snow falls softly and footprints linger in the blue moonlight.',
  },
  {
    id: 5,
    title: 'THE UNFINISHED PICTURE',
    chapter: 'Chapter 4: The Quiet Side of Winter',
    message: 'Even when a picture isn’t finished, the stars above it still remember why it was drawn.',
    description:
      'An unfinished pixel-art canvas depicting two small silhouettes beneath a starlit sky, entrusted to you by The Keeper.',
  },
  {
    id: 6,
    title: 'THE THINGS WORTH CELEBRATING',
    chapter: 'Chapter 5: The Place at the End',
    message:
      'I don’t know what the future will look like. But I know there are little things about you that deserve to be celebrated.',
    description:
      'The final Memory Fragment awakened inside the Grand Observatory once the four Constellation Lights and all six memories were brought together.',
  },
];

export const SECRET_STARS: SecretStarInfo[] = [
  {
    id: 1,
    name: 'Canopy Whisper Star',
    chapter: 'Chapter 1: The Overgrown Garden',
    locationHint: 'Follow the high cloud platforms above the central valley in the Overgrown Garden.',
  },
  {
    id: 2,
    name: 'Missing Page Star',
    chapter: 'Chapter 2: Town Library (Interior)',
    locationHint: 'Tucked in the top-right archive corner inside the Somewhere Town Library.',
  },
  {
    id: 3,
    name: 'Out-of-Order Cabinet Star',
    chapter: 'Chapter 3: The Clockwork Arcade',
    locationHint: 'Hidden in the top-right corner behind the broken "Out of Order" arcade machine.',
  },
  {
    id: 4,
    name: 'Frost-Pine Trail Star',
    chapter: 'Chapter 4: The Quiet Side of Winter',
    locationHint: 'Resting along the upper-right snow-pine ridge in the Winter Village.',
  },
  {
    id: 5,
    name: 'Windward Ridge Star',
    chapter: 'Chapter 5: Path to the Observatory',
    locationHint: 'On the high starlit cloud ledge directly above where Mallow rests on the mountain climb.',
  },
  {
    id: 6,
    name: 'Astrolabe Balcony Star',
    chapter: 'Chapter 5: The Observatory Dome',
    locationHint: 'In the upper-right alcove beside the brass astrolabe inside the Observatory.',
  },
];

export const QUEST_LIST: QuestInfo[] = [
  {
    id: 'main_prologue',
    title: 'Prologue: The Wrong Station',
    giver: 'Station Letter',
    chapter: 'Prologue',
    description: 'Explore the dusk train platform, wake the sleeping Town Guide, and read the letter left for you.',
    steps: [
      { flag: 'prologue_transformed', label: 'Step off the train onto Platform 0' },
      { flag: 'talked_mallow_station', label: 'Wake up Mallow on the bench under the "Official Town Guide" sign' },
      { flag: 'read_station_letter', label: 'Read the envelope on the Letter Stand to the right of Mallow' },
      { flag: 'entered_garden', label: 'Pass through the Garden Gate at the far right of the platform' },
    ],
    completedFlag: 'entered_garden',
    isMain: true,
  },
  {
    id: 'main_garden',
    title: 'Chapter 1: The Overgrown Garden',
    giver: 'Mallow',
    chapter: 'Chapter 1',
    description: 'Cross the twilight garden, collect Star Coins to make the night-blooms open, and claim the first Memory Fragment.',
    steps: [
      { flag: 'fragment_1', label: 'Collect Memory Fragment #1: THE LITTLE STAR at the far right clearing' },
      { flag: 'entered_town', label: 'Enter the Town Gate at the far right to reach Somewhere Town' },
    ],
    completedFlag: 'entered_town',
    isMain: true,
  },
  {
    id: 'main_town',
    title: 'Chapter 2: Town of Odd Jobs',
    giver: 'Mayor Cat',
    chapter: 'Chapter 2',
    description:
      'Someone has prepared the whole town for your arrival. Meet Mayor Cat, check into The Sleepy Inn, visit the Town Library, and claim Memory Fragment #2.',
    steps: [
      { flag: 'met_mayor_cat', label: 'Speak with Mayor Cat outside Town Hall (North)' },
      { flag: 'visited_sleepy_inn', label: 'Enter The Sleepy Inn (Southwest) & speak with Innkeeper Martha' },
      { flag: 'visited_library_lore', label: 'Enter the Town Library (next to the Inn) & speak with the Librarian' },
      { flag: 'fragment_2', label: 'Collect Memory Fragment #2 by the Town Square Fountain (Center)' },
    ],
    completedFlag: 'fragment_2',
    isMain: true,
  },
  {
    id: 'side_mayor_stamp',
    title: 'Odd Job: Mayor’s Missing Essentials',
    giver: 'Mayor Cat',
    chapter: 'Chapter 2 (Odd Job)',
    description: 'Help Mayor Cat recover his stolen Official Stamp, his hidden Desk Bell, and his "Classified Document".',
    steps: [
      { flag: 'started_mayor_quest', label: 'Speak with Mayor Cat inside Town Hall' },
      { flag: 'got_pigeon_stamp', label: 'Reclaim the Official Stamp from the pigeon near the outdoor Fountain' },
      { flag: 'found_mayor_bell', label: 'Search the velvet curtain in the top-left of Town Hall (Desk Bell)' },
      { flag: 'read_lunch_menu', label: 'Inspect the "Classified Document" on the left desk in Town Hall' },
      { flag: 'completed_mayor_quest', label: 'Report back to Mayor Cat inside Town Hall' },
    ],
    completedFlag: 'completed_mayor_quest',
    isMain: false,
  },
  {
    id: 'side_bram_bread',
    title: 'Odd Job: The Sourdough Union',
    giver: 'Bram the Baker',
    chapter: 'Chapter 2 (Odd Job)',
    description: 'Bram’s freshly baked sourdough loaves grew legs and marched out demanding a labor union!',
    steps: [
      { flag: 'talked_bram', label: 'Enter Bram’s Bakery (East) & speak with Bram' },
      { flag: 'caught_bread_1', label: 'Catch Sourdough Loaf #1 protesting to the right of the Town Fountain' },
      { flag: 'caught_bread_2', label: 'Catch Sourdough Loaf #2 hiding inside Mayor Cat’s spare hat (in Town Hall)' },
      { flag: 'completed_bread_quest', label: 'Return both runaway loaves to Bram in the Bakery' },
    ],
    completedFlag: 'completed_bread_quest',
    isMain: false,
  },
  {
    id: 'side_rosa_flowers',
    title: 'Odd Job: Runaway Night-Blooms',
    giver: 'Rosa',
    chapter: 'Chapter 2 (Odd Job)',
    description: 'Help Rosa coax two shy Night-Bloom flowers back into her conservatory so the town square can bloom.',
    steps: [
      { flag: 'talked_rosa', label: 'Enter Rosa’s Flower Shop (West) & speak with Rosa' },
      { flag: 'found_flower_1', label: 'Pick up Night-Bloom #1 along the southern lane below The Sleepy Inn' },
      { flag: 'found_flower_2', label: 'Pick up Night-Bloom #2 in the northeast garden lawn' },
      { flag: 'completed_rosa_quest', label: 'Return to Rosa inside the Flower Shop' },
    ],
    completedFlag: 'completed_rosa_quest',
    isMain: false,
  },
  {
    id: 'side_postie_mail',
    title: 'Odd Job: Fragile — Ego Inside',
    giver: 'Postie',
    chapter: 'Chapter 2 (Odd Job)',
    description: 'Deliver a very delicate package labeled "FRAGILE: EGO INSIDE" to a guest at The Sleepy Inn.',
    steps: [
      { flag: 'talked_postie', label: 'Enter the Post Office (South) & speak with Postie' },
      { flag: 'delivered_ego_package', label: 'Deliver the parcel to Barnaby at the right table inside The Sleepy Inn' },
      { flag: 'completed_postie_quest', label: 'Return to Postie to hear a clue about the Unsent Letter' },
    ],
    completedFlag: 'completed_postie_quest',
    isMain: false,
  },
  {
    id: 'main_arcade',
    title: 'Chapter 3: The Clockwork Arcade',
    giver: 'Tock the Clockmaker',
    chapter: 'Chapter 3',
    description: 'Win 3 Power Batteries in the arcade cabinet and solve the 4-Symbol Star Vault.',
    steps: [
      { flag: 'arcade_minigame_won', label: 'Play the "GEAR RUNNER" cabinet (top-left) & collect 3 Batteries' },
      { flag: 'arcade_puzzle_solved', label: 'Align the Star Vault dials: SUN -> MOON -> STAR -> ENVELOPE' },
      { flag: 'fragment_3', label: 'Collect Memory Fragment #3 in the center of the Arcade' },
      { flag: 'entered_winter', label: 'Enter the East Door to reach the Winter Village (Chapter 4)' },
    ],
    completedFlag: 'entered_winter',
    isMain: true,
  },
  {
    id: 'main_winter',
    title: 'Chapter 4: The Quiet Side of Winter',
    giver: 'The Keeper',
    chapter: 'Chapter 4',
    description: 'Investigate the clues in the moonlit snow, claim Fragment #4, and meet The Keeper outside the cabin.',
    steps: [
      { flag: 'winter_clue_ticket', label: 'Inspect the punched train ticket near the snow lantern (Southwest)' },
      { flag: 'winter_clue_photo', label: 'Inspect the faded photograph on the frozen well (Center)' },
      { flag: 'winter_clue_star', label: 'Inspect the constellation sketch on the wooden signpost' },
      { flag: 'fragment_4', label: 'Collect Memory Fragment #4 in front of the Winter Cabin porch' },
      { flag: 'fragment_5', label: 'Speak with The Keeper to receive Fragment #5 (The Unfinished Picture)' },
      { flag: 'entered_mountain', label: 'Pass through the Mountain Gate on the far right toward the Observatory' },
    ],
    completedFlag: 'entered_mountain',
    isMain: true,
  },
  {
    id: 'main_observatory',
    title: 'Chapter 5: The Place at the End',
    giver: 'The Keeper & Allan',
    chapter: 'Chapter 5',
    description: 'Climb the starlit mountain to the Grand Observatory, ignite the 4 Constellation Lights, and meet the creator of this world.',
    steps: [
      { flag: 'reached_observatory', label: 'Climb to the summit on the far right & enter the Observatory Dome' },
      { flag: 'observatory_puzzle_solved', label: 'Ignite the 4 Constellation Lights at the Center Altar' },
      { flag: 'allan_reveal_complete', label: 'Witness The Keeper’s reveal & speak with Allan' },
    ],
    completedFlag: 'allan_reveal_complete',
    isMain: true,
  },
];

export const PROLOGUE_LETTER_TEXT = [
  'Dear Raynio,',
  'If you’re reading this, the train actually stopped where it was supposed to.',
  'Welcome to Somewhere Town.',
  'Find the six Memory Fragments. Follow the stars. And whatever you do, do not trust the town guide with anything requiring basic competence.',
  '— Someone who knows you better than this town deserves to.',
];

export const FINAL_ALLAN_LETTER_PAGES: string[][] = [
  [
    'Dear Raynio,',
    'If you made it all the way up to this Observatory, it means you survived a dusk train that arbitrarily changed your outfit into knight armor, a unionizing loaf of sourdough bread, Mayor Cat spoiling the plot every five seconds, and Mallow’s questionable work ethic.',
    'What The Keeper told you a moment ago is true: sometimes it really is much easier to build a whole little world from scratch than to fit everything into ordinary sentences.',
    'So I built this little world for you instead.',
  ],
  [
    'It’s funny how paths cross in life. Some chapters are loud, some are quiet, and some leave behind small, bright things that only make sense once time has passed.',
    'Through this little adventure, I simply wanted you to know—without weight, without awkwardness, and without asking for anything in return—how genuinely grateful I am that our paths ever crossed.',
    '“Some things don’t need to be brought back to still mean something.” Every good memory, every ridiculous joke, and every bit of warmth still matters just as it is.',
  ],
  [
    'You are the protagonist of your own story, moving at your own pace toward all the bright chapters waiting ahead of you.',
    'My wish for you on your birthday is simple: may your days be filled with easy laughter, quiet peace whenever you need rest, moments that make you proud of who you are, and people who appreciate every little thing that makes you, you.',
    'Because you deserve good things, Raynio—simply for being yourself.',
  ],
  [
    'Happy Birthday, Raynio.',
    'I’m so happy to be a part of your life. I’ll love you forever.',
    'Thank you for walking all the way to the end of this little world I made for you. Keep the stars you collected, forgive Mallow for complaining about his salary, and have the happiest year ahead.',
    'With all my heart,',
    '— Allan',
  ],
];
