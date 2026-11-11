// shortcut: film kort-1 (3 min) served as HLS from a public Supabase bucket; move to Bunny Stream when egress
// starts to count. outreach-r3/ stays in the bucket as the way back. The app must list a version before it goes here.
export const voorVideo = {
  version: 'kort-1',
  cdnOrigin: 'https://nurdldgqxseunotmygzn.supabase.co',
  hlsUrl: 'https://nurdldgqxseunotmygzn.supabase.co/storage/v1/object/public/voor-video/outreach-kort-1/playlist.m3u8',
}
