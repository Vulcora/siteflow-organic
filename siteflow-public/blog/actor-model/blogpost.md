# Actor-modellen – så hanterar vi miljontals användare samtidigt

WhatsApp hanterar miljarder meddelanden varje dag med förvånansvärt få servrar.
Discord streamar röst och video till miljoner användare utan att hacka.
Ericssons telekomsystem har 99,9999999% upptid.

Vad har de gemensamt? **Actor-modellen.**

---

## Vad är Actor-modellen?

Tänk dig ett kontor där varje anställd har sitt eget rum, sin egen inkorg och sitt eget minne.

- Ingen kan gå in i någon annans rum
- All kommunikation sker via meddelanden i inkorgen
- Om en person blir sjuk påverkas inte de andra

Det är Actor-modellen i ett nötskal.

I traditionella system delar alla trådar på samma minne – som om alla anställda satt i ett öppet kontorslandskap och försökte skriva i samma dokument samtidigt. Kaos uppstår.

---

## Varför blir systemet snabbare när det används mer?

Det låter bakvänt, men det stämmer.

I Actor-modellen är varje användare en egen lättviktig process (en "actor"). När fler användare ansluter skapas fler actors – och de körs **parallellt** på alla tillgängliga processorkärnor.

Moderna servrar har 64, 128 eller fler kärnor. De flesta traditionella system kan bara använda en bråkdel av den kapaciteten. Actor-modellen utnyttjar **alla kärnor automatiskt**.

Resultatet:
- 10 användare → systemet använder 10 kärnor
- 100 000 användare → systemet använder alla kärnor, parallellt
- Varje användare får en dedikerad "arbetare"

---

## Isolering = stabilitet

Varje actor är helt isolerad från de andra.

Om en användares session kraschar (fel data, timeout, bugg) påverkas **ingen annan**. Systemet startar om just den actorn på mikrosekunder och fortsätter som vanligt.

Jämför med traditionella system där en krasch i en tråd kan ta ner hela servern, eller i värsta fall hela systemet.

---

## Verkliga exempel

### WhatsApp
- 900 miljoner användare
- 50 miljarder meddelanden per dag
- Kördes länge på bara ~100 servrar
- Byggd på Erlang/Actor-modellen

### Discord
- 150 miljoner aktiva användare
- Realtidsröst och video
- Elixir i backend
- Hanterar miljoner samtidiga anslutningar

### Ericsson
- Telekomsystem med 99,9999999% upptid
- Skapade Erlang specifikt för detta
- Har kört i produktion sedan 1980-talet

---

## Hur påverkar det dig?

Om du bygger ett system med oss får du:

**Äkta skalbarhet**
Systemet växer organiskt med din verksamhet. Ingen "big bang"-migrering behövs när du får fler kunder.

**Förutsägbara kostnader**
Eftersom vi utnyttjar hårdvaran effektivt behöver du inte överprovisioner "för säkerhets skull".

**Hög stabilitet**
Fel i en del av systemet sprider sig inte. Dina kunder märker inte när något går snett i bakgrunden.

**Framtidssäkert**
Actor-modellen är perfekt för AI-agenter, realtidsflöden och IoT – allt som kräver massiv parallellism.

---

## Sammanfattning

Actor-modellen är inte ny teknik – den har bevisat sig i världens mest krävande system i över 30 år.

Det som är nytt är att den nu är tillgänglig för alla typer av projekt, inte bara telekomjättar.

Vi använder den för att bygga system som:
- tål miljontals användare
- aldrig går ner helt
- kostar en bråkdel av alternativen

**Vill du veta mer?** Kontakta oss för en kostnadsfri genomgång av hur Actor-modellen kan passa ditt projekt.
