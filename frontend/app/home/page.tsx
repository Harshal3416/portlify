'use client';

export default function Home() {
    return (
        <div className="bg-cream text-steel-dark overflow-x-hidden">

            {/* <!-- ═══════════════════════════════════════════════════════════
     HEADER
══════════════════════════════════════════════════════════════ --> */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-card">
                <div className="max-w-6xl mx-auto px-6 h-[70px] flex items-center justify-between">

                    {/* <!-- Logo --> */}
                    <a href="#" className="flex items-center gap-3 no-underline group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-steel-dark to-steel-mid flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                            </svg>
                        </div>
                        <div className="leading-none">
                            <div className="font-display text-xl font-black text-steel-dark tracking-tight">
                                Catalo<span className="text-gold">gr</span>
                            </div>
                            <div className="text-[10px] text-steel uppercase tracking-widest mt-0.5">Business Showcase</div>
                        </div>
                    </a>

                    {/* <!-- Desktop Nav --> */}
                    <nav className="hidden md:flex items-center gap-2">
                        <a href="#features" className="px-4 py-2 rounded-full text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">Features</a>
                        <a href="#how-it-works" className="px-4 py-2 rounded-full text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">How it Works</a>
                        <a href="#directory" className="px-4 py-2 rounded-full text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">Directory</a>
                        <div className="w-px h-5 bg-gray-200 mx-1"></div>
                        <a href="site-settings.html"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-steel-dark text-white text-sm font-semibold hover:bg-gold hover:text-steel-dark transition-all duration-200 shadow-md hover:shadow-gold hover:-translate-y-0.5">
                            <span>✦</span> Create Free Store
                        </a>
                    </nav>

                    {/* <!-- Hamburger --> */}
                    <button className="md:hidden flex flex-col gap-1.5 p-2 border-none bg-transparent cursor-pointer" aria-label="Toggle menu"
                    // onclick="toggleMobileNav()" 
                    >
                        <span className="block w-5 h-0.5 bg-steel-dark rounded transition-all"></span>
                        <span className="block w-5 h-0.5 bg-steel-dark rounded transition-all"></span>
                        <span className="block w-5 h-0.5 bg-steel-dark rounded transition-all"></span>
                    </button>
                </div>

                {/* <!-- Mobile Nav Drawer --> */}
                <div id="mobileNav" className="mobile-nav flex-col gap-1 bg-white border-t border-gray-100 px-6 py-4 pb-5 shadow-card">
                    <a href="#features" className="px-4 py-3 rounded-xl text-sm font-medium text-steel-mid hover:bg-cream hover:text-steel-dark transition-all"
                    // onclick="toggleMobileNav()"
                    >Features</a>
                    <a href="#how-it-works" className="px-4 py-3 rounded-xl text-sm font-medium text-steel-mid hover:bg-cream hover:text-steel-dark transition-all"
                    // onclick="toggleMobileNav()"
                    >How it Works</a>
                    <a href="#directory" className="px-4 py-3 rounded-xl text-sm font-medium text-steel-mid hover:bg-cream hover:text-steel-dark transition-all"
                    // onclick="toggleMobileNav()"
                    >Directory</a>
                    <a href="site-settings.html"
                        className="mt-2 px-4 py-3.5 rounded-full bg-steel-dark text-white text-sm font-semibold text-center hover:bg-gold hover:text-steel-dark transition-all">
                        ✦ Create Free Store
                    </a>
                </div>
            </header>


            {/* <!-- ═══════════════════════════════════════════════════════════
     HERO
══════════════════════════════════════════════════════════════ --> */}
            <section className="hero-clip hero-grid relative overflow-hidden bg-gradient-to-br from-steel-dark via-[#3a5570] to-[#2c4a62] pt-24 pb-32 px-6">
                {/* <!-- Glow blobs --> */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-16 right-1/4 w-64 h-64 bg-steel/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* <!-- Left: Content --> */}
                    <div className="animate-fadeUp">
                        {/* <!-- Badge --> */}
                        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold-light px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulseDot"></span>
                            Free for every business · No credit card needed
                        </div>

                        {/* <!-- Heading --> */}
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.1] tracking-tight mb-6">
                            Your business,
                            {/* <br> */}
                            <em className="not-italic text-gold-light">beautifully</em>
                            {/* <br> */}
                            showcased.
                        </h1>

                        <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-[460px]">
                            Catalogr lets any business — shop, broker, bakery, guest lodge — build a stunning digital product catalog and share it with customers in minutes. Free, forever.
                        </p>

                        {/* <!-- CTAs --> */}
                        <div className="flex flex-wrap items-center gap-3 mb-12">
                            <a href="site-settings.html"
                                className="flex items-center gap-2 bg-gold hover:bg-gold-light text-steel-dark font-bold text-sm px-7 py-4 rounded-full shadow-gold hover:shadow-gold hover:-translate-y-0.5 transition-all duration-200">
                                Create Your Free Store →
                            </a>
                            <a href="#directory"
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-sm font-medium px-6 py-4 rounded-full transition-all duration-200">
                                Browse Businesses ↓
                            </a>
                        </div>

                        {/* <!-- Stats --> */}
                        <div className="flex items-center gap-8 flex-wrap">
                            <div>
                                <div className="font-display text-3xl font-bold text-gold-light">50+</div>
                                <div className="text-white/50 text-xs uppercase tracking-wider mt-1">Businesses Live</div>
                            </div>
                            <div className="w-px h-9 bg-white/15"></div>
                            <div>
                                <div className="font-display text-3xl font-bold text-gold-light">5 min</div>
                                <div className="text-white/50 text-xs uppercase tracking-wider mt-1">To Go Live</div>
                            </div>
                            <div className="w-px h-9 bg-white/15"></div>
                            <div>
                                <div className="font-display text-3xl font-bold text-gold-light">100%</div>
                                <div className="text-white/50 text-xs uppercase tracking-wider mt-1">Free Forever</div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Right: Floating Mockup --> */}
                    <div className="flex justify-center lg:justify-end animate-fadeUp" style={{ animationDelay: '0.15s' }}>
                        <div className="w-full max-w-[360px] bg-white/8 border border-white/12 rounded-2xl p-4 backdrop-blur-md shadow-2xl animate-float">
                            {/* <!-- Browser chrome --> */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
                                <div className="flex-1 bg-white/10 rounded-md px-3 py-1 text-[10px] text-white/40 font-mono">catalogr.app/store?id=rajsteel</div>
                            </div>

                            {/* <!-- Mockup header --> */}
                            <div className="bg-steel-dark rounded-xl px-3 py-2.5 flex items-center justify-between mb-2">
                                <span className="font-display text-sm font-bold text-white">Raj <span className="text-gold-light">Wholesale</span></span>
                                <span className="bg-gold text-steel-dark text-[9px] font-bold px-2 py-1 rounded-full">🛒 2</span>
                            </div>

                            {/* <!-- Mockup hero strip --> */}
                            <div className="bg-gradient-to-r from-steel-dark/80 to-steel-mid/60 rounded-lg p-3 mb-2 text-center">
                                <div className="font-display text-[11px] font-bold text-white">Stainless Steel Shop</div>
                                <div className="text-[8px] text-white/55 mt-0.5">Wholesale · Bangalore · Est. 2004</div>
                            </div>

                            {/* <!-- Mockup product grid --> */}
                            <div className="grid grid-cols-3 gap-1.5 mb-2">
                                <div className="bg-white/10 rounded-lg p-2 flex flex-col items-center gap-1">
                                    <span className="text-xl">🥘</span>
                                    <span className="text-[7px] text-white/70 text-center leading-tight">Pressure Cooker</span>
                                    <span className="bg-gold text-steel-dark text-[6px] font-bold px-1.5 py-0.5 rounded">Add</span>
                                </div>
                                <div className="bg-white/10 rounded-lg p-2 flex flex-col items-center gap-1">
                                    <span className="text-xl">🍳</span>
                                    <span className="text-[7px] text-white/70 text-center leading-tight">Steel Pan Set</span>
                                    <span className="bg-gold text-steel-dark text-[6px] font-bold px-1.5 py-0.5 rounded">Add</span>
                                </div>
                                <div className="bg-white/10 rounded-lg p-2 flex flex-col items-center gap-1">
                                    <span className="text-xl">🍱</span>
                                    <span className="text-[7px] text-white/70 text-center leading-tight">Tiffin Box</span>
                                    <span className="bg-white/20 text-white/60 text-[6px] font-bold px-1.5 py-0.5 rounded">✓ Cart</span>
                                </div>
                            </div>

                            {/* <!-- Mockup contact row --> */}
                            <div className="flex items-center justify-between bg-white/6 rounded-lg px-2.5 py-2">
                                <span className="text-[8px] text-white/50">📞 9909090909</span>
                                <span className="text-[8px] text-white/50">📍 Chikpete, Blr</span>
                                <span className="bg-[#25D366]/80 text-white text-[7px] font-bold px-2 py-0.5 rounded-full">WhatsApp</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* <!-- ═══════════════════════════════════════════════════════════
     FEATURE CARDS
══════════════════════════════════════════════════════════════ --> */}
            <section id="features" className="py-24 px-6 bg-cream">
                <div className="max-w-6xl mx-auto">

                    {/* <!-- Section header --> */}
                    <div className="text-center mb-14">
                        <span className="text-xs font-semibold tracking-[2px] uppercase text-gold mb-3 block">Why Catalogr</span>
                        <h2 className="font-display text-4xl font-black text-steel-dark leading-tight tracking-tight mb-4">
                            Everything your business
                            {/* <br> */}
                            <em className="not-italic text-steel-mid">needs to shine online</em>
                        </h2>
                        <p className="text-steel text-base leading-relaxed max-w-lg mx-auto">
                            No code, no designers, no monthly fees. Just a beautiful digital catalog your customers can browse and enquire from.
                        </p>
                    </div>

                    {/* <!-- Cards grid --> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        {/* <!-- Card 1 --> */}
                        <div className="feature-card fc-steel relative bg-white border border-gray-200 rounded-[18px] p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-250 overflow-hidden group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-steel-light flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200">🌐</div>
                            <h3 className="font-display text-lg font-bold text-steel-dark mb-2">Live in Minutes</h3>
                            <p className="text-sm text-steel leading-relaxed">Set up your store, add products, and share your link — all in under 5 minutes. No technical knowledge needed.</p>
                            <div className="flex items-center gap-1 mt-5 text-xs text-steel font-medium">
                                <span className="text-green-600">✓</span> No code required
                            </div>
                        </div>

                        {/* <!-- Card 2 --> */}
                        <div className="feature-card fc-gold relative bg-white border border-gray-200 rounded-[18px] p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-250 overflow-hidden group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-pale to-gold-light flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200">🎨</div>
                            <h3 className="font-display text-lg font-bold text-steel-dark mb-2">Fully Customisable</h3>
                            <p className="text-sm text-steel leading-relaxed">Add your logo, business name, description, opening hours, and social links. Your store, your identity.</p>
                            <div className="flex items-center gap-1 mt-5 text-xs text-steel font-medium">
                                <span className="text-green-600">✓</span> Your brand, your way
                            </div>
                        </div>

                        {/* <!-- Card 3 --> */}
                        <div className="feature-card fc-green relative bg-white border border-gray-200 rounded-[18px] p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-250 overflow-hidden group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-green-200 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200">💬</div>
                            <h3 className="font-display text-lg font-bold text-steel-dark mb-2">WhatsApp Enquiries</h3>
                            <p className="text-sm text-steel leading-relaxed">Customers tap "Enquire" and WhatsApp opens with a pre-filled message. Get orders directly, no middleman.</p>
                            <div className="flex items-center gap-1 mt-5 text-xs text-steel font-medium">
                                <span className="text-green-600">✓</span> Instant customer connect
                            </div>
                        </div>

                        {/* <!-- Card 4 --> */}
                        <div className="feature-card fc-purple relative bg-white border border-gray-200 rounded-[18px] p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-250 overflow-hidden group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-200 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200">🏢</div>
                            <h3 className="font-display text-lg font-bold text-steel-dark mb-2">Any Business Type</h3>
                            <p className="text-sm text-steel leading-relaxed">Broker, bakery, wholesale dealer, guest lodge, or retailer — Catalogr works for every kind of business.</p>
                            <div className="flex items-center gap-1 mt-5 text-xs text-steel font-medium">
                                <span className="text-green-600">✓</span> Universal platform
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* <!-- ═══════════════════════════════════════════════════════════
     HOW IT WORKS
══════════════════════════════════════════════════════════════ --> */}
            <section id="how-it-works" className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* <!-- Left: Steps --> */}
                    <div>
                        <span className="text-xs font-semibold tracking-[2px] uppercase text-gold mb-3 block">Get Started</span>
                        <h2 className="font-display text-4xl font-black text-steel-dark leading-tight tracking-tight mb-3">
                            Up and running
                            {/* <br> */}
                            <em className="not-italic text-steel-mid">in 4 simple steps</em>
                        </h2>
                        <p className="text-steel text-base leading-relaxed mb-10">No downloads. No developers. Just you and your business.</p>

                        <div className="flex flex-col gap-0">

                            {/* <!-- Step 1 --> */}
                            <div className="flex gap-5 pb-8 relative">
                                <div className="step-connector"></div>
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-steel-dark to-steel-mid flex items-center justify-center font-display text-lg font-bold text-white shadow-md flex-shrink-0 z-10">1</div>
                                <div className="pt-1.5">
                                    <h4 className="font-display text-lg font-bold text-steel-dark mb-1">Create your store</h4>
                                    <p className="text-sm text-steel leading-relaxed">Click "Create Free Store", enter your Tenant ID, and choose your business type. Takes 30 seconds.</p>
                                    <span className="inline-flex items-center gap-1.5 mt-3 bg-gold-pale border border-gold/30 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">⚡ Instant setup</span>
                                </div>
                            </div>

                            {/* <!-- Step 2 --> */}
                            <div className="flex gap-5 pb-8 relative">
                                <div className="step-connector"></div>
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-steel-dark to-steel-mid flex items-center justify-center font-display text-lg font-bold text-white shadow-md flex-shrink-0 z-10">2</div>
                                <div className="pt-1.5">
                                    <h4 className="font-display text-lg font-bold text-steel-dark mb-1">Customise your profile</h4>
                                    <p className="text-sm text-steel leading-relaxed">Add your logo, business description, contact details, social media links, and opening hours.</p>
                                    <span className="inline-flex items-center gap-1.5 mt-3 bg-gold-pale border border-gold/30 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">🎨 Make it yours</span>
                                </div>
                            </div>

                            {/* <!-- Step 3 --> */}
                            <div className="flex gap-5 pb-8 relative">
                                <div className="step-connector"></div>
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-steel-dark to-steel-mid flex items-center justify-center font-display text-lg font-bold text-white shadow-md flex-shrink-0 z-10">3</div>
                                <div className="pt-1.5">
                                    <h4 className="font-display text-lg font-bold text-steel-dark mb-1">Add your products</h4>
                                    <p className="text-sm text-steel leading-relaxed">Upload product photos, names, and descriptions. Your catalog is live the moment you save.</p>
                                    <span className="inline-flex items-center gap-1.5 mt-3 bg-gold-pale border border-gold/30 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">📦 Unlimited products</span>
                                </div>
                            </div>

                            {/* <!-- Step 4 --> */}
                            <div className="flex gap-5">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center font-display text-lg font-bold text-steel-dark shadow-md flex-shrink-0">4</div>
                                <div className="pt-1.5">
                                    <h4 className="font-display text-lg font-bold text-steel-dark mb-1">Share & get enquiries</h4>
                                    <p className="text-sm text-steel leading-relaxed">Share your Catalogr link on WhatsApp, Instagram, or anywhere. Customers browse and enquire directly.</p>
                                    <span className="inline-flex items-center gap-1.5 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">🚀 You're live!</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* <!-- Right: Info panel --> */}
                    <div className="flex flex-col gap-5">
                        {/* <!-- Big CTA card --> */}
                        <div className="bg-gradient-to-br from-steel-dark to-steel-mid rounded-2xl p-8 text-white relative overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gold/10 rounded-full"></div>
                            <div className="relative z-10">
                                <div className="text-3xl mb-4">🏪</div>
                                <h3 className="font-display text-2xl font-bold mb-3">Works for every business</h3>
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-white/80"><span className="text-gold">✓</span> Wholesale dealers</div>
                                    <div className="flex items-center gap-2 text-sm text-white/80"><span className="text-gold">✓</span> Brokers & agents</div>
                                    <div className="flex items-center gap-2 text-sm text-white/80"><span className="text-gold">✓</span> Bakeries</div>
                                    <div className="flex items-center gap-2 text-sm text-white/80"><span className="text-gold">✓</span> Guest lodges</div>
                                    <div className="flex items-center gap-2 text-sm text-white/80"><span className="text-gold">✓</span> Boutiques</div>
                                    <div className="flex items-center gap-2 text-sm text-white/80"><span className="text-gold">✓</span> Any business!</div>
                                </div>
                                <a href="site-settings.html"
                                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-steel-dark font-bold text-sm px-6 py-3 rounded-full transition-all duration-200 shadow-gold">
                                    Start for free →
                                </a>
                            </div>
                        </div>

                        {/* <!-- Trust badges --> */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-cream rounded-xl p-4 text-center border border-gray-200">
                                <div className="text-2xl mb-1">🔒</div>
                                <div className="text-xs font-semibold text-steel-dark">Secure</div>
                                <div className="text-[10px] text-steel mt-0.5">Private by default</div>
                            </div>
                            <div className="bg-cream rounded-xl p-4 text-center border border-gray-200">
                                <div className="text-2xl mb-1">📱</div>
                                <div className="text-xs font-semibold text-steel-dark">Mobile-first</div>
                                <div className="text-[10px] text-steel mt-0.5">Works on all devices</div>
                            </div>
                            <div className="bg-cream rounded-xl p-4 text-center border border-gray-200">
                                <div className="text-2xl mb-1">💸</div>
                                <div className="text-xs font-semibold text-steel-dark">Free forever</div>
                                <div className="text-[10px] text-steel mt-0.5">No hidden charges</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


            {/* <!-- ═══════════════════════════════════════════════════════════
     DIRECTORY
══════════════════════════════════════════════════════════════ --> */}
            <section id="directory" className="py-24 px-6 bg-cream">
                <div className="max-w-6xl mx-auto">

                    {/* <!-- Section header --> */}
                    <div className="text-center mb-10">
                        <span className="text-xs font-semibold tracking-[2px] uppercase text-gold mb-3 block">Explore</span>
                        <h2 className="font-display text-4xl font-black text-steel-dark leading-tight tracking-tight mb-4">
                            Browse Businesses
                        </h2>
                        <p className="text-steel text-base leading-relaxed max-w-md mx-auto">
                            Discover shops, brokers, bakeries, and more — all registered on Catalogr.
                        </p>
                    </div>

                    {/* <!-- Search + Tabs row --> */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        {/* <!-- Search --> */}
                        <div className="relative flex-1 w-full sm:max-w-xs">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-steel pointer-events-none">🔍</span>
                            <input
                                id="dirSearch"
                                type="text"
                                placeholder="Search businesses..."
                                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white text-sm text-steel-dark placeholder-steel shadow-card focus:outline-none focus:border-steel-mid focus:ring-2 focus:ring-steel-light/40 transition-all"
                            />
                        </div>

                        {/* <!-- Tabs --> */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button className="dir-tab active flex items-center gap-2 px-4 py-2.5 rounded-full border-1.5 border-gray-200 text-sm font-medium transition-all" data-cat="all">
                                {/* onClick="setTab(this,'all')" */}
                                <span>🏢</span> All
                                <span className="tab-count bg-cream text-steel text-[10px] font-bold px-2 py-0.5 rounded-full">9</span>
                            </button>
                            <button className="dir-tab flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-steel-mid text-sm font-medium transition-all" data-cat="broker">
                                {/* onclick="setTab(this,'broker')" */}
                                <span>🤝</span> Brokers
                                <span className="tab-count bg-cream text-steel text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                            </button>
                            <button className="dir-tab flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-steel-mid text-sm font-medium transition-all" data-cat="shop">
                                {/* onclick="setTab(this,'shop')" */}
                                <span>🏪</span> Shops
                                <span className="tab-count bg-cream text-steel text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                            </button>
                            <button className="dir-tab flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-steel-mid text-sm font-medium transition-all" data-cat="bakery">
                                {/* onclick="setTab(this,'bakery')" */}
                                <span>🥐</span> Bakeries
                                <span className="tab-count bg-cream text-steel text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
                            </button>
                            <button className="dir-tab flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-steel-mid text-sm font-medium transition-all" data-cat="lodge">
                                {/* onclick="setTab(this,'lodge')" */}
                                <span>🏨</span> Lodges
                                <span className="tab-count bg-cream text-steel text-[10px] font-bold px-2 py-0.5 rounded-full">1</span>
                            </button>
                        </div>
                    </div>

                    {/* <!-- Results meta --> */}
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-sm text-steel" id="dirMeta">Showing <strong className="text-steel-dark">9</strong> businesses</p>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-steel">Live directory</span>
                        </div>
                    </div>

                    {/* <!-- Business grid --> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="bizGrid">

                        {/* <!-- Broker 1 --> */}
                        <a href="customer-portal.html" data-cat="broker" data-name="raj wholesale stainless steel"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-steel-light flex items-center justify-center text-2xl flex-shrink-0">🔩</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Raj Wholesale Steel</h4>
                                    <p className="text-xs text-steel mt-0.5">Harshal Kapoor</p>
                                </div>
                                <span className="flex-shrink-0 bg-blue-50 text-steel-mid border border-steel-light text-[10px] font-semibold px-2.5 py-1 rounded-full">Broker</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Premium stainless steel wholesale — cookware, industrial supplies, and more. 20+ years in Bangalore.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 Chikpete, Bangalore</span>
                                <span className="text-green-600 font-semibold">● Open</span>
                            </div>
                        </a>

                        {/* <!-- Broker 2 --> */}
                        <a href="customer-portal.html" data-cat="broker" data-name="krishna textile brokers"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-200 flex items-center justify-center text-2xl flex-shrink-0">🧵</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Krishna Textile Brokers</h4>
                                    <p className="text-xs text-steel mt-0.5">Suresh Menon</p>
                                </div>
                                <span className="flex-shrink-0 bg-blue-50 text-steel-mid border border-steel-light text-[10px] font-semibold px-2.5 py-1 rounded-full">Broker</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Fabric wholesale brokers connecting manufacturers with retailers across Karnataka and Tamil Nadu.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 Shivajinagar, Bangalore</span>
                                <span className="text-green-600 font-semibold">● Open</span>
                            </div>
                        </a>

                        {/* <!-- Broker 3 --> */}
                        <a href="customer-portal.html" data-cat="broker" data-name="apex hardware trading"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-200 flex items-center justify-center text-2xl flex-shrink-0">🔧</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Apex Hardware Trading</h4>
                                    <p className="text-xs text-steel mt-0.5">Ramesh Pillai</p>
                                </div>
                                <span className="flex-shrink-0 bg-blue-50 text-steel-mid border border-steel-light text-[10px] font-semibold px-2.5 py-1 rounded-full">Broker</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Industrial hardware brokers — tools, fasteners, safety equipment. Serving construction industry since 2010.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 Peenya, Bangalore</span>
                                <span className="text-steel font-semibold">● Closed</span>
                            </div>
                        </a>

                        {/* <!-- Shop 1 --> */}
                        <a href="customer-portal.html" data-cat="shop" data-name="sunita sarees collection"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-pink-200 flex items-center justify-center text-2xl flex-shrink-0">👗</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Sunita Sarees</h4>
                                    <p className="text-xs text-steel mt-0.5">Sunita Reddy</p>
                                </div>
                                <span className="flex-shrink-0 bg-gold-pale text-amber-700 border border-gold/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">Shop</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Handloom and silk sarees from Kanchipuram, Mysore, and Banarasi. Wholesale and retail available.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 Commercial Street, Blr</span>
                                <span className="text-green-600 font-semibold">● Open</span>
                            </div>
                        </a>

                        {/* <!-- Shop 2 --> */}
                        <a href="customer-portal.html" data-cat="shop" data-name="deepak electronics store"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-200 flex items-center justify-center text-2xl flex-shrink-0">📱</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Deepak Electronics</h4>
                                    <p className="text-xs text-steel mt-0.5">Deepak Sharma</p>
                                </div>
                                <span className="flex-shrink-0 bg-gold-pale text-amber-700 border border-gold/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">Shop</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Mobiles, accessories, and home appliances at wholesale prices. Authorized service center.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 SP Road, Bangalore</span>
                                <span className="text-green-600 font-semibold">● Open</span>
                            </div>
                        </a>

                        {/* <!-- Shop 3 --> */}
                        <a href="customer-portal.html" data-cat="shop" data-name="priya fruits vegetables"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-200 flex items-center justify-center text-2xl flex-shrink-0">🥦</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Priya Fresh Produce</h4>
                                    <p className="text-xs text-steel mt-0.5">Priya Nair</p>
                                </div>
                                <span className="flex-shrink-0 bg-gold-pale text-amber-700 border border-gold/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">Shop</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Farm-fresh fruits and vegetables delivered to your door. Bulk orders for restaurants and caterers.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 KR Market, Bangalore</span>
                                <span className="text-green-600 font-semibold">● Open</span>
                            </div>
                        </a>

                        {/* <!-- Bakery 1 --> */}
                        <a href="customer-portal.html" data-cat="bakery" data-name="golden crust artisan bakery"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-200 flex items-center justify-center text-2xl flex-shrink-0">🥐</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Golden Crust Bakery</h4>
                                    <p className="text-xs text-steel mt-0.5">Ananya Bose</p>
                                </div>
                                <span className="flex-shrink-0 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-semibold px-2.5 py-1 rounded-full">Bakery</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Artisan breads, cakes, and pastries baked fresh every morning. Custom cakes for weddings and events.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 Indiranagar, Bangalore</span>
                                <span className="text-green-600 font-semibold">● Open</span>
                            </div>
                        </a>

                        {/* <!-- Bakery 2 --> */}
                        <a href="customer-portal.html" data-cat="bakery" data-name="sweet moments cake studio"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-rose-200 flex items-center justify-center text-2xl flex-shrink-0">🎂</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Sweet Moments Studio</h4>
                                    <p className="text-xs text-steel mt-0.5">Meera Thomas</p>
                                </div>
                                <span className="flex-shrink-0 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-semibold px-2.5 py-1 rounded-full">Bakery</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Designer cakes, cupcakes and dessert tables for birthdays, anniversaries, and corporate events.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 Koramangala, Bangalore</span>
                                <span className="text-green-600 font-semibold">● Open</span>
                            </div>
                        </a>

                        {/* <!-- Lodge 1 --> */}
                        <a href="customer-portal.html" data-cat="lodge" data-name="sunrise guest lodge"
                            className="biz-card relative bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 no-underline block">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-200 flex items-center justify-center text-2xl flex-shrink-0">🏨</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">Sunrise Guest Lodge</h4>
                                    <p className="text-xs text-steel mt-0.5">Vijay Kumar</p>
                                </div>
                                <span className="flex-shrink-0 bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-semibold px-2.5 py-1 rounded-full">Lodge</span>
                            </div>
                            <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">Comfortable rooms for business and leisure travelers. AC rooms, WiFi, and home-cooked meals included.</p>
                            <div className="flex items-center justify-between text-[10px] text-steel">
                                <span>📍 Majestic, Bangalore</span>
                                <span className="text-green-600 font-semibold">● Available</span>
                            </div>
                        </a>

                    </div>

                    {/* <!-- No results state --> */}
                    <div id="noResults" className="hidden text-center py-16">
                        <div className="text-5xl mb-4 opacity-40">🔍</div>
                        <p className="text-steel font-medium">No businesses found matching your search.</p>
                        <p className="text-steel text-sm mt-1">Try a different keyword or category.</p>
                    </div>

                    {/* <!-- CTA to list your business --> */}
                    <div className="mt-10 text-center">
                        <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-card">
                            <span className="text-2xl">✨</span>
                            <span className="text-sm text-steel-mid">Want your business listed here?</span>
                            <a href="site-settings.html" className="bg-steel-dark hover:bg-gold text-white hover:text-steel-dark text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200">
                                Join for free →
                            </a>
                        </div>
                    </div>

                </div>
            </section>


            {/* <!-- ═══════════════════════════════════════════════════════════
     FOOTER CTA BANNER
══════════════════════════════════════════════════════════════ --> */}
            <section className="bg-gradient-to-br from-steel-dark to-steel-mid py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-50"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="font-display text-4xl font-black text-white mb-4 tracking-tight">
                        Ready to showcase<br></br><em className="not-italic text-gold-light">your business?</em>
                    </h2>
                    <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                        Join 50+ businesses already on Catalogr. Free to start, free forever. Your store goes live in minutes.
                    </p>
                    <a href="site-settings.html"
                        className="inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-steel-dark font-bold text-base px-8 py-4 rounded-full shadow-gold hover:-translate-y-1 transition-all duration-200">
                        ✦ Create Your Free Store
                    </a>
                    <p className="text-white/35 text-xs mt-5">No credit card · No downloads · No code</p>
                </div>
            </section>


            {/* <!-- ═══════════════════════════════════════════════════════════
     FOOTER
══════════════════════════════════════════════════════════════ --> */}
            <footer className="bg-steel-dark border-t border-white/5 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
                        </div>
                        <span className="font-display text-white font-bold">Catalo<span className="text-gold">gr</span></span>
                    </div>
                    <p className="text-white/40 text-xs text-center">© 2026 Catalogr. Built for every business. · Contact: <a href="mailto:professor3416@gmail.com" className="text-gold-light hover:underline">professor3416@gmail.com</a></p>
                    <a href="#" className="text-white/40 hover:text-gold-light text-xs transition-colors">WhatsApp</a>
                </div>
            </footer>
        </div>
    );
}