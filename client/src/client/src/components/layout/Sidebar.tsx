export default function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r p-4 hidden md:block">
      <div className="space-y-4">
        <div className="font-medium">Menu</div>
        <nav className="flex flex-col space-y-2">
          <a href="/" className="text-sm hover:text-primary">Home</a>
          <a href="/markets" className="text-sm hover:text-primary">Markets</a>
          <a href="/portfolio" className="text-sm hover:text-primary">Portfolio</a>
          <a href="/wallets" className="text-sm hover:text-primary">Wallets</a>
          <a href="/swap" className="text-sm hover:text-primary">Swap</a>
          <a href="/transactions" className="text-sm hover:text-primary">Transactions</a>
          <a href="/settings" className="text-sm hover:text-primary">Settings</a>
          <a href="/support-faq" className="text-sm hover:text-primary">Support & FAQ</a>
        </nav>
      </div>
    </aside>
  );
}
