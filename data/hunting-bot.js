/* Drop-in file for Hunting Bot's data. It is empty on purpose.
   Format (one entry per area id from data/areas.js):

   window.HUNTING_BOT_DATA = {
     "lake-whitney-sp": {
       hunting: {
         status: "verified",                 // or "placeholder"
         summary: "One line summary.",
         seasons: [
           { species: "White-tailed deer", season: "Nov. 7 - Jan. 3", notes: "Bag, means, etc.",
             src: ["myNewSourceId"], status: "verified" }
         ],
         extra: "Optional paragraph under the table.", extraSrc: ["myNewSourceId"]
       },
       sources: { myNewSourceId: { label: "TPWD: page title", url: "https://tpwd.texas.gov/..." } }
     }
   };

   Every season row needs a TPWD source id in `src`, and unverified rows must use status "placeholder".
   The page merges this over the built-in hunting data by area id; nothing else needs editing. */
window.HUNTING_BOT_DATA = window.HUNTING_BOT_DATA || {};
