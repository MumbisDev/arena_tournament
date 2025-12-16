import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="py-md" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1 font-mono text-mono-xs">
        <li className="text-brutal-vermillion mr-2">&gt;</li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="text-neutral-500 uppercase tracking-widest hover:text-brutal-vermillion transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`uppercase tracking-widest ${
                    isLast ? 'text-brutal-black' : 'text-neutral-500'
                  }`}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="w-3 h-3 mx-2 text-neutral-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
