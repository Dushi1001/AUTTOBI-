export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 bg-background border-r p-4">
      <nav className="space-y-2">
        <a href="/" className="block hover:text-primary">Home</a>
        <a href="/markets" className="block hover:text-primary">Markets</a>
        <a href="/portfolio" className="block hover:text-primary">Portfolio</a>
      </nav>
    </aside>
  );
}
