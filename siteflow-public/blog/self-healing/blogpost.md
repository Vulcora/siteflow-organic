# "Let it crash" – självläkande system som aldrig går ner

Tänk om ditt system kunde läka sig självt.

Inte efter timmar av felsökning. Inte efter att någon vaknat mitt i natten.
**På mikrosekunder. Automatiskt. Utan att någon märker det.**

Det är filosofin bakom "Let it crash" – och det är så vi bygger våra system.

---

## Den kontraintuitiva sanningen

I traditionell programmering försöker vi förhindra alla fel:
- try-catch-block överallt
- defensiv kod som kontrollerar allt
- komplexa återhämtningsrutiner

Resultatet? Kod som är:
- svår att läsa och underhålla
- långsam (alla kontroller tar tid)
- ändå sårbar (vi kan inte förutse alla fel)

**"Let it crash" vänder på logiken:**

I stället för att förhindra fel, accepterar vi att fel händer.
Men vi ser till att systemet **återhämtar sig automatiskt**.

---

## Hur fungerar det i praktiken?

Varje del av systemet körs i en egen isolerad process (en "actor").
Ovanför dessa finns "supervisors" – övervakare som håller koll.

När något går fel:

1. **Processen kraschar** (snabbt och rent, ingen korrupt data)
2. **Supervisorn upptäcker det** (på mikrosekunder)
3. **En ny process startas** (med känt, rent tillstånd)
4. **Systemet fortsätter** (resten påverkades aldrig)

Det hela tar typiskt **mindre än en millisekund**.

---

## Varför är det bättre?

### Snabbare återhämtning
Traditionellt: upptäck fel → larma → någon vaknar → felsök → fixa → deploya
Med "Let it crash": krasch → omstart → klart (automatiskt, på millisekunder)

### Renare kod
Ingen defensiv kod överallt. Varje funktion gör sitt jobb.
Om något oväntat händer – krasch och omstart med rent tillstånd.

### Ingen "zombie state"
I traditionella system kan fel leda till att systemet hamnar i ett halvdött tillstånd – det kör, men fungerar inte riktigt. Med "Let it crash" finns bara två tillstånd: fungerande eller omstartande.

### Bättre felsökning
När ett fel inträffar får vi en tydlig kraschrapport. Ingen mystisk bugg som bara händer ibland och är omöjlig att återskapa.

---

## Ericsson visste detta redan 1987

Erlang skapades av Ericsson för telekomsystem där driftstopp kostar miljoner.

Deras mål: **99,9999999% upptid** (ungefär 31 millisekunder nere per år).

De uppnådde det. Och hemligheten var just "Let it crash" kombinerat med supervisors.

### AXD301 – ett legendariskt system
- Ericsons ATM-switch
- Miljontals telefonsamtal samtidigt
- "Nine nines" upptid (99,9999999%)
- Har kört oavbrutet i årtionden

---

## Supervisorträd – hierarkisk resiliens

Supervisors organiseras i träd:

```
           [Root Supervisor]
                 |
    +------------+------------+
    |            |            |
[WebSocket]  [Database]  [Background Jobs]
    |            |            |
 (users)     (queries)     (tasks)
```

Om en användares websocket kraschar → bara den användaren påverkas.
Om hela websocket-supervisorn kraschar → den startas om, alla användare återansluter.
Om root-supervisorn kraschar → hela systemet startas om (extremt sällsynt).

Varje nivå fångar och hanterar fel på sin nivå.

---

## Verkliga fördelar för dig

**Färre nattliga larm**
Systemet hanterar de flesta problem själv.

**Snabbare incident-hantering**
När du väl behöver titta på ett problem har du tydliga loggar och kraschrapporter.

**Högre kundnöjdhet**
Dina användare märker sällan problem – systemet återhämtar sig innan de hinner klaga.

**Lägre driftkostnader**
Mindre manuell övervakning och felsökning behövs.

---

## Sammanfattning

"Let it crash" är inte slarv – det är ingenjörskonst.

Det är erkännandet att vi inte kan förutse alla fel, kombinerat med en arkitektur som gör fel ofarliga.

Vi bygger system som:
- accepterar att fel händer
- isolerar fel så de inte sprider sig
- återhämtar sig automatiskt på mikrosekunder
- ger dig tydlig information när du behöver undersöka

**Resultatet?** System som "bara funkar" – även när saker går snett.
