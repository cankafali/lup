import { openStatus as copy } from "@/content/copy";
import { site } from "@/content/site";

const WEEKDAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: site.hours.timeZone,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const toMinutes = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** İstanbul saatine göre haftanın günü (0 = Pazar) ve gün içindeki dakika. */
function istanbulClock(now: Date) {
  const parts = Object.fromEntries(clock.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    day: WEEKDAY[parts.weekday ?? ""] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/**
 * Europe/Istanbul saatine göre açık/kapalı. Salı–Cumartesi 10:00–19:00; Pazar ve Pazartesi kapalı.
 * Kapalıyken bir sonraki açılış günü söylenir (bugün açılıştan önceyse bugün).
 */
export function getOpenStatus(now = new Date()): { open: boolean; label: string } {
  const { day, minutes } = istanbulClock(now);
  const openDays: readonly number[] = site.hours.open;
  const from = toMinutes(site.hours.from);
  const to = toMinutes(site.hours.to);
  const openToday = openDays.includes(day);

  if (openToday && minutes >= from && minutes < to) return { open: true, label: copy.open };

  let next = day;
  if (!(openToday && minutes < from)) {
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (openDays.includes(d)) {
        next = d;
        break;
      }
    }
  }
  return { open: false, label: copy.closed(copy.days[next] ?? "") };
}
