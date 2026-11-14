# Device Art Card

**Animated, realistic device drawings for your Home Assistant dashboard.** **1,528 drawings** in **17 categories** and 106 groups:
lights, fans, appliances, locks, sensors, plants and more. Builder cards and plant/tree builders add thousands more combinations. Each one comes alive with your device's state: lamps glow in the bulb's color, fans spin with their speed, washers
show their cycle and doors open.

![Fans](docs/images/anim-fans.gif)
![Lights and glow](docs/images/anim-lights.gif)
![Things that move](docs/images/anim-home.gif)

## What's new

**Update 2: people, pets and habitats** (57 new drawings, now **1,528** in all)

![People](docs/images/new-people.png)

- **People:** adult, older, teen, young boy and girl, toddler and baby. Pick the outfit (casual, business,
  business casual, formal, workout, nightwear, outdoor, hoodie, work uniform and more), hair style and color, facial hair,
  glasses, height, build, skin tone, mobility (cane, walker, wheelchair) and view (face, portrait, half body, full body).
  Each person follows a `person` entity: home, away or a zone.
- **Dogs & cats:** 10 dog breeds and 4 cats with a GPS collar and battery level. Pick the activity (resting, sleeping,
  walking, playing, eating), the zone, and the coat and collar colors.
- **Reptile & pet habitats:** 19 enclosures (gecko, chameleon, python, bearded dragon, bioactive, frog, tortoise, turtle,
  axolotl, tarantula, birds, hamsters, rabbits, incubator and brooder). Each shows temperature and humidity that turn
  amber or red outside the animal's safe range. Heat lamp, UVB, mister and more each switch on their own.
- **Chicken coops:** 14 coops and pieces of gear, showing the water level and coop temperature, with an auto door,
  heat lamp, light and waterer heater.

![One person, many looks](docs/images/options-people-man.png)
![Dogs and cats](docs/images/anim-pets.gif)
![Habitats and coops](docs/images/anim-habitats.gif)

**How many looks?** The menus alone make **over 59 million** combinations (most of them from the people). Counting the
preset color dots too, that's **over 4 billion**, and every drawing with a color picker takes any color on top of that. The
plant and tree builders add 1,620 more plant-and-pot combinations.

**Update 1:** the first release, with 1,471 drawings in 16 categories.

---

**[Browse the full gallery →](https://almulder.github.io/ha-device-art/)** It has every drawing, live, with all its options.
Pick a look, then press **Copy YAML** to get a card ready to paste.

---

## What you can change

Almost everything on a drawing can be set. The pictures below show only a few of the possibilities.

| Option | What it does |
|---|---|
| **Background on or off** (`scenery: false`) | Hides the wall, floor, counter or yard so the device stands alone and blends into any card or theme. |
| **On / off** | Follows your entity: lights glow, fans spin, appliances run, doors open, locks lock. |
| **Level** | Follows brightness, fan speed, cover position, volume or any number: dims lamps, speeds fans, fills tanks, opens blinds. |
| **Color** (`color`) | The main color: a light's color (it follows a color bulb automatically), or a body, finish, fabric or flower color. |
| **Second color** (`color2`) | A second part: lamp shades and globes, switch LEDs, fireplace surrounds, cooktop glass, doorbell rings. |
| **Parts** (`parts`) | Parts of one device that switch on their own, each from its own entity: microwave, light and fan on an over-the-range microwave; oven and each burner on a range; washer and dryer in a pair. |
| **Menus** (`options`) | Pick a look or a state: fridge style, washer cycle (wash, rinse, spin), range fuel and burners, outlet region (US, EU, UK, AU and more), fireplace surround and many more. Menus can follow an entity too (`options_from`). |
| **Animation** (`animate: false`) | Still pictures only. Animation also turns off by itself when your device asks for reduced motion. |
| **Name and state** (`show_name`, `show_state`, `name`) | Show or hide the label under the drawing. |
| **Tap** (`tap_action`) | `toggle`, `more-info` or `none`. |

### Background on or off

![Scenery on](docs/images/scenery-on.png)
![Scenery off](docs/images/scenery-off.png)

---

## Install

**HACS (recommended)**
1. HACS → ⋮ → **Custom repositories** → add `https://github.com/almulder/ha-device-art`, type **Dashboard**.
2. Install **Device Art Card**, then reload your browser.

**Getting updates:** HACS shows "Update available" for each new version. After updating, reload the page
(Ctrl+F5, or in the phone app: Settings → Companion App → Debugging → Reset frontend cache). To check your version,
open the browser console: it shows `DEVICE-ART-CARD v1.1.0`.

**Manual**
1. Copy `dist/ha-device-art.js` to `config/www/`.
2. Settings → Dashboards → ⋮ → **Resources** → add `/local/ha-device-art.js` as a **JavaScript module**.

---

## Use it

Add a **Manual** card and paste. The easiest way: open the [gallery](https://almulder.github.io/ha-device-art/), set the look,
press **Copy YAML**, then change `entity`.

```yaml
# a lamp that glows in your bulb's color and dims with it
type: custom:device-art-card
art: pendant/globe
entity: light.dining_pendant
```

```yaml
# a fan that spins with its speed, no background
type: custom:device-art-card
art: ceilingfan/classic
entity: fan.bedroom
scenery: false
```

```yaml
# a washer and dryer pair: each machine from its own entity, the cycle from a sensor
type: custom:device-art-card
art: laundrycfg/cfgscreen
options: { mach: both, layout: stack, ped: none }
parts:
  washer: switch.washer_running
  dryer: switch.dryer_running
options_from:
  wcyc:
    entity: sensor.washer_job_state
    map: { wash: wash, rinse: rinse, spin: spin, finished: done }
```

```yaml
# an over-the-range microwave: microwave, light and fan each on their own
type: custom:device-art-card
art: rangecfg/cfg-otrglass
parts:
  mw: switch.microwave
  light: light.hood_light
  fan: fan.hood_fan
```

Menu ids and values are shown in the gallery's **Copy YAML** output for each drawing.

### All settings

| Key | Example | Notes |
|---|---|---|
| `art` | `pendant/globe` | Required. The drawing (`set/drawing`); the gallery shows each one. |
| `entity` | `light.kitchen` | Drives on/off, level and (for lights) color. |
| `name`, `show_name`, `show_state` | `Kitchen`, `true`, `true` | The label under the drawing. |
| `color`, `color2` | `"#ffd27a"` | Override the colors. |
| `options` | `{ style: flex4 }` | Fixed menu choices. |
| `options_from` | `{ cycle: sensor.x }` or `{ cycle: { entity, map } }` | Menu choices that follow an entity's state. |
| `parts` | `{ fan: fan.hood }` | Part id → entity. Parts without an entity follow the main one. |
| `level`, `level_attribute`, `min`, `max` | `0.6`, `percentage`, `0`, `100` | Fixed level, or where to read it from. |
| `on_states`, `on_above` | `[running, heating]`, `5` | What counts as "on" (default: on, open, playing, heating, cleaning, running and similar). |
| `scenery` | `false` | Background off. |
| `animate` | `false` | Still picture. |
| `tap_action` | `toggle` | `toggle`, `more-info` or `none`. |
| `plant`, `pot`, `pot_color` | plant builder | Pick any plant and pot (see Plants below). |

---

## Builder cards: one card, many looks

Some cards are builders: pick the style, layout and extras from menus, and the drawing changes to match. The grids below show
**a few of the combinations, not all of them.** Every color, finish and menu can be mixed, and most drawings take any color.

**Fridge builder.** Side by side, French door, 4-door flex, 2 doors + 2 drawers, top or bottom freezer, column pair; door screen; ice and water dispenser; glass door.
![Fridge builder](docs/images/options-fridgecfg-steel.png)
![Fridge builder, glass panels](docs/images/options-fridgecfg-glasspanel.png)

**Washer & dryer builder.** Washer, dryer or both; side by side or stacked; pedestal; wash, rinse, spin and dry cycles.
![Washer and dryer builder](docs/images/options-laundrycfg-cfgscreen.png)
![Washer and dryer cycles](docs/images/anim-laundry.gif)

**Range builder.** Gas, coil, glass or induction; freestanding or slide-in; 4 to 6 burners; single or double oven; each burner and oven on its own.
![Range builder](docs/images/options-rangecfg-cfg-classic.png)

**Fireplaces.** Surround (brick, stacked stone, tile, painted, wood, marble) in any color, mantel, and flame color.
![Fireplace](docs/images/options-fireplace-insert.png)

**Plant & tree builder.** Any plant in any pot, in any pot and flower color; plants droop when they need water.
![Plant builder](docs/images/options-plantbuilder.png)

---

## Every category

A sample from each category, 1,528 drawings in all. The [gallery](https://almulder.github.io/ha-device-art/) has all of them.

| | |
|---|---|
| ![Lighting](docs/images/cat-lighting.png) | ![Lamps & accent lights](docs/images/cat-lamps.png) |
| ![Fans](docs/images/cat-fans.png) | ![Heating & cooling](docs/images/cat-climate.png) |
| ![Air quality](docs/images/cat-air.png) | ![Kitchen](docs/images/cat-kitchen.png) |
| ![Laundry & cleaning](docs/images/cat-cleaning.png) | ![Entertainment](docs/images/cat-entertainment.png) |
| ![Computers & network](docs/images/cat-computers.png) | ![Security & access](docs/images/cat-security.png) |
| ![Sensors & switches](docs/images/cat-controls.png) | ![Power & energy](docs/images/cat-energy.png) |
| ![Water & plumbing](docs/images/cat-water.png) | ![Outdoor, pool & yard](docs/images/cat-outdoor.png) |
| ![Plants](docs/images/cat-plants.png) | ![Home, pets & fitness](docs/images/cat-home.png) |
| ![People & pets](docs/images/cat-people.png) | |

---

## License

Free to use: code and artwork are under the [MIT License](LICENSE). Use them, change them and share them, including in your own
projects. Just keep the license notice.

## Disclaimer

All drawings in this project are original artwork, made from scratch. They are generic illustrations of common household devices.
Any resemblance to a real brand, product, model, trade dress or trademark is coincidental, a result of drawing everyday objects
realistically. This project is **not affiliated with, endorsed by, sponsored by or connected to** any manufacturer, brand or
company, including Home Assistant / Nabu Casa. All product and company names belong to their owners. None are used here.

The software is provided "as is", without warranty of any kind.
