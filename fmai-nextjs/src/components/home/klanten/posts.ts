// The posts on the client cards, shared by the home (#klanten), the hub and the SKC case:
// [image in public/home/klanten, message key under home.klanten, posted on].
// Dates are the posted_at of the real posts in content_schedule (checked 2026-11-10). The Sindy and
// Mintenz covers are fma-app rows 84339/84340, scheduled for 12 Nov and shown before posting on Daley's call.
export const SKC_POSTS = [
  ['skc-sindy-kennismaking', 'n3', '2026-11-12'],
  ['skc-shop-mintenz', 'n2', '2026-11-12'],
  ['skc-club-boodschappen', 'n1', '2026-10-27'],
] as const
export const SL_POSTS = [
  ['sl-not-right-now', 'n5', '2026-10-27'],
  ['sl-every-reply', 'n6', '2026-10-22'],
] as const
