export type Project = {
  image: string
  /** Page that opens when the card is clicked. */
  url: string
}

export const PROJECTS: Project[] = [
  { image: '/wind.png', url: 'https://para-wind.silaskierstein.com/' },
  { image: '/grove.png', url: 'https://grove.silaskierstein.com/' },
  { image: '/xr-drumming-game.png', url: 'https://viewer.amfitrack.com/demos/drum-kit' },
  { image: '/glass.png', url: 'https://glass.silaskierstein.com/' },
  { image: '/SDF-painting.png', url: 'https://sdf-paint.silaskierstein.com/' },
  { image: '/amfitrack-web.png', url: 'https://viewer.amfitrack.com/' },
  { image: '/lusion-dicks.png', url: 'https://dicks.silaskierstein.com/' },
  { image: '/steve.png', url: 'https://steve.silaskierstein.com/' },
  { image: '/audio-viz.png', url: 'https://disco.silaskierstein.com/' },
  { image: '/cloth.png', url: 'https://cloth.silaskierstein.com/' },
  { image: '/ascii.png', url: 'https://ascii.silaskierstein.com/' },
]

export const IMAGES = PROJECTS.map((p) => p.image)
