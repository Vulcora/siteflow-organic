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
