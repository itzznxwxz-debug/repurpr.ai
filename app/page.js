"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Loader2, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  ChevronRight, 
  Cpu, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  Globe,
  Lock,
  ArrowUpRight,
  Star,
  X,
  CreditCard,
  AlertCircle
} from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [tone, setTone] = useState("professional");
  const [formatLength, setFormatLength] = useState("detailed");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [activeTab, setActiveTab] = useState("linkedin");
  const [copiedId, setCopiedId] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialize usage counter from localStorage on client side
  useEffect(() => {
    const savedUsage = localStorage.getItem("repurpr_usage_count");
    if (savedUsage !== null) {
      setGenerationCount(parseInt(savedUsage, 10));
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") === "success" || params.get("checkout") === "success_demo") {
        setCheckoutSuccess(true);
      }
    }
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!url) return;
    setErrorMessage(null);

    // Enforce Freemium limit check (Max 3 free generations)
    if (generationCount >= 3) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, tone, formatLength }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setOutput(data);
      
      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      localStorage.setItem("repurpr_usage_count", newCount.toString());

      if (newCount >= 3) {
        setTimeout(() => setShowPaywall(true), 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate Stripe checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Checkout error: " + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetFreeTrialDemo = () => {
    localStorage.setItem("repurpr_usage_count", "0");
    setGenerationCount(0);
    setShowPaywall(false);
  };

  const faqs = [
    {
      q: "How does Repurpr extract data from a URL?",
      a: "Repurpr uses a custom headless parsing engine paired with OpenAI's gpt-4o-mini model to ingest raw textual metadata, structural HTML headers, or transcript nodes from standard web links or YouTube videos instantly."
    },
    {
      q: "Can I customize the output tone and length?",
      a: "Yes. You can switch between Professional, Conversational, Technical, and Aggressive marketing tones, and toggle structural content lengths (Concise vs Detailed)."
    },
    {
      q: "How does the asset valuation work for flipping?",
      a: "This app comes pre-configured with a freemium generation counter and Stripe checkout hooks, making it ready for acquisition on platforms like Acquire.com or Microns.io."
    },
    {
      q: "Is there a free tier available to test?",
      a: "Yes, you can generate up to 3 comprehensive multi-platform packages completely free before unlocking the Pro tier."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#07090e] text-slate-100 relative overflow-hidden">
      
      {/* Background Ambient Glow FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] left-1/4 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Checkout Success Banner */}
      {checkoutSuccess && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 text-center text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg relative z-50">
          <CheckCircle2 className="w-4 h-4" /> Subscription Active! Welcome to Repurpr Pro. Unlimited Generations Unlocked.
          <button onClick={() => setCheckoutSuccess(false)} className="ml-4 hover:opacity-80"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="border-b border-slate-900/80 backdrop-blur-xl bg-[#07090e]/80 sticky top-0 z-50 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Repurpr<span className="text-indigo-500">.ai</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#generator" className="hover:text-white transition">Live Engine</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Free Uses Left: <strong className="text-white">{Math.max(0, 3 - generationCount)}/3</strong>
          </div>
          <button
            onClick={handleStripeCheckout}
            disabled={checkoutLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {checkoutLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Upgrade to Pro
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-16 pt-20 pb-12 max-w-5xl mx-auto text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 shadow-inner">
          <Flame className="w-3.5 h-3.5 text-indigo-400" /> Monetizable Micro-SaaS Asset v2.0
        </div>

        <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1]">
          Turn 1 Link Into <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-500 bg-clip-text text-transparent">30 Days of Viral Content</span>
        </h1>

        <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          Stop writing social media posts from scratch. Paste any blog article or YouTube video URL and let our heuristic AI map out hyper-optimized content matrices instantly.
        </p>
      </section>

      {/* Interactive Core App Engine */}
      <section id="generator" className="px-6 lg:px-16 pb-24 max-w-4xl mx-auto w-full relative z-10">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl shadow-black/50 ring-1 ring-white/5 relative">
          
          {/* Header Usage Counter & Reset Demo Button */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Content Synthesizer</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full border font-bold ${
                generationCount >= 3 
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400" 
                  : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
              }`}>
                {generationCount >= 3 ? "Free Limit Reached" : `${generationCount} / 3 Free Generations Used`}
              </span>
              {generationCount > 0 && (
                <button onClick={resetFreeTrialDemo} className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer">
                  Reset Demo
                </button>
              )}
            </div>
          </div>

          {/* Paywall Overlay Modal if Free Limit Reached */}
          {showPaywall && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn border border-indigo-500/40">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">Free Generation Limit Reached</h3>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                You have used your 3 complimentary trial generations. Upgrade to Pro to unlock unlimited URL parsing, custom tone weights, and direct Stripe checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-xs">
                <button
                  onClick={handleStripeCheckout}
                  disabled={checkoutLoading}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />} Upgrade to Pro ($19/mo) <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Generation Notice</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-400" /> Target Source URL (Blog, Article, or YouTube)
                </label>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Parser Active
                </span>
              </div>
              <div className="relative">
                <input
                  type="url"
                  required
                  placeholder="https://example.com/blog-post-or-video-link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-4 pr-4 py-4 text-sm md:text-base text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition shadow-inner"
                />
              </div>
            </div>

            {/* Advanced Configuration Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
              {/* Tone Selection */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Brand Tone:
                </span>
                <div className="flex gap-2">
                  {["professional", "conversational", "technical"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                        tone === t
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Length Selection */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Depth:
                </span>
                <div className="flex gap-2">
                  {["concise", "detailed"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setFormatLength(l)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                        formatLength === l
                          ? "bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl text-sm transition shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Ingesting & Generating Matrix...
                </>
              ) : (
                <>
                  Generate Content Matrix <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Results Output Workspace */}
          {(loading || output) && (
            <div className="mt-8 pt-8 border-t border-slate-800/80 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Generated Content Output Matrix
                  </span>
                </div>
                {output && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Deployment
                  </span>
                )}
              </div>

              {loading ? (
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs shadow-inner">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="font-medium">Ingesting URL metadata & running heuristic LLM chains...</p>
                </div>
              ) : output ? (
                <div className="space-y-4">
                  {/* Platform Switcher Tabs */}
                  <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                    {[
                      { id: "linkedin", label: "LinkedIn Post" },
                      { id: "twitter", label: "Twitter Thread" },
                      { id: "newsletter", label: "Newsletter Blurb" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          activeTab === tab.id
                            ? "bg-slate-800 text-white shadow-md border border-slate-700"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content Box */}
                  {output[activeTab] && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative group">
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => copyText(output[activeTab].content, activeTab)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition shadow cursor-pointer"
                        >
                          {copiedId === activeTab ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Text
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-indigo-400 mb-2 pr-24">
                        {output[activeTab].title}
                      </h4>
                      <pre className="text-xs md:text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed pt-2">
                        {output[activeTab].content}
                      </pre>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

        </div>
      </section>

      {/* Feature Grid Breakdown */}
      <section id="features" className="px-6 lg:px-16 py-20 max-w-6xl mx-auto w-full relative z-10 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Engineered for Maximum Valuation</h2>
          <p className="text-slate-400 text-sm">Built with modular components, freemium gating, and payment hooks to maximize your acquisition price.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Terminal className="w-5 h-5 text-indigo-400" />,
              title: "Heuristic Parsing Engine",
              desc: "Deep parsing logic extracts clean markdown transcripts from complex blog layouts or YouTube IDs instantly."
            },
            {
              icon: <Layers className="w-5 h-5 text-cyan-400" />,
              title: "Multi-Platform Formatting",
              desc: "Automatically chunks and weights character limits for LinkedIn, Twitter threads, and email newsletters."
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
              title: "Stripe & Paywall Ready",
              desc: "Includes built-in freemium limits and secure checkout webhooks designed for immediate micro-SaaS flipping."
            }
          ].map((item, index) => (
            <div key={index} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl hover:border-indigo-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700/60 shadow-inner">
                {item.icon}
              </div>
              <h3 className="font-bold text-base text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Monetization Asset Valuation Section */}
      <section id="pricing" className="px-6 lg:px-16 py-20 max-w-4xl mx-auto w-full relative z-10 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Simple, Transparent Asset Pricing</h2>
          <p className="text-slate-400 text-sm">Deploy this exact web asset and charge users a monthly subscription fee via Stripe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Tier */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter Asset</span>
              <div className="text-3xl font-black">$0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
              <p className="text-xs text-slate-400">Great for evaluating the tool and testing early user adoption.</p>
              <ul className="space-y-3 pt-4 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 3 Free Generations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Single Platform Export</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Standard Parsing Speed</li>
              </ul>
            </div>
            <a href="#generator" className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition text-center block">
              Try Free Now
            </a>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-indigo-950/40 via-slate-900/50 to-slate-900/80 border border-indigo-500/50 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/10">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase shadow flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> High Value Asset
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Pro Creator / SaaS</span>
              <div className="text-3xl font-black">$19 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-400">Designed for power users generating steady monthly recurring revenue (MRR).</p>
              <ul className="space-y-3 pt-4 text-xs text-slate-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Unlimited URL Ingestion</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Multi-Platform Matrix (LinkedIn, X, Newsletter)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Priority Processing Queue</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Direct Stripe Checkout Webhook</li>
              </ul>
            </div>
            <button 
              onClick={handleStripeCheckout}
              disabled={checkoutLoading}
              className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {checkoutLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />} Upgrade with Stripe <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-6 lg:px-16 py-20 max-w-3xl mx-auto w-full relative z-10 border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-lg">
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex justify-between items-center text-left font-bold text-sm text-slate-200 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-indigo-400 transition-transform ${activeFaq === index ? "rotate-90" : ""}`} />
              </button>
              {activeFaq === index && (
                <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 px-6 lg:px-16 text-center text-xs text-slate-600 space-y-2 mt-auto">
        <p>© 2026 Repurpr.ai — Built as a high-value digital asset ready for deployment and acquisition.</p>
        <p>Push to Vercel, attach a custom domain, and list on Acquire.com or Microns.io.</p>
      </footer>

    </div>
  );
}
