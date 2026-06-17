import useShop from '../context/ShopContext';

const NEXGENAI_URL = 'https://www.nexgenai.lk';

export default function CopyrightBar({ className = '' }) {
  const { shop } = useShop();
  const year = new Date().getFullYear();

  return (
    <footer
      className={`shrink-0 border-t border-doc-border/60 bg-white px-6 py-3 text-center lg:px-8 ${className}`}
    >
      <p className="text-xs text-doc-muted">
        © {year} {shop.name}. Developed by{' '}
        <a
          href={NEXGENAI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-doc-primary transition-colors hover:text-doc-primary-dark"
        >
          NexGenAI
        </a>
      </p>
    </footer>
  );
}
