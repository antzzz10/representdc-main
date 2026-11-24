// The photo at the top of the News page. One place for the picture, its caption and its
// credit, so they change together.
//
// The caption says what the photo shows and when it was taken relative to the vote: the
// photo is from three weeks before the vote, not of it (Andria's wording, 2026-11-24). The
// vote, H.R. 51 passing the House 216 to 208 on April 22, 2021, was checked against the
// House Clerk's record (roll call 132 of 2021) on 2026-11-24.
//
// Licence: CC BY-SA 2.0, which needs the work's title, the photographer's name, a link to
// the licence and a note of changes. The cropped picture is offered under the same licence. The file was resized and is cropped by the page. Source and licence
// were read on its Wikimedia Commons page on 2026-11-24. Changing the picture means
// checking the new one's licence the same way.
import photo from '../assets/news/anthem-statehood-now-2021.jpg'

export const NEWS_PHOTO = {
  src: photo,
  width: 1600,
  height: 1044,
  alt: 'A theater marquee in Washington that reads "D.C. Statehood Now", under a sign for The Anthem.',
  caption:
    'Marquee at The Anthem, three weeks before the House passed the D.C. statehood bill for the second time on April 22, 2021.',
  credit: {
    // The title its photographer gave it, which the licence asks to be shown.
    title: 'The Anthem, Washington, DC 2021 - Statehood Now',
    name: 'Elvert Barnes',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Anthem,_Washington,_DC_2021_-_Statehood_Now.jpg',
    licence: 'CC BY-SA 2.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    changes: 'cropped',
  },
}
