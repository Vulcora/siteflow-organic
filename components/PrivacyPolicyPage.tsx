import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Page } from '../types';

interface PrivacyPolicyPageProps {
  onNavigate: (page: Page) => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';

  useEffect(() => {
    document.title = lang === 'sv' ? 'Integritetspolicy | Siteflow' : 'Privacy Policy | Siteflow';

    // Set meta description
    const setMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('description', lang === 'sv'
      ? 'Läs om hur Siteflow hanterar dina personuppgifter och skyddar din integritet.'
      : 'Learn how Siteflow handles your personal data and protects your privacy.');

    return () => {
      document.title = 'Siteflow';
    };
  }, [lang]);

  const content = {
    sv: {
      title: 'Integritetspolicy',
      lastUpdated: 'Senast uppdaterad: 26 november 2025',
      intro: 'På Siteflow värnar vi om din integritet. Denna policy beskriver hur vi samlar in, använder och skyddar dina personuppgifter när du använder vår webbplats och våra tjänster.',
      sections: [
        {
          title: '1. Vilka uppgifter samlar vi in?',
          content: `Vi samlar in uppgifter som du frivilligt lämnar till oss:

• **Kontaktuppgifter:** Namn, e-postadress, telefonnummer och företagsnamn när du fyller i kontaktformulär eller bokar möten.
• **Kommunikation:** Innehållet i e-postmeddelanden och meddelanden du skickar till oss.
• **Teknisk information:** IP-adress, webbläsartyp och enhetsinformation för att förbättra användarupplevelsen.

Vi samlar inte in känsliga personuppgifter och vi säljer aldrig dina uppgifter till tredje part.`
        },
        {
          title: '2. Hur använder vi dina uppgifter?',
          content: `Vi använder dina uppgifter för att:

• Besvara förfrågningar och kommunicera med dig om våra tjänster
• Skicka relevant information om projekt och samarbeten
• Förbättra vår webbplats och tjänster
• Uppfylla juridiska krav och avtalsenliga förpliktelser

Vi behandlar dina uppgifter baserat på:
• **Samtycke:** När du aktivt lämnar uppgifter till oss
• **Berättigat intresse:** För att driva och förbättra vår verksamhet
• **Avtal:** När vi levererar tjänster till dig`
        },
        {
          title: '3. Hur länge sparar vi dina uppgifter?',
          content: `Vi sparar dina uppgifter endast så länge som nödvändigt:

• **Kontaktförfrågningar:** Upp till 2 år efter senaste kontakt
• **Kundrelationer:** Under avtalstiden plus 7 år enligt bokföringslagen
• **Tekniska loggar:** Maximalt 12 månader

Du kan när som helst begära att vi raderar dina uppgifter, såvida vi inte har laglig skyldighet att behålla dem.`
        },
        {
          title: '4. Hur skyddar vi dina uppgifter?',
          content: `Vi tar datasäkerhet på allvar och implementerar:

• Krypterad överföring (HTTPS/TLS)
• Säker serverinfrastruktur med regelbundna säkerhetsuppdateringar
• Begränsad åtkomst – endast behörig personal kan se personuppgifter
• Regelbundna säkerhetsgranskningar

Vi väljer leverantörer som uppfyller GDPR och har starka säkerhetsrutiner.`
        },
        {
          title: '5. Tredjepartsleverantörer',
          content: `Vi använder följande tjänster som kan behandla personuppgifter:

• **Hosting:** Fly.io (EU-baserad infrastruktur)
• **E-post:** För kommunikation med kunder
• **Analys:** Anonymiserad trafikanalys för att förbättra webbplatsen

Alla våra leverantörer har databehandlingsavtal och följer GDPR.`
        },
        {
          title: '6. Cookies',
          content: `Vår webbplats använder endast nödvändiga cookies för att webbplatsen ska fungera korrekt. Vi använder inga spårningscookies eller tredjepartscookies för marknadsföring.

Om du vill kan du blockera cookies i din webbläsare, men vissa funktioner kan då påverkas.`
        },
        {
          title: '7. Dina rättigheter',
          content: `Enligt GDPR har du rätt att:

• **Få tillgång** till vilka uppgifter vi har om dig
• **Rätta** felaktiga uppgifter
• **Radera** dina uppgifter ("rätten att bli bortglömd")
• **Begränsa** behandlingen av dina uppgifter
• **Flytta** dina uppgifter till annan tjänst (dataportabilitet)
• **Invända** mot viss behandling

Kontakta oss på privacy@siteflow.se för att utöva dina rättigheter. Vi svarar inom 30 dagar.`
        },
        {
          title: '8. Kontakt och tillsynsmyndighet',
          content: `**Personuppgiftsansvarig:**
Siteflow AB
E-post: privacy@siteflow.se

Om du inte är nöjd med hur vi hanterar dina uppgifter kan du kontakta Integritetsskyddsmyndigheten (IMY):
www.imy.se`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: November 26, 2025',
      intro: 'At Siteflow, we care about your privacy. This policy describes how we collect, use, and protect your personal data when you use our website and services.',
      sections: [
        {
          title: '1. What data do we collect?',
          content: `We collect data that you voluntarily provide to us:

• **Contact information:** Name, email address, phone number, and company name when you fill out contact forms or book meetings.
• **Communication:** The content of emails and messages you send to us.
• **Technical information:** IP address, browser type, and device information to improve user experience.

We do not collect sensitive personal data and we never sell your data to third parties.`
        },
        {
          title: '2. How do we use your data?',
          content: `We use your data to:

• Respond to inquiries and communicate with you about our services
• Send relevant information about projects and collaborations
• Improve our website and services
• Fulfill legal requirements and contractual obligations

We process your data based on:
• **Consent:** When you actively provide data to us
• **Legitimate interest:** To operate and improve our business
• **Contract:** When we deliver services to you`
        },
        {
          title: '3. How long do we store your data?',
          content: `We store your data only as long as necessary:

• **Contact inquiries:** Up to 2 years after last contact
• **Customer relationships:** During the contract period plus 7 years according to accounting laws
• **Technical logs:** Maximum 12 months

You can request deletion of your data at any time, unless we have a legal obligation to retain it.`
        },
        {
          title: '4. How do we protect your data?',
          content: `We take data security seriously and implement:

• Encrypted transmission (HTTPS/TLS)
• Secure server infrastructure with regular security updates
• Limited access – only authorized personnel can access personal data
• Regular security audits

We choose vendors that comply with GDPR and have strong security practices.`
        },
        {
          title: '5. Third-party providers',
          content: `We use the following services that may process personal data:

• **Hosting:** Fly.io (EU-based infrastructure)
• **Email:** For customer communication
• **Analytics:** Anonymized traffic analysis to improve the website

All our vendors have data processing agreements and comply with GDPR.`
        },
        {
          title: '6. Cookies',
          content: `Our website only uses essential cookies required for the website to function properly. We do not use tracking cookies or third-party cookies for marketing purposes.

You can block cookies in your browser if you prefer, but some features may be affected.`
        },
        {
          title: '7. Your rights',
          content: `Under GDPR, you have the right to:

• **Access** what data we have about you
• **Rectify** incorrect data
• **Erase** your data ("right to be forgotten")
• **Restrict** the processing of your data
• **Port** your data to another service (data portability)
• **Object** to certain processing

Contact us at privacy@siteflow.se to exercise your rights. We will respond within 30 days.`
        },
        {
          title: '8. Contact and supervisory authority',
          content: `**Data Controller:**
Siteflow AB
Email: privacy@siteflow.se

If you are not satisfied with how we handle your data, you can contact the Swedish Authority for Privacy Protection (IMY):
www.imy.se`
        }
      ]
    }
  };

  const c = content[lang];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('nav.home')}</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{c.title}</h1>
          <p className="text-slate-400">{c.lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-lg text-slate-600 mb-12 leading-relaxed">{c.intro}</p>

          {c.sections.map((section, index) => (
            <div key={index} className="mb-10">
              <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">{section.title}</h2>
              <div className="prose prose-slate max-w-none">
                {section.content.split('\n\n').map((paragraph, pIndex) => {
                  if (paragraph.includes('• **')) {
                    const lines = paragraph.split('\n');
                    return (
                      <ul key={pIndex} className="space-y-2 text-slate-600 mb-4 list-none">
                        {lines.map((line, lIndex) => {
                          if (line.startsWith('• **')) {
                            const match = line.match(/• \*\*(.+?)\*\*:?\s*(.*)/);
                            if (match) {
                              return (
                                <li key={lIndex} className="flex items-start">
                                  <span className="text-blue-500 mr-3 mt-1">•</span>
                                  <span><strong className="text-slate-900">{match[1]}:</strong> {match[2]}</span>
                                </li>
                              );
                            }
                          }
                          return line && <p key={lIndex} className="text-slate-600">{line}</p>;
                        })}
                      </ul>
                    );
                  }
                  return (
                    <p key={pIndex} className="text-slate-600 leading-relaxed mb-4">{paragraph}</p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
