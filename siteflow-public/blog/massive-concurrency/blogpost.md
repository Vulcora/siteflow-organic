# 100 000 anslutningar? Inga problem.

Medan andra servrar svettas vid 1 000 anslutningar, gäspar våra vid 100 000.

Det är inte skryt. Det är arkitektur.

---

## Concurrency-problemet förklarat

"Concurrency" betyder att hantera många saker samtidigt.

Tänk dig en reception på ett hotell:
- **Låg concurrency:** En receptionist, en kö. Alla väntar.
- **Hög concurrency:** 100 receptionister, ingen kö. Alla betjänas direkt.

De flesta system fungerar som det första exemplet.
Våra fungerar som det andra.

---

## Varför 1 000 anslutningar är en gräns för många

I traditionella system (Node.js, Python, Ruby, Java) är varje anslutning kopplad till en **tråd** eller **process** i operativsystemet.

**Problemet:**
- En OS-tråd kostar ~1MB minne
- 1 000 trådar = 1GB minne bara för att hålla anslutningar öppna
- 10 000 trådar = 10GB minne
- 100 000 trådar = inte realistiskt

**Lösningen de flesta väljer:** Skala horisontellt (fler servrar)
- Dyrt
- Komplext
- Introducerar nya problem (synkronisering, load balancing)

---

## Hur vi hanterar 100 000+ anslutningar

I Elixir/Erlang är varje anslutning en **lättviktig process** i den virtuella maskinen (BEAM).

**Skillnaden:**
- En BEAM-process kostar ~2KB minne
- 100 000 processer = 200MB minne
- 1 000 000 processer = 2GB minne

**500x mer effektivt.**

Och det handlar inte bara om minne:
- BEAM-processer startar på mikrosekunder
- Context switches är extremt snabba
- Ingen "thread contention" (processer delar inget)

---

## Benchmarks som visar skillnaden

### Phoenix (Elixir) vs Node.js vs Go

**Test:** 100 000 WebSocket-anslutningar på en server

| Framework | RAM-användning | Latency (P99) | Klarade testet |
|-----------|---------------|---------------|----------------|
| Phoenix   | 2.1 GB        | 3ms           | Ja             |
| Node.js   | 14.2 GB       | 89ms          | Instabil       |
| Go        | 5.8 GB        | 12ms          | Ja             |

Phoenix använder 7x mindre minne än Node.js och har 30x bättre latency.

### Phoenix Channels i produktion

Discord rapporterade:
- 5 miljoner samtidiga användare per guild-server
- 12 miljoner WebSocket events per sekund
- Latency under 10ms

---

## Vad betyder det för dig?

### Realtidsapplikationer
- Live dashboards som uppdateras för tusentals användare
- Chat med miljontals användare
- Multiplayer-spel med hundratusentals spelare

### IoT och sensorer
- Hundratusentals enheter som rapporterar data
- Realtidsbearbetning av alla strömmar
- Ingen batching behövs

### Trading och fintech
- Orderböcker med miljoner uppdateringar per sekund
- Låg latency är kritiskt
- Konsistens utan att offra hastighet

### Livestreaming och media
- Tusentals samtidiga tittare
- Realtidsinteraktion (reaktioner, kommentarer)
- Adaptiv kvalitet per användare

---

## C10K är gammalt – vi siktar på C10M

**C10K-problemet** (hantera 10 000 anslutningar) formulerades 1999 och var en stor utmaning då.

Idag pratar vi om **C10M** – 10 miljoner samtidiga anslutningar.

Med rätt arkitektur är det möjligt:
- WhatsApp hade 900M användare på 100 servrar
- Phoenix har demonstrerat 2M WebSocket-anslutningar på en maskin
- BEAM har körts med 134M processer i tester

---

## Det handlar inte om hårdvara

Du kan inte köpa dig ur concurrency-problem.

- Snabbare CPU hjälper inte om arkitekturen är blocking
- Mer RAM hjälper inte om varje anslutning kostar 1MB
- Fler servrar ökar bara komplexiteten

**Det handlar om arkitektur.**

Välj rätt grund, och en server kan göra vad tio inte klarar med fel grund.

---

## Praktiskt exempel: Live-dashboard

**Scenario:** 50 000 användare tittar på samma dashboard som uppdateras varje sekund.

**Traditionellt (Node.js):**
- Behöver minst 5-10 servrar
- Varje uppdatering skickas 50 000 gånger
- Risk för "thundering herd"-problem
- Komplex synkronisering mellan servrar

**Med Phoenix:**
- En server räcker
- Phoenix PubSub hanterar broadcast effektivt
- Varje användare har en dedikerad process
- Inga synkroniseringsproblem

---

## Sammanfattning

Concurrency är inte ett problem du löser med mer hårdvara.
Det är ett problem du löser med rätt arkitektur.

Vi bygger system som:
- Hanterar 100 000+ anslutningar på en server
- Håller latency under 10ms oavsett last
- Skalar vertikalt först, horisontellt sen
- Kostar en bråkdel av alternativen

**Har du ett concurrency-problem?** Låt oss visa hur vi kan lösa det – ofta med färre servrar än du har idag.
