// Display name for a track. File-derived titles look like "Lauv   I Like Me Better [Official Audio]"
// (the hyphen became a gap): drop the bracketed tags and split "artist   title" on the gap.
export function trackLabel(track) {
  if (!track) return null;
  const clean = track.title.replace(/\s*[[(][^\])]*[\])]/g, '').trim();
  const parts = clean.split(/\s{2,}/);
  let artist = track.artist && track.artist !== 'Unknown' ? track.artist : null;
  let title = clean;
  if (parts.length > 1) {
    artist = artist || parts[0];
    title = parts.slice(1).join(' ');
  }
  return { title: title.trim(), artist };
}
