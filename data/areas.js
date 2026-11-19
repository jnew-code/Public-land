/* Texas Public Land Guide (working name) — data file.
   Everything here comes from TPWD pages unless marked otherwise. Structure notes:
   - SOURCES: one place for every TPWD link. Facts point at them with `src: ["id", ...]`.
   - areas[].hunting.status: "verified" | "placeholder". Placeholder rows render with
     the visible label "PLACEHOLDER: awaiting data".
   - Hunting Bot data can be dropped into data/hunting-bot.js (see README) and is merged
     over areas[].hunting by area id at load time.
   - areas[].fishing.fields use null for "Not stated in official sources".
*/
window.WMA_DATA = {
  meta: {
    workingName: "Texas Public Land Guide",
    lastVerified: "2026-11-18",
    seasonYear: "2026-27",
    disclaimer: "Rules change every season. Verify with TPWD. Not legal advice.",
    distanceNote: "Approximate straight-line miles from the town center (my estimate, not driving time or a TPWD figure). Check the TPWD directions link before you drive."
  },

  SOURCES: {
    aph:        { label: "TPWD: Annual Public Hunting (APH) permit / walk-in hunts 2026-27", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/" },
    aphSearch:  { label: "TPWD: Search for an Area or Legal Game (APH)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/search.phtml" },
    aphData:    { label: "TPWD: APH 2026-27 area data file (aph_202627.json)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/data/aph_202627.json" },
    drawn:      { label: "TPWD: Drawn hunts (how to apply)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/" },
    permits:    { label: "TPWD: Permits", url: "https://tpwd.texas.gov/business/permits/" },
    huntLic:    { label: "TPWD: Outdoor Annual, hunting regulations", url: "https://tpwd.texas.gov/regulations/outdoor-annual/hunting/" },
    seasonsCty: { label: "TPWD: Outdoor Annual, seasons by county", url: "https://tpwd.texas.gov/regulations/outdoor-annual/hunting/seasons/county-listing/" },
    fishRegs:   { label: "TPWD: Outdoor Annual, fishing regulations", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/" },
    licenses:   { label: "TPWD: Buy a license online", url: "https://tpwd.texas.gov/business/licenses/online_sales/" },

    lwPark:     { label: "TPWD: Lake Whitney State Park", url: "https://tpwd.texas.gov/state-parks/lake-whitney" },
    lwAlert:    { label: "TPWD: Lake Whitney State Park alerts (closures)", url: "https://tpwd.texas.gov/state-parks/lake-whitney/alert" },
    lwHunt:     { label: "TPWD: Lake Whitney SP drawn-hunt details", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/hunt-area-details.phtml?OArea=LW" },
    lwBrochure: { label: "TPWD: Lake Whitney SP hunt brochure (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/brochures/ALLLW.pdf" },
    lwFish:     { label: "TPWD: Fishing Lake Whitney", url: "https://tpwd.texas.gov/fishboat/fish/recreational/lakes/whitney/" },
    lwMap:      { label: "TPWD: Lake Whitney SP park map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_019f.pdf" },
    lwTrails:   { label: "TPWD: Lake Whitney SP trails map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_0019s.pdf" },
    lwGis:      { label: "TPWD: Lake Whitney SP interactive trail map", url: "https://tpwd.texas.gov/spdest/parkinfo/maps/gis/lake_whitney/" },

    dvPark:     { label: "TPWD: Dinosaur Valley State Park", url: "https://tpwd.texas.gov/state-parks/dinosaur-valley" },
    dvHunt:     { label: "TPWD: Dinosaur Valley SP drawn-hunt details", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/hunt-area-details.phtml?OArea=DV" },
    dvMap:      { label: "TPWD: Dinosaur Valley SP park map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_094r.pdf" },
    dvTrails:   { label: "TPWD: Dinosaur Valley SP trails map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_0094s.pdf" },

    svHunt:     { label: "TPWD: Somerville PHL Unit 711 + Flag Pond Unit 1121, 2026-27 APH map/legal game (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/711_1121.pdf" },
    svWma:      { label: "TPWD: Somerville WMA leaflet and map (PDF; printed 2003, so rules text may be older than the 2026-27 unit page)", url: "https://tpwd.texas.gov/huntwild/hunt/wma/images/somerville_wma_map.pdf" },
    svFish:     { label: "TPWD: Fishing Lake Somerville", url: "https://tpwd.texas.gov/fishboat/fish/recreational/lakes/somerville/" },
    svAccess:   { label: "TPWD: Lake Somerville access (ramps and parks)", url: "https://tpwd.texas.gov/fishboat/fish/recreational/lakes/somerville/access.phtml" },
    svPark:     { label: "TPWD: Lake Somerville State Park & Trailway", url: "https://tpwd.texas.gov/state-parks/lake-somerville" },
    svNailsHunt:{ label: "TPWD: Lake Somerville SP Nails Creek hunt brochure (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/brochures/ALLSS.pdf" },

    lumHunt:    { label: "TPWD: Luminant Texas Unit 607, 2026-27 APH map/legal game (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/607.pdf" },

    kcWma:      { label: "TPWD: Keechi Creek WMA", url: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?id=11" },
    kcHunt:     { label: "TPWD: Keechi Creek WMA drawn-hunt details", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/hunt-area-details.phtml?OArea=KC" },

    mlHunt:     { label: "TPWD: Marlin Lake Park Unit 2547, 2026-27 APH map/legal game (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/2547.pdf" },

    fbPark:     { label: "TPWD: Fort Boggy State Park", url: "https://tpwd.texas.gov/state-parks/fort-boggy" },
    fbHunt:     { label: "TPWD: Fort Boggy SP drawn-hunt details", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/hunt-area-details.phtml?OArea=FB" },
    fbFish:     { label: "TPWD: Fort Boggy SP fishing tip sheet (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/pwd_lf_p4503_0146b.pdf" },
    fbMap:      { label: "TPWD: Fort Boggy SP park map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_146.pdf" },

    jdWma:      { label: "TPWD: J.D. Murphree WMA", url: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?id=40" },
    jdFish:     { label: "TPWD: J.D. Murphree WMA, fishing", url: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?activity=fishing&id=40" },
    jdRules:    { label: "TPWD: J.D. Murphree WMA, rules", url: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?id=40&section=rules" },
    jdN:        { label: "TPWD: J.D. Murphree WMA Big Hill Unit 783N, 2026-27 (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/783N.pdf" },
    jdS:        { label: "TPWD: J.D. Murphree WMA Salt Bayou Unit 783S, 2026-27 (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/783S.pdf" },
    flounder:   { label: "TPWD: Flounder bag and length limits", url: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/saltwater-fishing/bag-length-limits/flounder-bag-length-limits" }
  },

  areas: [
    /* ---------------------------------------------------------------- */
    {
      id: "lake-whitney-sp",
      name: "Lake Whitney State Park",
      kind: "State park (public hunt area)",
      county: "Hill",
      region: "v1",
      acres: "About 775 acres",
      address: "433 FM 1244, Whitney, TX 76692",
      phone: "(254) 694-3793",
      approxMiles: { clifton: 15, collegeStation: 110 },
      coordsRough: false,
      blurb: "Lake shore park on the Brazos arm of Lake Whitney. Hunting here is drawn-only deer and hog hunts; the park closes to the public during them. Good fishing for stripers, white bass and blue catfish.",
      accessTypes: ["drawn", "state-park"],
      accessLabel: "Drawn hunts only + state park entry for visiting",
      species: ["deer", "hog"],
      hasFishing: true,
      header: { type: "photo", key: "lake-whitney", alt: "Sunset over Lake Whitney, Texas", caption: "Lake Whitney (view near the state park)." },
      permits: [
        { label: "Drawn hunt permit (apply online by the deadline)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/", note: "Applications for the 2026-27 hunts closed Sept. 1 and Sept. 15, 2026. All adult hunters need an Annual Public Hunting (APH) permit to apply for the E-Postcard youth archery hunt." },
        { label: "Annual Public Hunting (APH) permit, $48", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/", note: "Only needed here to apply for the E-Postcard youth archery hunt." },
        { label: "State park entry (visiting / fishing), $5 adult, 12 and under free", url: "https://tpwd.texas.gov/state-parks/lake-whitney", note: "Reservations recommended; the park often reaches capacity." }
      ],
      quickFacts: { permit: "Drawn hunt permit (APH to apply to the youth archery hunt); state park entry to visit", access: "Drawn only for hunting; park entry for everyone else", species: "White-tailed deer, feral hogs", bestMonths: "Hunt dates: Dec. 7–11, 2026; Jan. 16–17 and Jan. 20–22, 2027 (see table)" },
      maps: [
        { label: "TPWD park map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_019f.pdf", src: ["lwMap"] },
        { label: "TPWD trails map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_0019s.pdf", src: ["lwTrails"] },
        { label: "TPWD interactive trail map", url: "https://tpwd.texas.gov/spdest/parkinfo/maps/gis/lake_whitney/", src: ["lwGis"] },
        { label: "TPWD drawn-hunt page (has TPWD's own map)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/hunt-area-details.phtml?OArea=LW", src: ["lwHunt"] }
      ],
      directions: { label: "TPWD park page: 'View map and directions'", url: "https://tpwd.texas.gov/state-parks/lake-whitney" },
      hunting: {
        status: "verified",
        summary: "Drawn hunts only (2026-27). Park is closed to non-hunters during hunts.",
        seasons: [
          { species: "White-tailed deer (gun, antlerless or spike buck)", season: "Dec. 7–9, Dec. 9–11, 2026 and Jan. 20–22, 2027", notes: "30 permits. Muzzleloaders .45 caliber or larger only. Assigned blind. Baiting allowed. $3 application plus $80 per adult permit; youth 8–16 $0. Applications closed Sept. 15, 2026.", src: ["lwHunt", "lwBrochure"], status: "verified" },
          { species: "White-tailed deer (E-Postcard youth archery)", season: "Jan. 16–17, 2027", notes: "10 permits. Youth 8–16 with a supervising adult 18+. All archery equipment. Assigned blind. Baiting allowed. $0. APH permit needed to apply. Applications closed Sept. 1, 2026.", src: ["lwHunt"], status: "verified" },
          { species: "Feral hogs", season: "During the drawn hunts above", notes: "Unlimited bag, but TPWD says hogs are in limited numbers.", src: ["lwHunt"], status: "verified" }
        ],
        orSpecies: []
      },
      zones: [],
      zonesNote: "No best-zone notes: none are supported by a TPWD source, so none are shown.",
      access: [
        { label: "Closures", text: "Park closed 5 p.m. Dec. 6 to 3 p.m. Dec. 11 and 5 p.m. Jan. 15 to 3 p.m. Jan. 22. Only permitted hunters are allowed on those dates.", src: ["lwAlert", "lwBrochure"] },
        { label: "Hours", text: "Gate 6 a.m. – 10 p.m.; office 8:30 a.m. – 4:30 p.m.", src: ["lwPark"] },
        { label: "Camping", text: "Sites with water only, water and electricity, or full hookups; screened shelters. Camping is available to permitted hunters at normal fees; showers and a dump station are in the camping area.", src: ["lwPark", "lwBrochure"] },
        { label: "Game care", text: "Cleaning and skinning facilities are available; there is no cold storage.", src: ["lwBrochure"] },
        { label: "Water access", text: "Boat ramp, fish cleaning shelter and loaner fishing gear.", src: ["lwPark"] },
        { label: "Contact", text: "(254) 694-3793 · LakeWhitneySP@tpwd.texas.gov", src: ["lwPark"] }
      ],
      fishing: {
        status: "verified-with-flags",
        intro: "Fishing Bot's draft was re-checked against the linked TPWD pages. Items that differ or could not be confirmed are flagged in the 'Check notes' list.",
        species: { text: "Largemouth and smallmouth bass; striped and white bass; channel, blue and flathead catfish; crappie. TPWD's survey table also lists sunfish.", src: ["lwFish"] },
        bestMonths: [
          { species: "Striped bass", text: "March–May is best (TPWD says some of the best striped bass fishing in the state).", src: ["lwFish"] },
          { species: "White bass", text: "River spawning run March–May; main lake April–November.", src: ["lwFish"] },
          { species: "Largemouth bass", text: "March–May for quality fish in 2–15 ft of water.", src: ["lwFish"] },
          { species: "Smallmouth bass", text: "Early March–May in rocky coves; fishing heats up again October–December. TPWD notes the fishery is still poor compared with the 1990s.", src: ["lwFish"] },
          { species: "Crappie", text: "March–April spawn is best.", src: ["lwFish"] },
          { species: "Catfish (channel, blue, flathead)", text: "Year-round; best April–June. Many anglers target trophy blues December–March.", src: ["lwFish"] }
        ],
        access: [
          { label: "Bank", text: "Shore fishing is allowed in the park (no license needed from shore, per TPWD).", src: ["lwPark"] },
          { label: "Boat ramp", text: "The park has a boat ramp.", src: ["lwPark"] },
          { label: "Kayak / paddle", text: null },
          { label: "Limits / seasonal closures", text: "All species follow statewide regulations. The park closes to the public during the drawn hunts (dates above). Golden alga blooms can occur and may hurt fishing.", src: ["lwFish", "lwAlert"] },
          { label: "Facilities", text: "Fish cleaning shelter; loaner gear; gate 6 a.m. – 10 p.m.", src: ["lwPark"] }
        ],
        license: [
          { label: "Fishing license", text: "Not needed to fish from shore in a state park. Whether one is needed from a boat is not stated on the linked TPWD pages.", src: ["lwPark"] },
          { label: "APH / LPU permit", text: null },
          { label: "Special harvest rules", text: "None stated; all species are managed under statewide regulations.", src: ["lwFish"] },
          { label: "Closures during hunts", text: "Dec. 6 (5 p.m.) – Dec. 11 (3 p.m.) and Jan. 15 (5 p.m.) – Jan. 22 (3 p.m.).", src: ["lwAlert"] }
        ],
        tips: [
          { text: "TPWD and 4-H volunteers placed three fish habitat reefs in coves along the park shore (six reefs total in the lake). TPWD's Habitat Structure Viewer lists them.", src: ["lwFish"] },
          { text: "Bank anglers do best below sand or gravel bars on the Nolan and Brazos rivers above the lake; in the main lake, windswept sandy beaches.", src: ["lwFish"] },
          { text: "Golden alga blooms can occur. Check bloom status with TPWD before you go.", src: ["lwFish"] },
          { text: "Reserve ahead: TPWD says the park often reaches capacity.", src: ["lwPark"] }
        ],
        checkNotes: [
          "Fishing Bot said 'Dec 6-11 and Jan 15-22'. TPWD's alert page gives times: 5 p.m. Dec. 6 to 3 p.m. Dec. 11, and 5 p.m. Jan. 15 to 3 p.m. Jan. 22. Updated.",
          "Fishing Bot said a license is required from a boat. The linked pages only say none is needed from shore in a state park; the boat case is not stated, so it shows as unstated.",
          "Fishing Bot said no APH/LPU is needed. The linked pages do not address this for fishing (APH is mentioned only for applying to hunts), so it shows as unstated.",
          "Everything else (species, best months, access, $5 entry, gate hours, closures, reefs, golden alga) matched the TPWD pages."
        ],
        sources: ["lwFish", "lwPark", "lwAlert"]
      },
      fieldNotes: []
    },

    /* ---------------------------------------------------------------- */
    {
      id: "somerville-wma-711",
      name: "Somerville WMA (Public Hunting Land, Unit 711)",
      kind: "WMA / APH walk-in unit",
      county: "Lee and Burleson",
      region: "v1",
      acres: "3,180 acres (2,030 Yegua Creek + 1,150 Nails Creek compartments)",
      address: "Check station / info: Nails Creek Unit, Lake Somerville State Park",
      phone: "(979) 289-2392 (Nails Creek State Park)",
      approxMiles: { clifton: 170, collegeStation: 30 },
      coordsRough: true,
      blurb: "Walk-in archery deer and hog land on Lake Somerville, with small game, waterfowl and dove too. Camping is not allowed on the WMA; camp at the state park next door.",
      accessTypes: ["aph"],
      accessLabel: "APH walk-in (on-site registration each day)",
      species: ["deer", "hog", "waterfowl", "dove", "small-game"],
      hasFishing: true,
      header: { type: "photo", key: "somerville", alt: "View of Lake Somerville from Lake Somerville State Park", caption: "Lake Somerville, seen from the state park next to the WMA." },
      permits: [
        { label: "Annual Public Hunting (APH) permit, $48, to hunt", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/", note: "Plus a Texas hunting license. Only hunters need the APH permit here; no APH or LPU is required to fish (a fishing license is, per statute)." },
        { label: "Postcard selection hunt: archery deer at the Lake Somerville SP Nails Creek unit", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/", note: "Listed by TPWD as an E-Postcard archery deer hunt on the neighboring state park unit." }
      ],
      quickFacts: { permit: "APH permit (hunting); fishing license only (fishing)", access: "Walk-in; OSR each day; archery-only deer and hog", species: "White-tailed deer and feral hogs (archery only), squirrel, rabbit, waterfowl, dove", bestMonths: "Archery deer: Oct. 3 – Jan. 3 (details below)" },
      maps: [
        { label: "TPWD 2026-27 unit map + legal game (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/711_1121.pdf", src: ["svHunt"] },
        { label: "TPWD WMA leaflet and map (PDF, printed 2003)", url: "https://tpwd.texas.gov/huntwild/hunt/wma/images/somerville_wma_map.pdf", src: ["svWma"] }
      ],
      directions: { label: "TPWD: Lake Somerville State Park (check station at Nails Creek unit)", url: "https://tpwd.texas.gov/state-parks/lake-somerville" },
      hunting: {
        status: "verified",
        summary: "2026-27 APH Unit 711: archery only for deer and hogs. Source: TPWD unit page (PDF).",
        seasons: [
          { species: "White-tailed deer (archery only)", season: "Oct. 3–Nov. 6 and Nov. 14–29 (either sex); Nov. 7–Jan. 3 (buck only)", notes: "Bag limit 3 (1 buck, 2 antlerless). Legal buck: at least one unbranched antler or an inside main beam spread of 13 in. or more.", src: ["svHunt"], status: "verified" },
          { species: "Feral hog (archery only)", season: "No closed season; no bag limit", notes: "Baiting allowed Mar. 30–Aug. 16.", src: ["svHunt"], status: "verified" },
          { species: "Squirrel", season: "Jan. 4–Aug. 31", notes: "Dogs allowed. Falconry, shotgun and air rifles only.", src: ["svHunt"], status: "verified" },
          { species: "Rabbits and hares", season: "Jan. 4–Aug. 31", notes: "Dogs allowed. Falconry, rimfire, shotgun and air rifles only.", src: ["svHunt"], status: "verified" },
          { species: "Beaver, raccoon, opossum, muskrat, nutria, skunk", season: "Jan. 4–Aug. 31, night only", notes: "Dogs allowed. Shotguns only.", src: ["svHunt"], status: "verified" },
          { species: "Waterfowl", season: "Each day of the Early Teal, North Zone Duck and Extended Falconry seasons", notes: "Non-toxic shot required.", src: ["svHunt"], status: "verified" },
          { species: "Dove", season: "Every day of the first split of the Central Zone season", notes: "", src: ["svHunt"], status: "verified" }
        ],
        extra: "Means: firearms are restricted to shotguns with no larger than #2 shot (deer and hogs are archery only). OSR required each day. No ORVs or ATVs. Trailway Flag Pond Unit 1121 (waterfowl only, boat access only, shooting ends at noon) is closed Dec. 5–6 and Jan. 9–10.",
        extraSrc: ["svHunt"]
      },
      zones: [
        { text: "The WMA is two separate tracts: the Yegua Creek Compartment (2,030 acres) and the Nails Creek Compartment (1,150 acres).", src: ["svWma"] }
      ],
      zonesNote: "No best-zone notes: none are supported by a TPWD source, so none are shown.",
      access: [
        { label: "Camping", text: "Camping and campfires are prohibited on the WMA. Camp at Nails Creek or Birch Creek units of Lake Somerville State Park, or at Corps of Engineers parks on the lake.", src: ["svWma", "svPark"] },
        { label: "Registration", text: "OSR required each day.", src: ["svHunt"] },
        { label: "Vehicles", text: "No ORVs or ATVs. For disabled access, contact Nails Creek State Park.", src: ["svHunt"] },
        { label: "Facilities on the WMA", text: "PLACEHOLDER: awaiting data (restrooms and water on the WMA itself are not stated in the sources checked)", placeholder: true }
      ],
      fishing: {
        status: "verified-with-flags",
        intro: "Fishing Bot's draft was re-checked against the linked TPWD pages. Items that differ or could not be confirmed are flagged in the 'Check notes' list.",
        species: { text: "Largemouth bass; white and hybrid striped bass; bluegill; channel, blue and flathead catfish; white and black crappie.", src: ["svFish"] },
        bestMonths: [
          { species: "White bass and hybrid striped bass", text: "In the creeks in early spring, usually beginning mid-February; open water following schooling shad in summer and fall. The area off Welch Park is particularly good just before the spring run.", src: ["svFish"] },
          { species: "Largemouth bass, bluegill, catfish, crappie", text: null }
        ],
        access: [
          { label: "Bank", text: "Not stated in official sources for the WMA itself.", src: [], rawNull: true },
          { label: "Boat ramp", text: "Nails Creek Unit (state park): 2-lane ramp for all boat types, park entry fee. Yegua Creek Park (Corps of Engineers): two ramps, $2 launch fee. TPWD lists no ramp on the WMA itself in the pages checked.", src: ["svAccess"] },
          { label: "Kayak / paddle", text: "Lake Somerville is open to motorized boat, kayak or canoe; the park no longer rents watercraft, so bring your own.", src: ["svPark"] },
          { label: "Limits / seasonal closures", text: "Statewide regulations apply. Some parks and ramps close for high water or flood damage; check the Army Corps and State Parks alert map. No hunting-related fishing closure is listed for 2026-27 (deer and hogs are archery only).", src: ["svFish", "svHunt"] }
        ],
        license: [
          { label: "Fishing license", text: "Required where state law requires it. No other permit is needed to fish on the WMA.", src: ["svWma"] },
          { label: "APH / LPU permit", text: "Not required to fish. Only hunters need an APH permit.", src: ["svHunt"] },
          { label: "Special harvest rules", text: "All species are managed under statewide regulations.", src: ["svFish"] },
          { label: "Closures during hunts", text: "None listed for 2026-27 on the unit page. Flag Pond Unit 1121 is closed Dec. 5–6 and Jan. 9–10.", src: ["svHunt"] }
        ],
        tips: [
          { text: "TPWD has installed fish habitat structures in the lake. Use GPS with a fish finder, or TPWD's Habitat Structure Viewer.", src: ["svFish"] },
          { text: "Check the alert map before you go; some ramps close for high water.", src: ["svFish"] }
        ],
        checkNotes: [
          "Fishing Bot said 'no ramp on the WMA'. TPWD does not say that outright. It lists ramps at the Nails Creek Unit and Yegua Creek Park only, which is why the page words it this way.",
          "Fishing Bot said 'no camping'. Confirmed for the WMA (not the state park next door). Note: the WMA leaflet is dated 2003, so the 2026-27 unit page is used for hunting rules.",
          "Fishing Bot said 'fishing license required; no APH/LPU needed to fish'. Confirmed (unit page and WMA leaflet).",
          "Fishing Bot said 'possible closure during gun-deer hunts, but 2026-27 is archery-only'. The 2026-27 unit page does say archery only for deer and hogs. The 2003 leaflet still describes special gun-deer hunts, so check TPWD if that changes.",
          "Best months for largemouth, bluegill, catfish and crappie are not stated on the linked pages."
        ],
        sources: ["svFish", "svAccess", "svPark", "svHunt", "svWma"]
      },
      fieldNotes: []
    },

    /* ---------------------------------------------------------------- */
    {
      id: "dinosaur-valley-sp",
      name: "Dinosaur Valley State Park",
      kind: "State park (public hunt area)",
      county: "Somervell",
      region: "v1",
      acres: "Not stated in the sources checked",
      address: "1629 Park Rd 59, Glen Rose, TX 76043",
      phone: "(254) 897-4588",
      approxMiles: { clifton: 35, collegeStation: 150 },
      coordsRough: false,
      blurb: "Paluxy River park known for dinosaur tracks. Hunting is two drawn, assigned-blind deer and hog hunts a year; the park closes to non-hunters during them.",
      accessTypes: ["drawn", "state-park"],
      accessLabel: "Drawn hunts only + state park entry for visiting",
      species: ["deer", "hog"],
      hasFishing: true,
      header: { type: "photo", key: "dinosaur-valley", alt: "Paluxy River overlook at Dinosaur Valley State Park", caption: "Paluxy River overlook, Dinosaur Valley State Park." },
      permits: [
        { label: "Drawn hunt permit (apply online by the deadline)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/", note: "Applications for the 2026-27 hunts closed Sept. 15, 2026. $3 application, $130 adult permit fee." },
        { label: "State park entry (visiting / fishing), $8 adult day use, 12 and under free", url: "https://tpwd.texas.gov/state-parks/dinosaur-valley", note: "TPWD recommends reservations." }
      ],
      quickFacts: { permit: "Drawn hunt permit; state park entry to visit", access: "Drawn only for hunting; no standbys", species: "White-tailed deer, feral hogs", bestMonths: "Hunt dates: Dec. 7–10, 2026 and Jan. 11–14, 2027" },
      maps: [
        { label: "TPWD park map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_094r.pdf", src: ["dvMap"] },
        { label: "TPWD trails map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_0094s.pdf", src: ["dvTrails"] },
        { label: "TPWD drawn-hunt page (has TPWD's own map)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/hunt-area-details.phtml?OArea=DV", src: ["dvHunt"] }
      ],
      directions: { label: "TPWD park page: 'View map and directions'", url: "https://tpwd.texas.gov/state-parks/dinosaur-valley" },
      hunting: {
        status: "verified",
        summary: "Two drawn hunts for 2026-27. Source: TPWD drawn-hunt details.",
        seasons: [
          { species: "White-tailed deer, antlerless or spike buck (GDA)", season: "Dec. 7–10, 2026", notes: "10 permits. Archery, muzzleloaders, shotguns with slugs. Assigned blind. No baiting. Orientation 10 a.m. day one. No standbys. Hogs: unlimited, in limited numbers.", src: ["dvHunt"], status: "verified" },
          { species: "Deer, antlerless or spike buck, one of each (GDE)", season: "Jan. 11–14, 2027", notes: "10 permits. Same means and rules as above. Feral hogs unlimited, either sex.", src: ["dvHunt"], status: "verified" }
        ]
      },
      zones: [],
      zonesNote: "No best-zone notes: none are supported by a TPWD source, so none are shown.",
      access: [
        { label: "During hunts", text: "Non-permitted hunters, visitors and family are not allowed in the park during hunts (except a non-hunting adult assisting a hunter with a mobility disability).", src: ["dvHunt"] },
        { label: "Camping", text: "Available to permitted hunters at the standard overnight fees; sites with water and electricity, a dump station and restrooms with showers.", src: ["dvHunt"] },
        { label: "Hours", text: "Open daily; gate 6 a.m. – 10 p.m.; office 8:30 a.m. – 4:30 p.m.", src: ["dvPark"] },
        { label: "Other", text: "Hiking, mountain biking, swimming, paddling, horse trails, an interpretive center.", src: ["dvPark"] },
        { label: "Contact", text: "(254) 897-4588 · Dinosaur.Valley@tpwd.texas.gov", src: ["dvPark"] }
      ],
      fishing: {
        status: "partial",
        intro: "Fishing Bot has not sent data for this area. Only what the TPWD park page says is shown; the rest reads 'Not stated in official sources'.",
        species: { text: null },
        bestMonths: [ { species: "All species", text: null } ],
        access: [
          { label: "Bank", text: "The park page lists fishing in the Paluxy River as an activity; bank access points are not described.", src: ["dvPark"] },
          { label: "Boat ramp", text: null },
          { label: "Kayak / paddle", text: "Paddling in the river is listed as an activity.", src: ["dvPark"] },
          { label: "Limits / seasonal closures", text: null }
        ],
        license: [
          { label: "Fishing license", text: null },
          { label: "APH / LPU permit", text: null },
          { label: "Special harvest rules", text: null },
          { label: "Closures during hunts", text: "The park is closed to non-hunters during the drawn hunts (Dec. 7–10, 2026; Jan. 11–14, 2027).", src: ["dvHunt"] }
        ],
        tips: [ { text: "The park store runs a Tackle Loaner Program (ask at the store).", src: ["dvPark"] } ],
        checkNotes: ["PLACEHOLDER: awaiting data from Fishing Bot for species, best months and license rules."],
        sources: ["dvPark", "dvHunt"]
      },
      fieldNotes: []
    },

    /* ---------------------------------------------------------------- */
    {
      id: "luminant-texas-607",
      name: "Luminant Texas (APH Unit 607)",
      kind: "APH walk-in unit (leased land)",
      county: "Robertson",
      region: "v1",
      acres: "1,071 acres",
      address: "Designated access point on the unit map; see TPWD PDF",
      phone: "Not stated in the unit PDF",
      approxMiles: { clifton: 90, collegeStation: 35 },
      coordsRough: true,
      blurb: "Walk-in unit in Robertson County with deer (archery, general, muzzleloader), hogs, waterfowl, dove, quail, small game and more, on an APH permit.",
      accessTypes: ["aph"],
      accessLabel: "APH walk-in (on-site registration each day)",
      species: ["deer", "hog", "waterfowl", "dove", "small-game", "quail"],
      hasFishing: true,
      header: { type: "illustration", palette: "bottomland", alt: "Illustrated header: bottomland trees" },
      permits: [
        { label: "Annual Public Hunting (APH) permit, $48", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/", note: "Plus a Texas hunting license. Hunters 17+. Youth under 17 may hunt free with a permitted adult 18+." }
      ],
      quickFacts: { permit: "APH permit + hunting license", access: "Walk-in; OSR each day", species: "White-tailed deer, hogs, waterfowl, dove, quail, squirrel, rabbit", bestMonths: "Deer: archery, general and muzzleloader seasons for Robertson County" },
      maps: [
        { label: "TPWD 2026-27 unit map + legal game (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/607.pdf", src: ["lumHunt"] },
        { label: "TPWD aerial map (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/Luminant_607.pdf", src: ["aphData"] }
      ],
      directions: { label: "TPWD APH area search (unit 607 details)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/search.phtml" },
      hunting: {
        status: "verified",
        summary: "2026-27 APH Unit 607. Dates follow county seasons, so check the Robertson County listing for exact dates.",
        seasons: [
          { species: "White-tailed deer", season: "Each day of the archery, general and muzzleloader seasons established for Robertson County", notes: "Bag limit 1 buck and 1 antlerless. Legal buck: at least one unbranched antler or an inside spread of 13 in. or more.", src: ["lumHunt", "seasonsCty"], status: "verified" },
          { species: "Feral hog", season: "Archery: with archery deer season. General: from general deer season start through Mar. 31", notes: "No bag limit.", src: ["lumHunt"], status: "verified" },
          { species: "Waterfowl", season: "Each day of Early Teal, North Zone Duck and Eastern Zone Goose seasons", notes: "Shooting hours: half hour before sunrise to noon (all day for Early Teal).", src: ["lumHunt"], status: "verified" },
          { species: "Squirrel", season: "As established for Robertson County", notes: "", src: ["lumHunt"], status: "verified" },
          { species: "Dove", season: "Each day of Central Zone dove season", notes: "", src: ["lumHunt"], status: "verified" },
          { species: "Also listed", season: "Quail; woodcock, rail, gallinule, snipe; furbearers and predators; rabbits and hares; bullfrogs (daily limit 25); crayfish", notes: "The PDF lists these as legal game; exact dates are PLACEHOLDER: awaiting data (not stated in the PDF text).", src: ["lumHunt"], status: "placeholder" }
        ],
        extra: "OSR required each day. Youth-only squirrel and deer, and youth/veteran/active-duty waterfowl special seasons: see the Outdoor Annual. Do not drive past the pipeline road when wet; the pipeline maintenance road is foot traffic only. Horses allowed only Sept. 1–Oct. 2 and Apr. 1–Aug. 31.",
        extraSrc: ["lumHunt"]
      },
      zones: [],
      zonesNote: "No best-zone notes: none are supported by a TPWD source, so none are shown.",
      access: [
        { label: "Entry", text: "Designated access point; land outside the public hunting area is private property.", src: ["lumHunt"] },
        { label: "Camping and facilities", text: "PLACEHOLDER: awaiting data", placeholder: true }
      ],
      fishing: {
        status: "partial",
        intro: "The unit PDF lists fishing as legal use but gives no details. Fishing Bot has not sent data for this area.",
        species: { text: null },
        bestMonths: [ { species: "All species", text: null } ],
        access: [
          { label: "Bank", text: null }, { label: "Boat ramp", text: null }, { label: "Kayak / paddle", text: null }, { label: "Limits / seasonal closures", text: null }
        ],
        license: [
          { label: "Fishing license", text: null },
          { label: "APH / LPU permit", text: "Fishing is listed among legal uses on the APH unit; the PDF does not spell out whether an LPU permit covers it. Check TPWD.", src: ["lumHunt"] },
          { label: "Special harvest rules", text: null },
          { label: "Closures during hunts", text: null }
        ],
        tips: [],
        checkNotes: ["PLACEHOLDER: awaiting data from Fishing Bot."],
        sources: ["lumHunt", "aph"]
      },
      fieldNotes: []
    },

    /* ---------------------------------------------------------------- */
    {
      id: "keechi-creek-wma",
      name: "Keechi Creek WMA",
      kind: "WMA (drawn / E-Postcard access)",
      county: "Leon",
      region: "v1",
      acres: "1,500 acres",
      address: "1670 FM 488, Streetman, TX 75859 (as listed by TPWD)",
      phone: "(903) 480-1221",
      approxMiles: { clifton: 125, collegeStation: 65 },
      coordsRough: true,
      blurb: "Small bottomland hardwood WMA in northeast Leon County. Access is limited: hunting here is by E-Postcard drawing, and visitors 17+ need an APH or LPU permit. Fishing is not permitted.",
      accessTypes: ["drawn"],
      accessLabel: "Drawn (E-Postcard) hunts; APH needed to apply",
      species: ["deer", "hog", "waterfowl", "small-game"],
      hasFishing: false,
      header: { type: "illustration", palette: "bottomland", alt: "Illustrated header: bottomland hardwoods" },
      permits: [
        { label: "Annual Public Hunting (APH) permit, $48 (needed to apply to E-Postcard hunts)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/", note: "All visitors over 17 need an APH or Limited Public Use (LPU, $12) permit to use the WMA." },
        { label: "E-Postcard drawn hunt application", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/", note: "2026-27 deadlines have passed for these hunts. $0 permit fee for adults." }
      ],
      quickFacts: { permit: "APH to apply and to enter (LPU for non-hunting visitors)", access: "Limited; drawn hunts only; entry at designated point", species: "White-tailed deer, feral hogs, squirrel, waterfowl", bestMonths: "Hunt windows run Oct. 2026 – Mar. 2027 (see table)" },
      maps: [
        { label: "TPWD WMA page", url: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?id=11", src: ["kcWma"] },
        { label: "TPWD drawn-hunt page (has TPWD's own map)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/hunt-area-details.phtml?OArea=KC", src: ["kcHunt"] }
      ],
      directions: { label: "TPWD WMA page (contact and location)", url: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?id=11" },
      hunting: {
        status: "verified",
        summary: "All 2026-27 hunts are E-Postcard drawings. Source: TPWD drawn-hunt details.",
        seasons: [
          { species: "Archery deer", season: "Oct. 2–25, 2026", notes: "10 permits. Either sex, one buck (13 in. spread or one unbranched antler). Unlimited hogs. Baiting allowed. Mandatory 12 p.m. orientation.", src: ["kcHunt"], status: "verified" },
          { species: "Deer (gun)", season: "Nov. 6–29, 2026", notes: "5 permits. Compartment hunt; ATV/ORV use allowed. Hunter orange required. Mandatory 12 p.m. orientation.", src: ["kcHunt"], status: "verified" },
          { species: "Multi-species (waterfowl and squirrel)", season: "Dec. 4–27, 2026", notes: "10 permits. Airguns, rimfire, shotguns. Hunter orange required except when waterfowl hunting.", src: ["kcHunt"], status: "verified" },
          { species: "Waterfowl (groups)", season: "Jan. 8–31, 2027", notes: "5 groups. Shotguns only. North Zone duck and East Zone goose limits apply. Ends 11 a.m. daily.", src: ["kcHunt"], status: "verified" },
          { species: "Squirrel", season: "Feb. 5–28, 2027", notes: "20 permits. Airguns, rimfire, shotguns.", src: ["kcHunt"], status: "verified" },
          { species: "Feral hog", season: "Mar. 5–28, 2027", notes: "10 permits. Daylight only, no dogs, hunter orange required.", src: ["kcHunt"], status: "verified" }
        ]
      },
      zones: [],
      zonesNote: "No best-zone notes: none are supported by a TPWD source, so none are shown.",
      access: [
        { label: "Entry", text: "Entry restricted to the designated entry point only. Use caution during heavy rains; flooding may occur.", src: ["kcWma"] },
        { label: "Camping", text: "Allowed on the area for hunt participants; no facilities. Primitive camping (no running water) noted for the deer hunt.", src: ["kcHunt"] },
        { label: "Facilities", text: "No restrooms or potable water on the WMA.", src: ["kcWma"] },
        { label: "Fishing", text: "Not permitted (lack of access).", src: ["kcWma"] },
        { label: "Safety", text: "Three varieties of venomous snakes are documented; the timber rattlesnake is common.", src: ["kcWma"] }
      ],
      fishing: null,
      fieldNotes: []
    },

    /* ---------------------------------------------------------------- */
    {
      id: "marlin-lake-park-2547",
      name: "Marlin Lake Park (APH Unit 2547)",
      kind: "APH walk-in unit (city-owned park land)",
      county: "Falls",
      region: "v1",
      acres: "903 acres (owned by the City of Marlin)",
      address: "Near Marlin, TX; see TPWD unit map",
      phone: "Not stated in the unit PDF",
      approxMiles: { clifton: 55, collegeStation: 60 },
      coordsRough: true,
      blurb: "City-owned lake park near Marlin, hunted on an APH permit: archery deer and hogs, small game with restricted weapons, dove, and waterfowl on Old Lake only.",
      accessTypes: ["aph"],
      accessLabel: "APH walk-in (on-site registration each day)",
      species: ["deer", "hog", "waterfowl", "dove", "small-game"],
      hasFishing: true,
      header: { type: "illustration", palette: "lake", alt: "Illustrated header: lake and shoreline" },
      permits: [
        { label: "Annual Public Hunting (APH) permit, $48", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/", note: "Plus a Texas hunting license. Only hunters need the APH permit here." }
      ],
      quickFacts: { permit: "APH permit + hunting license (hunting); fishing via City of Marlin parks", access: "Walk-in; OSR each day; archery-only deer and hogs", species: "Deer and hogs (archery), small game, dove, waterfowl (Old Lake)", bestMonths: "Deer: archery and general seasons for Falls County" },
      maps: [
        { label: "TPWD 2026-27 unit map + legal game (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/2547.pdf", src: ["mlHunt"] },
        { label: "TPWD aerial map (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/MarlinLakePark_2547.pdf", src: ["aphData"] }
      ],
      directions: { label: "TPWD APH area search (unit 2547 details)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/search.phtml" },
      hunting: {
        status: "verified",
        summary: "2026-27 APH Unit 2547. Source: TPWD unit page (PDF).",
        seasons: [
          { species: "White-tailed deer (archery only)", season: "Each day of the archery and general seasons established for Falls County", notes: "", src: ["mlHunt", "seasonsCty"], status: "verified" },
          { species: "Feral hog (archery only)", season: "Open year-round; no closed season", notes: "No bag limit.", src: ["mlHunt"], status: "verified" },
          { species: "Squirrel, rabbits, hares, furbearers, predators", season: "Year-round except during the archery and general deer seasons for Falls County", notes: "Archery, air rifle and shotgun only; daylight only; no bag limit.", src: ["mlHunt"], status: "verified" },
          { species: "Dove", season: "Each day of the Central Zone season", notes: "", src: ["mlHunt"], status: "verified" },
          { species: "Waterfowl", season: "Old Lake only: each day of the Early Teal and North Zone Duck seasons for Falls County", notes: "Non-toxic shot. Gallinules, snipe, rail and woodcock also Old Lake only.", src: ["mlHunt"], status: "verified" }
        ],
        extra: "Means: centerfire/rimfire rifles, pistols and muzzleloaders are prohibited; shotguns only, non-toxic for migratory birds, no larger than #2 shot. OSR required each day.",
        extraSrc: ["mlHunt"]
      },
      zones: [
        { text: "The unit map shows an Old City Lake ('Old Lake') and a New City Lake ('New Lake'). Waterfowl hunting is on Old Lake only.", src: ["mlHunt"] }
      ],
      zonesNote: "No best-zone notes: none are supported by a TPWD source, so none are shown.",
      access: [
        { label: "Lake access for fishing", text: "Allowed through the City of Marlin managed parks.", src: ["mlHunt"] },
        { label: "Camping and facilities", text: "PLACEHOLDER: awaiting data", placeholder: true }
      ],
      fishing: {
        status: "partial",
        intro: "The unit PDF lists fishing as legal use and says lake access is through City of Marlin parks. Fishing Bot has not sent data for this area.",
        species: { text: null },
        bestMonths: [ { species: "All species", text: null } ],
        access: [
          { label: "Bank", text: "Lake access for fishing is allowed through the City of Marlin managed parks.", src: ["mlHunt"] },
          { label: "Boat ramp", text: null }, { label: "Kayak / paddle", text: null }, { label: "Limits / seasonal closures", text: null }
        ],
        license: [
          { label: "Fishing license", text: null },
          { label: "APH / LPU permit", text: "The unit PDF says only hunters are required to possess the APH permit.", src: ["mlHunt"] },
          { label: "Special harvest rules", text: null },
          { label: "Closures during hunts", text: null }
        ],
        tips: [],
        checkNotes: ["PLACEHOLDER: awaiting data from Fishing Bot."],
        sources: ["mlHunt"]
      },
      fieldNotes: []
    },

    /* ---------------------------------------------------------------- */
    {
      id: "fort-boggy-sp",
      name: "Fort Boggy State Park",
      kind: "State park (public hunt area)",
      county: "Leon",
      region: "v1",
      acres: "Over 1,800 acres",
      address: "4994 Highway 75 South, Centerville, TX 75833",
      phone: "(903) 344-1116",
      approxMiles: { clifton: 125, collegeStation: 45 },
      coordsRough: false,
      blurb: "Small state park with a 15-acre community fishing lake. Hunting is limited to drawn deer and hog hunts with assigned blinds.",
      accessTypes: ["drawn", "state-park"],
      accessLabel: "Drawn hunts only + state park entry for visiting",
      species: ["deer", "hog"],
      hasFishing: true,
      header: { type: "illustration", palette: "lake", alt: "Illustrated header: small lake and pines" },
      permits: [
        { label: "Drawn hunt permit (apply online by the deadline)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/", note: "Applications for 2026-27 hunts have closed (Aug. 15, Sept. 15 and Nov. 1, 2026). $3 application, $130 adult permit. Archery deer needs the Archery Endorsement." },
        { label: "State park entry (visiting / fishing), $3 adult, 12 and under free", url: "https://tpwd.texas.gov/state-parks/fort-boggy", note: "No fishing license needed to fish in the park." }
      ],
      quickFacts: { permit: "Drawn hunt permit; state park entry to visit", access: "Drawn only for hunting; assigned blinds", species: "White-tailed deer, feral hogs", bestMonths: "Hunt dates: Nov. 16–20, Nov. 30–Dec. 4, 2026; Jan. 18–22, 2027" },
      maps: [
        { label: "TPWD park map (PDF)", url: "https://tpwd.texas.gov/publications/pwdpubs/media/park_maps/pwd_mp_p4503_146.pdf", src: ["fbMap"] },
        { label: "TPWD drawn-hunt page (has TPWD's own map)", url: "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/hunt-area-details.phtml?OArea=FB", src: ["fbHunt"] }
      ],
      directions: { label: "TPWD park page: 'View map and directions'", url: "https://tpwd.texas.gov/state-parks/fort-boggy" },
      hunting: {
        status: "verified",
        summary: "Three drawn hunts for 2026-27. Source: TPWD drawn-hunt details.",
        seasons: [
          { species: "Archery deer (two deer: one antlerless, one buck of 13 in. spread)", season: "Nov. 16–20, 2026", notes: "5 permits. Archery Endorsement (Type 135) required. Assigned blind. Baiting allowed. No vehicles or ATVs.", src: ["fbHunt"], status: "verified" },
          { species: "Gun deer, either sex (two deer, same limits)", season: "Nov. 30–Dec. 4, 2026", notes: "5 permits. Assigned blind. Baiting allowed. No vehicles or ATVs.", src: ["fbHunt"], status: "verified" },
          { species: "Feral hogs", season: "Jan. 18–22, 2027", notes: "5 permits. Assigned blind. Baiting allowed (certified aflatoxin-free corn). No dogs, ATV/UTV or 4WD. Daylight only.", src: ["fbHunt"], status: "verified" }
        ]
      },
      zones: [],
      zonesNote: "No best-zone notes: none are supported by a TPWD source, so none are shown.",
      access: [
        { label: "Hours", text: "Open daily, 8 a.m. – 8 p.m.; office 8:30 a.m. – 4:30 p.m.", src: ["fbPark"] },
        { label: "Camping", text: "Cabins and primitive hike-in campsites; all sites are walk-in only, no car camping. Restrooms and an outdoor shower near the lake.", src: ["fbPark"] },
        { label: "Water", text: "15-acre Sullivan Lake: no-wake; boat ramp; kayak rentals at a kiosk.", src: ["fbPark"] },
        { label: "Contact", text: "(903) 344-1116", src: ["fbPark"] }
      ],
      fishing: {
        status: "partial",
        intro: "Fishing Bot has not sent data for this area. This block uses TPWD's park page and fishing tip sheet only.",
        species: { text: "Largemouth bass, channel catfish, sunfish, and rainbow trout (in season).", src: ["fbPark"] },
        bestMonths: [ { species: "All species", text: null } ],
        access: [
          { label: "Bank", text: "Fish from the pier or the lake bank.", src: ["fbPark"] },
          { label: "Boat ramp", text: "Yes; clean, drain and dry your boat.", src: ["fbPark"] },
          { label: "Kayak / paddle", text: "Bring your own small boat, canoe or kayak, or rent a kayak at the kiosk (first come, first served). No-wake lake.", src: ["fbPark"] },
          { label: "Limits / seasonal closures", text: "Daily bag 5 (all species combined), only 1 of which may be a black bass; black bass minimum 14 in.; no minimum on other species. Pole and line only, no more than two poles. Closed to non-hunters during drawn hunts (dates above).", src: ["fbFish", "fbHunt"] }
        ],
        license: [
          { label: "Fishing license", text: "Not needed to fish in the park (the lake is completely inside the park).", src: ["fbPark", "fbFish"] },
          { label: "APH / LPU permit", text: null },
          { label: "Special harvest rules", text: "Community fishing lake rules: see limits above.", src: ["fbFish"] },
          { label: "Closures during hunts", text: "Hunt dates are Nov. 16–20, Nov. 30–Dec. 4, 2026 and Jan. 18–22, 2027. Whether the park closes to visitors for the whole period is not stated on the hunt page; call the park.", src: ["fbHunt"] }
        ],
        tips: [ { text: "Download TPWD's Fishing Tip Sheet (PDF) for the park.", src: ["fbFish"] } ],
        checkNotes: ["Best months by species are not stated on the linked pages. PLACEHOLDER: awaiting data from Fishing Bot."],
        sources: ["fbPark", "fbFish", "fbHunt"]
      },
      fieldNotes: []
    },

    /* ---------------------------------------------------------------- */
    {
      id: "jd-murphree-wma",
      name: "J.D. Murphree WMA",
      kind: "WMA / APH unit",
      county: "Jefferson",
      region: "outside",
      outsideNote: "Example outside the v1 region. Included only because Fishing Bot supplied a fishing block, and to test the page template.",
      acres: "25,852 acres (Big Hill Unit 783N: 9,861; Salt Bayou Unit 783S: 15,397)",
      address: "10 Parks & Wildlife Dr., Port Arthur, TX 77640",
      phone: "(409) 736-2551",
      approxMiles: { clifton: 330, collegeStation: 185 },
      coordsRough: true,
      blurb: "Coastal marsh WMA at Port Arthur: waterfowl hunts, and freshwater and saltwater fishing, mostly by shallow-draft boat. Shown here as a template example, not part of the Clifton / College Station region.",
      accessTypes: ["aph"],
      accessLabel: "APH walk-in (waterfowl check station); boat access for most of the area",
      species: ["waterfowl", "hog"],
      hasFishing: true,
      header: { type: "illustration", palette: "marsh", alt: "Illustrated header: coastal marsh" },
      permits: [
        { label: "Annual Public Hunting (APH) permit, $48 (hunting; fishing in most cases)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/", note: "TPWD's fishing page says APH is required to fish unless all activity is in a boat in navigable waters. The 2026-27 unit PDFs say APH or LPU. See the fishing block." },
        { label: "Limited Public Use (LPU) permit, $12 (non-hunting uses)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/", note: "The 2026-27 unit PDFs allow APH or LPU for fishing; the older web fishing page lists only APH. Confirm with the WMA." }
      ],
      quickFacts: { permit: "APH (hunting); APH or LPU (fishing, per unit PDFs; see conflict notes)", access: "Mostly by shallow-draft boat; check station on Hwy. 73", species: "Waterfowl; feral hogs (Feb. 1 – Apr. 30)", bestMonths: "Fishing inside compartments: Feb. 1 – Aug. 31 (per unit PDFs)" },
      maps: [
        { label: "TPWD Big Hill Unit 783N 2026-27 map (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/783N.pdf", src: ["jdN"] },
        { label: "TPWD Salt Bayou Unit 783S 2026-27 map (PDF)", url: "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/resources/783S.pdf", src: ["jdS"] },
        { label: "TPWD WMA page", url: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?id=40", src: ["jdWma"] }
      ],
      directions: { label: "TPWD WMA page (headquarters on Hwy. 73, Port Arthur)", url: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?id=40" },
      hunting: {
        status: "verified",
        summary: "2026-27 APH units 783N and 783S. Source: TPWD unit PDFs.",
        seasons: [
          { species: "Waterfowl (APH permit only)", season: "Early Teal: each day. South Zone duck: designated days only (see unit PDFs)", notes: "Check in and out at the WMA check station and exit before noon. Check station opens at 4:00 a.m. (783S) or 4:30 a.m. (783N).", src: ["jdN", "jdS"], status: "verified" },
          { species: "Feral hog", season: "Feb. 1–Apr. 30", notes: "Archery or shotgun (slug or buckshot) only. No bag limit. No baiting. No registration required.", src: ["jdN", "jdS"], status: "verified" }
        ]
      },
      zones: [
        { text: "Units: Big Hill (north of the Gulf Intracoastal Waterway, freshwater levee compartments), Salt Bayou (south of the GIWW, no levees), and the Hillebrandt Unit.", src: ["jdFish", "jdRules"] }
      ],
      zonesNote: "No best-zone notes: none are supported by a TPWD source, so none are shown.",
      access: [
        { label: "Getting around", text: "There are no public roads inside the WMA beyond the headquarters complex. Access to most of the area is restricted to boats that can handle shallow lakes, channels and bayous. Motorized access is only on designated motorboat trails and named ditches.", src: ["jdWma", "jdN", "jdS"] },
        { label: "Facilities", text: "No restrooms. Bring drinking water. A wildlife viewing platform is in Compartment 1 of the Big Hill Unit.", src: ["jdWma"] },
        { label: "Contact", text: "(409) 736-2551", src: ["jdWma"] }
      ],
      fishing: {
        status: "verified-with-flags",
        intro: "Fishing Bot's draft was re-checked against TPWD's WMA pages and the 2026-27 unit PDFs. TPWD's own pages disagree with each other in places, so those spots are shown as conflicts, not resolved.",
        species: { text: "Big Hill Unit (freshwater marsh): bass, crappie, bream, catfish. Salt Bayou Unit: redfish, speckled trout and flounder in Keith and Johnson lakes and coastal channels; blue crabs are plentiful.", src: ["jdFish"] },
        bestMonths: [ { species: "All species", text: null } ],
        access: [
          { label: "Bank", text: null },
          { label: "Boat ramp", text: "Both unit maps show a public boat ramp symbol. Details are on the TPWD PDFs.", src: ["jdN", "jdS"] },
          { label: "Kayak / paddle", text: null },
          { label: "Limits / seasonal closures", text: "Access is mostly by shallow boat on designated motor trails and named ditches only. Interior compartments (2026-27 PDFs): open Feb. 1–Aug. 31, closed Sept. 1–Jan. 31. Big Hill Bayou and outside ditches (783N): Sept. 1–Oct. 31 and Feb. 1–Aug. 31, closed Nov. 1–Jan. 31. Fishing is limited to half an hour before sunrise to half an hour after sunset inside compartments. No unattended lines; no commercial fishing or crabbing.", src: ["jdN", "jdS", "jdWma"] },
          { label: "CONFLICT: compartment dates", text: "TPWD's older fishing page says compartments and ditches are open March 1 through August 31. The 2026-27 unit PDFs say Feb. 1–Aug. 31. Confirm with the WMA at (409) 736-2551.", src: ["jdFish", "jdN"], conflict: true },
          { label: "CONFLICT: Keith / Johnson lakes", text: "TPWD's fishing and rules pages say Keith Lake, Johnson Lake and Salt Bayou are open year-round with no daylight restriction (24 hours). The unit PDFs describe daylight-only fishing and do not mention an exception. Confirm with the WMA at (409) 736-2551.", src: ["jdFish", "jdRules", "jdS"], conflict: true }
        ],
        license: [
          { label: "Fishing license", text: "Not stated on the linked WMA pages. See TPWD fishing license information.", src: ["fishRegs"] },
          { label: "APH / LPU permit", text: "The 2026-27 unit PDFs: APH or LPU required to fish within the WMA unless all activity is confined to a boat in the named bayous and lakes (Big Hill, Taylor, Hillebrandt and Blind bayous for 783N; Keith, Johnson, Shell and Salt lakes for 783S). The older web fishing page lists APH only, and says boat-only in navigable waters is exempt.", src: ["jdN", "jdS", "jdFish"] },
          { label: "Special harvest rules", text: "Flounder: closed Nov. 1–Dec. 14 (statewide TPWD rule; bag limit zero in that period). No commercial fishing or crabbing, except in Keith Lake (older fishing page).", src: ["flounder", "jdFish"] },
          { label: "Closures during hunts", text: "Fishing, wildlife viewing and other uses are limited during scheduled hunts for September teal, regular waterfowl, feral hog and alligator seasons.", src: ["jdFish"] }
        ],
        tips: [
          { text: "A boat designed for shallow water is recommended. Weather varies a lot; heed marine advisories. Insect repellent and your own drinking water are recommended.", src: ["jdWma"] },
          { text: "Blue crabs are plentiful and easily caught in the Salt Bayou Unit.", src: ["jdFish"] }
        ],
        checkNotes: [
          "Fishing Bot said interior compartments open Feb. 1–Aug. 31 and Big Hill Bayou/outside ditches Sept. 1–Oct. 31 and Feb. 1–Aug. 31. Matches the 2026-27 PDFs. TPWD's fishing web page says March 1–Aug. 31 for compartments and ditches: shown as a conflict.",
          "Fishing Bot flagged Keith/Johnson as 'open 24/7 per the rules page'. Confirmed: the rules and fishing pages agree on year-round, no daylight limit. The conflict is with the unit PDFs' daylight-only wording.",
          "Fishing Bot said APH ($48) or LPU ($12) for 17+ unless boat-only on the named waters. Matches the PDFs. TPWD's fishing web page lists APH only. Shown as differing.",
          "Fishing Bot said flounder closed Nov. 1–Dec. 14. Confirmed on TPWD's flounder page (statewide rule), not on the WMA pages.",
          "Fishing Bot said 'No restrooms'. Confirmed.",
          "Fishing Bot's '2026-27 maps 783N/783S' were found and match the linked PDFs. Best months by species are not stated in any source checked."
        ],
        sources: ["jdFish", "jdRules", "jdWma", "jdN", "jdS", "flounder"]
      },
      fieldNotes: []
    }
  ]
};
