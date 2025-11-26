# Tekniken bakom Siteflow – därför kan vi göra mer med färre servrar

Du ska inte behöva vara tekniker för att ha nytta av bra teknik.  
Men det är värt att förstå **en sak**:

> Alla tekniska plattformar kostar inte lika mycket per kund att drifta.

Vissa kräver många stora servrar för ganska lite last.  
Andra är byggda för att klara enorm trafik på förvånansvärt få maskiner.

---

## Från telekom till chattappar – samma problem, samma lösning

Tekniken vi bygger på kommer ursprungligen från telekomvärlden:

- system som måste vara igång dygnet runt  
- miljontals användare som ringer, sms:ar och surfar samtidigt  
- kravet att ett fel inte får krascha hela systemet

Senare dök samma behov upp i:

- chattappar som WhatsApp och Discord  
- trading- och betalningssystem  
- realtidsplattformar och spel

Gemensamt: **hög belastning, höga krav på stabilitet.**

---

## Vad gör Elixir/Erlang annorlunda?

Elixir är språket vi skriver i.  
Erlang/BEAM är motorn under huven.

Tillsammans ger de några egenskaper som spelar stor roll för din ekonomi:

- Varje användare hanteras i en **lättviktig process** i stället för tunga operativsystemstrådar.  
- Miljontals sådana processer kan köras parallellt på samma maskin.  
- Om en del kraschar kan den startas om utan att resten påverkas.

Praktiskt betyder det:

- **fler kunder per server**  
- färre driftstopp  
- enklare felsökning (problemen är isolerade)

---

## Mer kapacitet, mindre slöseri

När man bygger på den här typen av motor kan man:

- komprimera många funktioner i ett och samma system  
- utnyttja maskinernas kapacitet bättre  
- slippa vissa extra lager som annars behövs bara för att “patcha” svagheter i stacken

För dig syns det här som:

- lägre molnnota  
- mindre behov av att köpa in fler servrar vid toppar  
- stabilitet även när ni växer eller kör kampanjer

I vissa kända exempel har Elixir/Erlang-system hanterat miljontals samtidiga användare med en förhållandevis liten serverpark.  
Det visar vad som är möjligt när grundtekniken är byggd för effektivitet.

---

## Varför gör inte alla så här?

Bra fråga.

Svaret är en kombination av:

- **vana:** många utvecklare kan andra språk sedan tidigare  
- **nätverkseffekt:** fler kan “standardstacken”, så den fortsätter väljas  
- **marknadsföring:** stora språk och plattformar har stora bolag bakom sig

Det gör att lösningar som är tekniskt överlägsna ibland förblir lite nischade,  
trots att de skulle kunna spara både pengar och problem för många.

---

## Varför vi har valt den här vägen

Siteflow är den del av Vulcora som bygger systemen.  
Vi har valt Elixir och den här tekniska grunden av en enkel anledning:

- den låter oss bygga **få, starka system**  
- den skalar från små bolag till jättar  
- den har redan bevisat sig i miljöer där fel inte får ske

För dig betyder det att du får:

- system som tål tillväxt utan att molnnotan exploderar  
- hög stabilitet utan att du behöver förstå alla tekniska detaljer  
- en grund som är redo för framtidens krav – inklusive AI och realtidsflöden

Du behöver inte kunna ordet “BEAM” för att ha nytta av det.  
Det räcker att veta att din teknik inte är vald för att den är trendig,  
utan för att den är **bevisat hållbar** där det verkligen gäller.
