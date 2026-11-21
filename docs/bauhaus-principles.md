# Bauhaus Principles: Reference for bauhaus-react

Purpose: ground the library's three looks (Playful, Swiss, Soft) and its showcase site in what the Bauhaus (1919-1933) actually taught. Companion to [`style-analysis.md`](./style-analysis.md), which analyses the visual references.

Verification note: dates and quotes below were checked against the linked sources on 2026-11-21. Where sources disagree, the disagreement is stated. Quotations come from the Wingler/GHDI translation of the 1919 programme; other translations word it differently.

---

## 1. Short history

| Phase | Years | Notes |
|---|---|---|
| Weimar | 1919-1925 | Staatliches Bauhaus opened 1 April 1919 under Walter Gropius, merging the Weimar School of Applied Arts and the Academy of Fine Arts ([Getty](https://getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/history/)). The founding programme is dated April 1919 ([GHDI](https://germanhistorydocs.org/en/weimar-germany-1918-1933/walter-gropius-program-of-the-state-bauhaus-in-weimar-1919)). |
| Dessau | 1925/26-1932 | Forced out of Weimar by conservative politics. Sources give 1925 (Met, RIBA) or 1926 (ZKM, for the new building) for the move. Gropius left in 1928; Hannes Meyer directed until 1930 ([Met](https://www.metmuseum.org/toah/hd/bauh/hd_bauh.htm), [MoMA catalogue](https://assets.moma.org/documents/moma_catalogue_2735_300190238.pdf)). |
| Berlin | 1932-1933 | Mies van der Rohe, director from 1930, moved the school to Berlin after Dessau's council closed it in 1932. It was raided in April 1933 and dissolved by its own staff in summer 1933 (sources differ: July or August) ([Dezeen](https://www.dezeen.com/2018/11/19/mies-van-der-rohe-modernist-architect-third-director-bauhaus-100/amp/), [Bauhaus Kooperation](https://bauhauskooperation.de/en/knowledge/the-bauhaus/phases/berlin)). |

Key people and what they contributed:

- **Walter Gropius**: founder; 1919 programme; in 1923 redirected the school to the slogan "Art and Technology, a New Unity" ([ZKM](https://zkm.de/en/node/4174)).
- **Johannes Itten**: devised the Preliminary Course (Vorkurs) in 1919, mandatory from 1920; left in 1923 ([Getty](https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/), [Bauhaus Kooperation](https://bauhauskooperation.de/en/knowledge/the-bauhaus/training/preliminary-course/johannes-ittens-preliminary-course)).
- **Wassily Kandinsky** (taught 1922-1933): form and colour theory; the 1923 questionnaire.
- **Laszlo Moholy-Nagy**: took over the Preliminary Course in 1923 with Josef Albers; "New Typography" and typophoto.
- **Herbert Bayer**: Dessau print workshop; the Universal alphabet (designed 1925-1930, never cast as metal type) ([Wikipedia](https://en.wikipedia.org/wiki/Herbert_Bayer)).
- **Josef Albers**: colour and material teaching; later *Interaction of Color* (1963) ([Albers Foundation](https://www.albersfoundation.org/alberses/teaching/interaction-of-color)).

---

## 2. Principles

### P1. Unity of the arts, crafts and building

The 1919 programme states "The ultimate aim of all visual arts is the complete building!" and "There is no essential difference between the artist and the craftsman." Architecture, sculpture and painting were to be reunited in "the new structure of the future" ([GHDI](https://germanhistorydocs.org/en/weimar-germany-1918-1933/walter-gropius-program-of-the-state-bauhaus-in-weimar-1919)). The Getty links this to the *Gesamtkunstwerk* ([Getty](https://getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/history/)).

**In UI terms:** one system, not a pile of widgets. Tokens, layout, type and decoration share one grammar, so a button, a card and a poster block feel like parts of the same building.

### P2. Art and technology, made for use

From 1923 the school's direction was "Art and Technology, a New Unity" ([ZKM](https://zkm.de/en/node/4174)). Design was meant for industrial production and everyday life, and under Meyer, for "the needs of the people" before luxury (ZKM). The Bauhaus did not coin "form follows function" (see Myths), but functional thinking was central to its output.

**In UI terms:** components exist to do a job (select, navigate, confirm). Every visual element must either carry meaning, structure content or aid input. Reproducible via tokens, not hand-tuned per screen.

### P3. Learn by doing: workshops and the Preliminary Course

Itten's Vorkurs had three parts: study of nature and materials (including colour and form theory), analysis of old masters, and life drawing. It stressed individual sensitivity to material, texture, colour and form, and relied on contrast studies (light-dark, material) ([Getty](https://getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/matter_materials/itten/), [Bauhaus Kooperation](https://bauhauskooperation.de/en/knowledge/the-bauhaus/training/preliminary-course/johannes-ittens-preliminary-course)). Moholy-Nagy and Albers reshaped it after 1923.

**In UI terms:** the showcase should teach by demonstration. Live, editable examples and visible tokens beat prose. Contrast (size, weight, hue, light/dark) is the working vocabulary.

### P4. Elementary forms: circle, square, triangle

Kandinsky's 1923 questionnaire asked students to assign yellow, red and blue to the triangle, square and circle. His intended answer was yellow triangle, red square, blue circle, with yellow "sharp", red "earthbound", blue "spiritual" ([Google Arts & Culture](https://artsandculture.google.com/story/OwURAJwcVUkTow), [Meiner](https://meiner-elibrary.de/article/1709/kandinskys-bauhaus-questionnaire)). Caveat: recent scholarship reads it as a tool to build artistic sensibility, not as proof, and later replications found about half of students gave other pairings (e.g. red triangle as warning sign). Treat it as a convention, not a law.

**In UI terms:** a restricted shape vocabulary (circle, square, triangle and their fragments: quarter-circle, semicircle, bar, pill). The pairing is a good default for decorative props; never the only carrier of meaning.

### P5. Colour as material, with a limited palette

Colour was taught systematically: Itten's twelve-hue star (1921), based on Runge's sphere, and later Albers' exercises showing colour as relative and unstable ([Getty](https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/), [Albers Foundation](https://www.albersfoundation.org/alberses/teaching/interaction-of-color)). Albers' book dates from 1963; one O'Reilly page says 1961, the Foundation and most sources say 1963.

**In UI terms:** solid fields of red, yellow, blue plus black and a neutral ground. Because colour is relative, always test it in context (yellow needs ink on top; contrast checks per pairing, not per swatch). Use colour for meaning (status, category, step).

### P6. Typography as structure: sans-serif, lowercase, clarity

Moholy-Nagy's 1923 "New Typography" put absolute clarity first: legibility must never be impaired by a priori aesthetics ([Reading Design](https://www.readingdesign.org/the-new-typography)). He described it as "a simultaneous experience of vision and communication" ([Letterform Archive](https://letterformarchive.org/news/bauhaus-typefaces-part-one/)). Publications used plain sans-serifs and the *bauhaus* magazine dropped capitals (Letterform Archive). Bayer's Universal (1925-1930) is a geometric lowercase sans that was never cast in metal ([Wikipedia](https://en.wikipedia.org/wiki/Herbert_Bayer)). Caveat: the efficiency rationale for lowercase comes from secondary summaries, not a verified Bayer quote, and Letterform Archive notes that the 1923 catalogue's wide text blocks hurt legibility, so practice lagged theory.

**In UI terms:** a type scale with extreme contrast, sans-serif only, optional lowercase display headings, uppercase for small labels. Body text must stay readable (line length, size); decoration never beats legibility.

### P7. Typophoto: word and image as one communication

Moholy-Nagy coined "typophoto" in *Painting, Photography, Film* (1925), defined as the visually most exact rendering of communication ([OpenLab reader](https://openlab.citytech.cuny.edu/comd3504-hd61-spring2022/files/2018/10/MoholyNagy_Typophoto.pdf)). Text, rules, photography and colour blocks are composed together on a page.

**In UI terms:** type, rules, images and colour blocks sit in the same grid cell logic. Photography is cut out, desaturated, or placed over a colour field rather than floated as decoration.

### P8. Asymmetric, rationally ordered composition

The "New Typography" tradition favoured asymmetric layouts built from straight lines and clear hierarchy ([Slanted](https://www.slanted.de/?p=572168)). The explicit grid-as-system is mostly a later codification (see Myths), but orthogonal order and tension through scale and position are Bauhaus-era traits.

**In UI terms:** off-centre compositions, large scale contrast, visible modular cells. Avoid default centred "hero + subtitle + button".

### P9. Reduction: no applied ornament

The Bauhaus rejected Jugendstil ornament in favour of unadorned, mass-producible forms (Letterform Archive, above). Gropius's programme opposes the "arrogant barrier" between craftsman and artist, not decoration as such, but the school's output is consistently reductive.

**In UI terms:** no gradients, glows, blur shadows or skeuomorphism. Depth comes from overlap and flat offset. Any decorative shape must sit on the grid and frame content.

### P10. Community and the end of class barriers

The programme calls for "a new guild of craftsmen without the class distinctions that raise an arrogant barrier between craftsman and artist" ([GHDI](https://germanhistorydocs.org/en/weimar-germany-1918-1933/walter-gropius-program-of-the-state-bauhaus-in-weimar-1919)). The Tate summarises this as replacing the pupil-teacher relationship with "a community of artists working together" ([Tate](https://www.tate.org.uk/art/art-terms/b/bauhaus)).

**In UI terms:** accessible by default. Everyone, including keyboard and screen-reader users, gets the same quality of interface. Open documentation, shared tokens, no insider-only styling.

### P11. Experiment and kinetic form

The school treated media as open to experiment (photography, film, light plays). In this library, the BHause reference turns primitives into slow loops, in the spirit of the colour-light plays (see `style-analysis.md`).

**In UI terms:** motion is short and linear for UI, slow and looping for decoration, and fully disabled under `prefers-reduced-motion`.

---

## 3. Principle by look

Scale: **High** = defining trait, **Med** = present but adapted, **Low** = weak or deliberately set aside.

| Principle | Playful | Swiss | Soft |
|---|---|---|---|
| P1 Unity of system | High: mosaics, one shape grammar | High: grid and type govern everything | Med: shared palette, rounded cards |
| P2 Function and use | Med: bold affordances (pills, chunky buttons) | High: type and rules only, nothing extra | High: product UI, status colour |
| P3 Learn by doing | Med: playful demos | Med: specimen-like demos | Med: guided steps |
| P4 Elementary forms | High: quarter-circles, pills, tiles | Low: circle crops, orbit rings only | Med: large circles, outline rings |
| P5 Colour as material | High: saturated flat fields | Low: monochrome, single accent | Med: cream ground, triad as semantic tags |
| P6 Typography as structure | Med: heavy geometric display | High: grotesk, tight tracking, scale contrast | Med: light geometric, big numerals |
| P7 Typophoto | Med: type over colour tiles | High: B/W photo, rules, captions | Med: B/W photo in colour header |
| P8 Asymmetric order | Med: dense tile grids | High: hairline cells, offset words | Low: more centred, card-based |
| P9 Reduction | Med: flat, hard shadows | High: almost no ornament | Med: decor circles, rounded radius |
| P10 Accessibility and community | Med: contrast must be checked on saturated fields | High: high contrast, large type | Med: watch cream/coral contrast |
| P11 Kinetic form | High: rotating primitives | Low: reveal and wipe only | Med: carousels, stacking |

Notes:

- Rounded corners (~16-24px) in Soft are a modern softening; the historical vocabulary is sharp rectangle plus perfect circle (see `style-analysis.md` section 5.3).
- Swiss is the least Bauhaus-native in era, but the most explicit in its grid and typography (see Myths).

---

## 4. Principles for the showcase site

Concrete rules for the documentation website, so it embodies what it demonstrates:

1. **Function first.** Every block on a page answers a reader's task (find, compare, copy, install). If a shape does not frame content or carry meaning, remove it.
2. **One visible grid.** A 12-column grid, 8px base unit, hairline rules (`1px`, rule colour) between header, nav, sidebar and content cells. Nothing floats off-grid.
3. **Colour as material.** Large solid fields of red, yellow and blue on paper (`#F4EFE6`) or white, with ink for text. One strong accent per screen plus at most two supporting. No gradients, no blur, no glass.
4. **Colour carries meaning.** Use the triad for status, category and navigation state, consistently across pages. Yellow is always a fill with ink text.
5. **Typography is structure.** Sans-serif only. Giant display against small captions (scale 6-12x). Uppercase tracked labels, optional lowercase headings. Emphasis by weight and grey-to-ink, not italics or decoration.
6. **Primitives only.** Hero and section decoration come from circle, square, triangle and their fragments, placed on the grid. Kandinsky's pairing (yellow triangle, red square, blue circle) is the default; never the sole signal.
7. **Asymmetry with balance.** Offset headlines, uneven column spans, no centred hero-subtitle-button stack.
8. **Show, don't tell.** Each component page leads with a live example and visible tokens (colour, radius, spacing), then code, then props. This mirrors the workshop and Vorkurs approach.
9. **Flat depth.** Elevation only as hard offset shadow (`4px 4px 0`, zero blur) or overlap. Radius is 0 or full; mid radii only inside the Soft look and labelled as such.
10. **Photography is B/W or desaturated**, cut out and placed over colour blocks, with a caption in the grid.
11. **Motion is restrained.** UI transitions 150-250ms ease-out; kinetic shapes slow and linear, decorative only; all stopped under `prefers-reduced-motion`.
12. **Accessible, open, shareable.** WCAG AA contrast verified per colour pair, visible focus states, keyboard navigation, semantic HTML. The Bauhaus aim of removing barriers applies to readers as well.
13. **Separate looks honestly.** The site shows Playful, Swiss and Soft side by side, and states which is the historical core and which are later descendants.
14. **Cite history accurately.** Dates, quotes and attributions on the site follow this document; correct the myths below rather than repeating them.

---

## 5. Common myths and corrections

| Myth | Correction | Source |
|---|---|---|
| "Form follows function" is a Bauhaus slogan | Coined by Louis Sullivan in 1896 ("The Tall Office Building Artistically Considered", "form ever follows function"). It became a modernist battle cry after the 1930s. The Bauhaus's own slogan from 1923 was "Art and Technology, a New Unity". | [Wikipedia](https://en.wikipedia.org/wiki/Form_follows_function), [ZKM](https://zkm.de/en/node/4174) |
| Swiss style is Bauhaus | It is a later descendant, formed in the 1950s-60s (Basel and Zurich schools, Helvetica in 1957), drawing on the Bauhaus, Russian Constructivism and other modernist currents. Some sources use "International Typographic Style" for a broader or earlier span, so terms vary. | [Swiss National Library](https://www.nb.admin.ch/en/the-international-style-1950-1970), [Wikipedia](https://en.wikipedia.org/wiki/International_Typographic_Style) |
| Constructivism is Bauhaus | Related and mutually influential, but distinct. Constructivism (e.g. El Lissitzky) is more diagonal and propagandistic; the Bauhaus more orthogonal and functional. Moholy-Nagy and Lissitzky connect the two, and the "bioscopic book" ideas fed typophoto. | [Disegno essay](https://disegno.mome.hu/articles/Disegno_2021_1-2_06-Sofia_Leal_Rodrigues.pdf), `style-analysis.md` |
| The Bauhaus was a style (white cubes, primary colours) | It was a school with changing aims: craft and expressionism under Gropius/Itten (1919-23), technology and industry from 1923, a more social/functional line under Meyer. The "style" is partly a later construction. | [Tate](https://www.tate.org.uk/art/art-terms/b/bauhaus), [Met](https://www.metmuseum.org/toah/hd/bauh/hd_bauh.htm) |
| Bauhaus type was all lowercase, one universal font | The Universal alphabet was designed (1925-1930) but never cast in metal. The *bauhaus* magazine dropped capitals, yet official publications also used mixed case and serif text in places (e.g. the 1923 catalogue text). | [Wikipedia](https://en.wikipedia.org/wiki/Herbert_Bayer), [Letterform Archive](https://letterformarchive.org/news/bauhaus-typefaces-part-one/) |
| Kandinsky proved colour and form correspond | The 1923 questionnaire was a pedagogical exercise; later studies found students often chose other pairings. | [Google Arts & Culture](https://artsandculture.google.com/story/OwURAJwcVUkTow) |
| The Bauhaus ended in one place and date | Three sites (Weimar, Dessau, Berlin). Dessau closure 1932, Berlin raid April 1933, dissolution July/August 1933 depending on source. | [Bauhaus Kooperation](https://bauhauskooperation.de/en/knowledge/the-bauhaus/phases/berlin) |

---

## 6. Sources

Primary or near-primary:

- Gropius, "Program of the Staatliche Bauhaus in Weimar" (April 1919), Wingler/GHDI translation: https://germanhistorydocs.org/en/weimar-germany-1918-1933/walter-gropius-program-of-the-state-bauhaus-in-weimar-1919
- Moholy-Nagy, "The New Typography" (1923): https://www.readingdesign.org/the-new-typography
- Moholy-Nagy, "Typophoto" (1925): https://openlab.citytech.cuny.edu/comd3504-hd61-spring2022/files/2018/10/MoholyNagy_Typophoto.pdf

Museums and foundations:

- Tate, "Bauhaus": https://www.tate.org.uk/art/art-terms/b/bauhaus
- Getty, Bauhaus history: https://getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/history/
- Getty, colour: https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/
- Getty, "Learning with Itten": https://getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/matter_materials/itten/
- Bauhaus Kooperation, Itten's preliminary course: https://bauhauskooperation.de/en/knowledge/the-bauhaus/training/preliminary-course/johannes-ittens-preliminary-course
- Bauhaus Kooperation, Bauhaus Berlin: https://bauhauskooperation.de/en/knowledge/the-bauhaus/phases/berlin
- Josef & Anni Albers Foundation, Interaction of Color: https://www.albersfoundation.org/alberses/teaching/interaction-of-color
- ZKM, "Art, Crafts, Technology": https://zkm.de/en/node/4174
- Met, "The Bauhaus, 1919-1933" (could not be fetched at time of writing, rate-limited; cited via search summary): https://www.metmuseum.org/toah/hd/bauh/hd_bauh.htm
- MoMA catalogue (Meyer's tenure to 1930): https://assets.moma.org/documents/moma_catalogue_2735_300190238.pdf
- Google Arts & Culture, "Bauhaus: The Importance of Shapes": https://artsandculture.google.com/story/OwURAJwcVUkTow

Secondary:

- Letterform Archive, "Bauhaus typefaces, part one": https://letterformarchive.org/news/bauhaus-typefaces-part-one/
- Kandinsky's Bauhaus Questionnaire (Immelmann et al., 2019): https://meiner-elibrary.de/article/1709/kandinskys-bauhaus-questionnaire
- Herbert Bayer (Wikipedia): https://en.wikipedia.org/wiki/Herbert_Bayer
- Form follows function (Wikipedia): https://en.wikipedia.org/wiki/Form_follows_function
- International Typographic Style (Wikipedia): https://en.wikipedia.org/wiki/International_Typographic_Style
- Swiss National Library, The International Style 1950-1970: https://www.nb.admin.ch/en/the-international-style-1950-1970
- Slanted, "Moholy-Nagy and the New Typography": https://www.slanted.de/?p=572168
- Dezeen, Mies van der Rohe and the Bauhaus: https://www.dezeen.com/2018/11/19/mies-van-der-rohe-modernist-architect-third-director-bauhaus-100/amp/
- Rodrigues, Disegno 2021 (typophoto and Lissitzky): https://disegno.mome.hu/articles/Disegno_2021_1-2_06-Sofia_Leal_Rodrigues.pdf

Open verification items: bauhaus100.de and bauhaus-dessau.de pages were not retrievable; a direct Bayer quotation on lowercase and the exact Kandinsky questionnaire text were not verified from primary sources.
