export default function Home() {
  return (
    <>
      <div className="hidden md:flex border-border/50 border-b-2 bg-background">
        <div className="flex flex-1 justify-center items-center p-2 gap-8">
          <div className="flex items-center gap-4 py-6"></div>
        </div>
      </div>
      <div className="">
        <div className="grain-blur background-base"></div>
        <div className="grain-background background-base"></div>
        <div className="grid-bg background-base"></div>
        <div className="large-blur background-base"></div>
        <div className="small-blur background-base"></div>
        <section className="mx-auto max-w-7xl px-[32px] relative flex items-center justify-between pt-36 mb-36">
          <div className="text-center w-full ">
          <h1 className="gradient-text text-[120px] font-medium text-transparent animate-gradient">Rhyno Saas Starter</h1>
            <h2 className="text-[36px] leading-[38px] md:text-[50px] md:leading-[50px] tracking-[-1.6px] font-normal pt-8 text-[#888888]">
              Supercharge your Nextjs Saas.
            </h2>
            <p className="mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px]">
              Plans for teams of every size — from start-up to enterprise.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
          <div className="isolate mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden">
              <div className="flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border">
                <div className="flex justify-between items-center px-8 pt-8">
                  <div className="flex items-center gap-[10px]">
                    <img
                      alt="Starter"
                      loading="lazy"
                      width={40}
                      height={40}
                      decoding="async"
                      data-nimg={1}
                      src="/images/background/free-icon.svg"
                      style={{ color: 'transparent' }}
                    />
                    <p className="text-[20px] leading-[30px] font-semibold">Starter</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col px-8">
                  <div className="text-[80px] leading-[96px] tracking-[-1.6px] font-medium">$0</div>
                  <div className="font-medium text-[12px]">per user/month</div>
                </div>
                <div className="px-8">
                  <div data-orientation="horizontal" role="none" className="shrink-0 h-[1px] w-full bg-border" />
                </div>
                <div className="px-8 text-[16px] leading-[24px]">
                  Ideal for individuals who want to get started with simple design tasks.
                </div>
              </div>
              <div className="px-8 mt-8">
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-medium ring-offset-background transition-colors focus:ring-ring focus:ring-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative bg-[#fcfcfc33] text-white secondary-button-animation disabled:bg-[#191A1A] h-11 px-5 py-[10px] w-full"
                  href="/checkout/pri_01hsxyh9txq4rzbrhbyngkhy46"
                >
                  Get started
                </a>
              </div>
              <ul className="p-8 flex flex-col gap-4">
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">1 workspace</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Limited collaboration</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Export to PNG and SVG</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden">
              <div className="flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border">
                <div className="featured-yellow-highlight-bg" />
                <div className="featured-hard-blur-bg" />
                <div className="featured-vertical-hard-blur-bg" />
                <div className="featured-soft-blur-bg" />
                <div className="flex justify-between items-center px-8 pt-8 featured-price-title">
                  <div className="flex items-center gap-[10px]">
                    <img
                      alt="Pro"
                      loading="lazy"
                      width={40}
                      height={40}
                      decoding="async"
                      data-nimg={1}
                      src="/images/background/basic-icon.svg"
                      style={{ color: 'transparent' }}
                    />
                    <p className="text-[20px] leading-[30px] font-semibold">Pro</p>
                  </div>
                  <div className="flex items-center px-3 py-1 rounded-xs border border-secondary-foreground/10 text-[14px] h-[29px] leading-[21px] featured-card-badge">
                    Most popular
                  </div>
                </div>
                <div className="mt-6 flex flex-col px-8">
                  <div className="text-[80px] leading-[96px] tracking-[-1.6px] font-medium">$50</div>
                  <div className="font-medium text-[12px]">per user/month</div>
                </div>
                <div className="px-8">
                  <div data-orientation="horizontal" role="none" className="shrink-0 h-[1px] w-full bg-border" />
                </div>
                <div className="px-8 text-[16px] leading-[24px]">
                  Enhanced design tools for scaling teams who need more flexibility.
                </div>
              </div>
              <div className="px-8 mt-8">
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-medium ring-offset-background transition-colors focus:ring-ring focus:ring-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative bg-[#fcfcfc33] text-white secondary-button-animation disabled:bg-[#191A1A] h-11 px-5 py-[10px] w-full"
                  href="/checkout/pri_01hsxycme6m95sejkz7sbz5e9g"
                >
                  Get started
                </a>
              </div>
              <ul className="p-8 flex flex-col gap-4">
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Integrations</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Unlimited workspaces</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Advanced editing tools</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Everything in Starter</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden">
              <div className="flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border">
                <div className="flex justify-between items-center px-8 pt-8">
                  <div className="flex items-center gap-[10px]">
                    <img
                      alt="Advanced"
                      loading="lazy"
                      width={40}
                      height={40}
                      decoding="async"
                      data-nimg={1}
                      src="/images/background/pro-icon.svg"
                      style={{ color: 'transparent' }}
                    />
                    <p className="text-[20px] leading-[30px] font-semibold">Advanced</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col px-8">
                  <div className="text-[80px] leading-[96px] tracking-[-1.6px] font-medium">$85</div>
                  <div className="font-medium text-[12px]">per user/month</div>
                </div>
                <div className="px-8">
                  <div data-orientation="horizontal" role="none" className="shrink-0 h-[1px] w-full bg-border" />
                </div>
                <div className="px-8 text-[16px] leading-[24px]">
                  Powerful tools designed for extensive collaboration and customization.
                </div>
              </div>
              <div className="px-8 mt-8">
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-medium ring-offset-background transition-colors focus:ring-ring focus:ring-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative bg-[#fcfcfc33] text-white secondary-button-animation disabled:bg-[#191A1A] h-11 px-5 py-[10px] w-full"
                  href="/checkout/pri_01hsxyff091kyc9rjzx7zm6yqh"
                >
                  Get started
                </a>
              </div>
              <ul className="p-8 flex flex-col gap-4">
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Single sign on (SSO)</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Advanced version control</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Assets library</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Guest accounts</span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check h-6 w-6 text-muted-foreground"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-base">Everything in Pro</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
