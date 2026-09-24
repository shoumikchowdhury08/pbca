import { CalendarCheck, HeartHandshake, Users } from "lucide-react";

/**
 * The benefit cards on the Membership page. Titles and copy are fixed in code;
 * each card's photo comes from the Membership gallery in the admin portal: the
 * first N published images (ordered by sortOrder, then creation time) map onto
 * these first N cards, so swapping a card image never needs a code change.
 */
export const MEMBERSHIP_BENEFIT_CARDS = [
  {
    icon: Users,
    title: "United in Celebration",
    text: "Meet families, artists, volunteers, and friends: the people who make PBCA feel like home.",
  },
  {
    icon: HeartHandshake,
    title: "Come and Connect",
    text: "Support the traditions and community programs that bring us together and keep our culture alive",
  },
  {
    icon: CalendarCheck,
    title: "Celebrations All Year Long",
    text: "Join us for meetings, gatherings and celebrations beyond the five days of puja.",
  },
] as const;
