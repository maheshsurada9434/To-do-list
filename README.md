# Card Float Planner

A single-page, no-install web app that tells you **which credit card to use on any given day** to get the longest interest-free period — and reminds you before every payment is due.

**Live app:** https://maheshsurada9434.github.io/To-do-list/

No build step, no server, no dependencies — open `index.html` in any browser or host it on GitHub Pages.

## Install on your phone

- **Android (Chrome):** open the live app and tap **Install app** at the top (or ⋮ menu → *Install app*).
- **iPhone (Safari):** open the live app, tap **Share** → **Add to Home Screen** → **Add**.

It opens full screen like a normal app and keeps working offline.

## Features

- **Planner** – your best card for today, shown as a real-looking credit card. Swipe the 3-week day strip to see the best card for any upcoming day, add an amount to skip cards without enough free limit, and see every card ranked by interest-free days.
- **Calendar** – the best card for each day of the month, colour-coded by float length, with dots on payment due dates. Tap a day to open it in the planner.
- **Spends** – log purchases (auto-assigned to the best card or picked manually), including EMI conversions. Shows statements that need paying, with one-tap **Mark paid**, current-cycle totals and limit usage per card.
- **Cards** – add, edit and delete cards. Statement day 29–31 is handled correctly in shorter months.
- **Reminders** – a *Due soon* list on the Planner shows payments due in the next 5 days (or overdue), plus a badge on the Spends tab.
- **Your data stays yours** – everything is saved automatically in the browser (`localStorage`). Export / import a JSON backup from the Cards tab to move between devices.
- **Premium card view** – the best card is shown as a realistic credit card (chip, contactless mark, embossed dates) in the colour you pick for each card.
- Dark mode, mobile-first layout, keyboard and screen-reader friendly.

## How the math works

| Term | Meaning |
| --- | --- |
| Statement day | Day of the month the bill is generated. Spends on that day are included in it. |
| Grace period | Days from the statement date to the payment due date. |
| Float | Days from the spend date to the due date of the statement it lands in. |

A spend made the day *after* a card's statement date gets the maximum float (about one month + grace period).

**EMI spends** bill one installment on each statement, starting with the statement the purchase lands in. The unpaid principal keeps counting against your limit until the matching statements are marked paid.

## Privacy

Nothing leaves your device. There is no server, analytics or tracking.

## Also in this repo: Doable

[`doable/`](doable/) is an advanced, offline to-do app. You type tasks in plain English, and it picks up dates, times, #tags, !priority and repeats. It also has subtasks, a focus timer and lists. It installs to your home screen like Card Float.

**Live:** https://maheshsurada9434.github.io/To-do-list/doable/

