// shortcut: film kort-2 (2:33) served as HLS from a public Supabase bucket; move to Bunny Stream when egress
// starts to count. outreach-kort-1/ and outreach-r3/ stay in the bucket as the way back. The app must list a version before it goes here.
export const voorVideo = {
  version: 'kort-2',
  cdnOrigin: 'https://nurdldgqxseunotmygzn.supabase.co',
  hlsUrl: 'https://nurdldgqxseunotmygzn.supabase.co/storage/v1/object/public/voor-video/outreach-kort-2/playlist.m3u8',
}
