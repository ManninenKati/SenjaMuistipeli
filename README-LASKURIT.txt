SENJAN MUISTIPELI - JULKISET LASKURIT

Pelin alareunassa näytetään:
Avattu X kertaa · Pelattu loppuun Y kertaa

Tekniikka:
- "Avattu" kasvaa kerran jokaisella sivun latauksella.
- "Pelattu loppuun" kasvaa, kun pelaaja löytää viimeisen parin.
- Luvut tallennetaan Netlify Blobsiin ja säilyvät uusien deploy-versioiden yli.
- Pelaajista ei tallenneta nimiä tai henkilötietoja.

TÄRKEÄÄ NETLIFY-JULKAISUSSA
Tämä versio sisältää Netlify Functionin ja @netlify/blobs-riippuvuuden.
Netlifyn pitää käsitellä projektin lähdekoodi, jotta funktio ja riippuvuus otetaan käyttöön.
Jos tavallinen "Already built it?" -pudotus julkaisee vain staattiset tiedostot eikä laskuri toimi,
käytä Netlifyn Git-deployta tai Netlify CLI:tä, jotta riippuvuudet asennetaan ja funktio niputetaan.
