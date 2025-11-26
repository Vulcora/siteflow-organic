import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Page } from '../types';

interface TermsOfServicePageProps {
  onNavigate: (page: Page) => void;
}

const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'sv' | 'en';

  useEffect(() => {
    document.title = lang === 'sv' ? 'Användarvillkor | Siteflow' : 'Terms of Service | Siteflow';

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
      ? 'Läs Siteflows användarvillkor för webbplatsen och våra tjänster.'
      : 'Read Siteflow\'s terms of service for the website and our services.');

    return () => {
      document.title = 'Siteflow';
    };
  }, [lang]);

  const content = {
    sv: {
      title: 'Användarvillkor',
      lastUpdated: 'Senast uppdaterad: 26 november 2025',
      intro: 'Dessa användarvillkor gäller för din användning av Siteflows webbplats (siteflow.se) och utgör ett avtal mellan dig och Siteflow AB. Genom att använda webbplatsen accepterar du dessa villkor.',
      sections: [
        {
          title: '1. Om Siteflow',
          content: `Siteflow AB är ett svenskt konsultbolag specialiserat på systemutveckling och digital transformation. Vi bygger skräddarsydda system med fokus på skalbarhet, effektivitet och långsiktig hållbarhet.

**Företagsinformation:**
Siteflow AB
Organisationsnummer: [Org.nr]
E-post: hello@siteflow.se`
        },
        {
          title: '2. Användning av webbplatsen',
          content: `Du får använda vår webbplats för att:

• Läsa om våra tjänster och kompetenser
• Ta kontakt med oss angående potentiella projekt
• Läsa vårt blogginnehåll och kundcase

Du får **inte**:

• Använda webbplatsen för olagliga syften
• Försöka få obehörig åtkomst till våra system
• Kopiera, distribuera eller modifiera innehåll utan tillstånd
• Automatiskt samla in data från webbplatsen (scraping)
• Belasta våra servrar med onödig trafik`
        },
        {
          title: '3. Immateriella rättigheter',
          content: `Allt innehåll på webbplatsen – inklusive text, bilder, grafik, logotyper, kod och design – tillhör Siteflow AB eller våra licensgivare och skyddas av upphovsrätt och andra immateriella rättigheter.

Du får:
• Läsa och dela länkar till vårt innehåll
• Citera kortare stycken med tydlig källhänvisning

Du får inte:
• Kopiera eller reproducera innehåll för kommersiellt bruk
• Använda våra logotyper eller varumärken utan skriftligt tillstånd
• Skapa derivativa verk baserat på vårt innehåll`
        },
        {
          title: '4. Tjänster och uppdrag',
          content: `Webbplatsen innehåller information om våra tjänster, men den utgör inget bindande erbjudande. Alla konsultuppdrag regleras av separata avtal som specificerar:

• Omfattning och leverabler
• Tidsramar och milstolpar
• Priser och betalningsvillkor
• Immateriella rättigheter till resultat
• Sekretess och konfidentialitet

Vi förbehåller oss rätten att tacka nej till uppdrag som inte matchar vår expertis eller värdegrund.`
        },
        {
          title: '5. Kontaktformulär och kommunikation',
          content: `När du skickar förfrågningar via vårt kontaktformulär:

• Samlar vi in de uppgifter du anger (se vår Integritetspolicy)
• Förbinder vi oss att svara inom rimlig tid
• Behandlas informationen konfidentiellt

Vi garanterar inte att alla förfrågningar leder till samarbete, men vi strävar efter att ge ett professionellt svar till alla som kontaktar oss.`
        },
        {
          title: '6. Analysverktyget',
          content: `Vår webbplats innehåller ett AI-drivet analysverktyg som hjälper till att bedöma systemkomplexitet. Observera att:

• Analysen är vägledande och ersätter inte professionell rådgivning
• Resultaten baseras på den information du anger
• Vi lagrar inte analysresultat permanent
• Verktyget är kostnadsfritt och utan förpliktelse

För detaljerad analys rekommenderar vi att boka ett möte med oss.`
        },
        {
          title: '7. Ansvarsfriskrivning',
          content: `Webbplatsen tillhandahålls "i befintligt skick". Vi strävar efter att hålla informationen korrekt och uppdaterad, men vi garanterar inte:

• Att webbplatsen är felfri eller oavbruten
• Att all information är komplett eller aktuell
• Att webbplatsen är kompatibel med alla enheter

**Ansvarsbegränsning:**
Siteflow AB ansvarar inte för direkta, indirekta eller följdskador som uppstår genom användning av webbplatsen. Detta inkluderar, men är inte begränsat till, förlorad data, utebliven vinst eller affärsavbrott.

Denna begränsning gäller inte vid grov vårdslöshet eller uppsåt från vår sida.`
        },
        {
          title: '8. Länkar till tredje part',
          content: `Vår webbplats kan innehålla länkar till externa webbplatser. Vi ansvarar inte för:

• Innehållet på externa webbplatser
• Deras integritetspolicyer eller säkerhet
• Eventuella skador från användning av externa tjänster

Vi rekommenderar att du läser villkoren för alla externa tjänster du använder.`
        },
        {
          title: '9. Ändringar av villkoren',
          content: `Vi kan uppdatera dessa villkor vid behov. Väsentliga ändringar meddelas via:

• Uppdaterat datum överst på sidan
• Eventuellt meddelande på webbplatsen

Genom att fortsätta använda webbplatsen efter ändringar accepterar du de uppdaterade villkoren. Om du inte accepterar nya villkor bör du sluta använda webbplatsen.`
        },
        {
          title: '10. Tillämplig lag och tvister',
          content: `Dessa villkor regleras av svensk lag. Eventuella tvister ska i första hand lösas genom förhandling. Om parterna inte kan enas ska tvisten avgöras av svensk allmän domstol med Stockholms tingsrätt som första instans.`
        },
        {
          title: '11. Kontakt',
          content: `Vid frågor om dessa villkor, kontakta oss:

**Siteflow AB**
E-post: hello@siteflow.se
Webb: siteflow.se`
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: November 26, 2025',
      intro: 'These terms of service apply to your use of Siteflow\'s website (siteflow.se) and constitute an agreement between you and Siteflow AB. By using the website, you accept these terms.',
      sections: [
        {
          title: '1. About Siteflow',
          content: `Siteflow AB is a Swedish consulting company specialized in system development and digital transformation. We build custom systems with a focus on scalability, efficiency, and long-term sustainability.

**Company Information:**
Siteflow AB
Organization number: [Org.nr]
Email: hello@siteflow.se`
        },
        {
          title: '2. Use of the website',
          content: `You may use our website to:

• Read about our services and expertise
• Contact us regarding potential projects
• Read our blog content and case studies

You may **not**:

• Use the website for illegal purposes
• Attempt to gain unauthorized access to our systems
• Copy, distribute, or modify content without permission
• Automatically collect data from the website (scraping)
• Burden our servers with unnecessary traffic`
        },
        {
          title: '3. Intellectual property rights',
          content: `All content on the website – including text, images, graphics, logos, code, and design – belongs to Siteflow AB or our licensors and is protected by copyright and other intellectual property rights.

You may:
• Read and share links to our content
• Quote shorter passages with clear source attribution

You may not:
• Copy or reproduce content for commercial use
• Use our logos or trademarks without written permission
• Create derivative works based on our content`
        },
        {
          title: '4. Services and assignments',
          content: `The website contains information about our services, but it does not constitute a binding offer. All consulting assignments are governed by separate agreements that specify:

• Scope and deliverables
• Timelines and milestones
• Prices and payment terms
• Intellectual property rights to results
• Confidentiality and non-disclosure

We reserve the right to decline assignments that don't match our expertise or values.`
        },
        {
          title: '5. Contact forms and communication',
          content: `When you send inquiries through our contact form:

• We collect the information you provide (see our Privacy Policy)
• We commit to responding within a reasonable time
• Information is treated confidentially

We do not guarantee that all inquiries will lead to collaboration, but we strive to provide a professional response to everyone who contacts us.`
        },
        {
          title: '6. Analysis tool',
          content: `Our website contains an AI-powered analysis tool that helps assess system complexity. Please note that:

• The analysis is advisory and does not replace professional advice
• Results are based on the information you provide
• We do not permanently store analysis results
• The tool is free and without obligation

For detailed analysis, we recommend booking a meeting with us.`
        },
        {
          title: '7. Disclaimer',
          content: `The website is provided "as is." We strive to keep information accurate and up-to-date, but we do not guarantee:

• That the website is error-free or uninterrupted
• That all information is complete or current
• That the website is compatible with all devices

**Limitation of liability:**
Siteflow AB is not liable for direct, indirect, or consequential damages arising from use of the website. This includes, but is not limited to, lost data, lost profits, or business interruption.

This limitation does not apply in cases of gross negligence or willful misconduct on our part.`
        },
        {
          title: '8. Third-party links',
          content: `Our website may contain links to external websites. We are not responsible for:

• Content on external websites
• Their privacy policies or security
• Any damages from using external services

We recommend reading the terms of all external services you use.`
        },
        {
          title: '9. Changes to the terms',
          content: `We may update these terms as needed. Significant changes will be communicated via:

• Updated date at the top of the page
• Possible notice on the website

By continuing to use the website after changes, you accept the updated terms. If you do not accept new terms, you should stop using the website.`
        },
        {
          title: '10. Applicable law and disputes',
          content: `These terms are governed by Swedish law. Any disputes shall primarily be resolved through negotiation. If the parties cannot agree, the dispute shall be decided by Swedish general courts with the Stockholm District Court as the court of first instance.`
        },
        {
          title: '11. Contact',
          content: `For questions about these terms, contact us:

**Siteflow AB**
Email: hello@siteflow.se
Web: siteflow.se`
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
                  if (paragraph.includes('• **') || paragraph.startsWith('•')) {
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
                          } else if (line.startsWith('• ')) {
                            return (
                              <li key={lIndex} className="flex items-start">
                                <span className="text-blue-500 mr-3 mt-1">•</span>
                                <span>{line.replace('• ', '')}</span>
                              </li>
                            );
                          }
                          return line && <p key={lIndex} className="text-slate-600">{line}</p>;
                        })}
                      </ul>
                    );
                  }
                  if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                    return (
                      <p key={pIndex} className="text-slate-600 leading-relaxed mb-4">
                        <strong className="text-slate-900">{paragraph.match(/\*\*(.+?)\*\*/)?.[1]}</strong>
                        {paragraph.replace(/\*\*.+?\*\*/, '')}
                      </p>
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

export default TermsOfServicePage;
