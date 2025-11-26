// Case study types and data

export interface CaseStudyImage {
  src: string;
  alt: { sv: string; en: string };
}

export interface CaseStudyClient {
  name: string | null;
  industry: { sv: string; en: string };
  size?: { sv: string; en: string };
  logo?: string;
}

export interface CaseStudyMetric {
  value: string;
  label: { sv: string; en: string };
  trend?: 'up' | 'down';
}

export interface CaseStudyTestimonial {
  quote: { sv: string; en: string };
  author: string;
  role: { sv: string; en: string };
}

export interface CaseStudySection {
  id: string;
  heading: { sv: string; en: string };
  content: { sv: string; en: string };
  image?: CaseStudyImage;
}

export interface CaseStudy {
  slug: string;
  title: { sv: string; en: string };
  excerpt: { sv: string; en: string };
  heroImage: CaseStudyImage;
  publishDate: string;
  client: CaseStudyClient;
  tags: string[];
  services: { sv: string; en: string }[];
  metrics: CaseStudyMetric[];
  challenge: { sv: string; en: string };
  solution: { sv: string; en: string };
  testimonial?: CaseStudyTestimonial;
  sections: CaseStudySection[];
  duration?: { sv: string; en: string };
}

export const caseStudies: CaseStudy[] = [
  // Case 1: Logistikföretag (anonym)
  {
    slug: 'logistik-systemkonsolidering',
    title: {
      sv: 'Från 8 system till 2 – så halverade vi driftkostnaderna',
      en: 'From 8 Systems to 2 – How We Cut Operating Costs in Half'
    },
    excerpt: {
      sv: 'Ett medelstort logistikföretag kämpade med ett fragmenterat IT-landskap. Vi konsoliderade deras system och sänkte driftkostnaderna med 70%.',
      en: 'A mid-sized logistics company struggled with a fragmented IT landscape. We consolidated their systems and reduced operating costs by 70%.'
    },
    heroImage: {
      src: '/ilustration/1.png',
      alt: { sv: 'Logistik systemkonsolidering', en: 'Logistics system consolidation' }
    },
    publishDate: '2024-10-15',
    client: {
      name: null,
      industry: { sv: 'Logistik & Transport', en: 'Logistics & Transportation' },
      size: { sv: '150-300 anställda', en: '150-300 employees' }
    },
    tags: ['Elixir', 'PostgreSQL', 'API-integration', 'Docker'],
    services: [
      { sv: 'Systemarkitektur', en: 'System Architecture' },
      { sv: 'Systemutveckling', en: 'System Development' },
      { sv: 'Datamigrering', en: 'Data Migration' }
    ],
    metrics: [
      { value: '70%', label: { sv: 'Lägre driftkostnader', en: 'Lower operating costs' }, trend: 'down' },
      { value: '4x', label: { sv: 'Snabbare orderhantering', en: 'Faster order processing' }, trend: 'up' },
      { value: '8→2', label: { sv: 'Konsoliderade system', en: 'Consolidated systems' }, trend: 'down' },
      { value: '99.9%', label: { sv: 'Drifttid', en: 'Uptime' }, trend: 'up' }
    ],
    challenge: {
      sv: 'Företaget hade över tid ackumulerat åtta olika system för lagerhantering, orderflöden, fakturering och kundkommunikation. Ingen hade full överblick, och samma data matades in på flera ställen.',
      en: 'The company had accumulated eight different systems over time for inventory management, order flows, invoicing, and customer communication. No one had complete oversight, and the same data was entered in multiple places.'
    },
    solution: {
      sv: 'Vi kartlade alla flöden och byggde två robusta system som ersatte de åtta gamla. Med Elixir som grund fick de en plattform som klarar hög belastning och växer med verksamheten.',
      en: 'We mapped all flows and built two robust systems that replaced the eight old ones. With Elixir as the foundation, they got a platform that handles high loads and scales with the business.'
    },
    testimonial: {
      quote: {
        sv: 'Vi visste att något behövde göras, men vi hade inte trott att skillnaden skulle bli så stor. Nu har vi äntligen kontroll över våra flöden.',
        en: 'We knew something needed to be done, but we hadn\'t expected the difference to be this significant. Now we finally have control over our flows.'
      },
      author: 'Magnus Lindqvist',
      role: { sv: 'IT-ansvarig', en: 'IT Manager' }
    },
    sections: [
      {
        id: 'bakgrund',
        heading: { sv: 'Bakgrund', en: 'Background' },
        content: {
          sv: 'Företaget hade växt snabbt under 15 år. Varje ny utmaning hade lösts med ett nytt system – ett CRM här, ett lagerverktyg där, ett Excel-ark för rapportering. Resultatet var ett IT-landskap som ingen hade full överblick över.\n\nMedarbetarna ägnade timmar varje dag åt att kopiera data mellan system. Fel uppstod konstant. Och varje gång någon ville ändra något var svaret: "Det går inte i vårt system."',
          en: 'The company had grown rapidly over 15 years. Each new challenge had been solved with a new system – a CRM here, an inventory tool there, a spreadsheet for reporting. The result was an IT landscape that no one had complete oversight of.\n\nEmployees spent hours every day copying data between systems. Errors occurred constantly. And every time someone wanted to change something, the answer was: "Our system can\'t do that."'
        }
      },
      {
        id: 'analys',
        heading: { sv: 'Vår analys', en: 'Our Analysis' },
        content: {
          sv: 'Vi började med att kartlägga alla system och flöden:\n\n• 8 olika system för kärnverksamheten\n• 23 manuella integrationspunkter (ofta Excel)\n• 3 personer vars huvuduppgift var att "hålla ihop" systemen\n• Molnkostnader på över 60 000 kr/månad\n\nDet största problemet var inte de individuella systemen – det var att samma data levde på flera ställen utan synkronisering.',
          en: 'We started by mapping all systems and flows:\n\n• 8 different systems for core operations\n• 23 manual integration points (often Excel)\n• 3 people whose main task was to "hold together" the systems\n• Cloud costs of over 60,000 SEK/month\n\nThe biggest problem wasn\'t the individual systems – it was that the same data lived in multiple places without synchronization.'
        },
        image: {
          src: '/blog/System-zoo/system-zoo.png',
          alt: { sv: 'System-zoo illustration', en: 'System zoo illustration' }
        }
      },
      {
        id: 'losning',
        heading: { sv: 'Lösningen', en: 'The Solution' },
        content: {
          sv: 'Istället för att lappa och laga byggde vi två nya kärnssystem:\n\n**System 1: Operations Hub**\nHanterar lager, ordrar och leveranser i ett enda flöde. Real-tidsuppdateringar, inga manuella överföringar.\n\n**System 2: Business Intelligence**\nSamlar all data för rapportering och analys. Automatiserade rapporter ersatte timmar av manuellt Excel-arbete.\n\nBåda systemen byggdes med Elixir för att hantera hög last och säkerställa stabilitet.',
          en: 'Instead of patching and repairing, we built two new core systems:\n\n**System 1: Operations Hub**\nHandles inventory, orders, and deliveries in a single flow. Real-time updates, no manual transfers.\n\n**System 2: Business Intelligence**\nCollects all data for reporting and analysis. Automated reports replaced hours of manual Excel work.\n\nBoth systems were built with Elixir to handle high loads and ensure stability.'
        },
        image: {
          src: '/blog/System-zoo/system-flowchart.png',
          alt: { sv: 'Systemflödesdiagram', en: 'System flowchart' }
        }
      },
      {
        id: 'resultat',
        heading: { sv: 'Resultat', en: 'Results' },
        content: {
          sv: 'Efter sex månaders implementation och tre månaders parallellkörning var resultaten tydliga:\n\n• Driftkostnaderna sjönk från 60 000 till 18 000 kr/månad\n• Orderhanteringstiden minskade från 12 minuter till 3 minuter\n• Noll dubbelregistreringar – all data finns på ett ställe\n• De tre "systemhållarna" kunde fokusera på värdeskapande arbete istället\n\nSex månader efter go-live rapporterade företaget sin högsta kundnöjdhet någonsin – ett direkt resultat av snabbare och mer tillförlitliga leveranser.',
          en: 'After six months of implementation and three months of parallel operation, the results were clear:\n\n• Operating costs dropped from 60,000 to 18,000 SEK/month\n• Order processing time decreased from 12 minutes to 3 minutes\n• Zero double entries – all data exists in one place\n• The three "system keepers" could focus on value-creating work instead\n\nSix months after go-live, the company reported its highest customer satisfaction ever – a direct result of faster and more reliable deliveries.'
        }
      }
    ],
    duration: { sv: '9 månader', en: '9 months' }
  },

  // Case 2: E-handelsbolag
  {
    slug: 'ehandel-skalning',
    title: {
      sv: 'Black Friday utan krascher – så byggde vi för 10x trafik',
      en: 'Black Friday Without Crashes – How We Built for 10x Traffic'
    },
    excerpt: {
      sv: 'En e-handlare kraschade varje kampanj. Vi byggde om plattformen för att hantera 10x fler användare till 60% lägre molnkostnad.',
      en: 'An e-commerce retailer crashed every campaign. We rebuilt the platform to handle 10x more users at 60% lower cloud cost.'
    },
    heroImage: {
      src: '/ilustration/2.png',
      alt: { sv: 'E-handel skalning', en: 'E-commerce scaling' }
    },
    publishDate: '2024-09-20',
    client: {
      name: null,
      industry: { sv: 'E-handel', en: 'E-commerce' },
      size: { sv: '50-100 anställda', en: '50-100 employees' }
    },
    tags: ['Elixir', 'Phoenix LiveView', 'PostgreSQL', 'Kubernetes'],
    services: [
      { sv: 'Plattformsutveckling', en: 'Platform Development' },
      { sv: 'Prestandaoptimering', en: 'Performance Optimization' },
      { sv: 'Molnarkitektur', en: 'Cloud Architecture' }
    ],
    metrics: [
      { value: '10x', label: { sv: 'Fler samtidiga användare', en: 'More concurrent users' }, trend: 'up' },
      { value: '60%', label: { sv: 'Lägre molnkostnader', en: 'Lower cloud costs' }, trend: 'down' },
      { value: '0', label: { sv: 'Krascher under kampanjer', en: 'Crashes during campaigns' }, trend: 'down' },
      { value: '200ms', label: { sv: 'Genomsnittlig svarstid', en: 'Average response time' }, trend: 'down' }
    ],
    challenge: {
      sv: 'Varje Black Friday och sommarrea kraschade sajten. Kunderna försvann till konkurrenterna, och teamet spenderade kampanjdagar med brandkårsarbete istället för att fira försäljningsrekord.',
      en: 'Every Black Friday and summer sale, the site crashed. Customers disappeared to competitors, and the team spent campaign days firefighting instead of celebrating sales records.'
    },
    solution: {
      sv: 'Vi byggde om kärnan i plattformen med Elixir och Phoenix LiveView. Istället för att kasta mer servrar på problemet optimerade vi arkitekturen för att göra mer med mindre.',
      en: 'We rebuilt the core of the platform with Elixir and Phoenix LiveView. Instead of throwing more servers at the problem, we optimized the architecture to do more with less.'
    },
    testimonial: {
      quote: {
        sv: 'Förra Black Friday sov jag gott för första gången på fem år. Sajten bara... fungerade. Och molnnotan var hälften så stor.',
        en: 'Last Black Friday I slept well for the first time in five years. The site just... worked. And the cloud bill was half the size.'
      },
      author: 'Emma Björk',
      role: { sv: 'CTO', en: 'CTO' }
    },
    sections: [
      {
        id: 'problemet',
        heading: { sv: 'Problemet', en: 'The Problem' },
        content: {
          sv: 'E-handlaren hade byggt sin plattform på en traditionell stack som fungerade bra vid normal last. Men vid kampanjer – när trafiken ökade 5-10 gånger – kollapsade allt.\n\nDeras lösning hade varit att hyra fler servrar inför varje kampanj. Men även det räckte inte alltid, och kostnaderna sköt i höjden.',
          en: 'The e-commerce retailer had built their platform on a traditional stack that worked well under normal load. But during campaigns – when traffic increased 5-10 times – everything collapsed.\n\nTheir solution had been to rent more servers before each campaign. But even that wasn\'t always enough, and costs skyrocketed.'
        }
      },
      {
        id: 'teknisk-analys',
        heading: { sv: 'Teknisk analys', en: 'Technical Analysis' },
        content: {
          sv: 'Vi identifierade flera flaskhalsar:\n\n• Synkrona databasanrop som blockerade vid hög last\n• Ineffektiv sessionshantering som åt minne\n• Tunga frontend-ramverk som krävde mycket JavaScript\n• Brist på caching för återkommande förfrågningar\n\nDen gamla arkitekturen var helt enkelt inte byggd för de volymer de nu hanterade.',
          en: 'We identified several bottlenecks:\n\n• Synchronous database calls that blocked under high load\n• Inefficient session handling that consumed memory\n• Heavy frontend frameworks requiring lots of JavaScript\n• Lack of caching for recurring requests\n\nThe old architecture simply wasn\'t built for the volumes they were now handling.'
        },
        image: {
          src: '/blog/elixir-erlang-ash/capacity-vs-waste-comparison.png',
          alt: { sv: 'Kapacitetsjämförelse', en: 'Capacity comparison' }
        }
      },
      {
        id: 'ny-arkitektur',
        heading: { sv: 'Ny arkitektur', en: 'New Architecture' },
        content: {
          sv: 'Vi byggde om plattformen med fokus på:\n\n**Elixir/Phoenix**\nByggt för att hantera miljontals samtidiga anslutningar. Varje användare hanteras i en lättviktsprocess.\n\n**LiveView**\nReal-tidsuppdateringar utan tung JavaScript. Snabbare första laddning, mindre bandbredd.\n\n**Smart caching**\nFlernivå-caching som minskar databasbelastningen med 90% vid topparna.\n\n**Auto-skalning**\nKubernetes-setup som skalar upp vid behov och ner när trafiken minskar.',
          en: 'We rebuilt the platform focusing on:\n\n**Elixir/Phoenix**\nBuilt to handle millions of concurrent connections. Each user is handled in a lightweight process.\n\n**LiveView**\nReal-time updates without heavy JavaScript. Faster initial load, less bandwidth.\n\n**Smart caching**\nMulti-level caching that reduces database load by 90% during peaks.\n\n**Auto-scaling**\nKubernetes setup that scales up when needed and down when traffic decreases.'
        },
        image: {
          src: '/blog/elixir-erlang-ash/beam-concurrency-visualization.png',
          alt: { sv: 'BEAM concurrency', en: 'BEAM concurrency' }
        }
      },
      {
        id: 'resultat',
        heading: { sv: 'Resultat', en: 'Results' },
        content: {
          sv: 'Den första Black Friday efter migreringen:\n\n• 127 000 samtidiga användare utan problem\n• Genomsnittlig svarstid under 200ms hela dagen\n• Molnkostnaden för kampanjmånaden var 40% lägre än förra året\n• Noll minuters nedtid\n\nKonverteringsgraden ökade med 23% jämfört med förra året – delvis på grund av snabbare sajt, delvis för att kunderna faktiskt kunde genomföra sina köp.',
          en: 'The first Black Friday after migration:\n\n• 127,000 concurrent users without issues\n• Average response time under 200ms all day\n• Cloud cost for the campaign month was 40% lower than last year\n• Zero minutes of downtime\n\nConversion rate increased by 23% compared to last year – partly due to faster site, partly because customers could actually complete their purchases.'
        }
      }
    ],
    duration: { sv: '6 månader', en: '6 months' }
  },

  // Case 3: SaaS-startup
  {
    slug: 'saas-modernisering',
    title: {
      sv: 'Från teknisk skuld till 3x snabbare releaser',
      en: 'From Technical Debt to 3x Faster Releases'
    },
    excerpt: {
      sv: 'En B2B SaaS-startup var fast i teknisk skuld. Vi hjälpte dem modernisera arkitekturen och tredubbla sin release-hastighet.',
      en: 'A B2B SaaS startup was stuck in technical debt. We helped them modernize their architecture and triple their release speed.'
    },
    heroImage: {
      src: '/ilustration/3.png',
      alt: { sv: 'SaaS modernisering', en: 'SaaS modernization' }
    },
    publishDate: '2024-08-10',
    client: {
      name: null,
      industry: { sv: 'B2B SaaS', en: 'B2B SaaS' },
      size: { sv: '20-50 anställda', en: '20-50 employees' }
    },
    tags: ['Elixir', 'Ash Framework', 'GraphQL', 'React'],
    services: [
      { sv: 'Arkitekturkonsultation', en: 'Architecture Consultation' },
      { sv: 'Kodmodernisering', en: 'Code Modernization' },
      { sv: 'Teamutbildning', en: 'Team Training' }
    ],
    metrics: [
      { value: '3x', label: { sv: 'Fler releaser per månad', en: 'More releases per month' }, trend: 'up' },
      { value: '50%', label: { sv: 'Kortare time-to-market', en: 'Shorter time-to-market' }, trend: 'down' },
      { value: '80%', label: { sv: 'Mindre buggfixar', en: 'Fewer bug fixes' }, trend: 'down' },
      { value: '2x', label: { sv: 'Utvecklarproduktivitet', en: 'Developer productivity' }, trend: 'up' }
    ],
    challenge: {
      sv: 'Startupens produkt hade vuxit organiskt i tre år. Nya funktioner tog allt längre tid att bygga, buggar dök upp överallt, och utvecklarna var frustrerade över att "allt hänger ihop med allt".',
      en: 'The startup\'s product had grown organically for three years. New features took longer and longer to build, bugs appeared everywhere, and developers were frustrated that "everything depends on everything."'
    },
    solution: {
      sv: 'Vi hjälpte dem införa en domändriven arkitektur med Ash Framework. Tydliga gränser mellan moduler, automatiska API:er, och en kodbas som går att resonera om.',
      en: 'We helped them introduce a domain-driven architecture with Ash Framework. Clear boundaries between modules, automatic APIs, and a codebase that\'s easy to reason about.'
    },
    testimonial: {
      quote: {
        sv: 'Våra utvecklare var skeptiska till att lära sig ny teknik. Nu vägrar de gå tillbaka. Koden är äntligen begriplig.',
        en: 'Our developers were skeptical about learning new technology. Now they refuse to go back. The code is finally understandable.'
      },
      author: 'Johan Eriksson',
      role: { sv: 'Grundare & CEO', en: 'Founder & CEO' }
    },
    sections: [
      {
        id: 'utmaningen',
        heading: { sv: 'Utmaningen', en: 'The Challenge' },
        content: {
          sv: 'Efter tre år av snabb tillväxt hade startupen hamnat i en bekant fälla:\n\n• Varje ny funktion tog längre tid än den förra\n• Buggar i en del av systemet orsakade problem i helt andra delar\n• Onboarding av nya utvecklare tog månader\n• Teknisk skuld växte snabbare än de kunde betala av den\n\nTeamet var duktigt, men arkitekturen arbetade emot dem.',
          en: 'After three years of rapid growth, the startup had fallen into a familiar trap:\n\n• Each new feature took longer than the previous one\n• Bugs in one part of the system caused problems in completely different parts\n• Onboarding new developers took months\n• Technical debt grew faster than they could pay it off\n\nThe team was skilled, but the architecture was working against them.'
        }
      },
      {
        id: 'var-approach',
        heading: { sv: 'Vår approach', en: 'Our Approach' },
        content: {
          sv: 'Istället för en total omskrivning valde vi en gradvis modernisering:\n\n**Fas 1: Kartläggning**\nVi identifierade de mest problematiska delarna och de naturliga domängränserna.\n\n**Fas 2: Pilotmodul**\nEn avgränsad del av systemet skrevs om med Ash Framework för att bevisa konceptet.\n\n**Fas 3: Gradvis migration**\nModul för modul moderniserades, med kontinuerlig drift av legacy-delarna.\n\n**Fas 4: Teamutbildning**\nWorkshops och parprogrammering för att överföra kunskap till det interna teamet.',
          en: 'Instead of a total rewrite, we chose a gradual modernization:\n\n**Phase 1: Mapping**\nWe identified the most problematic parts and the natural domain boundaries.\n\n**Phase 2: Pilot Module**\nA bounded part of the system was rewritten with Ash Framework to prove the concept.\n\n**Phase 3: Gradual Migration**\nModule by module was modernized, with continuous operation of legacy parts.\n\n**Phase 4: Team Training**\nWorkshops and pair programming to transfer knowledge to the internal team.'
        },
        image: {
          src: '/blog/future-proof/specification-as-asset.png',
          alt: { sv: 'Specifikation som tillgång', en: 'Specification as asset' }
        }
      },
      {
        id: 'tekniska-val',
        heading: { sv: 'Tekniska val', en: 'Technical Choices' },
        content: {
          sv: '**Ash Framework**\nGer struktur och automatik utan att låsa in. Domänregler definieras på ett ställe och API:er genereras automatiskt.\n\n**GraphQL**\nFlexibelt API som låter frontenden hämta exakt den data den behöver.\n\n**Eventdriven arkitektur**\nModuler kommunicerar via events istället för direkta anrop. Lättare att testa, lättare att ändra.\n\n**Automatiska tester**\nKoden är strukturerad så att tester blir enkla att skriva. Testäckningen ökade från 30% till 85%.',
          en: '**Ash Framework**\nProvides structure and automation without lock-in. Domain rules are defined in one place and APIs are generated automatically.\n\n**GraphQL**\nFlexible API that lets the frontend fetch exactly the data it needs.\n\n**Event-driven Architecture**\nModules communicate via events instead of direct calls. Easier to test, easier to change.\n\n**Automatic Tests**\nThe code is structured so tests become easy to write. Test coverage increased from 30% to 85%.'
        },
        image: {
          src: '/blog/future-proof/ai-era-structured-intelligence.png',
          alt: { sv: 'Strukturerad arkitektur', en: 'Structured architecture' }
        }
      },
      {
        id: 'resultat',
        heading: { sv: 'Resultat efter ett år', en: 'Results After One Year' },
        content: {
          sv: 'Ett år efter att moderniseringen påbörjades:\n\n• **Releaser:** Från 2 per månad till 6 per månad\n• **Time-to-market:** Nya funktioner tar hälften så lång tid\n• **Buggar:** 80% färre kritiska buggar i produktion\n• **Onboarding:** Nya utvecklare produktiva på veckor istället för månader\n• **Teamet:** Utvecklarna rapporterar högre arbetstillfredsställelse\n\nDen tekniska skulden är inte borta – men den växer inte längre. Och teamet har verktygen att hantera den.',
          en: 'One year after the modernization began:\n\n• **Releases:** From 2 per month to 6 per month\n• **Time-to-market:** New features take half the time\n• **Bugs:** 80% fewer critical bugs in production\n• **Onboarding:** New developers productive in weeks instead of months\n• **Team:** Developers report higher job satisfaction\n\nThe technical debt isn\'t gone – but it\'s no longer growing. And the team has the tools to manage it.'
        }
      }
    ],
    duration: { sv: '12 månader (pågående)', en: '12 months (ongoing)' }
  },

  // Case 4: Fintech / Betalningsplattform
  {
    slug: 'fintech-betalningsintegration',
    title: {
      sv: 'En API – sju betalningsleverantörer',
      en: 'One API – Seven Payment Providers'
    },
    excerpt: {
      sv: 'Ett växande fintech-bolag behövde integrera flera betalningsleverantörer utan att drunkna i komplexitet. Vi byggde ett enhetligt API som hanterar allt.',
      en: 'A growing fintech company needed to integrate multiple payment providers without drowning in complexity. We built a unified API that handles everything.'
    },
    heroImage: {
      src: '/ilustration/4.png',
      alt: { sv: 'Fintech betalningsintegration', en: 'Fintech payment integration' }
    },
    publishDate: '2024-11-05',
    client: {
      name: null,
      industry: { sv: 'Fintech & Betalningar', en: 'Fintech & Payments' },
      size: { sv: '30-60 anställda', en: '30-60 employees' }
    },
    tags: ['Elixir', 'Oban', 'PostgreSQL', 'REST API', 'PCI-DSS'],
    services: [
      { sv: 'API-utveckling', en: 'API Development' },
      { sv: 'Systemintegration', en: 'System Integration' },
      { sv: 'Säkerhetsarkitektur', en: 'Security Architecture' }
    ],
    metrics: [
      { value: '7→1', label: { sv: 'API:er till ett', en: 'APIs to one' }, trend: 'down' },
      { value: '99.99%', label: { sv: 'Transaktionsframgång', en: 'Transaction success' }, trend: 'up' },
      { value: '45%', label: { sv: 'Snabbare integration', en: 'Faster integration' }, trend: 'up' },
      { value: '< 100ms', label: { sv: 'Svarstid', en: 'Response time' }, trend: 'down' }
    ],
    challenge: {
      sv: 'Företaget behövde stödja Klarna, Stripe, Swish, Trustly och fler – varje leverantör med sitt eget API, egen dokumentation och egna felkoder. Utvecklarna ägnade mer tid åt att underhålla integrationer än att bygga nya funktioner.',
      en: 'The company needed to support Klarna, Stripe, Swish, Trustly and more – each provider with its own API, documentation and error codes. Developers spent more time maintaining integrations than building new features.'
    },
    solution: {
      sv: 'Vi byggde ett abstraktionslager som exponerar ett enda, väldesignat API. Under huven hanteras routing, retry-logik och felhantering automatiskt – oavsett vilken betalningsleverantör som används.',
      en: 'We built an abstraction layer that exposes a single, well-designed API. Under the hood, routing, retry logic and error handling are managed automatically – regardless of which payment provider is used.'
    },
    testimonial: {
      quote: {
        sv: 'Att lägga till en ny betalningsleverantör tog tidigare två månader. Nu tar det två veckor. Och vårt team kan fokusera på produkten istället för plumbing.',
        en: 'Adding a new payment provider used to take two months. Now it takes two weeks. And our team can focus on the product instead of plumbing.'
      },
      author: 'Lisa Andersson',
      role: { sv: 'VP Engineering', en: 'VP Engineering' }
    },
    sections: [
      {
        id: 'bakgrund',
        heading: { sv: 'Bakgrund', en: 'Background' },
        content: {
          sv: 'Som fintech-bolag är betalningar kärnan i verksamheten. Men kunderna ville ha valmöjligheter – Swish för svenska användare, Klarna för delbetalningar, Stripe för internationella kort, och så vidare.\n\nResultatet var sju olika betalningsintegrationer, alla med olika:\n\n• API-format (REST, SOAP, webhooks)\n• Autentiseringsmetoder\n• Felkoder och retry-logik\n• Testmiljöer och dokumentation\n\nVarje integration var en egen "snöflinga" som krävde specialistkunskap.',
          en: 'As a fintech company, payments are the core of the business. But customers wanted choices – Swish for Swedish users, Klarna for installments, Stripe for international cards, and so on.\n\nThe result was seven different payment integrations, all with different:\n\n• API formats (REST, SOAP, webhooks)\n• Authentication methods\n• Error codes and retry logic\n• Test environments and documentation\n\nEach integration was its own "snowflake" requiring specialist knowledge.'
        }
      },
      {
        id: 'problemet',
        heading: { sv: 'Problemets kärna', en: 'The Core Problem' },
        content: {
          sv: 'Den verkliga kostnaden var inte bara underhåll – det var förlorad hastighet:\n\n• Nya funktioner som berörde betalningar tog 3x längre tid\n• Endast 2 av 8 utvecklare kunde jobba med betalningskoden\n• Varje ny leverantör innebar månaders arbete\n• Testning var en mardröm – sju olika sandboxar att konfigurera\n\nOch när en leverantör hade driftproblem? Då kraschade hela checkout-flödet istället för att automatiskt falla tillbaka på en annan.',
          en: 'The real cost wasn\'t just maintenance – it was lost velocity:\n\n• New features involving payments took 3x longer\n• Only 2 of 8 developers could work with the payment code\n• Each new provider meant months of work\n• Testing was a nightmare – seven different sandboxes to configure\n\nAnd when a provider had outages? The entire checkout flow crashed instead of automatically falling back to another.'
        },
        image: {
          src: '/blog/System-zoo/system-zoo.png',
          alt: { sv: 'Komplexa integrationer', en: 'Complex integrations' }
        }
      },
      {
        id: 'losningen',
        heading: { sv: 'Vår lösning', en: 'Our Solution' },
        content: {
          sv: 'Vi designade ett Payment Gateway abstraktionslager:\n\n**Enhetligt API**\nEtt enda API för alla betalningsoperationer. Samma anrop för Stripe, Klarna eller Swish – systemet hanterar routing baserat på konfiguration.\n\n**Smart routing**\nAutomatisk failover om en leverantör är nere. Kostnadsoptimering genom att välja billigaste fungerande alternativet.\n\n**Oban för bakgrundsjobb**\nAsynkron hantering av webhooks, retry:s och notifieringar. Inga förlorade transaktioner.\n\n**Adapter-pattern**\nNya leverantörer läggs till som moduler utan att röra kärnlogiken.\n\n**PCI-DSS compliance**\nTokenisering och säker hantering av kortdata inbyggt från start.',
          en: 'We designed a Payment Gateway abstraction layer:\n\n**Unified API**\nA single API for all payment operations. Same call for Stripe, Klarna or Swish – the system handles routing based on configuration.\n\n**Smart routing**\nAutomatic failover if a provider is down. Cost optimization by choosing the cheapest working alternative.\n\n**Oban for background jobs**\nAsynchronous handling of webhooks, retries and notifications. No lost transactions.\n\n**Adapter pattern**\nNew providers are added as modules without touching core logic.\n\n**PCI-DSS compliance**\nTokenization and secure handling of card data built-in from the start.'
        },
        image: {
          src: '/blog/System-zoo/system-flowchart.png',
          alt: { sv: 'API-arkitektur', en: 'API architecture' }
        }
      },
      {
        id: 'implementation',
        heading: { sv: 'Implementation', en: 'Implementation' },
        content: {
          sv: 'Vi migrerade en leverantör i taget, utan att störa produktionstrafiken:\n\n**Vecka 1-4:** Kärnarkitektur och första adapter (Stripe)\n**Vecka 5-8:** Klarna och Swish-adaptrar\n**Vecka 9-12:** Resterande leverantörer + smart routing\n**Vecka 13-16:** Testning, dokumentation och knowledge transfer\n\nUnder hela projektet körde gamla och nya systemet parallellt. Varje adapter testades i produktion med en liten andel trafik innan full utrullning.',
          en: 'We migrated one provider at a time, without disrupting production traffic:\n\n**Week 1-4:** Core architecture and first adapter (Stripe)\n**Week 5-8:** Klarna and Swish adapters\n**Week 9-12:** Remaining providers + smart routing\n**Week 13-16:** Testing, documentation and knowledge transfer\n\nThroughout the project, old and new systems ran in parallel. Each adapter was tested in production with a small percentage of traffic before full rollout.'
        }
      },
      {
        id: 'resultat',
        heading: { sv: 'Resultat', en: 'Results' },
        content: {
          sv: 'Sex månader efter lansering:\n\n• **En kodbas** istället för sju separata integrationer\n• **99.99% transaktionsframgång** – upp från 98.5% tack vare automatisk failover\n• **45% snabbare** att bygga betalningsrelaterade funktioner\n• **2 veckor** att lägga till ny leverantör istället för 2 månader\n• **Alla utvecklare** kan nu jobba med betalningskoden\n\nBonuseffekt: När en leverantör hade ett större avbrott förra kvartalet märkte inte slutkunderna något – systemet routade automatiskt om till alternativa leverantörer.',
          en: 'Six months after launch:\n\n• **One codebase** instead of seven separate integrations\n• **99.99% transaction success** – up from 98.5% thanks to automatic failover\n• **45% faster** to build payment-related features\n• **2 weeks** to add new provider instead of 2 months\n• **All developers** can now work with the payment code\n\nBonus effect: When a provider had a major outage last quarter, end customers didn\'t notice – the system automatically rerouted to alternative providers.'
        }
      }
    ],
    duration: { sv: '4 månader', en: '4 months' }
  }
];

// Helper functions
export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
  return caseStudies.find(cs => cs.slug === slug);
};

export const getAllCaseStudies = (): CaseStudy[] => {
  return [...caseStudies].sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
};
