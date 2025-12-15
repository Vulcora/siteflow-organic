// Blog post types and data

export interface BlogImage {
  src: string;
  alt: { sv: string; en: string };
}

export interface BlogSection {
  id: string;
  heading: { sv: string; en: string };
  content: { sv: string; en: string };
  image?: BlogImage;
}

export interface BlogAuthor {
  name: string;
  role: { sv: string; en: string };
  avatar: string;
}

export interface BlogPost {
  slug: string;
  title: { sv: string; en: string };
  excerpt: { sv: string; en: string };
  heroImage: BlogImage;
  publishDate: string;
  readTimeMinutes: number;
  author: BlogAuthor;
  tags: string[];
  sections: BlogSection[];
}

// Default author for all posts
const defaultAuthor: BlogAuthor = {
  name: 'Sara Guldberg',
  role: { sv: 'Systemarkitekt', en: 'System Architect' },
  avatar: '/team-avatars/Sara.jpg'
};

export const blogPosts: BlogPost[] = [
  // Post 1: Elixir/Erlang/Ash
  {
    slug: 'tekniken-bakom-siteflow',
    title: {
      sv: 'Tekniken bakom Siteflow – därför kan vi göra mer med färre servrar',
      en: 'The Technology Behind Siteflow – Why We Can Do More With Fewer Servers'
    },
    excerpt: {
      sv: 'Alla tekniska plattformar kostar inte lika mycket per kund att drifta. Lär dig varför Elixir och Erlang gör skillnad.',
      en: 'Not all technical platforms cost the same per customer to operate. Learn why Elixir and Erlang make a difference.'
    },
    heroImage: {
      src: '/blog/elixir-erlang-ash/hero-efficient-infrastructure.png',
      alt: { sv: 'Effektiv infrastruktur', en: 'Efficient infrastructure' }
    },
    publishDate: '2024-11-20',
    readTimeMinutes: 5,
    author: defaultAuthor,
    tags: ['Elixir', 'Erlang', 'Skalbarhet'],
    sections: [
      {
        id: 'intro',
        heading: { sv: '', en: '' },
        content: {
          sv: 'Du ska inte behöva vara tekniker för att ha nytta av bra teknik.\nMen det är värt att förstå en sak:\n\nAlla tekniska plattformar kostar inte lika mycket per kund att drifta.\n\nVissa kräver många stora servrar för ganska lite last.\nAndra är byggda för att klara enorm trafik på förvånansvärt få maskiner.',
          en: 'You shouldn\'t need to be a technician to benefit from good technology.\nBut it\'s worth understanding one thing:\n\nNot all technical platforms cost the same per customer to operate.\n\nSome require many large servers for relatively little load.\nOthers are built to handle enormous traffic on surprisingly few machines.'
        }
      },
      {
        id: 'telekom',
        heading: {
          sv: 'Från telekom till chattappar – samma problem, samma lösning',
          en: 'From Telecom to Chat Apps – Same Problem, Same Solution'
        },
        content: {
          sv: 'Tekniken vi bygger på kommer ursprungligen från telekomvärlden:\n\n• system som måste vara igång dygnet runt\n• miljontals användare som ringer, sms:ar och surfar samtidigt\n• kravet att ett fel inte får krascha hela systemet\n\nSenare dök samma behov upp i:\n\n• chattappar som WhatsApp och Discord\n• trading- och betalningssystem\n• realtidsplattformar och spel\n\nGemensamt: hög belastning, höga krav på stabilitet.',
          en: 'The technology we build on originally comes from the telecom world:\n\n• systems that must be running 24/7\n• millions of users calling, texting, and browsing simultaneously\n• the requirement that one error must not crash the entire system\n\nLater, the same needs appeared in:\n\n• chat apps like WhatsApp and Discord\n• trading and payment systems\n• real-time platforms and games\n\nCommon thread: high load, high stability requirements.'
        },
        image: {
          src: '/blog/elixir-erlang-ash/telecom-to-modern-apps.png',
          alt: { sv: 'Från telekom till moderna appar', en: 'From telecom to modern apps' }
        }
      },
      {
        id: 'elixir-erlang',
        heading: {
          sv: 'Vad gör Elixir/Erlang annorlunda?',
          en: 'What Makes Elixir/Erlang Different?'
        },
        content: {
          sv: 'Elixir är språket vi skriver i.\nErlang/BEAM är motorn under huven.\n\nTillsammans ger de några egenskaper som spelar stor roll för din ekonomi:\n\n• Varje användare hanteras i en lättviktig process i stället för tunga operativsystemstrådar.\n• Miljontals sådana processer kan köras parallellt på samma maskin.\n• Om en del kraschar kan den startas om utan att resten påverkas.\n\nPraktiskt betyder det:\n\n• fler kunder per server\n• färre driftstopp\n• enklare felsökning (problemen är isolerade)',
          en: 'Elixir is the language we write in.\nErlang/BEAM is the engine under the hood.\n\nTogether they provide characteristics that significantly impact your bottom line:\n\n• Each user is handled in a lightweight process instead of heavy operating system threads.\n• Millions of such processes can run in parallel on the same machine.\n• If one part crashes, it can be restarted without affecting the rest.\n\nPractically, this means:\n\n• more customers per server\n• fewer outages\n• easier troubleshooting (problems are isolated)'
        },
        image: {
          src: '/blog/elixir-erlang-ash/beam-concurrency-visualization.png',
          alt: { sv: 'BEAM concurrency visualisering', en: 'BEAM concurrency visualization' }
        }
      },
      {
        id: 'kapacitet',
        heading: {
          sv: 'Mer kapacitet, mindre slöseri',
          en: 'More Capacity, Less Waste'
        },
        content: {
          sv: 'När man bygger på den här typen av motor kan man:\n\n• komprimera många funktioner i ett och samma system\n• utnyttja maskinernas kapacitet bättre\n• slippa vissa extra lager som annars behövs bara för att "patcha" svagheter i stacken\n\nFör dig syns det här som:\n\n• lägre molnnota\n• mindre behov av att köpa in fler servrar vid toppar\n• stabilitet även när ni växer eller kör kampanjer\n\nI vissa kända exempel har Elixir/Erlang-system hanterat miljontals samtidiga användare med en förhållandevis liten serverpark.\nDet visar vad som är möjligt när grundtekniken är byggd för effektivitet.',
          en: 'When building on this type of engine, you can:\n\n• compress many functions into a single system\n• utilize machine capacity better\n• avoid certain extra layers otherwise needed just to "patch" weaknesses in the stack\n\nFor you, this appears as:\n\n• lower cloud bills\n• less need to purchase more servers during peaks\n• stability even when you grow or run campaigns\n\nIn some well-known examples, Elixir/Erlang systems have handled millions of simultaneous users with a relatively small server farm.\nThis shows what\'s possible when the underlying technology is built for efficiency.'
        },
        image: {
          src: '/blog/elixir-erlang-ash/capacity-vs-waste-comparison.png',
          alt: { sv: 'Kapacitet vs slöseri jämförelse', en: 'Capacity vs waste comparison' }
        }
      },
      {
        id: 'varfor-inte-alla',
        heading: {
          sv: 'Varför gör inte alla så här?',
          en: 'Why Doesn\'t Everyone Do This?'
        },
        content: {
          sv: 'Bra fråga.\n\nSvaret är en kombination av:\n\n• vana: många utvecklare kan andra språk sedan tidigare\n• nätverkseffekt: fler kan "standardstacken", så den fortsätter väljas\n• marknadsföring: stora språk och plattformar har stora bolag bakom sig\n\nDet gör att lösningar som är tekniskt överlägsna ibland förblir lite nischade,\ntrots att de skulle kunna spara både pengar och problem för många.',
          en: 'Good question.\n\nThe answer is a combination of:\n\n• habit: many developers already know other languages\n• network effect: more people know the "standard stack," so it keeps getting chosen\n• marketing: major languages and platforms have big companies behind them\n\nThis means technically superior solutions sometimes remain somewhat niche,\ndespite being able to save both money and problems for many.'
        }
      },
      {
        id: 'varfor-vi-valt',
        heading: {
          sv: 'Varför vi har valt den här vägen',
          en: 'Why We Chose This Path'
        },
        content: {
          sv: 'Siteflow är den del av Vulcora som bygger systemen.\nVi har valt Elixir och den här tekniska grunden av en enkel anledning:\n\n• den låter oss bygga få, starka system\n• den skalar från små bolag till jättar\n• den har redan bevisat sig i miljöer där fel inte får ske\n\nFör dig betyder det att du får:\n\n• system som tål tillväxt utan att molnnotan exploderar\n• hög stabilitet utan att du behöver förstå alla tekniska detaljer\n• en grund som är redo för framtidens krav – inklusive AI och realtidsflöden\n\nDu behöver inte kunna ordet "BEAM" för att ha nytta av det.\nDet räcker att veta att din teknik inte är vald för att den är trendig,\nutan för att den är bevisat hållbar där det verkligen gäller.',
          en: 'Siteflow is the part of Vulcora that builds the systems.\nWe chose Elixir and this technical foundation for a simple reason:\n\n• it lets us build few, strong systems\n• it scales from small companies to giants\n• it has already proven itself in environments where failure is not an option\n\nFor you, this means you get:\n\n• systems that handle growth without exploding cloud bills\n• high stability without needing to understand all technical details\n• a foundation ready for future demands – including AI and real-time flows\n\nYou don\'t need to know the word "BEAM" to benefit from it.\nIt\'s enough to know that your technology wasn\'t chosen because it\'s trendy,\nbut because it\'s proven sustainable where it really matters.'
        },
        image: {
          src: '/blog/elixir-erlang-ash/proven-scalability.png',
          alt: { sv: 'Bevisad skalbarhet', en: 'Proven scalability' }
        }
      }
    ]
  },

  // Post 2: Future-proof Systems
  {
    slug: 'system-som-haller',
    title: {
      sv: 'System som håller när allt annat ändras',
      en: 'Systems That Hold When Everything Else Changes'
    },
    excerpt: {
      sv: 'Världen rör sig snabbare än någonsin. Lär dig hur du bygger system som är redo för förändring.',
      en: 'The world moves faster than ever. Learn how to build systems ready for change.'
    },
    heroImage: {
      src: '/blog/future-proof/hero-change-and-stability.png',
      alt: { sv: 'Förändring och stabilitet', en: 'Change and stability' }
    },
    publishDate: '2024-11-15',
    readTimeMinutes: 5,
    author: defaultAuthor,
    tags: ['Arkitektur', 'Framtidssäkring', 'AI'],
    sections: [
      {
        id: 'intro',
        heading: { sv: '', en: '' },
        content: {
          sv: 'Världen rör sig snabbare än någonsin.\nKundkrav, regler, marknader – och nu AI – ändrar spelplanen på månader, inte år.\n\nÄndå är många system byggda som om allt vore statiskt.',
          en: 'The world moves faster than ever.\nCustomer demands, regulations, markets – and now AI – change the playing field in months, not years.\n\nYet many systems are built as if everything were static.'
        }
      },
      {
        id: 'problemet',
        heading: {
          sv: 'Problemet: system som sitter fast i gårdagen',
          en: 'The Problem: Systems Stuck in Yesterday'
        },
        content: {
          sv: 'Traditionellt bygger man system så här:\n\n1. man samlar krav\n2. man bygger en stor lösning\n3. man lappar och lagar tills det blir ohanterligt\n4. man river och börjar om\n\nDet kan fungera ett tag. Men i en värld där tekniken ändras hela tiden blir du snabbt fast i:\n\n• gamla ramverk\n• gammal integrationslogik\n• leverantörslåsningar\n\nVarje ny idé blir en kamp:\n"Går det ens att göra i vårt system?"',
          en: 'Traditionally, systems are built like this:\n\n1. gather requirements\n2. build a large solution\n3. patch and repair until it becomes unmanageable\n4. tear down and start over\n\nThis can work for a while. But in a world where technology changes constantly, you quickly get stuck with:\n\n• old frameworks\n• old integration logic\n• vendor lock-ins\n\nEvery new idea becomes a battle:\n"Can we even do this in our system?"'
        },
        image: {
          src: '/blog/future-proof/traditional-vs-adaptive-architecture.png',
          alt: { sv: 'Traditionell vs adaptiv arkitektur', en: 'Traditional vs adaptive architecture' }
        }
      },
      {
        id: 'princip',
        heading: {
          sv: 'En enkel princip: anpassningsförmåga slår förutsägelser',
          en: 'A Simple Principle: Adaptability Beats Predictions'
        },
        content: {
          sv: 'Vi tror inte på att försöka förutse exakt hur AI, marknad och regler ser ut om fem år.\n\nVi tror på något enklare:\n\nDet viktigaste är att systemen går att ändra – snabbt, säkert och utan att rasa.\n\nDet betyder:\n\n• tydliga regler och affärslogik samlade på ett ställe\n• så lite hårdkodad speciallogik som möjligt i varje system\n• en struktur där delar kan bytas ut utan att allt måste skrivas om',
          en: 'We don\'t believe in trying to predict exactly what AI, markets, and regulations will look like in five years.\n\nWe believe in something simpler:\n\nThe most important thing is that systems can be changed – quickly, safely, and without collapsing.\n\nThis means:\n\n• clear rules and business logic gathered in one place\n• as little hardcoded special logic as possible in each system\n• a structure where parts can be replaced without rewriting everything'
        }
      },
      {
        id: 'specifikationer',
        heading: {
          sv: 'Specifikationer som tillgång, kod som färskvara',
          en: 'Specifications as Assets, Code as Perishables'
        },
        content: {
          sv: 'För oss är specifikationen – beskrivningen av hur ni faktiskt arbetar och tar beslut – den riktiga tillgången.\n\nKoden är "bara" hur vi råkar implementera den just nu.\n\nDet ger några viktiga effekter:\n\n• ni blir mindre beroende av enskilda utvecklare eller leverantörer\n• ni kan byta teknik, ramverk eller moln utan att tappa bort er logik\n• ni kan låta AI-verktyg hjälpa till att generera ny kod utifrån en tydlig modell\n\nKort sagt: ni äger hjärnan, inte bara kroppen.',
          en: 'For us, the specification – the description of how you actually work and make decisions – is the real asset.\n\nThe code is "just" how we happen to implement it right now.\n\nThis creates some important effects:\n\n• you become less dependent on individual developers or vendors\n• you can switch technology, frameworks, or cloud without losing your logic\n• you can let AI tools help generate new code from a clear model\n\nIn short: you own the brain, not just the body.'
        },
        image: {
          src: '/blog/future-proof/specification-as-asset.png',
          alt: { sv: 'Specifikation som tillgång', en: 'Specification as asset' }
        }
      },
      {
        id: 'ai-eran',
        heading: {
          sv: 'AI-eran: fler möjligheter, mer krav på struktur',
          en: 'The AI Era: More Possibilities, More Demands for Structure'
        },
        content: {
          sv: 'AI och agenter öppnar för att:\n\n• automatisera delar av arbetet\n• låta system föreslå beslut\n• låta "digitala medarbetare" göra grundjobb\n\nMen det fungerar bara om:\n\n• era regler är tydliga\n• era dataflöden är begripliga\n• era system går att prata med på ett strukturerat sätt\n\nAnnars blir AI bara ännu ett lager ovanpå ett redan rörigt landskap.',
          en: 'AI and agents open up for:\n\n• automating parts of the work\n• letting systems suggest decisions\n• letting "digital coworkers" do basic work\n\nBut this only works if:\n\n• your rules are clear\n• your data flows are comprehensible\n• your systems can be communicated with in a structured way\n\nOtherwise, AI just becomes another layer on top of an already messy landscape.'
        },
        image: {
          src: '/blog/future-proof/ai-era-structured-intelligence.png',
          alt: { sv: 'AI-eran strukturerad intelligens', en: 'AI era structured intelligence' }
        }
      },
      {
        id: 'siteflow-bygger',
        heading: {
          sv: 'Hur Siteflow bygger för en rörlig framtid',
          en: 'How Siteflow Builds for a Moving Future'
        },
        content: {
          sv: 'När vi tar oss an ett system tittar vi på:\n\n• Vilka beslut tas?\n• Vilka regler styr dem?\n• Vilka data behövs för att ta dem?\n\nVi samlar det i en tydlig modell.\nSedan låter vi tekniken – Elixir, Ash och annat – bli ett sätt att köra den modellen på ett effektivt sätt.\n\nFör dig betyder det:\n\n• system som går att ändra i takt med att verkligheten ändras\n• färre helrenoveringar vart tredje år\n• en struktur där AI kan bli ett naturligt nästa steg, inte ett påklistrat lager\n\nSystem som håller handlar alltså mindre om "rätt trend"\noch mer om rätt form:\n\n• tydliga regler\n• renare flöden\n• teknik som går att byta när det behövs\n\nDet är så vi tänker när vi säger att vi bygger system som håller även när allt annat ändras.',
          en: 'When we approach a system, we look at:\n\n• What decisions are made?\n• What rules govern them?\n• What data is needed to make them?\n\nWe gather this in a clear model.\nThen we let the technology – Elixir, Ash, and others – become a way to run that model efficiently.\n\nFor you, this means:\n\n• systems that can change as reality changes\n• fewer complete renovations every three years\n• a structure where AI can become a natural next step, not a tacked-on layer\n\nSystems that hold are thus less about the "right trend"\nand more about the right form:\n\n• clear rules\n• cleaner flows\n• technology that can be replaced when needed\n\nThis is how we think when we say we build systems that hold even when everything else changes.'
        },
        image: {
          src: '/blog/future-proof/systems-that-endure.png',
          alt: { sv: 'System som håller', en: 'Systems that endure' }
        }
      }
    ]
  },

  // Post 3: System Zoo
  {
    slug: 'system-zoo',
    title: {
      sv: 'System-zoo: hur vi hamnade här',
      en: 'System Zoo: How We Got Here'
    },
    excerpt: {
      sv: 'Varje nytt behov leder till ett nytt system. Snart har du ett helt zoo. Så bryter du mönstret.',
      en: 'Every new need leads to a new system. Soon you have a whole zoo. Here\'s how to break the pattern.'
    },
    heroImage: {
      src: '/blog/System-zoo/enterprise-software-architecture.png',
      alt: { sv: 'Enterprise programvaruarkitektur', en: 'Enterprise software architecture' }
    },
    publishDate: '2024-11-10',
    readTimeMinutes: 5,
    author: defaultAuthor,
    tags: ['Komplexitet', 'Arkitektur', 'Kostnader'],
    sections: [
      {
        id: 'intro',
        heading: {
          sv: 'System-zoo: hur vi hamnade här',
          en: 'System Zoo: How We Got Here'
        },
        content: {
          sv: 'Varje gång ett nytt behov dyker upp händer något i stil med:\n\n• "Vi lägger till ett nytt system för det där."\n• "Vi köper in en SaaS-tjänst, det går snabbast."\n• "Vi integrerar sen."\n\nResultatet blir:\n\n• många inloggningar\n• många databaser\n• många excelark vid sidan av\n\nAlla dessa lösningar är ofta motiverade var för sig. Tillsammans blir de ett system-zoo.',
          en: 'Every time a new need arises, something like this happens:\n\n• "We\'ll add a new system for that."\n• "We\'ll buy a SaaS service, it\'s fastest."\n• "We\'ll integrate later."\n\nThe result is:\n\n• many logins\n• many databases\n• many spreadsheets on the side\n\nAll these solutions are often justified individually. Together they become a system zoo.'
        },
        image: {
          src: '/blog/System-zoo/system-zoo.png',
          alt: { sv: 'System-zoo illustration', en: 'System zoo illustration' }
        }
      },
      {
        id: 'dolda-kostnaden',
        heading: {
          sv: 'Den dolda kostnaden: mer än bara licenser',
          en: 'The Hidden Cost: More Than Just Licenses'
        },
        content: {
          sv: 'När vi pratar IT-kostnader tänker många på licenser och molnnota.\nMen den verkliga kostnaden är större:\n\n• tid som går åt till att leta information\n• fel som uppstår när samma sak registreras på flera ställen\n• beroendet av en eller två personer som "är de enda som kan systemet"\n• extra serverkraft för att hålla många halvutnyttjade system igång\n\nVi har sett företag lägga 50–60 000 i månaden på infrastruktur för en last som skulle kunna köras för en bråkdel – om arkitekturen vore mer effektiv.',
          en: 'When we talk IT costs, many think of licenses and cloud bills.\nBut the real cost is larger:\n\n• time spent searching for information\n• errors that occur when the same thing is registered in multiple places\n• dependence on one or two people who "are the only ones who know the system"\n• extra server power to keep many underutilized systems running\n\nWe\'ve seen companies spend 50-60,000 per month on infrastructure for a load that could run for a fraction – if the architecture were more efficient.'
        },
        image: {
          src: '/blog/System-zoo/cost-comparison-visialization.png',
          alt: { sv: 'Kostnadsjämförelse', en: 'Cost comparison' }
        }
      },
      {
        id: 'komplexitet-belonas',
        heading: {
          sv: 'Varför komplexitet belönas i branschen',
          en: 'Why Complexity Is Rewarded in the Industry'
        },
        content: {
          sv: 'Det finns också en obekväm sanning:\n\n• Molnleverantörer tjänar mer när ni använder fler servrar och fler tjänster.\n• Konsulter tjänar mer när det finns många system och mycket speciallogik.\n\nIngen sitter och planerar att göra det dyrt för er.\nMen incitamenten i branschen gör att komplexitet flyter uppåt nästan av sig själv.',
          en: 'There\'s also an uncomfortable truth:\n\n• Cloud providers earn more when you use more servers and more services.\n• Consultants earn more when there are many systems and lots of special logic.\n\nNo one sits planning to make things expensive for you.\nBut the industry\'s incentives mean complexity floats upward almost by itself.'
        }
      },
      {
        id: 'siteflow-angreppssatt',
        heading: {
          sv: 'Siteflows angreppssätt: färre, starkare system',
          en: 'Siteflow\'s Approach: Fewer, Stronger Systems'
        },
        content: {
          sv: 'På Siteflow gör vi tvärtom.\nVi börjar med frågan:\n\n"Hur få system kan vi komma undan med, utan att tumma på kvaliteten?"\n\nVi kartlägger:\n\n• vilka flöden ni har (från kundförfrågan till betalning, från inventering till rapport)\n• var arbete och data hoppar mellan system\n• var ni har manuella genvägar, excelark och dubbelregistrering\n\nMålet är att ersätta system-zoot med ett fåtal robusta system som:\n\n• håller ihop flödet\n• minskar antalet rörliga delar\n• går att äga och förstå över tid',
          en: 'At Siteflow, we do the opposite.\nWe start with the question:\n\n"How few systems can we get away with, without compromising quality?"\n\nWe map:\n\n• what flows you have (from customer inquiry to payment, from inventory to report)\n• where work and data jump between systems\n• where you have manual shortcuts, spreadsheets, and double registration\n\nThe goal is to replace the system zoo with a few robust systems that:\n\n• keep the flow together\n• reduce the number of moving parts\n• can be owned and understood over time'
        },
        image: {
          src: '/blog/System-zoo/system-flowchart.png',
          alt: { sv: 'System flödesschema', en: 'System flowchart' }
        }
      },
      {
        id: 'siffror',
        heading: {
          sv: 'Vad det kan betyda i siffror',
          en: 'What It Can Mean in Numbers'
        },
        content: {
          sv: 'När vi går från spretig arkitektur till färre, effektivare system händer ofta tre saker:\n\n1. Driftkostnader sjunker kraftigt\n   – färre servrar, färre licenser, färre duplicerade lager.\n\n2. Färre incidenter och mindre brandkårsarbete\n   – det finns helt enkelt färre kopplingspunkter där saker kan gå fel.\n\n3. Kortare väg från idé till ändring\n   – när logiken sitter samlat kan vi snabbare ändra regler, flöden och integrationer.\n\nI vissa projekt har vi sett infrastrukturkostnader minska med upp till 80 %.\nDet är inte magi – det är effekten av att inte sprida samma funktionalitet över för många system.',
          en: 'When we move from scattered architecture to fewer, more efficient systems, three things often happen:\n\n1. Operating costs drop significantly\n   – fewer servers, fewer licenses, fewer duplicate layers.\n\n2. Fewer incidents and less firefighting\n   – there are simply fewer connection points where things can go wrong.\n\n3. Shorter path from idea to change\n   – when logic is gathered, we can more quickly change rules, flows, and integrations.\n\nIn some projects, we\'ve seen infrastructure costs decrease by up to 80%.\nIt\'s not magic – it\'s the effect of not spreading the same functionality across too many systems.'
        },
        image: {
          src: '/blog/System-zoo/workspace-overhead.png',
          alt: { sv: 'Arbetsplats overhead', en: 'Workspace overhead' }
        }
      },
      {
        id: 'for-dig',
        heading: {
          sv: 'För dig som äger eller leder ett företag',
          en: 'For You Who Own or Lead a Company'
        },
        content: {
          sv: 'Du behöver inte kunna orden för allt det här.\nDet viktiga är att ställa några enkla frågor:\n\n• Vet vi hur många system vi egentligen använder?\n• Vet vi vilka som är affärskritiska?\n• Vet vi var vi läcker tid, energi och pengar?\n\nOm svaret är "nej" på de flesta, då är inte problemet "att ni är dåliga på IT".\nProblemet är att arkitekturen aldrig fick chansen att bli enkel.\n\nDet är där Siteflow kommer in:\nVi hjälper er se helheten – och bygga en väg från system-zoo till något som faktiskt går att leva med.',
          en: 'You don\'t need to know the words for all of this.\nThe important thing is to ask a few simple questions:\n\n• Do we know how many systems we actually use?\n• Do we know which ones are business-critical?\n• Do we know where we\'re leaking time, energy, and money?\n\nIf the answer is "no" to most of these, the problem isn\'t "that you\'re bad at IT."\nThe problem is that the architecture never got the chance to become simple.\n\nThat\'s where Siteflow comes in:\nWe help you see the whole picture – and build a path from system zoo to something you can actually live with.'
        }
      }
    ]
  },

  // Post 4: Actor-modellen
  {
    slug: 'actor-modellen',
    title: {
      sv: 'Actor-modellen – så hanterar vi miljontals användare samtidigt',
      en: 'The Actor Model – How We Handle Millions of Users Simultaneously'
    },
    excerpt: {
      sv: 'WhatsApp, Discord och Ericsson använder samma teknik. Lär dig hur Actor-modellen gör system snabbare ju mer de används.',
      en: 'WhatsApp, Discord, and Ericsson use the same technology. Learn how the Actor Model makes systems faster the more they are used.'
    },
    heroImage: {
      src: '/blog/actor-model/hero-actor-model.png',
      alt: { sv: 'Actor-modellen visualisering', en: 'Actor model visualization' }
    },
    publishDate: '2024-12-10',
    readTimeMinutes: 6,
    author: defaultAuthor,
    tags: ['Skalbarhet', 'Arkitektur', 'Elixir'],
    sections: [
      {
        id: 'intro',
        heading: { sv: '', en: '' },
        content: {
          sv: 'WhatsApp hanterar miljarder meddelanden varje dag med förvånansvärt få servrar.\nDiscord streamar röst och video till miljoner användare utan att hacka.\nEricssons telekomsystem har 99,9999999% upptid.\n\nVad har de gemensamt? Actor-modellen.',
          en: 'WhatsApp handles billions of messages every day with surprisingly few servers.\nDiscord streams voice and video to millions of users without stuttering.\nEricsson\'s telecom systems have 99.9999999% uptime.\n\nWhat do they have in common? The Actor Model.'
        }
      },
      {
        id: 'vad-ar-actor',
        heading: {
          sv: 'Vad är Actor-modellen?',
          en: 'What is the Actor Model?'
        },
        content: {
          sv: 'Tänk dig ett kontor där varje anställd har sitt eget rum, sin egen inkorg och sitt eget minne.\n\n• Ingen kan gå in i någon annans rum\n• All kommunikation sker via meddelanden i inkorgen\n• Om en person blir sjuk påverkas inte de andra\n\nDet är Actor-modellen i ett nötskal.\n\nI traditionella system delar alla trådar på samma minne – som om alla anställda satt i ett öppet kontorslandskap och försökte skriva i samma dokument samtidigt. Kaos uppstår.',
          en: 'Imagine an office where each employee has their own room, their own inbox, and their own memory.\n\n• No one can enter anyone else\'s room\n• All communication happens via messages in the inbox\n• If one person gets sick, the others are not affected\n\nThat\'s the Actor Model in a nutshell.\n\nIn traditional systems, all threads share the same memory – as if all employees sat in an open office landscape trying to write in the same document simultaneously. Chaos ensues.'
        },
        image: {
          src: '/blog/actor-model/office-analogy.png',
          alt: { sv: 'Kontorsanalogi', en: 'Office analogy' }
        }
      },
      {
        id: 'snabbare',
        heading: {
          sv: 'Varför blir systemet snabbare när det används mer?',
          en: 'Why Does the System Get Faster When Used More?'
        },
        content: {
          sv: 'Det låter bakvänt, men det stämmer.\n\nI Actor-modellen är varje användare en egen lättviktig process (en "actor"). När fler användare ansluter skapas fler actors – och de körs parallellt på alla tillgängliga processorkärnor.\n\nModerna servrar har 64, 128 eller fler kärnor. De flesta traditionella system kan bara använda en bråkdel av den kapaciteten. Actor-modellen utnyttjar alla kärnor automatiskt.\n\nResultatet:\n• 10 användare → systemet använder 10 kärnor\n• 100 000 användare → systemet använder alla kärnor, parallellt\n• Varje användare får en dedikerad "arbetare"',
          en: 'It sounds backwards, but it\'s true.\n\nIn the Actor Model, each user is their own lightweight process (an "actor"). When more users connect, more actors are created – and they run in parallel on all available processor cores.\n\nModern servers have 64, 128, or more cores. Most traditional systems can only use a fraction of that capacity. The Actor Model utilizes all cores automatically.\n\nThe result:\n• 10 users → the system uses 10 cores\n• 100,000 users → the system uses all cores, in parallel\n• Each user gets a dedicated "worker"'
        },
        image: {
          src: '/blog/actor-model/parallel-scaling.png',
          alt: { sv: 'Parallell skalning', en: 'Parallel scaling' }
        }
      },
      {
        id: 'isolering',
        heading: {
          sv: 'Isolering = stabilitet',
          en: 'Isolation = Stability'
        },
        content: {
          sv: 'Varje actor är helt isolerad från de andra.\n\nOm en användares session kraschar (fel data, timeout, bugg) påverkas ingen annan. Systemet startar om just den actorn på mikrosekunder och fortsätter som vanligt.\n\nJämför med traditionella system där en krasch i en tråd kan ta ner hela servern, eller i värsta fall hela systemet.',
          en: 'Each actor is completely isolated from the others.\n\nIf a user\'s session crashes (bad data, timeout, bug) no one else is affected. The system restarts just that actor in microseconds and continues as normal.\n\nCompare to traditional systems where a crash in one thread can take down the entire server, or in worst case the entire system.'
        }
      },
      {
        id: 'exempel',
        heading: {
          sv: 'Verkliga exempel',
          en: 'Real Examples'
        },
        content: {
          sv: 'WhatsApp\n• 900 miljoner användare\n• 50 miljarder meddelanden per dag\n• Kördes länge på bara ~100 servrar\n• Byggd på Erlang/Actor-modellen\n\nDiscord\n• 150 miljoner aktiva användare\n• Realtidsröst och video\n• Elixir i backend\n• Hanterar miljoner samtidiga anslutningar\n\nEricsson\n• Telekomsystem med 99,9999999% upptid\n• Skapade Erlang specifikt för detta\n• Har kört i produktion sedan 1980-talet',
          en: 'WhatsApp\n• 900 million users\n• 50 billion messages per day\n• Ran for a long time on just ~100 servers\n• Built on Erlang/Actor Model\n\nDiscord\n• 150 million active users\n• Real-time voice and video\n• Elixir in backend\n• Handles millions of simultaneous connections\n\nEricsson\n• Telecom systems with 99.9999999% uptime\n• Created Erlang specifically for this\n• Has been running in production since the 1980s'
        },
        image: {
          src: '/blog/actor-model/whatsapp-discord-stats.png',
          alt: { sv: 'WhatsApp och Discord statistik', en: 'WhatsApp and Discord statistics' }
        }
      },
      {
        id: 'for-dig',
        heading: {
          sv: 'Hur påverkar det dig?',
          en: 'How Does This Affect You?'
        },
        content: {
          sv: 'Om du bygger ett system med oss får du:\n\nÄkta skalbarhet\nSystemet växer organiskt med din verksamhet. Ingen "big bang"-migrering behövs när du får fler kunder.\n\nFörutsägbara kostnader\nEftersom vi utnyttjar hårdvaran effektivt behöver du inte överprovisioner "för säkerhets skull".\n\nHög stabilitet\nFel i en del av systemet sprider sig inte. Dina kunder märker inte när något går snett i bakgrunden.\n\nFramtidssäkert\nActor-modellen är perfekt för AI-agenter, realtidsflöden och IoT – allt som kräver massiv parallellism.',
          en: 'If you build a system with us, you get:\n\nTrue scalability\nThe system grows organically with your business. No "big bang" migration needed when you get more customers.\n\nPredictable costs\nSince we utilize hardware efficiently, you don\'t need to over-provision "just in case".\n\nHigh stability\nErrors in one part of the system don\'t spread. Your customers don\'t notice when something goes wrong in the background.\n\nFuture-proof\nThe Actor Model is perfect for AI agents, real-time flows, and IoT – everything that requires massive parallelism.'
        },
        image: {
          src: '/blog/actor-model/benefits-overview.png',
          alt: { sv: 'Fördelar översikt', en: 'Benefits overview' }
        }
      }
    ]
  },

  // Post 5: Självläkande system
  {
    slug: 'sjalvlakande-system',
    title: {
      sv: '"Let it crash" – självläkande system som aldrig går ner',
      en: '"Let it crash" – Self-Healing Systems That Never Go Down'
    },
    excerpt: {
      sv: 'Tänk om ditt system kunde läka sig självt på mikrosekunder. Automatiskt. Utan att någon märker det.',
      en: 'What if your system could heal itself in microseconds. Automatically. Without anyone noticing.'
    },
    heroImage: {
      src: '/blog/self-healing/hero-self-healing.png',
      alt: { sv: 'Självläkande system', en: 'Self-healing system' }
    },
    publishDate: '2024-12-08',
    readTimeMinutes: 5,
    author: defaultAuthor,
    tags: ['Stabilitet', 'Arkitektur', 'Erlang'],
    sections: [
      {
        id: 'intro',
        heading: { sv: '', en: '' },
        content: {
          sv: 'Tänk om ditt system kunde läka sig självt.\n\nInte efter timmar av felsökning. Inte efter att någon vaknat mitt i natten.\nPå mikrosekunder. Automatiskt. Utan att någon märker det.\n\nDet är filosofin bakom "Let it crash" – och det är så vi bygger våra system.',
          en: 'What if your system could heal itself.\n\nNot after hours of debugging. Not after someone woke up in the middle of the night.\nIn microseconds. Automatically. Without anyone noticing.\n\nThat\'s the philosophy behind "Let it crash" – and that\'s how we build our systems.'
        }
      },
      {
        id: 'kontraintuitiv',
        heading: {
          sv: 'Den kontraintuitiva sanningen',
          en: 'The Counterintuitive Truth'
        },
        content: {
          sv: 'I traditionell programmering försöker vi förhindra alla fel:\n• try-catch-block överallt\n• defensiv kod som kontrollerar allt\n• komplexa återhämtningsrutiner\n\nResultatet? Kod som är:\n• svår att läsa och underhålla\n• långsam (alla kontroller tar tid)\n• ändå sårbar (vi kan inte förutse alla fel)\n\n"Let it crash" vänder på logiken:\n\nI stället för att förhindra fel, accepterar vi att fel händer.\nMen vi ser till att systemet återhämtar sig automatiskt.',
          en: 'In traditional programming, we try to prevent all errors:\n• try-catch blocks everywhere\n• defensive code that checks everything\n• complex recovery routines\n\nThe result? Code that is:\n• hard to read and maintain\n• slow (all checks take time)\n• still vulnerable (we can\'t predict all errors)\n\n"Let it crash" turns the logic around:\n\nInstead of preventing errors, we accept that errors happen.\nBut we make sure the system recovers automatically.'
        },
        image: {
          src: '/blog/self-healing/traditional-vs-letitcrash.png',
          alt: { sv: 'Traditionell vs Let it crash', en: 'Traditional vs Let it crash' }
        }
      },
      {
        id: 'praktiken',
        heading: {
          sv: 'Hur fungerar det i praktiken?',
          en: 'How Does It Work in Practice?'
        },
        content: {
          sv: 'Varje del av systemet körs i en egen isolerad process (en "actor").\nOvanför dessa finns "supervisors" – övervakare som håller koll.\n\nNär något går fel:\n\n1. Processen kraschar (snabbt och rent, ingen korrupt data)\n2. Supervisorn upptäcker det (på mikrosekunder)\n3. En ny process startas (med känt, rent tillstånd)\n4. Systemet fortsätter (resten påverkades aldrig)\n\nDet hela tar typiskt mindre än en millisekund.',
          en: 'Each part of the system runs in its own isolated process (an "actor").\nAbove these are "supervisors" – monitors that keep watch.\n\nWhen something goes wrong:\n\n1. The process crashes (quickly and cleanly, no corrupt data)\n2. The supervisor detects it (in microseconds)\n3. A new process is started (with known, clean state)\n4. The system continues (the rest was never affected)\n\nThe whole thing typically takes less than a millisecond.'
        },
        image: {
          src: '/blog/self-healing/crash-recovery-timeline.png',
          alt: { sv: 'Krasch-återhämtning tidslinje', en: 'Crash recovery timeline' }
        }
      },
      {
        id: 'battre',
        heading: {
          sv: 'Varför är det bättre?',
          en: 'Why Is It Better?'
        },
        content: {
          sv: 'Snabbare återhämtning\nTraditionellt: upptäck fel → larma → någon vaknar → felsök → fixa → deploya\nMed "Let it crash": krasch → omstart → klart (automatiskt, på millisekunder)\n\nRenare kod\nIngen defensiv kod överallt. Varje funktion gör sitt jobb.\nOm något oväntat händer – krasch och omstart med rent tillstånd.\n\nIngen "zombie state"\nI traditionella system kan fel leda till att systemet hamnar i ett halvdött tillstånd – det kör, men fungerar inte riktigt. Med "Let it crash" finns bara två tillstånd: fungerande eller omstartande.\n\nBättre felsökning\nNär ett fel inträffar får vi en tydlig kraschrapport. Ingen mystisk bugg som bara händer ibland.',
          en: 'Faster recovery\nTraditionally: detect error → alert → someone wakes up → debug → fix → deploy\nWith "Let it crash": crash → restart → done (automatically, in milliseconds)\n\nCleaner code\nNo defensive code everywhere. Each function does its job.\nIf something unexpected happens – crash and restart with clean state.\n\nNo "zombie state"\nIn traditional systems, errors can lead to the system ending up in a half-dead state – it runs, but doesn\'t really work. With "Let it crash" there are only two states: working or restarting.\n\nBetter debugging\nWhen an error occurs, we get a clear crash report. No mysterious bug that only happens sometimes.'
        }
      },
      {
        id: 'ericsson',
        heading: {
          sv: 'Ericsson visste detta redan 1987',
          en: 'Ericsson Knew This Back in 1987'
        },
        content: {
          sv: 'Erlang skapades av Ericsson för telekomsystem där driftstopp kostar miljoner.\n\nDeras mål: 99,9999999% upptid (ungefär 31 millisekunder nere per år).\n\nDe uppnådde det. Och hemligheten var just "Let it crash" kombinerat med supervisors.\n\nAXD301 – ett legendariskt system\n• Ericsons ATM-switch\n• Miljontals telefonsamtal samtidigt\n• "Nine nines" upptid (99,9999999%)\n• Har kört oavbrutet i årtionden',
          en: 'Erlang was created by Ericsson for telecom systems where downtime costs millions.\n\nTheir goal: 99.9999999% uptime (about 31 milliseconds down per year).\n\nThey achieved it. And the secret was precisely "Let it crash" combined with supervisors.\n\nAXD301 – a legendary system\n• Ericsson\'s ATM switch\n• Millions of phone calls simultaneously\n• "Nine nines" uptime (99.9999999%)\n• Has been running uninterrupted for decades'
        },
        image: {
          src: '/blog/self-healing/ericsson-uptime.png',
          alt: { sv: 'Ericsson upptid', en: 'Ericsson uptime' }
        }
      },
      {
        id: 'supervisortrad',
        heading: {
          sv: 'Supervisorträd – hierarkisk resiliens',
          en: 'Supervisor Trees – Hierarchical Resilience'
        },
        content: {
          sv: 'Supervisors organiseras i träd:\n\nOm en användares websocket kraschar → bara den användaren påverkas.\nOm hela websocket-supervisorn kraschar → den startas om, alla användare återansluter.\nOm root-supervisorn kraschar → hela systemet startas om (extremt sällsynt).\n\nVarje nivå fångar och hanterar fel på sin nivå.',
          en: 'Supervisors are organized in trees:\n\nIf a user\'s websocket crashes → only that user is affected.\nIf the entire websocket supervisor crashes → it restarts, all users reconnect.\nIf the root supervisor crashes → the entire system restarts (extremely rare).\n\nEach level catches and handles errors at its level.'
        },
        image: {
          src: '/blog/self-healing/supervisor-tree.png',
          alt: { sv: 'Supervisorträd', en: 'Supervisor tree' }
        }
      },
      {
        id: 'fordelar',
        heading: {
          sv: 'Verkliga fördelar för dig',
          en: 'Real Benefits for You'
        },
        content: {
          sv: 'Färre nattliga larm\nSystemet hanterar de flesta problem själv.\n\nSnabbare incident-hantering\nNär du väl behöver titta på ett problem har du tydliga loggar och kraschrapporter.\n\nHögre kundnöjdhet\nDina användare märker sällan problem – systemet återhämtar sig innan de hinner klaga.\n\nLägre driftkostnader\nMindre manuell övervakning och felsökning behövs.',
          en: 'Fewer nighttime alerts\nThe system handles most problems itself.\n\nFaster incident handling\nWhen you do need to look at a problem, you have clear logs and crash reports.\n\nHigher customer satisfaction\nYour users rarely notice problems – the system recovers before they have time to complain.\n\nLower operating costs\nLess manual monitoring and debugging needed.'
        }
      }
    ]
  },

  // Post 6: Kostnadseffektivt
  {
    slug: 'kostnadseffektivt',
    title: {
      sv: 'Upp till 80% lägre infrastrukturkostnader',
      en: 'Up to 80% Lower Infrastructure Costs'
    },
    excerpt: {
      sv: 'Din molnfaktura växer varje månad. Det finns ett bättre sätt. Lär dig hur vi gör mer med mindre hårdvara.',
      en: 'Your cloud bill grows every month. There\'s a better way. Learn how we do more with less hardware.'
    },
    heroImage: {
      src: '/blog/cost-effective/hero-cost-savings.png',
      alt: { sv: 'Kostnadsbesparingar', en: 'Cost savings' }
    },
    publishDate: '2024-12-05',
    readTimeMinutes: 6,
    author: defaultAuthor,
    tags: ['Kostnader', 'Infrastruktur', 'Effektivitet'],
    sections: [
      {
        id: 'intro',
        heading: { sv: '', en: '' },
        content: {
          sv: 'Din molnfaktura växer varje månad.\nFler servrar. Mer minne. Högre CPU-klasser.\nMen prestandan ökar inte i samma takt.\n\nDet finns ett bättre sätt.',
          en: 'Your cloud bill grows every month.\nMore servers. More memory. Higher CPU classes.\nBut performance doesn\'t increase at the same rate.\n\nThere\'s a better way.'
        }
      },
      {
        id: 'problemet',
        heading: {
          sv: 'Problemet med traditionella stackar',
          en: 'The Problem with Traditional Stacks'
        },
        content: {
          sv: 'De flesta system idag byggs med tekniker som:\n• Node.js / Express\n• Python / Django / FastAPI\n• Ruby on Rails\n• Java / Spring Boot\n\nDe är populära. De är välkända. Men de har ett gemensamt problem:\n\nDe slösar med resurser.\n\nVarför?\n• Varje request blockerar en tråd\n• Trådar är "dyra" (MB av minne per tråd)\n• Vid hög last måste du skala horisontellt (fler servrar)\n• Varje ny server kostar pengar',
          en: 'Most systems today are built with technologies like:\n• Node.js / Express\n• Python / Django / FastAPI\n• Ruby on Rails\n• Java / Spring Boot\n\nThey\'re popular. They\'re well-known. But they have a common problem:\n\nThey waste resources.\n\nWhy?\n• Each request blocks a thread\n• Threads are "expensive" (MB of memory per thread)\n• Under high load, you must scale horizontally (more servers)\n• Each new server costs money'
        },
        image: {
          src: '/blog/cost-effective/resource-waste-comparison.png',
          alt: { sv: 'Resursslöseri jämförelse', en: 'Resource waste comparison' }
        }
      },
      {
        id: 'siffror',
        heading: {
          sv: 'Siffror som talar för sig själva',
          en: 'Numbers That Speak for Themselves'
        },
        content: {
          sv: 'WhatsApp (2012)\n• 450 miljoner aktiva användare\n• 50+ miljarder meddelanden per dag\n• 32 servrar för messaging\n• Byggd på Erlang\n\nDiscord (2017)\n• 5 miljoner samtidiga användare per server\n• Migrerade från Go till Elixir\n• Halverade antalet servrar\n• Bättre latency som bonus\n\nPinterest (2022)\n• Migrerade från Python till Elixir\n• 95% färre servrar för vissa tjänster\n• Snabbare responstider',
          en: 'WhatsApp (2012)\n• 450 million active users\n• 50+ billion messages per day\n• 32 servers for messaging\n• Built on Erlang\n\nDiscord (2017)\n• 5 million concurrent users per server\n• Migrated from Go to Elixir\n• Halved the number of servers\n• Better latency as a bonus\n\nPinterest (2022)\n• Migrated from Python to Elixir\n• 95% fewer servers for certain services\n• Faster response times'
        },
        image: {
          src: '/blog/cost-effective/whatsapp-discord-pinterest-stats.png',
          alt: { sv: 'WhatsApp Discord Pinterest statistik', en: 'WhatsApp Discord Pinterest statistics' }
        }
      },
      {
        id: 'hur',
        heading: {
          sv: 'Hur uppnår vi 80% lägre kostnader?',
          en: 'How Do We Achieve 80% Lower Costs?'
        },
        content: {
          sv: 'Lättviktiga processer\nI Elixir/Erlang kostar en process ~2KB minne.\nI Java kostar en tråd ~1MB minne.\n500x skillnad.\n\nDet betyder att en server som kör 1000 Java-trådar kan köra 500 000 Elixir-processer.\n\nBättre resursutnyttjande\nTraditionella system är ofta "tomma" 80-90% av tiden – de väntar på databassvar, nätverksanrop eller användarinput.\n\nElixir-processer är non-blocking. När en process väntar, kör andra processer. Ingen CPU-tid slösas.\n\nFärre lager\nMed Elixir kan mycket byggas in i samma system:\n• Inbyggd load balancing\n• Phoenix hanterar HTTP direkt\n• Background jobs i samma system\n• PubSub inbyggt\n• Inbyggd caching (ETS)\n\nFärre komponenter = färre servrar = lägre kostnad.',
          en: 'Lightweight processes\nIn Elixir/Erlang, a process costs ~2KB memory.\nIn Java, a thread costs ~1MB memory.\n500x difference.\n\nThis means a server running 1000 Java threads can run 500,000 Elixir processes.\n\nBetter resource utilization\nTraditional systems are often "idle" 80-90% of the time – they wait for database responses, network calls, or user input.\n\nElixir processes are non-blocking. When one process waits, other processes run. No CPU time is wasted.\n\nFewer layers\nWith Elixir, much can be built into the same system:\n• Built-in load balancing\n• Phoenix handles HTTP directly\n• Background jobs in the same system\n• PubSub built-in\n• Built-in caching (ETS)\n\nFewer components = fewer servers = lower cost.'
        },
        image: {
          src: '/blog/cost-effective/process-memory-comparison.png',
          alt: { sv: 'Process minne jämförelse', en: 'Process memory comparison' }
        }
      },
      {
        id: 'rakneexempel',
        heading: {
          sv: 'Konkret räkneexempel',
          en: 'Concrete Calculation Example'
        },
        content: {
          sv: 'Scenario: E-handelsplattform med 10 000 samtidiga användare\n\nTraditionell stack (Node.js)\n• 8 app-servrar (à 200 SEK/månad)\n• 2 bakgrundsjobb-servrar\n• 1 Redis-server\n• 1 load balancer\n• Total: ~2 200 SEK/månad\n\nElixir-stack\n• 2 app-servrar (hanterar allt)\n• 1 load balancer (valfri)\n• Total: ~500 SEK/månad\n\nBesparing: 77%',
          en: 'Scenario: E-commerce platform with 10,000 concurrent users\n\nTraditional stack (Node.js)\n• 8 app servers (at 200 SEK/month each)\n• 2 background job servers\n• 1 Redis server\n• 1 load balancer\n• Total: ~2,200 SEK/month\n\nElixir stack\n• 2 app servers (handles everything)\n• 1 load balancer (optional)\n• Total: ~500 SEK/month\n\nSavings: 77%'
        },
        image: {
          src: '/blog/cost-effective/cost-calculation-infographic.png',
          alt: { sv: 'Kostnadsberäkning infografik', en: 'Cost calculation infographic' }
        }
      },
      {
        id: 'nar-lonar',
        heading: {
          sv: 'När lönar det sig mest?',
          en: 'When Is It Most Worth It?'
        },
        content: {
          sv: 'Våra kostnadsbesparingar är störst för system med:\n\n• Hög samtidighet (många användare samtidigt)\n• Realtidsfunktioner (chat, notifikationer, live-uppdateringar)\n• Bakgrundsjobb (rapporter, synkronisering, import/export)\n• WebSockets (dashboards, spel, samarbetsverktyg)\n\nJu mer av detta ditt system har, desto större besparing.\n\n80% lägre kostnader är inte marknadsföring. Det är matematik.\n\nVill du veta vad du kan spara? Kontakta oss för en kostnadsfri analys av din nuvarande arkitektur.',
          en: 'Our cost savings are greatest for systems with:\n\n• High concurrency (many users simultaneously)\n• Real-time features (chat, notifications, live updates)\n• Background jobs (reports, sync, import/export)\n• WebSockets (dashboards, games, collaboration tools)\n\nThe more of this your system has, the greater the savings.\n\n80% lower costs isn\'t marketing. It\'s math.\n\nWant to know what you can save? Contact us for a free analysis of your current architecture.'
        }
      }
    ]
  },

  // Post 7: Redo för AI
  {
    slug: 'redo-for-ai',
    title: {
      sv: 'Redo för AI – system byggda för agenter från dag ett',
      en: 'AI-Ready – Systems Built for Agents from Day One'
    },
    excerpt: {
      sv: 'AI-agenter kräver en helt annan arkitektur. Lär dig varför de flesta system kämpar med AI.',
      en: 'AI agents require a completely different architecture. Learn why most systems struggle with AI.'
    },
    heroImage: {
      src: '/blog/ai-ready/hero-ai-agents.png',
      alt: { sv: 'AI-agenter', en: 'AI agents' }
    },
    publishDate: '2024-12-03',
    readTimeMinutes: 6,
    author: defaultAuthor,
    tags: ['AI', 'Agenter', 'Framtidssäkring'],
    sections: [
      {
        id: 'intro',
        heading: { sv: '', en: '' },
        content: {
          sv: 'AI är inte längre framtid. Det är nu.\n\nMen de flesta system är inte byggda för det. De är byggda för en värld där:\n• En användare gör en förfrågan\n• Servern svarar\n• Klart\n\nAI-agenter fungerar annorlunda.',
          en: 'AI is no longer the future. It\'s now.\n\nBut most systems aren\'t built for it. They\'re built for a world where:\n• A user makes a request\n• The server responds\n• Done\n\nAI agents work differently.'
        }
      },
      {
        id: 'hur-agenter',
        heading: {
          sv: 'Hur AI-agenter arbetar',
          en: 'How AI Agents Work'
        },
        content: {
          sv: 'En AI-agent är inte en enkel förfrågan. Den är en process som:\n\n1. Tar emot ett mål ("boka en resa till Stockholm")\n2. Bryter ner det i deluppgifter\n3. Kör flera uppgifter parallellt\n4. Väntar på externa svar (API:er, databaser, andra agenter)\n5. Anpassar sig baserat på resultaten\n6. Kan köra i minuter eller timmar\n\nDet här kräver en helt annan arkitektur.',
          en: 'An AI agent is not a simple request. It\'s a process that:\n\n1. Receives a goal ("book a trip to Stockholm")\n2. Breaks it down into subtasks\n3. Runs multiple tasks in parallel\n4. Waits for external responses (APIs, databases, other agents)\n5. Adapts based on results\n6. Can run for minutes or hours\n\nThis requires a completely different architecture.'
        },
        image: {
          src: '/blog/ai-ready/ai-agent-workflow.png',
          alt: { sv: 'AI-agent arbetsflöde', en: 'AI agent workflow' }
        }
      },
      {
        id: 'traditionella-kampar',
        heading: {
          sv: 'Varför traditionella system kämpar',
          en: 'Why Traditional Systems Struggle'
        },
        content: {
          sv: 'Problem 1: Timeouts\nTraditionella web requests har timeout på 30-60 sekunder.\nAI-agenter kan behöva minuter. Eller längre.\n\nProblem 2: Blocking\nMedan agenten väntar på ett API-svar, blockeras resurser.\nMed 100 agenter har du 100 blockerade trådar.\n\nProblem 3: State management\nAgenter har state – de "minns" vad de gjort och planerar nästa steg.\nTraditionella stateless-arkitekturer hanterar inte detta bra.\n\nProblem 4: Parallellism\nEn agent som ska boka en resa kanske behöver söka flyg, hotell, kolla väder och kalender samtidigt.\nAllt detta bör ske parallellt. Traditionella system gör det sekventiellt.',
          en: 'Problem 1: Timeouts\nTraditional web requests have a 30-60 second timeout.\nAI agents may need minutes. Or longer.\n\nProblem 2: Blocking\nWhile the agent waits for an API response, resources are blocked.\nWith 100 agents, you have 100 blocked threads.\n\nProblem 3: State management\nAgents have state – they "remember" what they\'ve done and plan the next step.\nTraditional stateless architectures don\'t handle this well.\n\nProblem 4: Parallelism\nAn agent booking a trip might need to search flights, hotels, check weather and calendar simultaneously.\nAll this should happen in parallel. Traditional systems do it sequentially.'
        },
        image: {
          src: '/blog/ai-ready/traditional-vs-actor-ai.png',
          alt: { sv: 'Traditionell vs Actor för AI', en: 'Traditional vs Actor for AI' }
        }
      },
      {
        id: 'actor-loser',
        heading: {
          sv: 'Hur Actor-modellen löser detta',
          en: 'How the Actor Model Solves This'
        },
        content: {
          sv: 'Varje AI-agent blir en egen process (actor).\n\nObegränsad livslängd\nProcessen lever så länge den behövs – sekunder, minuter, dagar.\n\nIcke-blockerande\nNär agenten väntar på ett API-svar, kör andra agenter. Ingen resurs slösas.\n\nInbyggd state\nVarje process har sitt eget minne. Agentens "tankar" lever naturligt i processen.\n\nMassiv parallellism\nAtt köra 10 000 agenter samtidigt är inget problem. Var och en är en lättviktig process.',
          en: 'Each AI agent becomes its own process (actor).\n\nUnlimited lifespan\nThe process lives as long as needed – seconds, minutes, days.\n\nNon-blocking\nWhen the agent waits for an API response, other agents run. No resources wasted.\n\nBuilt-in state\nEach process has its own memory. The agent\'s "thoughts" live naturally in the process.\n\nMassive parallelism\nRunning 10,000 agents simultaneously is no problem. Each one is a lightweight process.'
        },
        image: {
          src: '/blog/ai-ready/parallel-agent-tasks.png',
          alt: { sv: 'Parallella agent-uppgifter', en: 'Parallel agent tasks' }
        }
      },
      {
        id: 'vad-bygga',
        heading: {
          sv: 'Vad du kan bygga',
          en: 'What You Can Build'
        },
        content: {
          sv: 'Med en AI-redo arkitektur öppnas nya möjligheter:\n\nIntelligenta assistenter\nChatbots som faktiskt förstår kontext och kan utföra uppgifter.\n\nAutomatiserade workflows\nAgenter som hanterar hela processer – fakturering, onboarding, rapportering.\n\nRealtidsanalys\nAI som kontinuerligt analyserar data och agerar på insikter.\n\nMulti-agent-system\nFlera AI:er som samarbetar – en säljer, en hanterar support, en optimerar priser.',
          en: 'With an AI-ready architecture, new possibilities open up:\n\nIntelligent assistants\nChatbots that actually understand context and can perform tasks.\n\nAutomated workflows\nAgents that handle entire processes – billing, onboarding, reporting.\n\nReal-time analysis\nAI that continuously analyzes data and acts on insights.\n\nMulti-agent systems\nMultiple AIs that collaborate – one sells, one handles support, one optimizes prices.'
        },
        image: {
          src: '/blog/ai-ready/multi-agent-system.png',
          alt: { sv: 'Multi-agent system', en: 'Multi-agent system' }
        }
      },
      {
        id: 'sammanfattning',
        heading: {
          sv: 'Framtidssäkert – inte efterkonstruerat',
          en: 'Future-Proof – Not Retrofitted'
        },
        content: {
          sv: 'Många försöker "peta in" AI i befintliga system:\n• Microservices för AI\n• Separata köer\n• Komplexa orchestration-lager\n\nDet blir dyrt, komplext och långsamt.\n\nVi bygger system där AI-kapacitet finns från start:\n• Samma arkitektur för användare och agenter\n• Skalning fungerar likadant\n• Ingen extra infrastruktur behövs\n\nVi bygger inte system som "kan utökas med AI".\nVi bygger system där AI är en naturlig del av arkitekturen.\n\nÄr du redo för AI-eran? Kontakta oss för att diskutera hur din verksamhet kan dra nytta av AI-redo system.',
          en: 'Many try to "shoehorn" AI into existing systems:\n• Microservices for AI\n• Separate queues\n• Complex orchestration layers\n\nIt becomes expensive, complex, and slow.\n\nWe build systems where AI capability exists from the start:\n• Same architecture for users and agents\n• Scaling works the same way\n• No extra infrastructure needed\n\nWe don\'t build systems that "can be extended with AI".\nWe build systems where AI is a natural part of the architecture.\n\nAre you ready for the AI era? Contact us to discuss how your business can benefit from AI-ready systems.'
        }
      }
    ]
  },

  // Post 8: Massiv Concurrency
  {
    slug: 'massiv-concurrency',
    title: {
      sv: '100 000 anslutningar? Inga problem.',
      en: '100,000 Connections? No Problem.'
    },
    excerpt: {
      sv: 'Medan andra servrar svettas vid 1 000 anslutningar, gäspar våra vid 100 000. Det är inte skryt – det är arkitektur.',
      en: 'While other servers sweat at 1,000 connections, ours yawn at 100,000. It\'s not bragging – it\'s architecture.'
    },
    heroImage: {
      src: '/blog/massive-concurrency/hero-massive-concurrency.png',
      alt: { sv: 'Massiv concurrency', en: 'Massive concurrency' }
    },
    publishDate: '2024-12-01',
    readTimeMinutes: 6,
    author: defaultAuthor,
    tags: ['Concurrency', 'Prestanda', 'WebSockets'],
    sections: [
      {
        id: 'intro',
        heading: { sv: '', en: '' },
        content: {
          sv: 'Medan andra servrar svettas vid 1 000 anslutningar, gäspar våra vid 100 000.\n\nDet är inte skryt. Det är arkitektur.',
          en: 'While other servers sweat at 1,000 connections, ours yawn at 100,000.\n\nIt\'s not bragging. It\'s architecture.'
        }
      },
      {
        id: 'problemet',
        heading: {
          sv: 'Concurrency-problemet förklarat',
          en: 'The Concurrency Problem Explained'
        },
        content: {
          sv: '"Concurrency" betyder att hantera många saker samtidigt.\n\nTänk dig en reception på ett hotell:\n• Låg concurrency: En receptionist, en kö. Alla väntar.\n• Hög concurrency: 100 receptionister, ingen kö. Alla betjänas direkt.\n\nDe flesta system fungerar som det första exemplet.\nVåra fungerar som det andra.',
          en: '"Concurrency" means handling many things simultaneously.\n\nImagine a hotel reception:\n• Low concurrency: One receptionist, one queue. Everyone waits.\n• High concurrency: 100 receptionists, no queue. Everyone is served immediately.\n\nMost systems work like the first example.\nOurs work like the second.'
        },
        image: {
          src: '/blog/massive-concurrency/hotel-reception-analogy.png',
          alt: { sv: 'Hotellreception analogi', en: 'Hotel reception analogy' }
        }
      },
      {
        id: 'grans',
        heading: {
          sv: 'Varför 1 000 anslutningar är en gräns för många',
          en: 'Why 1,000 Connections Is a Limit for Many'
        },
        content: {
          sv: 'I traditionella system (Node.js, Python, Ruby, Java) är varje anslutning kopplad till en tråd eller process i operativsystemet.\n\nProblemet:\n• En OS-tråd kostar ~1MB minne\n• 1 000 trådar = 1GB minne bara för att hålla anslutningar öppna\n• 10 000 trådar = 10GB minne\n• 100 000 trådar = inte realistiskt\n\nLösningen de flesta väljer: Skala horisontellt (fler servrar)\n• Dyrt\n• Komplext\n• Introducerar nya problem (synkronisering, load balancing)',
          en: 'In traditional systems (Node.js, Python, Ruby, Java), each connection is tied to a thread or process in the operating system.\n\nThe problem:\n• An OS thread costs ~1MB memory\n• 1,000 threads = 1GB memory just to keep connections open\n• 10,000 threads = 10GB memory\n• 100,000 threads = not realistic\n\nThe solution most choose: Scale horizontally (more servers)\n• Expensive\n• Complex\n• Introduces new problems (synchronization, load balancing)'
        },
        image: {
          src: '/blog/massive-concurrency/thread-vs-process-memory.png',
          alt: { sv: 'Tråd vs process minne', en: 'Thread vs process memory' }
        }
      },
      {
        id: 'hur-vi',
        heading: {
          sv: 'Hur vi hanterar 100 000+ anslutningar',
          en: 'How We Handle 100,000+ Connections'
        },
        content: {
          sv: 'I Elixir/Erlang är varje anslutning en lättviktig process i den virtuella maskinen (BEAM).\n\nSkillnaden:\n• En BEAM-process kostar ~2KB minne\n• 100 000 processer = 200MB minne\n• 1 000 000 processer = 2GB minne\n\n500x mer effektivt.\n\nOch det handlar inte bara om minne:\n• BEAM-processer startar på mikrosekunder\n• Context switches är extremt snabba\n• Ingen "thread contention" (processer delar inget)',
          en: 'In Elixir/Erlang, each connection is a lightweight process in the virtual machine (BEAM).\n\nThe difference:\n• A BEAM process costs ~2KB memory\n• 100,000 processes = 200MB memory\n• 1,000,000 processes = 2GB memory\n\n500x more efficient.\n\nAnd it\'s not just about memory:\n• BEAM processes start in microseconds\n• Context switches are extremely fast\n• No "thread contention" (processes share nothing)'
        }
      },
      {
        id: 'benchmarks',
        heading: {
          sv: 'Benchmarks som visar skillnaden',
          en: 'Benchmarks That Show the Difference'
        },
        content: {
          sv: 'Phoenix (Elixir) vs Node.js vs Go\n\nTest: 100 000 WebSocket-anslutningar på en server\n\nPhoenix: 2.1 GB RAM, 3ms latency (P99), Klarade testet\nNode.js: 14.2 GB RAM, 89ms latency (P99), Instabil\nGo: 5.8 GB RAM, 12ms latency (P99), Klarade testet\n\nPhoenix använder 7x mindre minne än Node.js och har 30x bättre latency.\n\nDiscord rapporterade:\n• 5 miljoner samtidiga användare per guild-server\n• 12 miljoner WebSocket events per sekund\n• Latency under 10ms',
          en: 'Phoenix (Elixir) vs Node.js vs Go\n\nTest: 100,000 WebSocket connections on one server\n\nPhoenix: 2.1 GB RAM, 3ms latency (P99), Passed the test\nNode.js: 14.2 GB RAM, 89ms latency (P99), Unstable\nGo: 5.8 GB RAM, 12ms latency (P99), Passed the test\n\nPhoenix uses 7x less memory than Node.js and has 30x better latency.\n\nDiscord reported:\n• 5 million concurrent users per guild server\n• 12 million WebSocket events per second\n• Latency under 10ms'
        },
        image: {
          src: '/blog/massive-concurrency/benchmark-comparison.png',
          alt: { sv: 'Benchmark jämförelse', en: 'Benchmark comparison' }
        }
      },
      {
        id: 'for-dig',
        heading: {
          sv: 'Vad betyder det för dig?',
          en: 'What Does It Mean for You?'
        },
        content: {
          sv: 'Realtidsapplikationer\n• Live dashboards som uppdateras för tusentals användare\n• Chat med miljontals användare\n• Multiplayer-spel med hundratusentals spelare\n\nIoT och sensorer\n• Hundratusentals enheter som rapporterar data\n• Realtidsbearbetning av alla strömmar\n• Ingen batching behövs\n\nTrading och fintech\n• Orderböcker med miljoner uppdateringar per sekund\n• Låg latency är kritiskt\n• Konsistens utan att offra hastighet\n\nLivestreaming och media\n• Tusentals samtidiga tittare\n• Realtidsinteraktion (reaktioner, kommentarer)\n• Adaptiv kvalitet per användare',
          en: 'Real-time applications\n• Live dashboards updating for thousands of users\n• Chat with millions of users\n• Multiplayer games with hundreds of thousands of players\n\nIoT and sensors\n• Hundreds of thousands of devices reporting data\n• Real-time processing of all streams\n• No batching needed\n\nTrading and fintech\n• Order books with millions of updates per second\n• Low latency is critical\n• Consistency without sacrificing speed\n\nLive streaming and media\n• Thousands of simultaneous viewers\n• Real-time interaction (reactions, comments)\n• Adaptive quality per user'
        },
        image: {
          src: '/blog/massive-concurrency/use-cases-grid.png',
          alt: { sv: 'Användningsområden', en: 'Use cases' }
        }
      },
      {
        id: 'c10m',
        heading: {
          sv: 'C10K är gammalt – vi siktar på C10M',
          en: 'C10K Is Old – We\'re Aiming for C10M'
        },
        content: {
          sv: 'C10K-problemet (hantera 10 000 anslutningar) formulerades 1999 och var en stor utmaning då.\n\nIdag pratar vi om C10M – 10 miljoner samtidiga anslutningar.\n\nMed rätt arkitektur är det möjligt:\n• WhatsApp hade 900M användare på 100 servrar\n• Phoenix har demonstrerat 2M WebSocket-anslutningar på en maskin\n• BEAM har körts med 134M processer i tester\n\nDu kan inte köpa dig ur concurrency-problem.\nSnabbare CPU hjälper inte om arkitekturen är blocking.\nMer RAM hjälper inte om varje anslutning kostar 1MB.\nFler servrar ökar bara komplexiteten.\n\nDet handlar om arkitektur. Välj rätt grund, och en server kan göra vad tio inte klarar med fel grund.\n\nHar du ett concurrency-problem? Låt oss visa hur vi kan lösa det – ofta med färre servrar än du har idag.',
          en: 'The C10K problem (handling 10,000 connections) was formulated in 1999 and was a big challenge then.\n\nToday we\'re talking about C10M – 10 million simultaneous connections.\n\nWith the right architecture, it\'s possible:\n• WhatsApp had 900M users on 100 servers\n• Phoenix has demonstrated 2M WebSocket connections on one machine\n• BEAM has been run with 134M processes in tests\n\nYou can\'t buy your way out of concurrency problems.\nFaster CPU doesn\'t help if the architecture is blocking.\nMore RAM doesn\'t help if each connection costs 1MB.\nMore servers just increase complexity.\n\nIt\'s about architecture. Choose the right foundation, and one server can do what ten can\'t with the wrong foundation.\n\nDo you have a concurrency problem? Let us show you how we can solve it – often with fewer servers than you have today.'
        },
        image: {
          src: '/blog/massive-concurrency/c10k-to-c10m-evolution.png',
          alt: { sv: 'C10K till C10M evolution', en: 'C10K to C10M evolution' }
        }
      }
    ]
  }
];

// Helper functions
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getAllBlogPosts = (): BlogPost[] => {
  return [...blogPosts].sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
};
