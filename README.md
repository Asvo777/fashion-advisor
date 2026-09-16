# wardrobe-keeper

## What this is

An app that recommends what to wear each morning, based on:
- The user's own virtual clothes library (tops, bottoms, feet, headwear, special items)
- Current weather at the user's location
- Learned personal style preferences, built up over time from swipe feedback (like Tinder, but for outfits)

The user swipes through up to 10 daily outfit suggestions, picks one as their "outfit of the day" (worn by their avatar until midnight), and the app gets better at picking outfits the more they use it.

## Problem it solves

Deciding what to wear every morning takes time and mental energy. This app removes that decision by doing it automatically — factoring in comfort, weather appropriateness, and the user's actual taste (not just what "looks good" generically).

## Development approach

Built iteratively using Agile: each iteration below produces a working, demoable version of the app with more capability than the last. Nothing is built before the iteration that actually needs it (no ML before there's data to train on, no real weather API before the outfit logic is proven with presets, no avatar graphics before the recommendation engine works).

---

## Deliverables & Timeline

**Assumptions:** solo developer, beginner, ~3 hours/day, every day. Dates are estimates — expect some slip, especially around Iteration 1 (environment setup + learning curve) and Iteration 6 (ML is the hardest iteration). Treat each date as a checkpoint to reassess, not a hard deadline to stress over.

Start date: **September 16, 2026**

### Deliverable 1 — Walking Skeleton
**Target: September 16 – October 6, 2026 (3 weeks)**

- [ ] Project scaffolded (repo, folder structure, chosen stack running "hello world")
- [ ] Data model implemented: User, ClothingItem (+ subtypes), Outfit
- [ ] Onboarding flow: profile fields (age, gender, body type, location) + minimum clothes check
- [ ] Fake weather function (hardcoded presets: hot/cold/rainy/snowy/sunny)
- [ ] Rule-based generator producing **one** valid outfit respecting composition rules
- [ ] Outfit displayed as plain text/labels (no graphics, no swipe UI)

**Definition of done:** you can create a profile, add minimum clothes, and see one sensible outfit suggestion for a chosen weather preset.

### Deliverable 2 — Batch Recommendations + Swipe
**Target: October 7 – October 20, 2026 (2 weeks)**

- [ ] Generator produces up to 10 distinct valid outfits per batch
- [ ] Swipe UI (like/dislike), updates outfit status
- [ ] "Select as outfit of the day" action, switchable anytime that day
- [ ] Still using preset weather

**Definition of done:** you can swipe through a batch and lock in an outfit of the day.

### Deliverable 3 — Real Weather + Daily Reset Cycle
**Target: October 21 – November 3, 2026 (2 weeks)**

- [ ] Real weather API integrated via the user's location
- [ ] WearLog implemented: archives OOTD + liked outfits at midnight, purges entries older than 7 days
- [ ] "Worn yesterday" deprioritization in the generator
- [ ] Full daily cycle (avatar reset, new batch generated) matching the state machine

**Definition of done:** the app runs on real weather and correctly resets each night without manual intervention.

### Deliverable 4 — Custom Outfits + Edge Cases
**Target: November 4 – November 14, 2026 (~1.5 weeks)**

- [ ] Manual outfit builder from the user's library (same composition rules enforced)
- [ ] Handles: too few clothes for a full batch, no valid outfit for extreme weather, multiple outfit switches per day
- [ ] Basic validation feedback to the user

**Definition of done:** the app doesn't break or behave strangely under realistic edge cases.

### Deliverable 5 — Heuristic Personalization (v1)
**Target: November 15 – November 28, 2026 (2 weeks)**

- [ ] UserPreferenceProfile: weighted scoring per attribute (color, category, warmth, pattern) from like/dislike counts
- [ ] Batch ranked by preference score instead of pure rules/randomness

**Definition of done:** the outfit order visibly shifts toward your taste as you keep swiping.

### Deliverable 6 — Full ML Personalization
**Target: November 29 – December 19, 2026 (3 weeks)**

- [ ] Heuristic scorer replaced with a trained model (logistic regression or gradient-boosted trees) on swipe history
- [ ] Online/incremental retraining as new swipes come in
- [ ] Exploration vs. exploitation mixed into batch ranking (avoids repetitive suggestions)
- [ ] Feature engineering pass on clothing + weather + day-of-week attributes
- [ ] Simple evaluation metric tracked (e.g., week-over-week like-rate)

**Definition of done:** recommendations are model-driven, measurably improving, and not stuck in a rut.

### Deliverable 7 — Avatar Visualization + Polish
**Target: December 20, 2026 – January 9, 2027 (3 weeks, expect slower pace over the holidays)**

- [ ] 2D avatar rendering with layered clothing (head/outer top/inner top/bottom/feet)
- [ ] Size attribute reflected visually (slim → baggy)
- [ ] Stats/habit view from WearLog (most/least worn, streaks)
- [ ] UI polish: animations, empty states, error/fallback states
- [ ] Basic settings: edit profile, edit/delete clothes, mark item unavailable

**Definition of done:** the app looks and feels like a real demoable product.

**Estimated full timeline: ~16 weeks (Sept 16, 2026 → early January 2027).**

---

## Future Upgrades (post-demo, not scheduled)

- Multi-user support + authentication
- Weather forecasting (plan for tomorrow, not just today)
- Occasion-aware suggestions (calendar integration)
- Wardrobe gap suggestions ("you have no warm jackets")
- Social features (sharing, comparing outfits with friends)
- Seasonal wardrobe rotation

