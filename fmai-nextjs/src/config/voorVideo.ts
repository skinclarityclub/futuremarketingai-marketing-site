// shortcut: film r3 (5 min) served as HLS from a public Supabase bucket so prospects see the real film now;
// move to Bunny Stream when plan A Task 11 lands. version stays 'stil-1' because the app accepts only that value.
export const voorVideo = {
  version: 'stil-1',
  cdnOrigin: 'https://nurdldgqxseunotmygzn.supabase.co',
  hlsUrl: 'https://nurdldgqxseunotmygzn.supabase.co/storage/v1/object/public/voor-video/outreach-r3/playlist.m3u8',
}
