import { useEffect, useId, useRef, useState } from 'react';
import { SearchIcon } from './icons';

function matchesQuery(customer, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    customer.name.toLowerCase().includes(q) ||
    customer.phone.toLowerCase().includes(q) ||
    customer.customerType.toLowerCase().includes(q)
  );
}

export default function CustomerSearchSelect({
  customers,
  value,
  onChange,
  name,
  required = false,
  autoFocus = false,
  placeholder = 'Search by name or phone...',
}) {
  const listId = useId();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const selectedCustomer = customers.find((customer) => customer.name === value);
  const filteredCustomers = customers.filter((customer) => matchesQuery(customer, query));

  useEffect(() => {
    if (!value) {
      setQuery('');
      setOpen(false);
    }
  }, [value]);

  useEffect(() => {
    if (!open) return undefined;

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleFocus() {
    setOpen(true);
    setQuery(selectedCustomer?.name ?? '');
  }

  function handleInputChange(event) {
    setQuery(event.target.value);
    setOpen(true);
    if (value) onChange('');
  }

  function handleSelect(customer) {
    onChange(customer.name);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  const inputValue = open ? query : selectedCustomer?.name ?? '';

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} required={required} />

      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-doc-muted" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoFocus={autoFocus}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="w-full rounded-xl border border-doc-border bg-white py-2.5 pl-10 pr-4 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-doc-border bg-white py-1 shadow-lg"
        >
          {filteredCustomers.length === 0 ? (
            <li className="px-4 py-2.5 text-sm text-doc-muted">No customers found</li>
          ) : (
            filteredCustomers.map((customer) => {
              const isSelected = customer.name === value;

              return (
                <li key={customer.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(customer)}
                    className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left text-sm transition hover:bg-doc-primary-light ${
                      isSelected ? 'bg-doc-primary-light/60' : ''
                    }`}
                  >
                    <span className="font-medium text-doc-navy">{customer.name}</span>
                    <span className="text-xs text-doc-muted">
                      {customer.phone} · {customer.customerType}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
