import React, { useState } from 'react';
import { ShieldAlert, Scale, Cookie, Fingerprint, HelpCircle } from 'lucide-react';

export default function LegalPages() {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'cookie' | 'disclaimer' | 'dmca'>('privacy');

  const policies = {
    privacy: {
      title: "VoxAI Privacy Policy",
      icon: Fingerprint,
      subtitle: "Last Updated Statement: May 2026",
      introduction: "At VoxAI, accessible from the preview sandbox domain, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by VoxAI and how we use it.",
      sections: [
        {
          heading: "1. Client-Side Processing Architecture",
          body: "Unlike typical cloud networks, VoxAI performs speech synthesis directly within the client browser buffer through standard Web SpeechSynthesis APIs. Because audio translation is calculated completely locally on your machine, your input scripts never touch third-party databases, providing unparalleled enterprise security."
        },
        {
          heading: "2. Personal Information Collection",
          body: "We do not request, harvest, or persist sensitive user keys. Only basic telemetry parameters such as character counts generated, bookmark voice logs, and subscription simulation indices are saved inside the local sandbox storage for user convenience."
        },
        {
          heading: "3. Logging Data & Cookies",
          body: "VoxAI uses diagnostic localStorage blocks to remember favorites, selected pitch levels, and theme configurations. No ad tracker networks or behavioral profiling scripts are ever injected into the root application frame."
        }
      ]
    },
    terms: {
      title: "SaaS Terms of Service",
      icon: Scale,
      subtitle: "Last Updated Statement: May 2026",
      introduction: "By accessing this platform, you agree to comply with and be bound by the following Terms of Service governing local synthesizer access and sound licensing.",
      sections: [
        {
          heading: "1. Permitted Resource Actions",
          body: "Users are granted an unlimited, royalty-free, globally authorized license to synthesize, stream, download, and export vocal tracks created using standard free voice presets for both private and fully monetized commercial video or audiobook audio formats."
        },
        {
          heading: "2. Absolute Conduct Boundaries",
          body: "You are strictly forbidden from utilizing synthetic voices to construct, distribute, or propagate malicious political misinformation, fraudulent deepfakes, or harassment scripts. Violation immediately terminates local sandbox execution authorizations."
        },
        {
          heading: "3. Disclaimers and Warranties",
          body: "The speech engines are provided 'as is' without warranty of any kind. Speech cadences and OS pronunciations fall back to localized platform systems which are beyond our absolute direct modification capabilities."
        }
      ]
    },
    cookie: {
      title: "Cookie Disclosure",
      icon: Cookie,
      subtitle: "Compliance: GDPR & CCPA Shield Protected",
      introduction: "We use cookies and localStorage parameters on our site to improve features and remember preset choices.",
      sections: [
        {
          heading: "1. What is Local Storage Caching?",
          body: "We store lightweight configuration parameters inside your browser localStorage context rather than sending tracking cookies to servers. This enables instantaneous loading of your voice history and selected accents across sessions."
        },
        {
          heading: "2. Strict Necessity",
          body: "These storage tags are absolutely necessary to operationalize your Creator Studio slider parameters (uniquely mapping rate, pitch, and selected vocal speaker variables)."
        }
      ]
    },
    disclaimer: {
      title: "Platform Disclaimer",
      icon: HelpCircle,
      subtitle: "Linguistic Disclaimer Rules",
      introduction: "Please read this legal disclaimer carefully before utilizing our synthesized sound waves.",
      sections: [
        {
          heading: "1. Speech Accuracy Liability",
          body: "VoxAI cannot guarantee that the phonemes rendered by browser synthesis systems are grammatically or phonetically flawless. The platform acts simply as a web controller mapping native speaker libraries on your local operating hardware."
        },
        {
          heading: "2. Third Party Intellectual Liability",
          body: "The voice names (e.g. 'Sarah', 'Sir Arthur') are simulated phonetic representations designed to describe the acoustic model tone. No affiliation, endorsement, or ownership of existing real-world personalities is implied."
        }
      ]
    },
    dmca: {
      title: "DMCA Copyright Policy",
      icon: ShieldAlert,
      subtitle: "Copyright Take-Down Guidelines",
      introduction: "VoxAI respects the copyright rights of intellectual creators and expects users to do the same.",
      sections: [
        {
          heading: "1. Copyright Infringement Claims",
          body: "If any user utilizes our open-source tools to broadcast copyrighted literature or replicate secure vocal properties, copyright holders can submit a DMCA take-down request to support@voxai.com. We will immediately suspend access to offending online scripts."
        },
        {
          heading: "2. Reporting Guidelines",
          body: "An official notice must identify the highly structured address of copyrighted assets, proof of authorization, and specific details. We respond to and process claims within forty-eight hours of submission."
        }
      ]
    }
  };

  const selectedPolicy = policies[activePolicy];
  const IconComponent = selectedPolicy.icon;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-white text-left">
      
      <div className="text-left mb-8 pb-4 border-b border-white/10">
        <span className="text-xs font-bold text-violet-400 font-mono uppercase tracking-widest leading-none">Regulatory Center</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-display">Legal Policies & Compliance</h1>
        <p className="text-xs sm:text-sm text-white/50 leading-normal mt-0.5">Read VoxAI legal conditions, DMCA copyright rules, cookie policies, and customer protection disclaimers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Nav (Col-3) */}
        <div className="lg:col-span-3 space-y-2">
          {Object.keys(policies).map((key) => {
            const pol = policies[key as keyof typeof policies];
            const PolIcon = pol.icon;
            const isActive = activePolicy === key;
            return (
              <button
                key={key}
                onClick={() => setActivePolicy(key as any)}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider font-mono border transition-all ${
                  isActive 
                    ? 'bg-white/10 border-violet-500/30 text-violet-400 font-bold' 
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                <PolIcon className="h-4 w-4 shrink-0" />
                <span>{key.replace('-', ' ')}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body (Col-9) */}
        <div className="lg:col-span-9 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 space-y-6 backdrop-blur-md shadow-sm">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                <IconComponent className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{selectedPolicy.title}</h2>
            </div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/35 pl-10">
              {selectedPolicy.subtitle}
            </p>
          </div>

          {/* Intro */}
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed border-l-2 border-violet-500 pl-4 text-justify">
            {selectedPolicy.introduction}
          </p>

          {/* Sections list */}
          <div className="space-y-6 pt-4 text-left">
            {selectedPolicy.sections.map((sec, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                  {sec.heading}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed text-justify whitespace-pre-line">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Protective Seal Bottom Row */}
          <div className="border-t border-white/5 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest inline-flex items-center gap-1.5 leading-none">
              <Scale className="h-3.5 w-3.5" /> Permanent Legal Shield Active
            </span>
            <div className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono text-emerald-400 leading-none">
              Client Authorized Sandbox
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
