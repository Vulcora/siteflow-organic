# Siteflow Prislista - JSON API & Dokumentation

## Översikt

Denna mapp innehåller Siteflows kompletta prislista i olika format:
- **JSON** - Strukturerad data för programmatisk användning
- **PDF** - Professionellt formaterad prislista för kunder
- **Python** - Exempel på hur man använder JSON-datan



## JSON-struktur

JSON-filen innehåller följande huvudsektioner:

### 1. Företagsinformation
```json
{
  "company": {
    "name": "Siteflow",
    "currency": "SEK",
    "vat_rate": 0.25,
    "contact": { ... }
  }
}
```

### 2. Timpriser
Timpriser för olika roller och kompetenser:
```json
{
  "hourly_rates": {
    "rates": [
      {
        "role": "Senior Elixir-arkitekt",
        "price_per_hour": 1600,
        "level": "Senior"
      },
      ...
    ]
  }
}
```

### 3. Paketerade tjänster
```json
{
  "packaged_services": {
    "services": [
      {
        "name": "MVP-system",
        "price_min": 200000,
        "price_max": 400000,
        "duration": "4-8 veckor"
      }
    ]
  }
}
```

### 4. Designtjänster
Logotyper, varumärkesidentitet, UI/UX-design

### 5. Integrationer
API-integrationer med olika komplexitetsnivåer

### 6. Hosting (Fly.io)
4 olika hosting-paket med specificerade kostnader

### 7. Support & Underhåll
Från Basic till Enterprise-support

### 8. Kodägandeskap
```json
{
  "code_ownership": {
    "models": [
      {
        "name": "Licensmodell",
        "multiplier": 1.0
      },
      {
        "name": "Delad äganderätt",
        "multiplier": 1.3
      },
      {
        "name": "Full äganderätt",
        "multiplier": 2.0
      }
    ]
  }
}
```

### 9. Workshops & Utbildning

### 10. Övriga tjänster
Kodgranskning, Due Diligence, Akutsupport, SLA-övervakning

### 11. Betalningsvillkor

### 12. Prislogik
Innehåller formler och exempel på beräkningar

## Använda Python-exemplet

### Installation
Inga extra beroenden behövs - bara Python 3.6+

### Köra exemplet
```bash
python3 prisberakning_exempel.py
```

### Funktioner i Python-exemplet

#### 1. Beräkna projektkostnad
```python
result = calculate_project_cost(
    hours=300,
    role='Elixir-utvecklare',
    ownership_model='shared'  # 'license', 'shared', eller 'full'
)

print(f"Totalkostnad: {result['final_cost']:,} kr")
```

#### 2. Hämta hosting-kostnader
```python
hosting = calculate_monthly_hosting('Growth')
print(f"Månadskostnad: {hosting['costs']['total_monthly']} kr")
```

#### 3. Beräkna support-kostnader
```python
support = calculate_support_annual_cost('Standard Support')
print(f"Årskostnad: {support['annual']:,} kr")
```

#### 4. Hitta paketerad tjänst
```python
mvp = find_packaged_service('MVP-system')
print(f"Prisintervall: {mvp['price_min']} - {mvp['price_max']} kr")
```

## Användningsexempel

### Exempel 1: Beräkna komplett projekt

```python
import json

with open('siteflow-prislista.json', 'r') as f:
    pricing = json.load(f)

# Projektdata
project = {
    'senior_architect_hours': 80,
    'developer_hours': 400,
    'frontend_hours': 200,
    'ownership_model': 'shared'  # 1.3x multiplier
}

# Hitta timpriser
rates = {r['role']: r['price_per_hour'] for r in pricing['hourly_rates']['rates']}

# Beräkna
base_cost = (
    project['senior_architect_hours'] * rates['Senior Elixir-arkitekt'] +
    project['developer_hours'] * rates['Elixir-utvecklare'] +
    project['frontend_hours'] * rates['Frontend-utvecklare']
)

# Applicera ägandemodell
ownership_multiplier = 1.3  # Delad äganderätt
final_cost = base_cost * ownership_multiplier

# Lägg till moms
vat = final_cost * pricing['company']['vat_rate']
total_with_vat = final_cost + vat

print(f"Baspris: {base_cost:,} kr")
print(f"Efter ägandemodell: {final_cost:,} kr")
print(f"Inkl. moms: {total_with_vat:,} kr")
```

### Exempel 2: Jämför hosting-alternativ

```python
import json

with open('siteflow-prislista.json', 'r') as f:
    pricing = json.load(f)

print("Hosting-kostnader per år:\n")

for package in pricing['hosting']['packages']:
    monthly = package['costs']['total_monthly']
    annual = monthly * 12
    
    print(f"{package['name']:12} {annual:>8,} kr/år")
    print(f"  Specs: {package['specs']['cpu']}, {package['specs']['ram_gb']}GB RAM")
    print()
```

### Exempel 3: Skapa offert

```python
import json
from datetime import datetime

with open('siteflow-prislista.json', 'r') as f:
    pricing = json.load(f)

# Offertdata
quote = {
    'customer': 'Acme AB',
    'date': datetime.now().strftime('%Y-%m-%d'),
    'project': 'E-handelsplattform',
    'items': []
}

# Lägg till tjänster
mvp = next(s for s in pricing['packaged_services']['services'] 
           if s['name'] == 'MVP-system')

quote['items'].append({
    'description': mvp['name'],
    'price': 300000,
    'ownership': 'Delad äganderätt (1.3x)',
    'final_price': 300000 * 1.3
})

# Lägg till hosting (12 månader)
hosting = next(p for p in pricing['hosting']['packages'] 
               if p['name'] == 'Growth')

quote['items'].append({
    'description': 'Hosting Growth - 12 månader',
    'price': hosting['costs']['total_monthly'] * 12
})

# Beräkna totalt
subtotal = sum(item.get('final_price', item['price']) 
               for item in quote['items'])
vat = subtotal * pricing['company']['vat_rate']
total = subtotal + vat

quote['subtotal'] = subtotal
quote['vat'] = vat
quote['total'] = total

# Skriv ut offert
print(f"OFFERT - {quote['customer']}")
print(f"Datum: {quote['date']}")
print(f"Projekt: {quote['project']}\n")

for item in quote['items']:
    price = item.get('final_price', item['price'])
    print(f"{item['description']}: {price:,} kr")
    if 'ownership' in item:
        print(f"  ({item['ownership']})")

print(f"\nDelsumma: {subtotal:,} kr")
print(f"Moms (25%): {vat:,} kr")
print(f"TOTALT: {total:,} kr")
```

## API-integration

JSON-filen kan enkelt användas i webbapplikationer:

### JavaScript/Node.js
```javascript
const pricing = require('./siteflow-prislista.json');

// Hitta timpris
const elixirDev = pricing.hourly_rates.rates.find(
  r => r.role === 'Elixir-utvecklare'
);

console.log(`Timpris: ${elixirDev.price_per_hour} kr`);
```

### REST API (Express.js exempel)
```javascript
const express = require('express');
const pricing = require('./siteflow-prislista.json');

const app = express();

app.get('/api/hourly-rates', (req, res) => {
  res.json(pricing.hourly_rates);
});

app.get('/api/hosting/:package', (req, res) => {
  const pkg = pricing.hosting.packages.find(
    p => p.name.toLowerCase() === req.params.package.toLowerCase()
  );
  res.json(pkg);
});

app.listen(3000);
```

### React/TypeScript
```typescript
import pricingData from './siteflow-prislista.json';

interface HourlyRate {
  role: string;
  level: string;
  price_per_hour: number;
  description: string;
}

function PricingTable() {
  const rates: HourlyRate[] = pricingData.hourly_rates.rates;
  
  return (
    <table>
      <thead>
        <tr>
          <th>Roll</th>
          <th>Nivå</th>
          <th>Timpris</th>
        </tr>
      </thead>
      <tbody>
        {rates.map((rate, i) => (
          <tr key={i}>
            <td>{rate.role}</td>
            <td>{rate.level}</td>
            <td>{rate.price_per_hour} kr</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Beräkningslogik

### Projektkostnad
```
Baspris = Timmar × Timpris × Teamstorlek
Ägandemodell = Baspris × Multiplier
Moms = Ägandemodell × 0.25
Totalt = Ägandemodell + Moms
```

### Ägandemodeller
- **Licensmodell**: 1.0x (baspris)
- **Delad äganderätt**: 1.3x (+30%)
- **Full äganderätt**: 1.8x (+80%)
- **Source Code Escrow**: +25 000 kr engång + 8 000 kr/år

### Hosting
```
Total månadskostnad = Fly.io-kostnad + Siteflow förvaltning
```

## Uppdateringar

För att uppdatera priser, redigera JSON-filen och kör:
```bash
python3 prisberakning_exempel.py
```

för att verifiera att alla beräkningar fungerar korrekt.

## Kontakt

**Siteflow**
- E-post: info@siteflow.se
- Webb: www.siteflow.se
- Telefon: [telefonnummer]

## Licens

© 2025 Siteflow. Alla priser och villkor är proprietära.

---

*Senast uppdaterad: 2025-11-26*