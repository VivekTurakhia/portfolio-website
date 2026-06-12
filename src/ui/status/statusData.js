/**
 * Manually-maintained content for the status dashboard (Monitor B).
 * Edit this file to update what the monitor shows.
 */
export const statusData = {
  contact: {
    email: 'vivekct2@illinois.edu',
    linkedinUrl: 'https://www.linkedin.com/in/vivek-turakhia/',
    linkedinHandle: 'in/vivek-turakhia',
  },

  // Updated by hand — swap when you start a new book.
  reading: {
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441172719', // drives the Open Library cover image
    progress: 0.35, // 0..1
  },

  // Shown when the Spotify API isn't configured/reachable (e.g. local dev).
  fallbackTrack: {
    isPlaying: false,
    track: 'Spotify not connected',
    artist: 'configure api/spotify-now-playing',
    albumArt: null,
    url: null,
  },

  statusLine: "CE @ UIUC '27 · open to SWE '27",
}
