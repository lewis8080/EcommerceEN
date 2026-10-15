import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="bg-umber pb-10 pt-16 text-ivory/50">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-10 border-t border-ivory/10 pt-12 md:flex-row md:items-center">
          <Link
            to="/"
            className="font-serif text-2xl uppercase tracking-[0.28em] text-ivory"
          >
            La&nbsp;Lumière
          </Link>
          <div className="flex flex-wrap gap-x-10 gap-y-3 text-[11px] uppercase tracking-[0.3em]">
            <Link to="/maison" className="transition-colors hover:text-ivory">
              Maison
            </Link>
            <Link to="/shop" className="transition-colors hover:text-ivory">
              Shop
            </Link>
            <Link
              to="/product/illuminating-serum"
              className="transition-colors hover:text-ivory"
            >
              Serum N°01
            </Link>
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em]">
            Grasse · Kyoto · Bretagne — © 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
