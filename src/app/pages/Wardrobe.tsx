import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Shirt, Layers, ChevronDown, ChevronLeft, Pencil, Check, X, Camera, Trash2, Image, Sparkles, Wand2, Heart, UtensilsCrossed, Plane, Briefcase, Sun, Sliders, RefreshCw, CalendarDays, PartyPopper, Dumbbell, Search, Bell, Settings, ChevronRight, Moon, ShoppingBag, Globe, LogOut, User, Shield, HelpCircle, Star, FileText } from 'lucide-react';

const FILTERS = {
  tipo:    { label: 'Tipo',    options: ['Tops', 'Pantalones', 'Calzado', 'Accesorios', 'Vestidos', 'Abrigos'] },
  color:   { label: 'Color',   options: ['Blanco', 'Negro', 'Beige', 'Azul', 'Marrón', 'Gris', 'Rojo', 'Verde'] },
  ocasion: { label: 'Ocasión', options: ['Casual', 'Sport', 'Formal', 'Trabajo', 'Fiesta'] },
  marca:   { label: 'Marca',   options: ['Zara', 'H&M', 'Mango', 'Nike', 'Adidas', 'Massimo Dutti', 'Pull&Bear'] },
} as const;

const COLOR_SWATCHES: Record<string, string> = {
  Blanco: '#FFFFFF',
  Negro:  '#1C1C1C',
  Beige:  '#E8DCC8',
  Azul:   '#3B82F6',
  Marrón: '#8B5A2B',
  Gris:   '#9CA3AF',
  Rojo:   '#EF4444',
  Verde:  '#22C55E',
};

type FilterKey = keyof typeof FILTERS;

const ITEMS = [
  // Tops
  { id: 1,  name: 'Camiseta Blanca',      category: 'Tops',       tipo: 'Tops',       color: ['Blanco'] as string[], ocasion: ['Casual']  as string[], marca: 'Zara',          img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=533&fit=crop&q=80' },
  { id: 4,  name: 'Blazer Beige',         category: 'Tops',       tipo: 'Tops',       color: ['Beige']  as string[], ocasion: ['Formal']  as string[], marca: 'Mango',         img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=533&fit=crop&q=80' },
  { id: 7,  name: 'Sudadera Oversize',    category: 'Tops',       tipo: 'Tops',       color: ['Gris']   as string[], ocasion: ['Sport']   as string[], marca: 'Pull&Bear',     img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=533&fit=crop&q=80' },
  { id: 9,  name: 'Camisa Oxford Azul',   category: 'Tops',       tipo: 'Tops',       color: ['Azul']   as string[], ocasion: ['Trabajo'] as string[], marca: 'Massimo Dutti', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=533&fit=crop&q=80' },
  { id: 10, name: 'Jersey Negro',         category: 'Tops',       tipo: 'Tops',       color: ['Negro']  as string[], ocasion: ['Casual']  as string[], marca: 'Zara',          img: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=533&fit=crop&q=80' },
  { id: 11, name: 'Camiseta Gráfica',     category: 'Tops',       tipo: 'Tops',       color: ['Blanco'] as string[], ocasion: ['Casual']  as string[], marca: 'Pull&Bear',     img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=533&fit=crop&q=80' },
  { id: 12, name: 'Blusa Blanca',         category: 'Tops',       tipo: 'Tops',       color: ['Blanco'] as string[], ocasion: ['Trabajo'] as string[], marca: 'Mango',         img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=533&fit=crop&q=80' },
  { id: 13, name: 'Chaqueta Vaquera',     category: 'Tops',       tipo: 'Tops',       color: ['Azul']   as string[], ocasion: ['Casual']  as string[], marca: 'H&M',           img: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&h=533&fit=crop&q=80' },
  { id: 14, name: 'Abrigo Camel',         category: 'Abrigos',    tipo: 'Abrigos',    color: ['Beige']  as string[], ocasion: ['Casual']  as string[], marca: 'Mango',         img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=533&fit=crop&q=80' },
  { id: 15, name: 'Cazadora Negra',       category: 'Abrigos',    tipo: 'Abrigos',    color: ['Negro']  as string[], ocasion: ['Casual']  as string[], marca: 'Zara',          img: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=400&h=533&fit=crop&q=80' },
  // Pantalones
  { id: 2,  name: 'Vaqueros Slim',        category: 'Pantalones', tipo: 'Pantalones', color: ['Azul']   as string[], ocasion: ['Casual']  as string[], marca: 'H&M',           img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=533&fit=crop&q=80' },
  { id: 5,  name: 'Pantalón Negro',       category: 'Pantalones', tipo: 'Pantalones', color: ['Negro']  as string[], ocasion: ['Trabajo'] as string[], marca: 'Zara',          img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=533&fit=crop&q=80' },
  { id: 16, name: 'Chino Beige',          category: 'Pantalones', tipo: 'Pantalones', color: ['Beige']  as string[], ocasion: ['Casual']  as string[], marca: 'Massimo Dutti', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=533&fit=crop&q=80' },
  { id: 17, name: 'Pantalón Cargo Gris',  category: 'Pantalones', tipo: 'Pantalones', color: ['Gris']   as string[], ocasion: ['Casual']  as string[], marca: 'Pull&Bear',     img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&h=533&fit=crop&q=80' },
  { id: 18, name: 'Leggings Negros',      category: 'Pantalones', tipo: 'Pantalones', color: ['Negro']  as string[], ocasion: ['Sport']   as string[], marca: 'Adidas',        img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=533&fit=crop&q=80' },
  { id: 19, name: 'Falda Midi Beige',     category: 'Pantalones', tipo: 'Pantalones', color: ['Beige']  as string[], ocasion: ['Formal']  as string[], marca: 'Zara',          img: 'https://images.unsplash.com/photo-1583496661160-fb5218a5f95b?w=400&h=533&fit=crop&q=80' },
  // Calzado
  { id: 3,  name: 'Zapatillas Blancas',   category: 'Calzado',    tipo: 'Calzado',    color: ['Blanco'] as string[], ocasion: ['Sport']   as string[], marca: 'Nike',          img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=533&fit=crop&q=80' },
  { id: 8,  name: 'Botas Chelsea',        category: 'Calzado',    tipo: 'Calzado',    color: ['Marrón'] as string[], ocasion: ['Casual']  as string[], marca: 'Zara',          img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=533&fit=crop&q=80' },
  { id: 20, name: 'Zapatillas Running',   category: 'Calzado',    tipo: 'Calzado',    color: ['Negro']  as string[], ocasion: ['Sport']   as string[], marca: 'Adidas',        img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=533&fit=crop&q=80' },
  { id: 21, name: 'Mocasines Marrón',     category: 'Calzado',    tipo: 'Calzado',    color: ['Marrón'] as string[], ocasion: ['Trabajo'] as string[], marca: 'Massimo Dutti', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=533&fit=crop&q=80' },
  { id: 22, name: 'Sandalias Beige',      category: 'Calzado',    tipo: 'Calzado',    color: ['Beige']  as string[], ocasion: ['Casual']  as string[], marca: 'Mango',         img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=533&fit=crop&q=80' },
  { id: 23, name: 'Deportivas Verdes',    category: 'Calzado',    tipo: 'Calzado',    color: ['Verde']  as string[], ocasion: ['Casual']  as string[], marca: 'Nike',          img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=533&fit=crop&q=80' },
  // Accesorios
  { id: 6,  name: 'Cinturón Marrón',      category: 'Accesorios', tipo: 'Accesorios', color: ['Marrón'] as string[], ocasion: ['Casual']  as string[], marca: 'Massimo Dutti', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=533&fit=crop&q=80' },
  { id: 24, name: 'Bolso Marrón',         category: 'Accesorios', tipo: 'Accesorios', color: ['Marrón'] as string[], ocasion: ['Trabajo'] as string[], marca: 'Mango',         img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=533&fit=crop&q=80' },
  { id: 25, name: 'Gorra Negra',          category: 'Accesorios', tipo: 'Accesorios', color: ['Negro']  as string[], ocasion: ['Casual']  as string[], marca: 'Nike',          img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=533&fit=crop&q=80' },
  { id: 26, name: 'Bufanda Gris',         category: 'Accesorios', tipo: 'Accesorios', color: ['Gris']   as string[], ocasion: ['Casual']  as string[], marca: 'Zara',          img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=533&fit=crop&q=80' },
  { id: 27, name: 'Gafas de Sol',         category: 'Accesorios', tipo: 'Accesorios', color: ['Negro']  as string[], ocasion: ['Casual']  as string[], marca: 'Mango',         img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=533&fit=crop&q=80' },
  { id: 28, name: 'Mochila Negra',        category: 'Accesorios', tipo: 'Accesorios', color: ['Negro']  as string[], ocasion: ['Casual']  as string[], marca: 'Adidas',        img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=533&fit=crop&q=80' },
  // Vestidos
  { id: 29, name: 'Vestido Blanco',       category: 'Vestidos',   tipo: 'Vestidos',   color: ['Blanco'] as string[], ocasion: ['Casual']  as string[], marca: 'Zara',          img: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&h=533&fit=crop&q=80' },
  { id: 30, name: 'Vestido Negro',        category: 'Vestidos',   tipo: 'Vestidos',   color: ['Negro']  as string[], ocasion: ['Fiesta']  as string[], marca: 'Mango',         img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=533&fit=crop&q=80' },
];

function FilterDropdown({
  filterKey,
  values,
  onChange,
  openKey,
  setOpenKey,
}: {
  filterKey: FilterKey;
  values: string[];
  onChange: (v: string[]) => void;
  openKey: FilterKey | null;
  setOpenKey: (k: FilterKey | null) => void;
}) {
  const { tk } = useContext(ThemeCtx);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const isOpen = openKey === filterKey;
  const { label, options } = FILTERS[filterKey];
  const isActive = values.length > 0;
  const [dropPos, setDropPos] = useState<{ top: number; left?: number; right?: number }>({ top: 0, left: 0 });

  // Close on outside click — checks both trigger button and dropdown panel
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (dropRef.current?.contains(target)) return;
      setOpenKey(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, setOpenKey]);

  const handleOpen = () => {
    if (!isOpen && btnRef.current) {
      const screen = document.getElementById('phone-screen');
      const screenRect = screen?.getBoundingClientRect() ?? { top: 0, left: 0, right: 0, width: 0 };
      const btnRect = btnRef.current.getBoundingClientRect();
      const btnRelRight = btnRect.right - screenRect.left;
      const screenWidth = (screenRect as DOMRect).width ?? 0;
      if (btnRelRight > screenWidth / 2) {
        setDropPos({
          top: btnRect.bottom - screenRect.top + 6,
          right: screenRect.right - btnRect.right,
        });
      } else {
        setDropPos({
          top: btnRect.bottom - screenRect.top + 6,
          left: btnRect.left - screenRect.left,
        });
      }
    }
    setOpenKey(isOpen ? null : filterKey);
  };

  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };

  const screen = typeof document !== 'undefined' ? document.getElementById('phone-screen') : null;

  const dropdown = isOpen && screen ? createPortal(
    <div
      ref={dropRef}
      className="absolute rounded-[12px] shadow-lg border z-[9999] py-1 w-max"
      style={{
        top: dropPos.top,
        left: dropPos.left ?? 'auto',
        right: dropPos.right ?? 'auto',
        backgroundColor: tk.dropdownBg,
        borderColor: tk.border,
      }}
    >
      {isActive && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onChange([])}
          className="whitespace-nowrap flex items-center gap-2 px-4 py-2 text-[13px]"
          style={{ color: tk.textMuted }}
        >
          Limpiar filtro
        </button>
      )}
      {(options as readonly string[]).map((opt) => {
        const selected = values.includes(opt);
        return (
          <button
            key={opt}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => toggle(opt)}
            className="whitespace-nowrap flex items-center gap-2 px-4 py-2 text-[13px] font-medium w-full"
            style={{
              color: selected ? tk.dropdownSelectedText : tk.text,
              backgroundColor: selected ? tk.dropdownSelectedBg : 'transparent',
            }}
          >
            {filterKey === 'color' && (
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 inline-block"
                style={{
                  backgroundColor: COLOR_SWATCHES[opt] ?? '#ccc',
                  border: opt === 'Blanco' ? '1px solid #D1C9C2' : '1px solid transparent',
                }}
              />
            )}
            {opt}
            {selected && (
              <span className="ml-auto pl-3 text-[11px]" style={{ color: tk.dropdownSelectedText }}>✓</span>
            )}
          </button>
        );
      })}
    </div>,
    screen
  ) : null;

  // Pill label
  const pillLabel = !isActive
    ? label
    : values.length === 1
    ? values[0]
    : `${label} (${values.length})`;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="shrink-0 flex items-center gap-1 pl-3 pr-2 py-[7px] rounded-full text-[13px] font-medium transition-all active:scale-95"
        style={{
          backgroundColor: isActive ? tk.filterActiveBg : tk.filterInactiveBg,
          color: isActive ? tk.filterActiveText : tk.filterInactiveText,
        }}
      >
        <span className="flex items-center gap-1.5">
          {filterKey === 'color' && values.length === 1 && (
            <span
              className="w-3 h-3 rounded-full shrink-0 inline-block"
              style={{
                backgroundColor: COLOR_SWATCHES[values[0]] ?? '#ccc',
                border: values[0] === 'Blanco' ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
              }}
            />
          )}
          {pillLabel}
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {dropdown}
    </>
  );
}

type Item = typeof ITEMS[number];
type EditableFields = Pick<Item, 'tipo' | 'color' | 'ocasion' | 'marca' | 'name' | 'img'>;

const EDIT_FIELDS: { key: keyof EditableFields; label: string; options: readonly string[] }[] = [
  { key: 'name',   label: 'Nombre',    options: [] },
  { key: 'tipo',   label: 'Categoría', options: FILTERS.tipo.options },
  { key: 'color',  label: 'Color',     options: FILTERS.color.options },
  { key: 'ocasion',label: 'Ocasión',   options: FILTERS.ocasion.options },
  { key: 'marca',  label: 'Marca',     options: FILTERS.marca.options },
].filter((f) => f.key !== 'img') as { key: Exclude<keyof EditableFields, 'img'>; label: string; options: readonly string[] }[];

function ItemDetail({ item, onBack, onUpdate, onDelete, savedOutfits, onOpenOutfit }: { item: Item; onBack: () => void; onUpdate: (updated: Item) => void; onDelete: (id: number) => void; savedOutfits: SavedOutfit[]; onOpenOutfit: (id: number) => void; }) {
  const [tab, setTab] = useState<'info' | 'outfit'>('info');
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<EditableFields>({
    name: item.name, tipo: item.tipo, color: item.color, ocasion: item.ocasion, marca: item.marca, img: item.img,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tk } = useContext(ThemeCtx);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft((d) => ({ ...d, img: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  const triggerToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = () => {
    onUpdate({ ...item, ...draft, category: draft.tipo });
    setEditing(false);
    triggerToast();
  };

  const handleCancel = () => {
    setDraft({ name: item.name, tipo: item.tipo, color: item.color, ocasion: item.ocasion, marca: item.marca, img: item.img });
    setEditing(false);
  };

  // View rows
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Nombre',    value: <span style={{ color: tk.accentText }}>{item.name}</span> },
    { label: 'Categoría', value: <span style={{ color: tk.accentText }}>{item.tipo}</span> },
    {
      label: 'Color',
      value: (
        <span className="flex items-center flex-wrap gap-x-2 gap-y-1 justify-end">
          {item.color.map((c) => (
            <span key={c} className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full inline-block shrink-0" style={{ backgroundColor: COLOR_SWATCHES[c] ?? '#ccc', border: c === 'Blanco' ? `1px solid ${tk.iconMuted}` : '1px solid transparent' }} />
              <span style={{ color: tk.accentText }}>{c}</span>
            </span>
          ))}
        </span>
      ),
    },
    {
      label: 'Ocasión',
      value: (
        <span className="flex flex-wrap gap-x-2 gap-y-1 justify-end">
          {item.ocasion.map((o, i) => (
            <span key={o} style={{ color: tk.accentText }}>{o}{i < item.ocasion.length - 1 ? ',' : ''}</span>
          ))}
        </span>
      ),
    },
    { label: 'Marca',   value: <span style={{ color: tk.accentText }}>{item.marca}</span> },
  ];

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: tk.surface }}>
      {/* Image area */}
      <div className="relative shrink-0" style={{ backgroundColor: tk.surfaceMuted }}>
        <div className="w-full" style={{ aspectRatio: '1/1' }}>
          {draft.img ? (
            <img src={draft.img} alt={draft.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shirt className="w-16 h-16" style={{ color: '#C4B8B0' }} strokeWidth={1.2} />
            </div>
          )}
        </div>
        {/* Back button */}
        <button onClick={onBack} className="absolute top-[54px] left-4 w-9 h-9 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform" style={{ backgroundColor: tk.surface + 'D9' }}>
          <ChevronLeft className="w-5 h-5" style={{ color: tk.text }} />
        </button>
        {/* Change image button (edit mode only) */}
        {editing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 active:opacity-80 transition-opacity"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <Camera className="w-8 h-8" style={{ color: '#FFFFFF' }} strokeWidth={1.5} />
            <span className="text-[12px] font-medium" style={{ color: '#FFFFFF' }}>Cambiar imagen</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Tabs */}
      <div className="pt-4 pb-0 shrink-0">
        <div className="flex border-b" style={{ borderColor: tk.border }}>
          {(['info', 'outfit'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="flex-1 pb-3 text-[12px] font-medium transition-colors"
              style={{ color: tab === t ? tk.text : tk.textMuted, borderBottom: tab === t ? `2px solid ${tk.text}` : '2px solid transparent' }}>
              {t === 'info' ? 'Información' : 'Outfit'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'info' ? (
          <div className="px-5 pt-2">
            {/* Section header */}
            <div className="flex items-center justify-between mt-4 mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: tk.textMuted }}>Información de prenda</p>
              {!editing ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium active:scale-95 transition-transform" style={{ backgroundColor: tk.destructiveSurface, color: tk.destructive }}>
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </button>
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium active:scale-95 transition-transform" style={{ backgroundColor: tk.accentSurface, color: tk.accent }}>
                    <Pencil className="w-3 h-3" />
                    Editar
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleCancel} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium active:scale-95 transition-transform" style={{ backgroundColor: tk.surfaceMuted, color: tk.textSub }}>
                    <X className="w-3 h-3" />
                    Cancelar
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium active:scale-95 transition-transform" style={{ backgroundColor: tk.invertedBg, color: tk.invertedText }}>
                    <Check className="w-3 h-3" />
                    Guardar
                  </button>
                </div>
              )}
            </div>

            {!editing ? (
              // View mode
              rows.map((row, i) => (
                <div key={row.label} className="flex items-center justify-between py-3" style={{ borderBottom: i < rows.length - 1 ? `1px solid ${tk.borderLight}` : 'none' }}>
                  <span className="text-[14px]" style={{ color: tk.textSub }}>{row.label}</span>
                  <span className="text-[14px] font-medium">{row.value}</span>
                </div>
              ))
            ) : (
              // Edit mode
              EDIT_FIELDS.map((field, i) => (
                <div key={field.key} className="flex items-center justify-between py-3" style={{ borderBottom: i < EDIT_FIELDS.length - 1 ? `1px solid ${tk.borderLight}` : 'none' }}>
                  <span className="text-[14px] shrink-0" style={{ color: tk.textSub }}>{field.label}</span>
                  {field.options.length === 0 ? (
                    <input
                      className="text-[14px] font-medium text-right bg-transparent outline-none border-b"
                      style={{ color: tk.text, borderColor: tk.iconMuted, minWidth: 0, maxWidth: '55%' }}
                      value={draft[field.key]}
                      onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5 justify-end" style={{ maxWidth: '65%' }}>
                      {field.options.map((opt) => {
                        const isMulti = field.key === 'color' || field.key === 'ocasion';
                        const fieldVal = draft[field.key];
                        const selected = isMulti
                          ? (fieldVal as string[]).includes(opt)
                          : fieldVal === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              if (field.key === 'color' || field.key === 'ocasion') {
                                setDraft((d) => {
                                  const arr = d[field.key] as string[];
                                  return { ...d, [field.key]: arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt] };
                                });
                              } else {
                                setDraft((d) => ({ ...d, [field.key]: opt }));
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95"
                            style={{ backgroundColor: selected ? tk.pillActiveBg : tk.pillBg, color: selected ? tk.pillActiveText : tk.pillText }}
                          >
                            {field.key === 'color' && (
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLOR_SWATCHES[opt] ?? '#ccc', border: opt === 'Blanco' ? `1px solid ${tk.iconMuted}` : '1px solid transparent' }} />
                            )}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          (() => {
            const matching = savedOutfits.filter(o => o.pieces.some(p => p.id === item.id));
            if (matching.length === 0) return (
              <div className="flex flex-col items-center justify-center py-20 gap-2 px-5">
                <Layers className="w-10 h-10" style={{ color: tk.iconMuted }} strokeWidth={1.5} />
                <p className="text-[13px] text-center" style={{ color: tk.textSub }}>Aún no hay outfits con esta prenda</p>
              </div>
            );
            return (
              <div className="px-5 pt-4 flex flex-col gap-3 pb-6">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: tk.textMuted }}>Outfits con esta prenda</p>
                {matching.map(outfit => (
                  <button
                    key={outfit.id}
                    onClick={() => onOpenOutfit(outfit.id)}
                    className="flex items-center gap-3 p-3 rounded-2xl active:scale-[0.98] transition-transform text-left w-full"
                    style={{ backgroundColor: tk.surfaceMuted, border: `1.5px solid ${tk.border}` }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                      <OutfitCollage pieces={outfit.pieces} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: tk.text, lineHeight: 1.3 }}>Outfit guardado</p>
                      <p style={{ fontSize: 12, color: tk.textMuted, textTransform: 'capitalize' }}>{outfit.date} · {outfit.pieces.length} prendas</p>
                    </div>
                    <ChevronLeft style={{ width: 16, height: 16, color: tk.iconMuted, transform: 'rotate(180deg)', flexShrink: 0 }} strokeWidth={2} />
                  </button>
                ))}
              </div>
            );
          })()
        )}
      </div>

      {/* ── Delete confirmation dialog ── */}
      {confirmDelete && (
        <div className="absolute inset-0 z-50 flex items-end justify-center pb-8 px-5" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full rounded-[24px] overflow-hidden" style={{ backgroundColor: tk.surface }}>
            <div className="px-6 pt-6 pb-4 flex flex-col items-center gap-2">
              <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: tk.destructiveSurface }}>
                <Trash2 className="w-6 h-6" style={{ color: tk.destructive }} />
              </span>
              <p className="text-[16px] font-bold mt-1" style={{ color: tk.text }}>Eliminar prenda</p>
              <p className="text-[13px] text-center" style={{ color: tk.textSub }}>¿Seguro que quieres eliminar <span className="font-semibold" style={{ color: tk.text }}>{item.name}</span>? Esta acción no se puede deshacer.</p>
            </div>
            <div className="flex border-t" style={{ borderColor: tk.borderLight }}>
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-4 text-[15px] font-medium border-r active:bg-gray-50 transition-colors" style={{ color: tk.textSub, borderColor: tk.borderLight }}>Cancelar</button>
              <button onClick={() => onDelete(item.id)} className="flex-1 py-4 text-[15px] font-semibold active:bg-red-50 transition-colors" style={{ color: tk.destructive }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast de confirmación ── */}
      <div
        className="absolute bottom-[86px] left-4 right-4 z-50 pointer-events-none transition-all duration-300"
        style={{
          opacity: showToast ? 1 : 0,
          transform: showToast ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg"
          style={{ backgroundColor: '#16A34A' }}
        >
          <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <Check className="w-3.5 h-3.5" style={{ color: '#FFFFFF' }} strokeWidth={2.5} />
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold" style={{ color: '#FFFFFF' }}>Cambios guardados</span>
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.75)' }}>La prenda se ha actualizado correctamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Garment Flow ────────────────────────────────────────────────────────

const SCAN_MS = 2800;

function AddGarmentFlow({ onAdd, onCancel, initialImg }: {
  onAdd: (item: Omit<Item, 'id'>) => void;
  onCancel: () => void;
  initialImg: string;
}) {
  const [step, setStep] = useState<'scanning' | 'confirm'>('scanning');
  const [imgSrc, setImgSrc] = useState(initialImg);
  const [scanY, setScanY] = useState(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<{ name: string; tipo: string; color: string[]; ocasion: string[]; marca: string }>({
    name: 'Nueva prenda', tipo: 'Tops', color: [], ocasion: [], marca: '',
  });
  const { tk } = useContext(ThemeCtx);

  // Seed draft on first mount from initial image
  useEffect(() => {
    const rnd = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
    setDraft({
      name: 'Nueva prenda',
      tipo: rnd(FILTERS.tipo.options),
      color: [rnd(FILTERS.color.options)],
      ocasion: [rnd(FILTERS.ocasion.options)],
      marca: rnd(FILTERS.marca.options),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetryCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const rnd = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
      setImgSrc(src);
      setDraft({
        name: 'Nueva prenda',
        tipo: rnd(FILTERS.tipo.options),
        color: [rnd(FILTERS.color.options)],
        ocasion: [rnd(FILTERS.ocasion.options)],
        marca: rnd(FILTERS.marca.options),
      });
      setStep('scanning');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Scan line animation
  useEffect(() => {
    if (step !== 'scanning') return;
    setScanY(0);
    let y = 0;
    const iv = setInterval(() => {
      y += 100 / (SCAN_MS / 16);
      setScanY(Math.min(y, 100));
    }, 16);
    return () => clearInterval(iv);
  }, [step]);

  // Auto-advance scanning → confirm
  useEffect(() => {
    if (step !== 'scanning') return;
    const t = setTimeout(() => setStep('confirm'), SCAN_MS);
    return () => clearTimeout(t);
  }, [step]);

  const toggleMulti = (field: 'color' | 'ocasion', opt: string) =>
    setDraft((d) => {
      const arr = d[field] as string[];
      return { ...d, [field]: arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt] };
    });

  // ── Scanning step ──
  if (step === 'scanning') {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: tk.bg }}>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleRetryCapture} />
        <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleRetryCapture} />
        <div className="pt-[54px] shrink-0" />
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
          <p className="text-[18px] font-bold tracking-tight" style={{ color: tk.text }}>Analizando prenda</p>
          {/* Photo card */}
          <div className="relative rounded-[20px] overflow-hidden shadow-2xl" style={{ width: 200, height: 267, backgroundColor: tk.surfaceMuted }}>
            {imgSrc && <img src={imgSrc} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.12) 100%)' }} />
            {/* Scan line */}
            <div className="absolute left-0 right-0 h-[2px]" style={{ top: `${scanY}%`, backgroundColor: '#22C55E', boxShadow: '0 0 10px 3px rgba(34,197,94,0.55)' }} />
            {/* Corner brackets */}
            {([['top-0 left-0','border-t-2 border-l-2 rounded-tl-[8px]'],['top-0 right-0','border-t-2 border-r-2 rounded-tr-[8px]'],['bottom-0 left-0','border-b-2 border-l-2 rounded-bl-[8px]'],['bottom-0 right-0','border-b-2 border-r-2 rounded-br-[8px]']] as [string,string][]).map(([pos,cls]) => (
              <div key={pos} className={`absolute ${pos} w-5 h-5 m-2 ${cls}`} style={{ borderColor: '#22C55E' }} />
            ))}
          </div>
          {/* Loader */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: tk.borderLight, borderTopColor: tk.accent }} />
            <p className="text-[13px] font-medium" style={{ color: tk.textSub }}>Identificando tipo, color y ocasión…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Confirm step ──
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: tk.bg }}>
      <div className="pt-[54px] shrink-0" />
      <div className="px-5 py-3 shrink-0 flex items-center justify-between border-b" style={{ borderColor: tk.border, backgroundColor: tk.bg }}>
        <p className="text-[17px] font-bold" style={{ color: tk.text }}>Nueva prenda</p>
        <button onClick={onCancel} className="text-[13px] font-medium active:opacity-60" style={{ color: tk.textSub }}>Cancelar</button>
      </div>
      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto pb-2">
        {/* Image */}
        <div className="mx-5 mt-4 rounded-[20px] overflow-hidden shadow-sm" style={{ backgroundColor: tk.surface, aspectRatio: '3/4' }}>
          {imgSrc
            ? <img src={imgSrc} alt="prenda" className="w-full h-full object-contain" />
            : <div className="w-full h-full flex items-center justify-center"><Shirt className="w-16 h-16" style={{ color: tk.iconMuted }} strokeWidth={1.2} /></div>}
        </div>
        <div className="px-5 mt-5 flex flex-col gap-1">
          {/* Section header */}
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: tk.textMuted }}>Información de prenda</p>
          {/* Card */}
          <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
            {/* Name */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: tk.borderLight }}>
              <span className="text-[14px]" style={{ color: tk.textSub }}>Nombre</span>
              <input
                className="text-[14px] font-medium text-right bg-transparent outline-none"
                style={{ color: tk.text, minWidth: 0, maxWidth: '55%' }}
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </div>
            {/* Category */}
            <div className="flex items-start justify-between px-4 py-3 border-b" style={{ borderColor: tk.borderLight }}>
              <span className="text-[14px] shrink-0 pt-0.5" style={{ color: tk.textSub }}>Categoría</span>
              <div className="flex flex-wrap gap-1.5 justify-end" style={{ maxWidth: '65%' }}>
                {FILTERS.tipo.options.map((opt) => {
                  const sel = draft.tipo === opt;
                  return <button key={opt} onClick={() => setDraft((d) => ({ ...d, tipo: opt }))} className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95" style={{ backgroundColor: sel ? tk.pillActiveBg : tk.pillBg, color: sel ? tk.pillActiveText : tk.pillText }}>{opt}</button>;
                })}
              </div>
            </div>
            {/* Color */}
            <div className="flex items-start justify-between px-4 py-3 border-b" style={{ borderColor: tk.borderLight }}>
              <span className="text-[14px] shrink-0 pt-0.5" style={{ color: tk.textSub }}>Color</span>
              <div className="flex flex-wrap gap-1.5 justify-end" style={{ maxWidth: '65%' }}>
                {FILTERS.color.options.map((opt) => {
                  const sel = draft.color.includes(opt);
                  return (
                    <button key={opt} onClick={() => toggleMulti('color', opt)} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95" style={{ backgroundColor: sel ? tk.pillActiveBg : tk.pillBg, color: sel ? tk.pillActiveText : tk.pillText }}>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLOR_SWATCHES[opt] ?? '#ccc', border: opt === 'Blanco' ? `1px solid ${tk.iconMuted}` : '1px solid transparent' }} />
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Ocasión */}
            <div className="flex items-start justify-between px-4 py-3 border-b" style={{ borderColor: tk.borderLight }}>
              <span className="text-[14px] shrink-0 pt-0.5" style={{ color: tk.textSub }}>Ocasión</span>
              <div className="flex flex-wrap gap-1.5 justify-end" style={{ maxWidth: '65%' }}>
                {FILTERS.ocasion.options.map((opt) => {
                  const sel = draft.ocasion.includes(opt);
                  return <button key={opt} onClick={() => toggleMulti('ocasion', opt)} className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95" style={{ backgroundColor: sel ? tk.pillActiveBg : tk.pillBg, color: sel ? tk.pillActiveText : tk.pillText }}>{opt}</button>;
                })}
              </div>
            </div>
            {/* Marca */}
            <div className="flex items-start justify-between px-4 py-3" >
              <span className="text-[14px] shrink-0 pt-0.5" style={{ color: tk.textSub }}>Marca</span>
              <div className="flex flex-wrap gap-1.5 justify-end" style={{ maxWidth: '65%' }}>
                {FILTERS.marca.options.map((opt) => {
                  const sel = draft.marca === opt;
                  return <button key={opt} onClick={() => setDraft((d) => ({ ...d, marca: opt }))} className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95" style={{ backgroundColor: sel ? tk.pillActiveBg : tk.pillBg, color: sel ? tk.pillActiveText : tk.pillText }}>{opt}</button>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom buttons */}
      <div className="shrink-0 px-5 pb-6 pt-3 flex gap-3 border-t" style={{ borderColor: tk.border, backgroundColor: tk.bg }}>
        <button onClick={() => onAdd({ ...draft, img: imgSrc, category: draft.tipo })} className="w-full py-3 rounded-full text-[14px] font-semibold active:scale-95 transition-transform" style={{ backgroundColor: tk.invertedBg, color: tk.invertedText }}>
          Añadir prenda
        </button>
      </div>
    </div>
  );
}

// ─── Outfit helpers ─────────────────────────────────────────────────────────

type SavedOutfit = { id: number; date: string; pieces: Item[]; collection: 'guardados' | 'favoritos' };

function generateOutfit(items: Item[]): Item[] {
  const pick = (arr: Item[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
  const tops    = items.filter(i => i.tipo === 'Tops');
  const bottoms = items.filter(i => i.tipo === 'Pantalones');
  const shoes   = items.filter(i => i.tipo === 'Calzado');
  const acc     = items.filter(i => i.tipo === 'Accesorios');
  return [pick(tops), pick(bottoms), pick(shoes), pick(acc)].filter((x): x is Item => x !== null);
}

// ─── Situation Planner helpers ────────────────────────────────────────────────

type SituationType = 'cena' | 'viaje' | 'trabajo' | 'fiesta' | 'finde' | 'deporte' | 'custom' | 'generar';

type SituationTemplate = {
  id: SituationType;
  label: string;
  description: string;
  ocasion: string;
  defaultDays: number;
  configurable: boolean;
};

const SITUATION_TEMPLATES: SituationTemplate[] = [
  { id: 'custom',  label: 'Personalizado',   description: 'Define tu propia situación',           ocasion: 'Casual',  defaultDays: 1, configurable: true  },
  { id: 'cena',    label: 'Cena',            description: 'Look elegante para la ocasión',        ocasion: 'Formal',  defaultDays: 1, configurable: false },
  { id: 'viaje',   label: 'Viaje',           description: 'Un outfit por cada día del viaje',     ocasion: 'Casual',  defaultDays: 3, configurable: true  },
  { id: 'trabajo', label: 'Semana laboral',  description: 'Looks profesionales para la oficina',  ocasion: 'Trabajo', defaultDays: 5, configurable: false },
  { id: 'fiesta',  label: 'Fiesta',          description: 'Outfit para brillar esta noche',       ocasion: 'Fiesta',  defaultDays: 1, configurable: false },
  { id: 'finde',   label: 'Fin de semana',   description: 'Planes informales y relajados',        ocasion: 'Casual',  defaultDays: 2, configurable: false },
  { id: 'deporte', label: 'Deporte',         description: 'Looks cómodos para entrenar',          ocasion: 'Sport',   defaultDays: 1, configurable: false },
];

function SituationIcon({ id, className, style }: { id: SituationType; className?: string; style?: React.CSSProperties }) {
  const props = { className, style, strokeWidth: 1.8 };
  switch (id) {
    case 'cena':    return <UtensilsCrossed {...props} />;
    case 'viaje':   return <Plane {...props} />;
    case 'trabajo': return <Briefcase {...props} />;
    case 'fiesta':  return <PartyPopper {...props} />;
    case 'finde':   return <Sun {...props} />;
    case 'deporte': return <Dumbbell {...props} />;
    case 'custom':  return <Sliders {...props} />;
    case 'generar': return <Wand2 {...props} />;
  }
}

function generateOutfitForOcasion(items: Item[], ocasion: string, usedIds: Set<number>): Item[] {
  const forOcasion = items.filter(i => i.ocasion.includes(ocasion));
  const pool = forOcasion.length >= 3 ? forOcasion : items;
  const pick = (arr: Item[]): Item | null => {
    const unused = arr.filter(i => !usedIds.has(i.id));
    const src = unused.length > 0 ? unused : arr;
    return src.length ? src[Math.floor(Math.random() * src.length)] : null;
  };
  const top    = pick(pool.filter(i => i.tipo === 'Tops' || i.tipo === 'Vestidos'));
  const isDress = top?.tipo === 'Vestidos';
  const bottom = isDress ? null : pick(pool.filter(i => i.tipo === 'Pantalones'));
  const shoe   = pick(pool.filter(i => i.tipo === 'Calzado'));
  const accArr = pool.filter(i => i.tipo === 'Accesorios');
  const acc    = accArr.length ? accArr[Math.floor(Math.random() * accArr.length)] : null;
  [top, bottom, shoe].forEach(i => i && usedIds.add(i.id));
  return [top, bottom, shoe, acc].filter((x): x is Item => x !== null);
}

function getTodayLabel() {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function getSituationLabel(id: SituationType, lang: 'es' | 'en'): string {
  const map: Record<'es' | 'en', Record<SituationType, string>> = {
    es: { custom: 'Personalizado', cena: 'Cena', viaje: 'Viaje', trabajo: 'Semana laboral', fiesta: 'Fiesta', finde: 'Fin de semana', deporte: 'Deporte', generar: 'Generar outfit' },
    en: { custom: 'Custom', cena: 'Dinner', viaje: 'Trip', trabajo: 'Work week', fiesta: 'Party', finde: 'Weekend', deporte: 'Sports', generar: 'Generate outfit' },
  };
  return map[lang][id];
}

function getSituationDesc(id: SituationType, lang: 'es' | 'en'): string {
  const map: Record<'es' | 'en', Record<SituationType, string>> = {
    es: { custom: 'Define tu propia situación', cena: 'Look elegante para la ocasión', viaje: 'Un outfit por cada día del viaje', trabajo: 'Looks profesionales para la oficina', fiesta: 'Outfit para brillar esta noche', finde: 'Planes informales y relajados', deporte: 'Looks cómodos para entrenar', generar: 'Crea un look al instante con tus prendas' },
    en: { custom: 'Define your own situation', cena: 'Elegant look for the occasion', viaje: 'One outfit per day of the trip', trabajo: 'Professional looks for the office', fiesta: 'Outfit to shine tonight', finde: 'Informal and relaxed plans', deporte: 'Comfortable looks for training', generar: 'Create a look instantly with your items' },
  };
  return map[lang][id];
}

const REJECT_REASONS_I18N: Record<'es' | 'en', string[]> = {
  es: ['No me convence', 'No disponible hoy', 'Fuera de ocasión', 'No me favorece'],
  en: ['Not convinced', 'Not available today', 'Wrong occasion', "Doesn't suit me"],
};

// ─── OutfitCollage ────────────────────────────────────────────────────────────

function OutfitCollage({ pieces }: { pieces: Item[] }) {
  const { tk } = useContext(ThemeCtx);
  const slots = Array.from({ length: 4 }, (_, i) => pieces[i] ?? null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', height: '100%', gap: 1 }}>
      {slots.map((piece, i) => (
        <div key={i} style={{ backgroundColor: tk.surfaceMuted, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {piece?.img ? (
            <img src={piece.img} alt={piece.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : piece ? (
            <Shirt style={{ width: '35%', height: '35%', color: tk.iconMuted, opacity: 0.6 }} strokeWidth={1.2} />
          ) : (
            <div style={{ backgroundColor: tk.border, width: '100%', height: '100%' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── SituationPlannerView ─────────────────────────────────────────────────────

function SituationPlannerView({ items, onSaveOutfit }: { items: Item[]; onSaveOutfit: (o: SavedOutfit) => void }) {
  const { tk, lang } = useContext(ThemeCtx);
  const t = I18N[lang];
  const [step, setStep] = useState<'select' | 'configure' | 'results'>('select');
  const [template, setTemplate] = useState<SituationTemplate | null>(null);
  const [days, setDays] = useState(1);
  const [customOcasion, setCustomOcasion] = useState('Casual');
  const [customDescription, setCustomDescription] = useState('');
  const [plan, setPlan] = useState<{ label: string; outfit: Item[] }[]>([]);
  const [savedPlan, setSavedPlan] = useState(false);

  const buildPlan = (_tpl: SituationTemplate, numDays: number, ocasion: string) => {
    const usedIds = new Set<number>();
    return Array.from({ length: numDays }, (_, i) => ({
      label: numDays === 1 ? t.lookOfDay : `${t.day} ${i + 1}`,
      outfit: generateOutfitForOcasion(items, ocasion, usedIds),
    }));
  };

  const handleSelectTemplate = (t: SituationTemplate) => {
    setTemplate(t);
    setDays(t.defaultDays);
    setCustomOcasion('Casual');
    setCustomDescription('');
    if (t.configurable) {
      setStep('configure');
    } else {
      setPlan(buildPlan(t, t.defaultDays, t.ocasion));
      setSavedPlan(false);
      setStep('results');
    }
  };

  const handleGenerate = () => {
    if (!template) return;
    const ocasion = template.id === 'custom' ? customOcasion : template.ocasion;
    setPlan(buildPlan(template, days, ocasion));
    setSavedPlan(false);
    setStep('results');
  };

  const handleRegenOutfit = (idx: number) => {
    if (!template) return;
    const ocasion = template.id === 'custom' ? customOcasion : template.ocasion;
    setPlan(prev => prev.map((p, i) =>
      i === idx ? { ...p, outfit: generateOutfitForOcasion(items, ocasion, new Set<number>()) } : p
    ));
  };

  const handleReset = () => { setStep('select'); setTemplate(null); setPlan([]); setSavedPlan(false); setCustomDescription(''); };

  if (step === 'select') {
    return (
      <div className="px-5 py-4 flex flex-col gap-4">
        <div>
          <p className="text-[15px] font-bold" style={{ color: tk.text }}>{t.whichSituation}</p>
          <p className="text-[12px] mt-0.5" style={{ color: tk.textMuted }}>{t.whichSituationSub}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Quick generate */}
          <button
            onClick={() => handleSelectTemplate({ id: 'generar', label: 'Generar outfit', description: 'Look aleatorio', ocasion: 'Casual', defaultDays: 1, configurable: false })}
            className="col-span-2 flex items-center gap-3 p-3.5 rounded-2xl active:scale-[0.97] transition-all text-left"
            style={{ backgroundColor: tk.featureBg, border: `1px solid ${tk.featureBg}` }}
          >
            <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tk.featureIconBg }}>
              <Sparkles className="w-5 h-5" style={{ color: tk.featureIconColor }} strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[14px] font-bold" style={{ color: tk.featureText }}>{t.generateOutfitLabel}</p>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: tk.featureSubText }}>{t.generateOutfitDesc}</p>
            </div>
          </button>
          {SITUATION_TEMPLATES.map(tpl => {
            const isCustom = tpl.id === 'custom';
            return (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`flex flex-col items-start gap-2.5 p-3.5 rounded-2xl active:scale-[0.97] transition-all text-left${isCustom ? ' col-span-2' : ''}`}
                style={isCustom
                  ? { backgroundColor: tk.featureBg, border: `1px solid ${tk.featureBg}` }
                  : { backgroundColor: tk.surface, border: `1px solid ${tk.border}` }}
              >
                {isCustom ? (
                  <div className="w-full flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tk.featureIconBg }}>
                      <SituationIcon id={tpl.id} className="w-5 h-5" style={{ color: tk.featureIconColor }} />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold" style={{ color: tk.featureText }}>{getSituationLabel(tpl.id, lang)}</p>
                      <p className="text-[11px] leading-tight mt-0.5" style={{ color: tk.featureSubText }}>{getSituationDesc(tpl.id, lang)}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: tk.accentSurface }}>
                      <SituationIcon id={tpl.id} className="w-[18px] h-[18px]" style={{ color: tk.accent }} />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: tk.text }}>{getSituationLabel(tpl.id, lang)}</p>
                      <p className="text-[11px] leading-tight mt-0.5" style={{ color: tk.textSub }}>{getSituationDesc(tpl.id, lang)}</p>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 'configure') {
    return (
      <div className="px-5 py-4 flex flex-col gap-5">
        <button onClick={() => setStep('select')} className="flex items-center gap-1.5 text-[13px] w-fit" style={{ color: tk.accentText }}>
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          {t.changeSituation}
        </button>
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tk.accentSurface }}>
            <SituationIcon id={template!.id} className="w-5 h-5" style={{ color: tk.accent }} />
          </span>
          <div>
            <p className="text-[15px] font-bold" style={{ color: tk.text }}>{getSituationLabel(template!.id, lang)}</p>
            <p className="text-[12px]" style={{ color: tk.textMuted }}>{t.configureDetails}</p>
          </div>
        </div>

        {/* Custom occasion picker + description */}
        {template?.id === 'custom' && (
          <>
            <div className="rounded-2xl p-4" style={{ backgroundColor: tk.surface, border: `1px solid ${tk.border}` }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: tk.text }}>{t.describeOccasion}</p>
              <p className="text-[11px] mb-3" style={{ color: tk.textMuted }}>{t.describeOccasionSub}</p>
              <textarea
                value={customDescription}
                onChange={e => setCustomDescription(e.target.value)}
                placeholder={t.describeOccasionPlaceholder}
                maxLength={200}
                rows={3}
                className="w-full resize-none rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
                style={{
                  backgroundColor: tk.surfaceMuted,
                  color: tk.text,
                  border: '1.5px solid transparent',
                  lineHeight: '1.5',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = tk.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = 'transparent')}
              />
              <p className="text-[10px] text-right mt-1" style={{ color: tk.iconMuted }}>{customDescription.length}/200</p>
            </div>
          </>
        )}

        {/* Days picker */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: tk.surface, border: `1px solid ${tk.border}` }}>
          <p className="text-[13px] font-semibold mb-4" style={{ color: tk.text }}>{t.howManyDays}</p>
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => setDays(d => Math.max(1, d - 1))}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ backgroundColor: tk.surfaceMuted }}
            >
              <span className="text-[22px] leading-none font-light" style={{ color: tk.text }}>−</span>
            </button>
            <span className="text-[32px] font-bold w-10 text-center tabular-nums" style={{ color: tk.text }}>{days}</span>
            <button
              onClick={() => setDays(d => Math.min(7, d + 1))}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ backgroundColor: tk.surfaceMuted }}
            >
              <span className="text-[22px] leading-none font-light" style={{ color: tk.text }}>+</span>
            </button>
          </div>
          <p className="text-[11px] text-center mt-3" style={{ color: tk.textMuted }}>{t.maxDays}</p>
        </div>

        {template?.id === 'custom' && (
          <>
            <div className="rounded-2xl p-4" style={{ backgroundColor: tk.surface, border: `1px solid ${tk.border}` }}>
              <p className="text-[13px] font-semibold mb-3" style={{ color: tk.text }}>{t.occasionType}</p>
              <div className="flex flex-wrap gap-2">
                {(['Casual', 'Sport', 'Formal', 'Trabajo', 'Fiesta'] as const).map(o => (
                  <button
                    key={o}
                    onClick={() => setCustomOcasion(o)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95"
                    style={{
                      backgroundColor: customOcasion === o ? tk.invertedBg : tk.surfaceMuted,
                      color: customOcasion === o ? tk.invertedText : tk.accentText,
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleGenerate}
          className="w-full py-3.5 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: tk.invertedBg, color: tk.invertedText }}
        >
          <Sparkles className="w-4 h-4" strokeWidth={2} />
          {t.generatePlan}
        </button>
      </div>
    );
  }

  // step === 'results'
  return (
    <div className="px-5 py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={handleReset} className="flex items-center gap-1.5 text-[13px]" style={{ color: tk.accentText }}>
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          {t.newSituation}
        </button>
        <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: tk.accentSurface, color: tk.accent }}>
          {plan.length} {plan.length === 1 ? 'outfit' : 'outfits'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tk.accentSurface }}>
          <SituationIcon id={template!.id} className="w-5 h-5" style={{ color: tk.accent }} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold" style={{ color: tk.text }}>{t.planOf} {getSituationLabel(template!.id, lang)}</p>
          {customDescription ? (
            <p className="text-[11px] mt-0.5 leading-tight line-clamp-2" style={{ color: tk.accentText }}>"{customDescription}"</p>
          ) : (
            <p className="text-[12px]" style={{ color: tk.textMuted }}>{t.proposalsFromWardrobe}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {plan.map((dayPlan, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden" style={{ backgroundColor: tk.surface, border: `1px solid ${tk.border}` }}>
            {/* Card header */}
            <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b" style={{ borderColor: tk.borderLight }}>
              <p className="text-[13px] font-bold" style={{ color: tk.text }}>{dayPlan.label}</p>
              <button
                onClick={() => handleRegenOutfit(idx)}
                className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full active:scale-90 transition-transform"
                style={{ backgroundColor: tk.accentSurface, color: tk.accent }}
              >
                <RefreshCw className="w-3 h-3" strokeWidth={2} />
                {t.regenerate}
              </button>
            </div>
            {/* Pieces */}
            <div className="px-4 py-3 flex flex-col gap-2">
              {dayPlan.outfit.length === 0 ? (
                <p className="text-[12px] text-center py-2" style={{ color: tk.textMuted }}>{t.notEnoughItems}</p>
              ) : (
                dayPlan.outfit.map(piece => (
                  <div key={piece.id} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ backgroundColor: tk.surfaceMuted }}>
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: tk.surface }}>
                      {piece.img ? (
                        <img src={piece.img} alt={piece.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shirt className="w-3.5 h-3.5" style={{ color: tk.iconMuted }} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold truncate" style={{ color: tk.text }}>{piece.name}</p>
                      <p className="text-[10px]" style={{ color: tk.textMuted }}>{piece.tipo}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {piece.color.map(c => (
                        <div
                          key={c}
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLOR_SWATCHES[c] ?? '#D1D5DB',
                            border: c === 'Blanco' ? `1px solid ${tk.border}` : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save / Saved */}
      {!savedPlan ? (
        <button
          onClick={() => {
            plan.forEach(dayPlan => {
              if (dayPlan.outfit.length > 0) {
                onSaveOutfit({ id: Date.now() + Math.random(), date: getTodayLabel(), pieces: dayPlan.outfit, collection: 'guardados' });
              }
            });
            setSavedPlan(true);
          }}
          className="w-full py-3.5 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: tk.invertedBg, color: tk.invertedText }}
        >
          <Heart className="w-4 h-4" strokeWidth={2} />
          {t.savePlan}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <Check className="w-4 h-4" style={{ color: '#16A34A' }} strokeWidth={2.5} />
          <p className="text-[13px] font-semibold" style={{ color: '#16A34A' }}>{t.planSaved}</p>
        </div>
      )}
    </div>
  );
}

// ─── ExploreView ──────────────────────────────────────────────────────────────

const BRAND_URLS: Record<string, string> = {
  'Zara':          'https://www.zara.com/es/',
  'H&M':           'https://www2.hm.com/es_es/',
  'Mango':         'https://shop.mango.com/es',
  'Nike':          'https://www.nike.com/es/',
  'Adidas':        'https://www.adidas.es/',
  'Massimo Dutti': 'https://www.massimodutti.com/es/',
  'Pull&Bear':     'https://www.pullandbear.com/es/',
};

const BRAND_META: Record<string, { bg: string; initials: string; logo: string }> = {
  'Zara':          { bg: '#1C1C1C', initials: 'ZA',  logo: 'https://www.google.com/s2/favicons?sz=128&domain=zara.com' },
  'H&M':           { bg: '#E11D48', initials: 'H&M', logo: 'https://www.google.com/s2/favicons?sz=128&domain=hm.com' },
  'Mango':         { bg: '#92400E', initials: 'MG',  logo: 'https://www.google.com/s2/favicons?sz=128&domain=mango.com' },
  'Nike':          { bg: '#111827', initials: 'NK',  logo: 'https://www.google.com/s2/favicons?sz=128&domain=nike.com' },
  'Adidas':        { bg: '#166534', initials: 'AD',  logo: 'https://www.google.com/s2/favicons?sz=128&domain=adidas.com' },
  'Massimo Dutti': { bg: '#1E3A5F', initials: 'MD',  logo: 'https://www.google.com/s2/favicons?sz=128&domain=massimodutti.com' },
  'Pull&Bear':     { bg: '#C2410C', initials: 'P&B', logo: 'https://www.google.com/s2/favicons?sz=128&domain=pullandbear.com' },
};

const SPONSORED_ITEMS = [
  // Zara
  { id: 1,  brand: 'Zara', name: 'Camisa Oxford',       price: '29,95 €', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=533&fit=crop&q=80' },
  { id: 2,  brand: 'Zara', name: 'Falda Midi',          price: '39,95 €', img: 'https://images.unsplash.com/photo-1583496661160-fb5218a5f95b?w=400&h=533&fit=crop&q=80' },
  { id: 3,  brand: 'Zara', name: 'Chaqueta Vaquera',    price: '49,95 €', img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=533&fit=crop&q=80' },
  { id: 4,  brand: 'Zara', name: 'Vestido Lino',        price: '35,95 €', img: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&h=533&fit=crop&q=80' },
  // H&M
  { id: 5,  brand: 'H&M', name: 'Camiseta Básica',     price: '9,99 €',  img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=533&fit=crop&q=80' },
  { id: 6,  brand: 'H&M', name: 'Chino Slim',           price: '24,99 €', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=533&fit=crop&q=80' },
  { id: 7,  brand: 'H&M', name: 'Abrigo Oversize',      price: '59,99 €', img: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=400&h=533&fit=crop&q=80' },
  { id: 8,  brand: 'H&M', name: 'Jersey Punto',         price: '19,99 €', img: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=533&fit=crop&q=80' },
  // Nike
  { id: 9,  brand: 'Nike', name: 'Chaqueta Windrunner', price: '109,99 €', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=533&fit=crop&q=80' },
  { id: 10, brand: 'Nike', name: 'Leggings Pro',         price: '49,99 €', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=533&fit=crop&q=80' },
  { id: 11, brand: 'Nike', name: 'Camiseta Dri-FIT',    price: '34,99 €', img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&h=533&fit=crop&q=80' },
  { id: 12, brand: 'Nike', name: 'Pantalón Tech Fleece', price: '119,99 €', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&h=533&fit=crop&q=80' },
  // Mango
  { id: 13, brand: 'Mango', name: 'Abrigo Camel',       price: '89,99 €', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=533&fit=crop&q=80' },
  { id: 14, brand: 'Mango', name: 'Blazer Cuadros',     price: '69,99 €', img: 'https://images.unsplash.com/photo-1619603364930-4ab9282a8e34?w=400&h=533&fit=crop&q=80' },
  { id: 15, brand: 'Mango', name: 'Vestido Satén',      price: '59,99 €', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=533&fit=crop&q=80' },
  { id: 16, brand: 'Mango', name: 'Pantalón Palazzo',   price: '45,99 €', img: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=400&h=533&fit=crop&q=80' },
  // Adidas
  { id: 17, brand: 'Adidas', name: 'Sudadera Trefoil',  price: '64,99 €', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=533&fit=crop&q=80' },
  { id: 18, brand: 'Adidas', name: 'Chándal Originals', price: '89,99 €', img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=533&fit=crop&q=80' },
  { id: 19, brand: 'Adidas', name: 'Camiseta Crop',     price: '29,99 €', img: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=533&fit=crop&q=80' },
  // Massimo Dutti
  { id: 20, brand: 'Massimo Dutti', name: 'Blazer Slim',    price: '149,00 €', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=533&fit=crop&q=80' },
  { id: 21, brand: 'Massimo Dutti', name: 'Cinturón Piel',  price: '49,00 €',  img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=533&fit=crop&q=80' },
  { id: 22, brand: 'Massimo Dutti', name: 'Camisa Lino',    price: '59,00 €',  img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=533&fit=crop&q=80' },
  // Pull&Bear
  { id: 23, brand: 'Pull&Bear', name: 'Pantalón Cargo',    price: '35,99 €', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=533&fit=crop&q=80' },
  { id: 24, brand: 'Pull&Bear', name: 'Sudadera Printed',  price: '25,99 €', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=533&fit=crop&q=80' },
  { id: 25, brand: 'Pull&Bear', name: 'Camiseta Graphic',  price: '17,99 €', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=533&fit=crop&q=80' },
];

function BrandCircle({ brand }: { brand: string }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { tk } = useContext(ThemeCtx);
  const meta = BRAND_META[brand];
  return (
    <button
      onClick={() => window.open(BRAND_URLS[brand], '_blank', 'noopener,noreferrer')}
      className="flex flex-col items-center gap-1.5 shrink-0 active:scale-90 transition-transform"
    >
      <div
        className="w-14 h-14 rounded-full relative overflow-hidden transition-colors duration-200"
        style={{ backgroundColor: '#FFFFFF', border: `2px solid ${tk.border}` }}
      >
        {!logoLoaded && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
            {meta.initials}
          </span>
        )}
        <img
          src={meta.logo}
          alt={brand}
          className="absolute inset-0 w-full h-full object-contain p-2"
          onLoad={() => setLogoLoaded(true)}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <span
        className="text-[9px]" style={{ color: tk.textSub }}>
        {brand}
      </span>
    </button>
  );
}

function ExploreView({
  onNavArmario,
  onNavOutfits,
  onNavProto,
  onAdd,
}: {
  onNavArmario: () => void;
  onNavOutfits: () => void;
  onNavProto: () => void;
  onAdd: () => void;
}) {
  const { tk, lang } = useContext(ThemeCtx);
  const t = I18N[lang];
  const brands = Object.keys(BRAND_META);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: tk.bg }}>
      {/* Spacer for status bar */}
      <div className="pt-[54px]" />

      {/* Header */}
      <div className="sticky top-0 z-30 pt-5 pb-3 px-5" style={{ backgroundColor: tk.bg }}>
        <h1 className="text-[26px] font-bold tracking-tight mb-1" style={{ color: tk.text }}>{t.explore}</h1>
        <p className="text-[13px] mb-4" style={{ color: tk.textMuted }}>{t.sponsoredItems}</p>

        {/* Brand circles — each links directly to brand site */}
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {brands.map((brand) => (
            <BrandCircle key={brand} brand={brand} />
          ))}
        </div>
      </div>

      {/* Sponsored grid — same card style as armario */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {SPONSORED_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => window.open(BRAND_URLS[item.brand] ?? '#', '_blank', 'noopener,noreferrer')}
              className="rounded-lg overflow-hidden active:scale-[0.97] transition-transform text-left"
              style={{ outline: `2px dashed ${tk.border}`, outlineOffset: '-2px' }}
            >
              <div className="relative w-full aspect-[3/4]" style={{ backgroundColor: tk.surfaceMuted }}>
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span
                  className="absolute top-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: tk.surface + 'E0', color: tk.accentText }}
                >
                  {t.sponsored}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="h-[70px] flex items-center justify-around px-4 z-40 border-t shrink-0" style={{ backgroundColor: tk.navBg, borderColor: tk.border }}>
        <button onClick={onNavArmario} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Shirt className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.wardrobe}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Search className="w-6 h-6" style={{ color: tk.text }} strokeWidth={2} />
          <span className="text-[10px] font-semibold" style={{ color: tk.text }}>{t.explore}</span>
        </button>
        <button onClick={onAdd} className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform -mt-5" style={{ backgroundColor: tk.invertedBg }}>
          <Plus className="w-7 h-7" style={{ color: tk.invertedText }} strokeWidth={2.5} />
        </button>
        <button onClick={onNavProto} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Wand2 className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.suggestions}</span>
        </button>
        <button onClick={onNavOutfits} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Layers className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.outfits}</span>
        </button>
      </div>
    </div>
  );
}

// ─── OutfitsView ──────────────────────────────────────────────────────────────



// ─── SugerenciasView ─────────────────────────────────────────────────────────

function SugerenciasView({
  items,
  onSaveOutfit,
  onDeleteOutfit,
  onMoveOutfit,
  onNavArmario,
  onNavExplorar,
  onNavOutfits,
  onAdd,
}: {
  items: Item[];
  onSaveOutfit: (o: SavedOutfit) => void;
  onDeleteOutfit: (id: number) => void;
  onMoveOutfit: (id: number, collection: 'guardados' | 'favoritos') => void;
  onNavArmario: () => void;
  onNavExplorar: () => void;
  onNavOutfits: () => void;
  onAdd: () => void;
}) {
  const { tk, lang } = useContext(ThemeCtx);
  const t = I18N[lang];
  const DAILY_LIMIT = 5;
  const SWIPE_X = 80;
  const SWIPE_Y = 70;

  const [suggestions] = useState<Item[][]>(() =>
    Array.from({ length: DAILY_LIMIT }, () => generateOutfit(items))
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [favorites, setFavorites] = useState<boolean[]>(Array(DAILY_LIMIT).fill(false));
  const [done, setDone] = useState(false);

  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragXRef = useRef(0);
  const dragYRef = useRef(0);

  const [flyDir, setFlyDir] = useState<'left' | 'right' | null>(null);
  const [showPieces, setShowPieces] = useState(false);
  const [piecesVisible, setPiecesVisible] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const pieceDragStart = useRef(0);
  const [pieceDragY, setPieceDragY] = useState(0);
  const pieceDragYRef = useRef(0);
  const savedOutfitIds = useRef<(number | null)[]>(Array(DAILY_LIMIT).fill(null));

  const outfit = suggestions[currentIdx] ?? [];
  const nextOutfit = currentIdx + 1 < DAILY_LIMIT ? suggestions[currentIdx + 1] : null;

  const openPieces = () => {
    setShowPieces(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setPiecesVisible(true)));
  };

  const closePieces = () => {
    setPiecesVisible(false);
    setTimeout(() => setShowPieces(false), 300);
  };

  const advanceCard = () => {
    setShowPieces(false);
    setPiecesVisible(false);
    if (currentIdx + 1 >= DAILY_LIMIT) setDone(true);
    else setCurrentIdx(i => i + 1);
  };

  const doAccept = () => {
    if (flyDir || done) return;
    const idx = currentIdx;
    if (savedOutfitIds.current[idx] == null) {
      const id = Date.now();
      savedOutfitIds.current[idx] = id;
      onSaveOutfit({ id, date: getTodayLabel(), pieces: outfit, collection: 'guardados' });
    }
    setFlyDir('left');
    setTimeout(() => { setFlyDir(null); dragXRef.current = 0; dragYRef.current = 0; setDragX(0); setDragY(0); advanceCard(); }, 380);
  };

  const doReject = () => {
    if (flyDir || done) return;
    setFlyDir('right');
    setTimeout(() => {
      setFlyDir(null); dragXRef.current = 0; dragYRef.current = 0; setDragX(0); setDragY(0);
      setShowReject(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setRejectVisible(true)));
    }, 380);
  };

  const closeReject = () => {
    setRejectVisible(false);
    setCustomReason('');
    setTimeout(() => { setShowReject(false); advanceCard(); }, 300);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = currentIdx;
    const existingId = savedOutfitIds.current[idx];
    if (!favorites[idx]) {
      // Turn ON → move to favoritos (or create new if not saved yet)
      if (existingId != null) {
        onMoveOutfit(existingId, 'favoritos');
      } else {
        const id = Date.now();
        savedOutfitIds.current[idx] = id;
        onSaveOutfit({ id, date: getTodayLabel(), pieces: outfit, collection: 'favoritos' });
      }
    } else {
      // Turn OFF → remove entirely
      if (existingId != null) {
        onDeleteOutfit(existingId);
        savedOutfitIds.current[idx] = null;
      }
    }
    setFavorites(prev => prev.map((v, i) => i === idx ? !v : v));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (showPieces || showReject || flyDir || done) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const x = e.clientX - startPos.current.x;
    const y = e.clientY - startPos.current.y;
    dragXRef.current = x;
    dragYRef.current = y;
    setDragX(x);
    setDragY(y);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const dx = dragXRef.current;
    const dy = dragYRef.current;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    dragXRef.current = 0;
    dragYRef.current = 0;
    if (dy < -SWIPE_Y && ay > ax * 0.7) { openPieces(); setDragX(0); setDragY(0); return; }
    if (dx > SWIPE_X && ax > ay) { doAccept(); return; }
    if (dx < -SWIPE_X && ax > ay) { doReject(); return; }
    setDragX(0); setDragY(0);
  };

  const getCardTransform = () => {
    if (flyDir === 'left') return 'translateX(160%) rotate(25deg)';
    if (flyDir === 'right') return 'translateX(-160%) rotate(-25deg)';
    if (isDragging) return `translateX(${dragX}px) translateY(${Math.min(0, dragY * 0.25)}px) rotate(${dragX * 0.035}deg)`;
    return 'translateX(0) rotate(0deg)';
  };

  const likeOpacity = isDragging ? Math.min(1, Math.max(0, (dragX - 20) / 60)) : 0;
  const nopeOpacity = isDragging ? Math.min(1, Math.max(0, (-dragX - 20) / 60)) : 0;

  const navBar = (
    <div className="h-[70px] flex items-center justify-around px-4 z-40 border-t shrink-0"
      style={{ backgroundColor: tk.navBg, borderColor: tk.border }}>
      <button onClick={onNavArmario} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
        <Shirt className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
        <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.wardrobe}</span>
      </button>
      <button onClick={onNavExplorar} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
        <Search className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
        <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.explore}</span>
      </button>
      <button onClick={onAdd} className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform -mt-5" style={{ backgroundColor: tk.invertedBg }}>
        <Plus className="w-7 h-7" style={{ color: tk.invertedText }} strokeWidth={2.5} />
      </button>
      <button className="flex flex-col items-center gap-1">
        <Wand2 className="w-6 h-6" style={{ color: tk.text }} strokeWidth={2} />
        <span className="text-[10px] font-semibold" style={{ color: tk.text }}>{t.suggestions}</span>
      </button>
      <button onClick={onNavOutfits} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
        <Layers className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
        <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.outfits}</span>
      </button>
    </div>
  );

  if (done) {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: tk.bg }}>
        <div className="pt-[54px]" />
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: tk.accentSurface }}>
            <Sparkles className="w-9 h-9" style={{ color: tk.accentText }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[21px] font-bold mb-2" style={{ color: tk.text }}>{t.allSeenToday}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: tk.textMuted }}>{t.allSeenBody}</p>
          </div>
          <div className="px-5 py-2 rounded-full text-[13px] font-medium" style={{ backgroundColor: tk.accentSurface, color: tk.accentText }}>
            {DAILY_LIMIT} / {DAILY_LIMIT} {t.seenOutfits}
          </div>
        </div>
        {navBar}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: tk.bg, userSelect: 'none' }}>
      <div className="pt-[54px]" />

      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center shrink-0">
        <div className="flex-1">
          <h1 className="text-[22px] font-bold leading-tight" style={{ color: tk.text }}>{t.suggestionsTitle}</h1>
          <p className="text-[12px] capitalize" style={{ color: tk.textMuted }}>{getTodayLabel()}</p>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative mx-4 mb-1" style={{ minHeight: 0 }}>

        {/* Background card (next outfit) */}
        {nextOutfit && (
          <div className="absolute inset-0 rounded-[28px] overflow-hidden"
            style={{ transform: 'scale(0.93) translateY(12px)', transformOrigin: 'bottom center', zIndex: 0 }}>
            <OutfitCollage pieces={nextOutfit} />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
          </div>
        )}

        {/* Current card */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 rounded-[28px] overflow-hidden"
          style={{
            zIndex: 1,
            transform: getCardTransform(),
            transition: isDragging ? 'none' : 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
          }}
        >
          <OutfitCollage pieces={outfit} />

          {/* Dark gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0) 65%)' }} />

          {/* Green tint (like) */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(34,197,94,0.35)', opacity: likeOpacity, pointerEvents: 'none' }} />
          {/* Red tint (nope) */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(239,68,68,0.35)', opacity: nopeOpacity, pointerEvents: 'none' }} />

          {/* LIKE badge */}
          <div style={{
            position: 'absolute', top: 28, left: 20,
            border: '3px solid #22C55E', borderRadius: 8, padding: '3px 12px',
            opacity: likeOpacity, transform: 'rotate(-12deg)', pointerEvents: 'none',
          }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#22C55E', letterSpacing: 2 }}>LIKE</span>
          </div>

          {/* NOPE badge */}
          <div style={{
            position: 'absolute', top: 28, right: 20,
            border: '3px solid #EF4444', borderRadius: 8, padding: '3px 12px',
            opacity: nopeOpacity, transform: 'rotate(12deg)', pointerEvents: 'none',
          }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#EF4444', letterSpacing: 2 }}>NOPE</span>
          </div>

          {/* Favorite button – top right */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={toggleFavorite}
            className="active:scale-90 transition-transform"
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 2,
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: favorites[currentIdx] ? 'rgba(254,226,226,0.95)' : 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <Heart
              style={{ width: 18, height: 18, color: favorites[currentIdx] ? '#DC2626' : '#C4B8B0' }}
              strokeWidth={2}
              fill={favorites[currentIdx] ? '#DC2626' : 'none'}
            />
          </button>

          {/* Bottom info */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '4px 10px' }}>
                <Sparkles style={{ width: 11, height: 11, color: '#FFFFFF' }} strokeWidth={1.8} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF' }}>{t.outfitLabel} {currentIdx + 1} {t.outfitOf} {DAILY_LIMIT}</span>
              </div>
            </div>
            {/* Ver prendas button */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); openPieces(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px', borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              <ChevronLeft style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.75)', transform: 'rotate(90deg)' }} strokeWidth={2} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{t.seeItems}</span>
            </button>
          </div>

          {/* Pieces panel – lifted outside card to avoid pointer capture interference */}
        </div>
      </div>

      {/* Pieces panel overlay */}
      {showPieces && (
        <div style={{
          position: 'absolute',
          inset: '0 16px 0 16px',
          marginBottom: '1px',
          backgroundColor: tk.surface,
          display: 'flex', flexDirection: 'column',
          transform: piecesVisible ? `translateY(${pieceDragY}px)` : 'translateY(100%)',
          transition: pieceDragY > 0 ? 'none' : 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
          borderRadius: 28, overflow: 'hidden',
          zIndex: 10,
        }}>
          <div
            onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); pieceDragStart.current = e.clientY; }}
            onPointerMove={(e) => { const dy = e.clientY - pieceDragStart.current; if (dy > 0) { pieceDragYRef.current = dy; setPieceDragY(dy); } }}
            onPointerUp={() => { if (pieceDragYRef.current > 60) closePieces(); pieceDragYRef.current = 0; setPieceDragY(0); }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: `1px solid ${tk.borderLight}`, flexShrink: 0, touchAction: 'none', cursor: 'grab', paddingTop: 10, paddingBottom: 12 }}>
            <div style={{ width: 36, height: 4, backgroundColor: tk.border, borderRadius: 2, marginBottom: 12 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 16px' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: tk.text }}>{t.itemsOfOutfit}</p>
              <button onClick={(e) => { e.stopPropagation(); closePieces(); }} style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: tk.surfaceMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X style={{ width: 14, height: 14, color: tk.accentText }} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {outfit.length === 0 ? (
              <p style={{ fontSize: 13, textAlign: 'center', color: tk.textMuted, paddingTop: 20 }}>{t.notEnoughItems}</p>
            ) : outfit.map(piece => (
              <div key={piece.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, backgroundColor: tk.surfaceMuted }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', backgroundColor: tk.surface, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {piece.img ? (
                    <img src={piece.img} alt={piece.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Shirt style={{ width: 20, height: 20, color: tk.iconMuted }} strokeWidth={1.5} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: tk.text, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{piece.name}</p>
                  <p style={{ fontSize: 11, color: tk.textMuted }}>{piece.tipo} · {piece.marca}</p>
                </div>
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {piece.color.map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLOR_SWATCHES[c] ?? '#D1D5DB', border: c === 'Blanco' ? '1px solid #E6DFD7' : 'none' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {navBar}

      {/* Reject reasons sheet */}
      {showReject && (
        <div
          onClick={closeReject}
          style={{
            position: 'absolute', inset: 0, zIndex: 60,
            display: 'flex', alignItems: 'flex-end',
            backgroundColor: rejectVisible ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
            backdropFilter: rejectVisible ? 'blur(4px)' : 'blur(0px)',
            WebkitBackdropFilter: rejectVisible ? 'blur(4px)' : 'blur(0px)',
            transition: 'background-color 0.28s, backdrop-filter 0.28s',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', backgroundColor: tk.surface,
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px',
              transform: rejectVisible ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <div style={{ width: 36, height: 4, backgroundColor: tk.border, borderRadius: 2, margin: '0 auto 20px' }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: tk.text, marginBottom: 4 }}>{t.rejectTitle}</p>
            <p style={{ fontSize: 13, color: tk.textMuted, marginBottom: 16 }}>{t.rejectSubtitle}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REJECT_REASONS_I18N[lang].map(reason => (
                <button
                  key={reason}
                  onClick={closeReject}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 14, backgroundColor: tk.surfaceMuted, border: `1.5px solid ${tk.border}`, textAlign: 'left' as const, fontSize: 14, fontWeight: 500, color: tk.text, cursor: 'pointer' }}
                >
                  {reason}
                </button>
              ))}
              <textarea
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                placeholder={t.tellUsMore}
                rows={2}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  backgroundColor: tk.surfaceMuted, border: `1.5px solid ${tk.border}`,
                  fontSize: 13, resize: 'none' as const, outline: 'none', color: tk.text,
                  fontFamily: 'inherit',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = tk.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = tk.border)}
              />
              <button
                onClick={closeReject}
                style={{ width: '100%', padding: '10px', marginTop: 2, borderRadius: 14, fontSize: 13, fontWeight: 500, color: tk.textMuted, cursor: 'pointer', backgroundColor: 'transparent' }}
              >
                {t.skipBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OutfitsView ──────────────────────────────────────────────────────────────

function OutfitsView({
  items,
  savedOutfits,
  onDeleteOutfit,
  onMoveOutfit,
  onSaveOutfit,
  onNavArmario,
  onNavExplorar,
  onNavProto,
  onAdd,
  openOutfitId,
  onClearOpenOutfit,
}: {
  items: Item[];
  savedOutfits: SavedOutfit[];
  onDeleteOutfit: (id: number) => void;
  onMoveOutfit: (id: number, collection: 'guardados' | 'favoritos') => void;
  onSaveOutfit: (o: SavedOutfit) => void;
  onNavArmario: () => void;
  onNavExplorar: () => void;
  onNavProto: () => void;
  onAdd: () => void;
  openOutfitId?: number | null;
  onClearOpenOutfit?: () => void;
}) {
  const { tk, lang } = useContext(ThemeCtx);
  const t = I18N[lang];
  const [subTab, setSubTab] = useState<'situaciones' | 'guardados'>('situaciones');
  const [savedSubTab, setSavedSubTab] = useState<'guardados' | 'favoritos'>('guardados');
  const [zoomedSavedId, setZoomedSavedId] = useState<number | null>(null);

  useEffect(() => {
    if (openOutfitId != null) {
      setSubTab('guardados');
      const target = savedOutfits.find(o => o.id === openOutfitId);
      if (target) setSavedSubTab(target.collection);
      setZoomedSavedId(openOutfitId);
      onClearOpenOutfit?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOutfitId]);

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: tk.bg }}>
      <div className="pt-[54px]"></div>
      {/* Sticky header */}
      <div className="sticky top-0 z-30 pt-5 px-5" style={{ backgroundColor: tk.bg }}>
        <h1 className="text-[26px] font-bold tracking-tight mb-4" style={{ color: tk.text }}>{t.outfits}</h1>
        <div className="flex border-b" style={{ borderColor: tk.border }}>
          {(['situaciones', 'guardados'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className="flex-1 pb-3 text-[13px] font-medium transition-colors flex flex-col items-center gap-1 pt-1"
              style={{ color: subTab === tab ? tk.text : tk.textMuted, borderBottom: subTab === tab ? `2px solid ${tk.text}` : '2px solid transparent' }}
            >
              {tab === 'situaciones' && <CalendarDays className="w-4 h-4" strokeWidth={1.8} />}
              {tab === 'guardados'   && <Heart className="w-4 h-4" strokeWidth={1.8} />}
              {tab === 'situaciones' ? t.situationsTab : t.savedTab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-5">
        {subTab === 'situaciones' ? (
          <SituationPlannerView items={items} onSaveOutfit={onSaveOutfit} />
        ) : (
          <>
            {/* Inner collection tabs */}
            <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px' }}>
              {(['guardados', 'favoritos'] as const).map(col => (
                <button
                  key={col}
                  onClick={() => setSavedSubTab(col)}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                    backgroundColor: savedSubTab === col ? tk.invertedBg : tk.surfaceMuted,
                    color: savedSubTab === col ? tk.invertedText : tk.textSub,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer',
                  }}
                >
                  {col === 'favoritos' && (
                    <Heart style={{ width: 11, height: 11, color: savedSubTab === col ? tk.invertedText : tk.textSub }} strokeWidth={2} fill={savedSubTab === col ? tk.invertedText : 'none'} />
                  )}
                  {col === 'guardados' ? t.savedTab : t.favoritesTab}
                </button>
              ))}
            </div>
            {/* Grid */}
            {(() => {
              const colItems = savedOutfits.filter(o => o.collection === savedSubTab);
              if (colItems.length === 0) return (
                <div className="flex flex-col items-center justify-center gap-3" style={{ paddingTop: 60 }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: tk.accentSurface }}>
                    {savedSubTab === 'favoritos'
                      ? <Heart className="w-7 h-7" style={{ color: tk.iconMuted }} strokeWidth={1.5} />
                      : <Layers className="w-7 h-7" style={{ color: tk.iconMuted }} strokeWidth={1.5} />}
                  </div>
                  <p className="text-[15px] font-semibold" style={{ color: tk.text }}>
                    {savedSubTab === 'favoritos' ? t.noFavorites : t.noSavedOutfits}
                  </p>
                  <p className="text-[13px] text-center px-8" style={{ color: tk.textMuted }}>
                    {savedSubTab === 'favoritos' ? t.noFavoritesBody : t.noSavedBody}
                  </p>
                </div>
              );
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px' }}>
                  {colItems.slice().reverse().map((outfit) => (
                    <div
                      key={outfit.id}
                      onClick={() => setZoomedSavedId(outfit.id)}
                      style={{ aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', border: `1px solid ${tk.border}`, cursor: 'pointer', position: 'relative' }}
                    >
                      <OutfitCollage pieces={outfit.pieces} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 45%)' }} />
                      <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', textTransform: 'capitalize', lineHeight: 1.3, marginBottom: 1 }}>{outfit.date}</p>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.72)' }}>{outfit.pieces.length} {t.piecesUnit}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onMoveOutfit(outfit.id, outfit.collection === 'favoritos' ? 'guardados' : 'favoritos'); }}
                        style={{
                          position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: outfit.collection === 'favoritos' ? 'rgba(254,226,226,0.95)' : 'rgba(255,255,255,0.85)',
                          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                        }}
                      >
                        <Heart
                          style={{ width: 14, height: 14, color: outfit.collection === 'favoritos' ? '#DC2626' : '#C4B8B0' }}
                          strokeWidth={2}
                          fill={outfit.collection === 'favoritos' ? '#DC2626' : 'none'}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div className="h-[70px] flex items-center justify-around px-4 z-40 border-t shrink-0" style={{ backgroundColor: tk.navBg, borderColor: tk.border }}>
        <button onClick={onNavArmario} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Shirt className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.wardrobe}</span>
        </button>
        <button onClick={onNavExplorar} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Search className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.explore}</span>
        </button>
        <button onClick={onAdd} className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform -mt-5" style={{ backgroundColor: tk.invertedBg }}>
          <Plus className="w-7 h-7" style={{ color: tk.invertedText }} strokeWidth={2.5} />
        </button>
        <button onClick={onNavProto} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Wand2 className="w-6 h-6" style={{ color: tk.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: tk.textSub }}>{t.suggestions}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Layers className="w-6 h-6" style={{ color: tk.text }} strokeWidth={2} />
          <span className="text-[10px] font-semibold" style={{ color: tk.text }}>{t.outfits}</span>
        </button>
      </div>

      {/* ── Saved outfit zoom overlay ── */}
      {(() => {
        const outfit = savedOutfits.find(o => o.id === zoomedSavedId) ?? null;
        const visible = outfit !== null;
        return (
          <div
            onClick={() => setZoomedSavedId(null)}
            style={{
              position: 'absolute', inset: 0, zIndex: 60,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px 20px',
              backgroundColor: visible ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
              backdropFilter: visible ? 'blur(10px)' : 'blur(0px)',
              WebkitBackdropFilter: visible ? 'blur(10px)' : 'blur(0px)',
              pointerEvents: visible ? 'auto' : 'none',
              transition: 'background-color 0.28s, backdrop-filter 0.28s',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                borderRadius: 24,
                overflow: 'hidden',
                backgroundColor: tk.surface,
                boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                transform: visible ? 'scale(1)' : 'scale(0.78)',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s',
              }}
            >
              {outfit && (
                <>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 14px', borderBottom: `1px solid ${tk.borderLight}` }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: tk.text, lineHeight: 1.3 }}>
                        {outfit.collection === 'favoritos' ? t.favOutfit : t.savedOutfit}
                      </p>
                      <p style={{ fontSize: 12, color: tk.textMuted, textTransform: 'capitalize' }}>{outfit.date}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => onMoveOutfit(outfit.id, outfit.collection === 'favoritos' ? 'guardados' : 'favoritos')}
                        style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: outfit.collection === 'favoritos' ? 'rgba(254,226,226,0.95)' : '#F0ECE8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Heart style={{ width: 15, height: 15, color: outfit.collection === 'favoritos' ? '#DC2626' : '#C4B8B0' }} strokeWidth={2} fill={outfit.collection === 'favoritos' ? '#DC2626' : 'none'} />
                      </button>
                      <button
                        onClick={() => { setZoomedSavedId(null); setTimeout(() => onDeleteOutfit(outfit.id), 260); }}
                        style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Trash2 style={{ width: 15, height: 15, color: '#DC2626' }} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => setZoomedSavedId(null)}
                        style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#F0ECE8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <X style={{ width: 15, height: 15, color: '#5D4037' }} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                  {/* Pieces */}
                  <div style={{ padding: '12px 16px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {outfit.pieces.map(piece => (
                      <div key={piece.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, backgroundColor: tk.surfaceMuted }}>
                        <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, backgroundColor: tk.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {piece.img
                            ? <img src={piece.img} alt={piece.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <Shirt style={{ width: 22, height: 22, color: tk.iconMuted }} strokeWidth={1.5} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: tk.text, lineHeight: 1.3 }}>{piece.name}</p>
                          <p style={{ fontSize: 12, color: tk.textMuted }}>{piece.tipo} · {piece.marca}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}

    </div>
  );
}

// ─── Theme tokens ────────────────────────────────────────────────────────────

const LIGHT_TK = {
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F0ECE8',
  border: '#E6DFD7',
  borderLight: '#F0ECE8',
  text: '#1C1C1C',
  textSub: '#6B7280',
  textMuted: '#9CA3AF',
  iconMuted: '#C4B8B0',
  accent: '#5D4037',
  accentSurface: '#F0ECE8',
  accentText: '#7C4F31',
  invertedBg: '#1C1C1C',
  invertedText: '#FFFFFF',
  navBg: '#FFFFFF',
  pillBg: '#E6DFD7',
  pillText: '#1C1C1C',
  pillActiveBg: '#5D4037',
  pillActiveText: '#FFFFFF',
  toggleTrackOff: '#D1CBC4',
  filterActiveBg: '#5D4037',
  filterActiveText: '#FFFFFF',
  filterInactiveBg: '#F5EFE9',
  filterInactiveText: '#5D4037',
  dropdownBg: '#FFFFFF',
  dropdownSelectedBg: '#F5EFE9',
  dropdownSelectedText: '#5D4037',
  destructive: '#DC2626',
  destructiveSurface: '#FEE2E2',
  featureBg: '#5D4037',
  featureText: '#FFFFFF',
  featureSubText: 'rgba(255,255,255,0.65)',
  featureIconBg: 'rgba(255,255,255,0.15)',
  featureIconColor: '#FFFFFF',
};
const DARK_TK = {
  bg: '#1A1410',
  surface: '#261E17',
  surfaceMuted: '#32261E',
  border: '#4A3728',
  borderLight: '#3D2E22',
  text: '#EDE0D0',
  textSub: '#B09880',
  textMuted: '#7A6455',
  iconMuted: '#5C4A3A',
  accent: '#5D4037',
  accentSurface: '#F0ECE8',
  accentText: '#EDE0D0',
  invertedBg: '#EDE0D0',
  invertedText: '#1A1410',
  navBg: '#211812',
  pillBg: '#32261E',
  pillText: '#EDE0D0',
  pillActiveBg: '#5D4037',
  pillActiveText: '#FFFFFF',
  toggleTrackOff: '#4A3728',
  filterActiveBg: '#F5EFE9',
  filterActiveText: '#5D4037',
  filterInactiveBg: '#32261E',
  filterInactiveText: '#EDE0D0',
  dropdownBg: '#261E17',
  dropdownSelectedBg: '#F5EFE9',
  dropdownSelectedText: '#5D4037',
  destructive: '#F87171',
  destructiveSurface: '#3A1818',
  featureBg: '#F0ECE8',
  featureText: '#5D4037',
  featureSubText: 'rgba(93,64,55,0.9)',
  featureIconBg: '#5D4037',
  featureIconColor: '#FFFFFF',
};
type TK = typeof LIGHT_TK;
type Lang = 'es' | 'en';
const ThemeCtx = createContext<{ tk: TK; lang: Lang }>({ tk: LIGHT_TK, lang: 'es' });

// ─── i18n ─────────────────────────────────────────────────────────────────────

const I18N = {
  es: {
    wardrobeTitle: 'Mi Armario', explore: 'Explorar', suggestions: 'Sugerencias',
    outfits: 'Outfits', wardrobe: 'Armario', settingsTitle: 'Ajustes',
    notifsTitle: 'Notificaciones', allSettings: 'Todos los ajustes',
    darkMode: 'Tema oscuro', pushNotifs: 'Notificaciones push',
    language: 'Idioma', currency: 'Moneda', preferences: 'Preferencias',
    region: 'Región', account: 'Cuenta', profile: 'Perfil', privacy: 'Privacidad',
    security: 'Seguridad', support: 'Ayuda y soporte', helpCenter: 'Centro de ayuda',
    reportProblem: 'Reportar un problema', rateApp: 'Valorar la app',
    about: 'Acerca de', version: 'Versión', terms: 'Términos de uso',
    privacyPolicy: 'Política de privacidad', logout: 'Cerrar sesión',
    markAllRead: 'Marcar todo leído', noItems: 'Sin prendas con estos filtros',
    cancel: 'Cancelar', sponsoredItems: 'Prendas patrocinadas para tu estilo',
    currencyValue: 'EUR (€)', spanish: 'Español', english: 'English',
    appVersion: '1.0.0 (build 42)',
    // SugerenciasView
    suggestionsTitle: 'Sugerencias', outfitLabel: 'Outfit', outfitOf: 'de',
    seenOutfits: 'outfits vistos', seeItems: 'Ver prendas',
    allSeenToday: '¡Todo visto por hoy!',
    allSeenBody: 'Has revisado los 5 outfits del día. Vuelve mañana para nuevas combinaciones.',
    itemsOfOutfit: 'Prendas del outfit', notEnoughItems: 'Sin prendas suficientes',
    rejectTitle: '¿Por qué no te gusta?',
    rejectSubtitle: 'Tu feedback mejora las próximas sugerencias',
    skipBtn: 'Saltar', tellUsMore: 'Cuéntanos más (opcional)...',
    // OutfitsView
    situationsTab: 'Situaciones', savedTab: 'Guardados', favoritesTab: 'Favoritos',
    noSavedOutfits: 'Sin outfits guardados', noFavorites: 'Sin favoritos',
    noSavedBody: 'Acepta un outfit en Sugerencias para guardarlo aquí',
    noFavoritesBody: 'Pulsa el corazón en Sugerencias para añadir favoritos',
    favOutfit: 'Outfit favorito', savedOutfit: 'Outfit guardado', piecesUnit: 'prendas',
    // ExploreView
    sponsored: 'Patrocinado',
    // SituationPlannerView
    whichSituation: '¿Cuál es la situación?',
    whichSituationSub: 'Selecciona y genera looks adaptados a tu ocasión',
    generateOutfitLabel: 'Generar outfit',
    generateOutfitDesc: 'Crea un look al instante con tus prendas',
    changeSituation: 'Cambiar situación', newSituation: 'Nueva situación',
    configureDetails: 'Configura los detalles',
    describeOccasion: 'Describe la situación',
    describeOccasionSub: 'Cuéntanos el contexto para afinar la propuesta',
    describeOccasionPlaceholder: 'Ej: cena de negocios en restaurante elegante, reunión informal con amigos en terraza…',
    howManyDays: '¿Cuántos días?', maxDays: 'Máximo 7 días',
    occasionType: 'Tipo de ocasión', generatePlan: 'Generar plan',
    savePlan: 'Guardar plan', planSaved: 'Plan guardado', regenerate: 'Regenerar',
    proposalsFromWardrobe: 'Propuestas de tu armario', planOf: 'Plan:',
    lookOfDay: 'Look del día', day: 'Día',
    // Notifications settings
    notifCustomize: 'Personalizar notificaciones', notifTypes: 'Tipos',
    notifOutfitSuggestions: 'Sugerencias de outfit',
    notifOutfitSuggestionsDesc: 'Recibe outfits nuevos cada día',
    notifWardrobeActivity: 'Actividad del armario',
    notifWardrobeActivityDesc: 'Prendas sin usar, actualizaciones',
    notifStoreNews: 'Novedades de tiendas',
    notifStoreNewsDesc: 'Nuevas colecciones y ofertas',
    notifReminders: 'Recordatorios', notifRemindersDesc: 'Prendas sin usar hace tiempo',
    notifFrequency: 'Frecuencia', freqImmediate: 'Inmediata', freqDaily: 'Resumen diario',
    freqWeekly: 'Resumen semanal', freqNever: 'Nunca',
    quietHours: 'Horas silenciosas', quietHoursDesc: 'Sin notificaciones de 22:00 a 8:00',
  },
  en: {
    wardrobeTitle: 'My Wardrobe', explore: 'Explore', suggestions: 'Suggestions',
    outfits: 'Outfits', wardrobe: 'Wardrobe', settingsTitle: 'Settings',
    notifsTitle: 'Notifications', allSettings: 'All settings',
    darkMode: 'Dark mode', pushNotifs: 'Push notifications',
    language: 'Language', currency: 'Currency', preferences: 'Preferences',
    region: 'Region', account: 'Account', profile: 'Profile', privacy: 'Privacy',
    security: 'Security', support: 'Help & Support', helpCenter: 'Help center',
    reportProblem: 'Report a problem', rateApp: 'Rate the app',
    about: 'About', version: 'Version', terms: 'Terms of use',
    privacyPolicy: 'Privacy policy', logout: 'Log out',
    markAllRead: 'Mark all as read', noItems: 'No items with these filters',
    cancel: 'Cancel', sponsoredItems: 'Sponsored items for your style',
    currencyValue: 'EUR (€)', spanish: 'Español', english: 'English',
    appVersion: '1.0.0 (build 42)',
    // SugerenciasView
    suggestionsTitle: 'Suggestions', outfitLabel: 'Outfit', outfitOf: 'of',
    seenOutfits: 'outfits seen', seeItems: 'See items',
    allSeenToday: 'All done for today!',
    allSeenBody: "You've reviewed today's 5 outfits. Come back tomorrow for new ideas.",
    itemsOfOutfit: 'Outfit items', notEnoughItems: 'Not enough items',
    rejectTitle: "Why don't you like it?",
    rejectSubtitle: 'Your feedback improves future suggestions',
    skipBtn: 'Skip', tellUsMore: 'Tell us more (optional)...',
    // OutfitsView
    situationsTab: 'Situations', savedTab: 'Saved', favoritesTab: 'Favorites',
    noSavedOutfits: 'No saved outfits', noFavorites: 'No favorites',
    noSavedBody: 'Accept an outfit in Suggestions to save it here',
    noFavoritesBody: 'Tap the heart in Suggestions to add favorites',
    favOutfit: 'Favorite outfit', savedOutfit: 'Saved outfit', piecesUnit: 'items',
    // ExploreView
    sponsored: 'Sponsored',
    // SituationPlannerView
    whichSituation: "What's the situation?",
    whichSituationSub: 'Select and generate looks adapted to your occasion',
    generateOutfitLabel: 'Generate outfit',
    generateOutfitDesc: 'Create a look instantly with your items',
    changeSituation: 'Change situation', newSituation: 'New situation',
    configureDetails: 'Configure details',
    describeOccasion: 'Describe the situation',
    describeOccasionSub: 'Tell us the context to refine the suggestion',
    describeOccasionPlaceholder: 'E.g. business dinner at elegant restaurant, casual gathering on a terrace…',
    howManyDays: 'How many days?', maxDays: 'Maximum 7 days',
    occasionType: 'Occasion type', generatePlan: 'Generate plan',
    savePlan: 'Save plan', planSaved: 'Plan saved', regenerate: 'Regenerate',
    proposalsFromWardrobe: 'Proposals from your wardrobe', planOf: 'Plan:',
    lookOfDay: 'Look of the day', day: 'Day',
    // Notifications settings
    notifCustomize: 'Customize notifications', notifTypes: 'Types',
    notifOutfitSuggestions: 'Outfit suggestions',
    notifOutfitSuggestionsDesc: 'Receive new outfits every day',
    notifWardrobeActivity: 'Wardrobe activity',
    notifWardrobeActivityDesc: 'Unused items, updates',
    notifStoreNews: 'Store news',
    notifStoreNewsDesc: 'New collections and deals',
    notifReminders: 'Reminders', notifRemindersDesc: 'Items unused for a long time',
    notifFrequency: 'Frequency', freqImmediate: 'Immediate', freqDaily: 'Daily digest',
    freqWeekly: 'Weekly digest', freqNever: 'Never',
    quietHours: 'Quiet hours', quietHoursDesc: 'No notifications from 10 PM to 8 AM',
  },
} as const;

// ─── Notifications & Settings data ───────────────────────────────────────────

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: 'outfit',    title: 'Nuevo outfit sugerido',  body: 'Tienes 3 combinaciones nuevas para hoy',         time: 'hace 5 min',   unread: true  },
  { id: 2, icon: 'wardrobe',  title: 'Armario actualizado',    body: 'Tu armario ya cuenta con 30 prendas',            time: 'hace 2 h',     unread: true  },
  { id: 3, icon: 'store',     title: 'Nueva colección Zara',   body: 'Descubre las novedades de temporada',            time: 'ayer',         unread: false },
  { id: 4, icon: 'reminder',  title: 'Prendas sin usar',       body: '3 prendas llevan más de 30 días sin uso',        time: 'hace 3 días',  unread: false },
];
type NotifItem = typeof INITIAL_NOTIFICATIONS[number];

// ─── SettingsPanel ────────────────────────────────────────────────────────────

function SettingsPanel({
  open, anchorRect, onClose, darkMode, onToggleDark, pushNotifs, onTogglePush, lang, onSetLang, onOpenAllSettings,
}: {
  open: boolean; anchorRect: DOMRect | null; onClose: () => void;
  darkMode: boolean; onToggleDark: () => void;
  pushNotifs: boolean; onTogglePush: () => void;
  lang: Lang; onSetLang: (l: Lang) => void;
  onOpenAllSettings: () => void;
}) {
  const { tk } = useContext(ThemeCtx);
  const t = I18N[lang];
  const panelRef = useRef<HTMLDivElement>(null);
  const screen = typeof document !== 'undefined' ? document.getElementById('phone-screen') : null;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open || !screen || !anchorRect) return null;
  const screenRect = screen.getBoundingClientRect();
  const top = anchorRect.bottom - screenRect.top + 6;
  const right = screenRect.right - anchorRect.right;

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0"
      style={{ backgroundColor: value ? tk.invertedBg : tk.toggleTrackOff }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: value ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  );

  return createPortal(
    <div
      ref={panelRef}
      className="absolute rounded-[16px] shadow-xl border z-[9999] overflow-hidden"
      style={{ top, right, width: 248, backgroundColor: tk.surface, borderColor: tk.border }}
    >
      {/* Preferencias */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: tk.textMuted }}>{t.preferences}</p>
        {/* Dark mode */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5">
            <Moon className="w-[15px] h-[15px]" style={{ color: tk.text }} strokeWidth={1.8} />
            <span className="text-[13px]" style={{ color: tk.text }}>{t.darkMode}</span>
          </div>
          <Toggle value={darkMode} onToggle={onToggleDark} />
        </div>
        {/* Push notifications */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5">
            <Bell className="w-[15px] h-[15px]" style={{ color: tk.text }} strokeWidth={1.8} />
            <span className="text-[13px]" style={{ color: tk.text }}>{t.pushNotifs}</span>
          </div>
          <Toggle value={pushNotifs} onToggle={onTogglePush} />
        </div>
      </div>

      <div className="h-px mx-4" style={{ backgroundColor: tk.borderLight }} />

      {/* Language */}
      <div className="px-4 pt-2 pb-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: tk.textMuted }}>{t.language}</p>
        <div className="flex gap-2">
          {(['es', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => onSetLang(l)}
              className="flex-1 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95"
              style={{ backgroundColor: lang === l ? tk.invertedBg : tk.pillBg, color: lang === l ? tk.invertedText : tk.textSub }}
            >
              {l === 'es' ? `🇪🇸 ${t.spanish}` : `🇬🇧 ${t.english}`}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px" style={{ backgroundColor: tk.borderLight }} />

      {/* All settings */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 active:opacity-70 transition-opacity"
        onClick={() => { onClose(); onOpenAllSettings(); }}
      >
        <span className="text-[13px] font-semibold" style={{ color: tk.text }}>{t.allSettings}</span>
        <ChevronRight className="w-[15px] h-[15px]" style={{ color: tk.textMuted }} strokeWidth={2} />
      </button>
    </div>,
    screen
  );
}

// ─── NotificationsPanel ───────────────────────────────────────────────────────

function NotificationsPanel({
  open, anchorRect, onClose, notifications, onMarkAllRead,
}: {
  open: boolean; anchorRect: DOMRect | null; onClose: () => void;
  notifications: NotifItem[]; onMarkAllRead: () => void;
}) {
  const { tk, lang } = useContext(ThemeCtx);
  const t = I18N[lang];
  const panelRef = useRef<HTMLDivElement>(null);
  const screen = typeof document !== 'undefined' ? document.getElementById('phone-screen') : null;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open || !screen || !anchorRect) return null;
  const screenRect = screen.getBoundingClientRect();
  const top = anchorRect.bottom - screenRect.top + 6;
  const right = screenRect.right - anchorRect.right;

  return createPortal(
    <div
      ref={panelRef}
      className="absolute rounded-[16px] shadow-xl border z-[9999] overflow-hidden"
      style={{ top, right, width: 270, backgroundColor: tk.surface, borderColor: tk.border }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b" style={{ borderColor: tk.borderLight }}>
        <p className="text-[14px] font-semibold" style={{ color: tk.text }}>{t.notifsTitle}</p>
        {notifications.some(n => n.unread) && (
          <button onClick={onMarkAllRead} className="text-[11px] font-medium active:opacity-60" style={{ color: tk.accentText }}>
            {t.markAllRead}
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: 310 }}>
        {notifications.map((n, i) => (
          <div
            key={n.id}
            className="flex items-start gap-3 px-4 py-3"
            style={{ borderBottom: i < notifications.length - 1 ? `1px solid ${tk.borderLight}` : 'none', backgroundColor: n.unread ? tk.surfaceMuted : tk.surface }}
          >
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5"
              style={{ backgroundColor: n.unread ? tk.accentSurface : tk.pillBg, boxShadow: n.unread ? `0 0 0 1.5px ${tk.accent}50` : 'none' }}
            >
              {n.icon === 'outfit'   && <Sparkles     className="w-[15px] h-[15px]" style={{ color: tk.accent }} strokeWidth={1.8} />}
              {n.icon === 'wardrobe' && <Shirt         className="w-[15px] h-[15px]" style={{ color: tk.accent }} strokeWidth={1.8} />}
              {n.icon === 'store'    && <ShoppingBag   className="w-[15px] h-[15px]" style={{ color: tk.accent }} strokeWidth={1.8} />}
              {n.icon === 'reminder' && <CalendarDays  className="w-[15px] h-[15px]" style={{ color: tk.accent }} strokeWidth={1.8} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-semibold leading-tight" style={{ color: tk.text }}>{n.title}</p>
                {n.unread && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tk.accent }} />}
              </div>
              <p className="text-[11px] mt-0.5 leading-snug" style={{ color: tk.textSub }}>{n.body}</p>
              <p className="text-[10px] mt-1" style={{ color: tk.textMuted }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,
    screen
  );
}

// ─── AllSettingsView ──────────────────────────────────────────────────────────

function AllSettingsView({
  open, onClose, darkMode, onToggleDark, pushNotifs, onTogglePush, lang, onSetLang,
}: {
  open: boolean; onClose: () => void;
  darkMode: boolean; onToggleDark: () => void;
  pushNotifs: boolean; onTogglePush: () => void;
  lang: Lang; onSetLang: (l: Lang) => void;
}) {
  const { tk } = useContext(ThemeCtx);
  const t = I18N[lang];
  const [notifSettingsOpen, setNotifSettingsOpen] = useState(false);
  const [notifOutfits, setNotifOutfits] = useState(true);
  const [notifWardrobe, setNotifWardrobe] = useState(true);
  const [notifStore, setNotifStore] = useState(false);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifFreq, setNotifFreq] = useState<'immediate' | 'daily' | 'weekly' | 'never'>('immediate');
  const [quietHours, setQuietHours] = useState(true);

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0"
      style={{ backgroundColor: value ? tk.invertedBg : tk.toggleTrackOff }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: value ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  );

  const Section = ({ title }: { title: string }) => (
    <p className="px-5 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: tk.textMuted }}>{title}</p>
  );

  const Row = ({ icon, label, right, last, danger }: { icon: React.ReactNode; label: string; right?: React.ReactNode; last?: boolean; danger?: boolean }) => (
    <div className="flex items-center justify-between px-4 py-3.5"
      style={{ borderBottom: last ? 'none' : `1px solid ${tk.borderLight}` }}>
      <div className="flex items-center gap-3">
        <span style={{ color: danger ? '#EF4444' : tk.textSub }}>{icon}</span>
        <span className="text-[14px]" style={{ color: danger ? '#EF4444' : tk.text }}>{label}</span>
      </div>
      {right ?? <ChevronRight className="w-4 h-4" style={{ color: tk.textMuted }} strokeWidth={1.8} />}
    </div>
  );

  const screen = typeof document !== 'undefined' ? document.getElementById('phone-screen') : null;
  if (!screen) return null;

  return createPortal(
    <div
      className="absolute inset-0 z-[9990] flex flex-col"
      style={{
        backgroundColor: tk.bg,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <div className="pt-[54px]" />
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b shrink-0" style={{ borderColor: tk.border, backgroundColor: tk.bg }}>
        <h1 className="text-[20px] font-bold" style={{ color: tk.text }}>{t.settingsTitle}</h1>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center active:opacity-60 transition-opacity" style={{ backgroundColor: tk.pillBg }}>
          <X className="w-4 h-4" style={{ color: tk.textSub }} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-8">

        {/* Preferencias */}
        <Section title={t.preferences} />
        <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
          <Row icon={<Moon className="w-4 h-4" strokeWidth={1.8} />} label={t.darkMode} right={<Toggle value={darkMode} onToggle={onToggleDark} />} />
          <Row icon={<Bell className="w-4 h-4" strokeWidth={1.8} />} label={t.pushNotifs} right={<Toggle value={pushNotifs} onToggle={onTogglePush} />} last />
        </div>

        {/* Notificaciones */}
        <Section title={t.notifsTitle} />
        <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-60 transition-opacity"
            onClick={() => setNotifSettingsOpen(true)}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" style={{ color: tk.textSub }} strokeWidth={1.8} />
              <span className="text-[14px]" style={{ color: tk.text }}>{t.notifCustomize}</span>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: tk.textMuted }} strokeWidth={1.8} />
          </button>
        </div>

        {/* Idioma */}
        <Section title={t.language} />
        <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
          <Row
            icon={<Globe className="w-4 h-4" strokeWidth={1.8} />}
            label={t.language}
            last
            right={
              <div className="flex gap-1.5">
                {(['es', 'en'] as const).map(l => (
                  <button key={l} onClick={() => onSetLang(l)}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95"
                    style={{ backgroundColor: lang === l ? tk.invertedBg : tk.pillBg, color: lang === l ? tk.invertedText : tk.textSub }}
                  >
                    {l === 'es' ? 'ES' : 'EN'}
                  </button>
                ))}
              </div>
            }
          />
        </div>

        {/* Región */}
        <Section title={t.region} />
        <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
          <Row icon={<Globe className="w-4 h-4" strokeWidth={1.8} />} label={t.language}
            right={<span className="text-[13px]" style={{ color: tk.textSub }}>{lang === 'es' ? t.spanish : t.english}</span>} />
          <Row icon={<FileText className="w-4 h-4" strokeWidth={1.8} />} label={t.currency} last
            right={<span className="text-[13px]" style={{ color: tk.textSub }}>{t.currencyValue}</span>} />
        </div>

        {/* Cuenta */}
        <Section title={t.account} />
        <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
          <Row icon={<User className="w-4 h-4" strokeWidth={1.8} />} label={t.profile} />
          <Row icon={<Shield className="w-4 h-4" strokeWidth={1.8} />} label={t.privacy} />
          <Row icon={<Settings className="w-4 h-4" strokeWidth={1.8} />} label={t.security} last />
        </div>

        {/* Soporte */}
        <Section title={t.support} />
        <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
          <Row icon={<HelpCircle className="w-4 h-4" strokeWidth={1.8} />} label={t.helpCenter} />
          <Row icon={<Star className="w-4 h-4" strokeWidth={1.8} />} label={t.rateApp} />
          <Row icon={<FileText className="w-4 h-4" strokeWidth={1.8} />} label={t.reportProblem} last />
        </div>

        {/* Acerca de */}
        <Section title={t.about} />
        <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
          <Row icon={<FileText className="w-4 h-4" strokeWidth={1.8} />} label={t.terms} />
          <Row icon={<Shield className="w-4 h-4" strokeWidth={1.8} />} label={t.privacyPolicy} />
          <Row icon={<Star className="w-4 h-4" strokeWidth={1.8} />} label={t.version} last
            right={<span className="text-[13px]" style={{ color: tk.textMuted }}>{t.appVersion}</span>} />
        </div>

        {/* Logout */}
        <div className="mx-4 mt-5 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
          <Row icon={<LogOut className="w-4 h-4" strokeWidth={1.8} />} label={t.logout} last danger right={null} />
        </div>
      </div>

      {/* ── Notification settings sub-panel ── */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          backgroundColor: tk.bg,
          transform: notifSettingsOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)',
          zIndex: 10,
        }}
      >
        <div className="pt-[54px]" />
        <div className="px-5 pt-4 pb-3 flex items-center gap-3 border-b shrink-0" style={{ borderColor: tk.border, backgroundColor: tk.bg }}>
          <button onClick={() => setNotifSettingsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:opacity-60 transition-opacity" style={{ backgroundColor: tk.pillBg }}>
            <ChevronLeft className="w-4 h-4" style={{ color: tk.textSub }} strokeWidth={2} />
          </button>
          <h2 className="text-[18px] font-bold" style={{ color: tk.text }}>{t.notifCustomize}</h2>
        </div>
        <div className="flex-1 overflow-y-auto pb-8">
          {/* Types */}
          <Section title={t.notifTypes} />
          <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
            {([
              [<Sparkles className="w-4 h-4" strokeWidth={1.8} />, t.notifOutfitSuggestions, t.notifOutfitSuggestionsDesc, notifOutfits, () => setNotifOutfits(v => !v)],
              [<Shirt className="w-4 h-4" strokeWidth={1.8} />, t.notifWardrobeActivity, t.notifWardrobeActivityDesc, notifWardrobe, () => setNotifWardrobe(v => !v)],
              [<ShoppingBag className="w-4 h-4" strokeWidth={1.8} />, t.notifStoreNews, t.notifStoreNewsDesc, notifStore, () => setNotifStore(v => !v)],
              [<CalendarDays className="w-4 h-4" strokeWidth={1.8} />, t.notifReminders, t.notifRemindersDesc, notifReminders, () => setNotifReminders(v => !v)],
            ] as [React.ReactNode, string, string, boolean, () => void][]).map(([icon, label, desc, val, setter], i, arr) => (
              <div key={String(label)} className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? `1px solid ${tk.borderLight}` : 'none' }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span style={{ color: tk.textSub }}>{icon}</span>
                  <div className="min-w-0">
                    <p className="text-[14px]" style={{ color: tk.text }}>{label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: tk.textMuted }}>{desc}</p>
                  </div>
                </div>
                <Toggle value={val} onToggle={setter} />
              </div>
            ))}
          </div>

          {/* Frequency */}
          <Section title={t.notifFrequency} />
          <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
            <div className="p-4 flex flex-col gap-2">
              {(['immediate', 'daily', 'weekly', 'never'] as const).map(val => (
                <button
                  key={val}
                  onClick={() => setNotifFreq(val)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl active:scale-[0.98] transition-all"
                  style={{ backgroundColor: notifFreq === val ? tk.accentSurface : tk.surfaceMuted }}
                >
                  <span className="text-[13px] font-medium" style={{ color: notifFreq === val ? tk.accent : tk.text }}>
                    {val === 'immediate' ? t.freqImmediate : val === 'daily' ? t.freqDaily : val === 'weekly' ? t.freqWeekly : t.freqNever}
                  </span>
                  {notifFreq === val && <Check className="w-4 h-4" style={{ color: tk.accent }} strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          </div>

          {/* Quiet hours */}
          <Section title={t.quietHours} />
          <div className="mx-4 rounded-2xl overflow-hidden border" style={{ backgroundColor: tk.surface, borderColor: tk.border }}>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Moon className="w-4 h-4 shrink-0" style={{ color: tk.textSub }} strokeWidth={1.8} />
                <div>
                  <p className="text-[14px]" style={{ color: tk.text }}>{t.quietHours}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: tk.textMuted }}>{t.quietHoursDesc}</p>
                </div>
              </div>
              <Toggle value={quietHours} onToggle={() => setQuietHours(v => !v)} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    screen
  );
}

export function Wardrobe() {
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [items, setItems] = useState(ITEMS);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState<Record<FilterKey, string[]>>({
    tipo: [], color: [], ocasion: [], marca: [],
  });
  const [addFlowOpen, setAddFlowOpen] = useState(false);
  const [pickOpen, setPickOpen] = useState(false);
  const [pickVisible, setPickVisible] = useState(false);
  const [flowImg, setFlowImg] = useState('');
  const pickCameraRef = useRef<HTMLInputElement>(null);
  const pickGalleryRef = useRef<HTMLInputElement>(null);
  const [addToast, setAddToast] = useState(false);
  const addToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deleteToast, setDeleteToast] = useState(false);
  const deleteToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [navTab, setNavTab] = useState<'armario' | 'explorar' | 'pronto' | 'outfits'>('armario');
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [openOutfitId, setOpenOutfitId] = useState<number | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const detailCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Notifications & Settings state ──
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [lang, setLang] = useState<Lang>('es');
  const [allSettingsOpen, setAllSettingsOpen] = useState(false);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const [notifBtnRect, setNotifBtnRect] = useState<DOMRect | null>(null);
  const [settingsBtnRect, setSettingsBtnRect] = useState<DOMRect | null>(null);

  const openDetail = (item: Item) => {
    setSelectedItem(item);
    requestAnimationFrame(() => requestAnimationFrame(() => setDetailVisible(true)));
  };

  const closeDetail = () => {
    setDetailVisible(false);
    if (detailCloseTimer.current) clearTimeout(detailCloseTimer.current);
    detailCloseTimer.current = setTimeout(() => setSelectedItem(null), 380);
  };

  const handleSaveOutfit = (outfit: SavedOutfit) => setSavedOutfits((prev) => [...prev, outfit]);
  const handleDeleteOutfit = (id: number) => setSavedOutfits((prev) => prev.filter(o => o.id !== id));
  const handleMoveOutfit = (id: number, collection: 'guardados' | 'favoritos') =>
    setSavedOutfits(prev => prev.map(o => o.id === id ? { ...o, collection } : o));
  const handleOpenOutfit = (id: number) => {
    closeDetail();
    setTimeout(() => { setNavTab('outfits'); setOpenOutfitId(id); }, 390);
  };

  const openPick = () => { setPickOpen(true); requestAnimationFrame(() => requestAnimationFrame(() => setPickVisible(true))); };
  const closePick = () => { setPickVisible(false); setTimeout(() => setPickOpen(false), 300); };

  const handlePickCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFlowImg(ev.target?.result as string);
      setPickOpen(false);
      setAddFlowOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    return () => {
      if (addToastTimer.current) clearTimeout(addToastTimer.current);
      if (deleteToastTimer.current) clearTimeout(deleteToastTimer.current);
      if (detailCloseTimer.current) clearTimeout(detailCloseTimer.current);
    };
  }, []);

  const handleAdd = (newItem: Omit<Item, 'id'>) => {
    setItems((prev) => [...prev, { ...newItem, id: Math.max(...prev.map((i) => i.id)) + 1 }]);
    setAddFlowOpen(false);
    if (addToastTimer.current) clearTimeout(addToastTimer.current);
    setAddToast(true);
    addToastTimer.current = setTimeout(() => setAddToast(false), 3000);
  };

  const handleUpdate = (updated: Item) => {
    setItems((prev) => prev.map((it) => it.id === updated.id ? updated : it));
    setSelectedItem(updated);
  };

  const handleDelete = (id: number) => {
    closeDetail();
    if (deleteToastTimer.current) clearTimeout(deleteToastTimer.current);
    setDeleteToast(true);
    deleteToastTimer.current = setTimeout(() => setDeleteToast(false), 3000);
    // Remove after slide-out finishes
    setTimeout(() => setItems((prev) => prev.filter((it) => it.id !== id)), 380);
  };

  const setFilter = (key: FilterKey) => (values: string[]) =>
    setFilters((prev) => ({ ...prev, [key]: values }));

  const filtered = items.filter((item) =>
    (filters.tipo.length    === 0 || filters.tipo.includes(item.tipo))                          &&
    (filters.color.length   === 0 || filters.color.some((fc) => item.color.includes(fc)))      &&
    (filters.ocasion.length === 0 || filters.ocasion.some((fo) => item.ocasion.includes(fo)))  &&
    (filters.marca.length   === 0 || filters.marca.includes(item.marca))
  );

  return (
    <ThemeCtx.Provider value={{ tk: darkMode ? DARK_TK : LIGHT_TK, lang }}>
    <div className="relative w-full h-full">
    <div style={{ display: navTab === 'outfits' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
      <OutfitsView items={items} savedOutfits={savedOutfits} onDeleteOutfit={handleDeleteOutfit} onMoveOutfit={handleMoveOutfit} onSaveOutfit={handleSaveOutfit} onNavArmario={() => setNavTab('armario')} onNavExplorar={() => setNavTab('explorar')} onNavProto={() => setNavTab('pronto')} onAdd={openPick} openOutfitId={openOutfitId} onClearOpenOutfit={() => setOpenOutfitId(null)} />
    </div>
    <div style={{ display: navTab === 'explorar' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
      <ExploreView onNavArmario={() => setNavTab('armario')} onNavOutfits={() => setNavTab('outfits')} onNavProto={() => setNavTab('pronto')} onAdd={openPick} />
    </div>
    <div style={{ display: navTab === 'pronto' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
      <SugerenciasView items={items} onSaveOutfit={handleSaveOutfit} onDeleteOutfit={handleDeleteOutfit} onMoveOutfit={handleMoveOutfit} onNavArmario={() => setNavTab('armario')} onNavExplorar={() => setNavTab('explorar')} onNavOutfits={() => setNavTab('outfits')} onAdd={openPick} />
    </div>
    <div className="flex flex-col h-full relative" style={{ backgroundColor: darkMode ? DARK_TK.bg : LIGHT_TK.bg, display: navTab === 'armario' ? 'flex' : 'none' }}>

      {/* ── Sticky header ── */}
      <div className="pt-[54px]"></div>
      <div className="sticky top-0 z-30 pt-5 pb-3 px-5" style={{ backgroundColor: darkMode ? DARK_TK.bg : LIGHT_TK.bg }}>
        <div className="mb-4">
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: darkMode ? DARK_TK.text : LIGHT_TK.text }}>
            {I18N[lang].wardrobeTitle}
          </h1>
        </div>

        {/* Dropdown filters */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
            <FilterDropdown
              key={key}
              filterKey={key}
              values={filters[key]}
              onChange={setFilter(key)}
              openKey={openKey}
              setOpenKey={setOpenKey}
            />
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {filtered.length === 0 && (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 gap-2">
              <Shirt className="w-10 h-10" style={{ color: darkMode ? DARK_TK.iconMuted : LIGHT_TK.iconMuted }} strokeWidth={1.5} />
              <p className="text-[13px]" style={{ color: darkMode ? DARK_TK.textSub : LIGHT_TK.textSub }}>{I18N[lang].noItems}</p>
            </div>
          )}
          {(() => {
            const cells: React.ReactNode[] = [];
            filtered.forEach((item, i) => {
              cells.push(
                <div
                  key={item.id}
                  onClick={() => openDetail(item)}
                  className="rounded-lg overflow-hidden active:scale-[0.97] transition-transform cursor-pointer"
                >
                  <div className="w-full aspect-[3/4] relative overflow-hidden" style={{ backgroundColor: darkMode ? DARK_TK.surfaceMuted : LIGHT_TK.surfaceMuted }}>
                    {item.img ? (
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Shirt className="w-10 h-10" style={{ color: darkMode ? DARK_TK.iconMuted : LIGHT_TK.iconMuted }} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                </div>
              );
              // Inject a sponsored card after every 5 items
              if ((i + 1) % 5 === 0) {
                const sp = SPONSORED_ITEMS[(Math.floor(i / 5)) % SPONSORED_ITEMS.length];
                const spMeta = BRAND_META[sp.brand];
                cells.push(
                  <button
                    key={`sp-${i}`}
                    onClick={() => window.open(BRAND_URLS[sp.brand] ?? '#', '_blank', 'noopener,noreferrer')}
                    className="rounded-lg overflow-hidden active:scale-[0.97] transition-transform text-left flex flex-col"
                    style={{ border: '3px solid #7C4F31', boxShadow: '0 0 0 1px rgba(124,79,49,0.15)', aspectRatio: '3/4' }}
                  >
                    {/* Brand strip */}
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1.5 shrink-0"
                      style={{ backgroundColor: '#7C4F31' }}
                    >
                      <img
                        src={spMeta?.logo}
                        alt={sp.brand}
                        className="w-4 h-4 object-contain rounded-sm"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="text-[10px] font-bold text-white truncate">{sp.brand}</span>
                      <span className="ml-auto text-[9px] font-medium text-white/70">Publicidad</span>
                    </div>
                    <div className="relative flex-1 bg-[#F0ECE8]">
                      <img src={sp.img} alt={sp.name} className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span
                        className="absolute top-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#92400E' }}
                      >
                        Patrocinado
                      </span>
                    </div>
                  </button>
                );
              }
            });
            return cells;
          })()}
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <div
        className="h-[70px] flex items-center justify-around px-4 z-40 border-t shrink-0"
        style={{ backgroundColor: darkMode ? DARK_TK.navBg : LIGHT_TK.navBg, borderColor: darkMode ? DARK_TK.border : LIGHT_TK.border }}
      >
        {/* Armario (active) */}
        <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Shirt className="w-6 h-6" style={{ color: darkMode ? DARK_TK.text : LIGHT_TK.text }} strokeWidth={2} />
          <span className="text-[10px] font-semibold" style={{ color: darkMode ? DARK_TK.text : LIGHT_TK.text }}>{I18N[lang].wardrobe}</span>
        </button>

        {/* Explorar */}
        <button onClick={() => setNavTab('explorar')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Search className="w-6 h-6" style={{ color: darkMode ? DARK_TK.textSub : LIGHT_TK.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: darkMode ? DARK_TK.textSub : LIGHT_TK.textSub }}>{I18N[lang].explore}</span>
        </button>

        {/* Add (floating) */}
        <button
          onClick={openPick}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform -mt-5"
          style={{ backgroundColor: darkMode ? DARK_TK.invertedBg : LIGHT_TK.invertedBg }}
        >
          <Plus className="w-7 h-7" style={{ color: darkMode ? DARK_TK.invertedText : LIGHT_TK.invertedText }} strokeWidth={2.5} />
        </button>

        {/* Sugerencias */}
        <button onClick={() => setNavTab('pronto')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Wand2 className="w-6 h-6" style={{ color: darkMode ? DARK_TK.textSub : LIGHT_TK.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: darkMode ? DARK_TK.textSub : LIGHT_TK.textSub }}>{I18N[lang].suggestions}</span>
        </button>

        {/* Outfits */}
        <button onClick={() => setNavTab('outfits')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Layers className="w-6 h-6" style={{ color: darkMode ? DARK_TK.textSub : LIGHT_TK.textSub }} strokeWidth={1.8} />
          <span className="text-[10px] font-medium" style={{ color: darkMode ? DARK_TK.textSub : LIGHT_TK.textSub }}>{I18N[lang].outfits}</span>
        </button>
      </div>
    </div>

    {/* ── Pick bottom sheet (shared overlay) ── */}
    <input ref={pickCameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePickCapture} />
    <input ref={pickGalleryRef} type="file" accept="image/*" className="hidden" onChange={handlePickCapture} />
      {pickOpen && (
        <div
          className="absolute inset-0 z-50 flex flex-col justify-end transition-all duration-300"
          style={{
            backdropFilter: pickVisible ? 'blur(12px)' : 'blur(0px)',
            WebkitBackdropFilter: pickVisible ? 'blur(12px)' : 'blur(0px)',
            backgroundColor: pickVisible ? 'rgba(28,28,28,0.45)' : 'rgba(28,28,28,0)',
          }}
          onClick={closePick}
        >
          {/* Sheet card */}
          <div
            className="mx-4 mb-4 rounded-[20px] overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: darkMode ? DARK_TK.surface : LIGHT_TK.surface,
              border: `1px solid ${darkMode ? DARK_TK.border : LIGHT_TK.border}`,
              transform: pickVisible ? 'translateY(0)' : 'translateY(110%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: darkMode ? DARK_TK.borderLight : LIGHT_TK.borderLight }}>
              <p className="text-[16px] font-bold text-center" style={{ color: darkMode ? DARK_TK.text : LIGHT_TK.text }}>Añadir prenda</p>
              <p className="text-[12px] text-center mt-0.5" style={{ color: darkMode ? DARK_TK.textMuted : LIGHT_TK.textMuted }}>Elige cómo subir la imagen</p>
            </div>
            {/* Cámara */}
            <button
              onClick={() => pickCameraRef.current?.click()}
              className="flex items-center gap-4 w-full px-5 py-4 border-b active:opacity-75 transition-opacity"
              style={{ borderColor: darkMode ? DARK_TK.borderLight : LIGHT_TK.borderLight }}
            >
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: darkMode ? DARK_TK.surfaceMuted : LIGHT_TK.accentSurface }}>
                <Camera className="w-5 h-5" style={{ color: darkMode ? DARK_TK.accent : LIGHT_TK.accent }} strokeWidth={1.8} />
              </span>
              <div className="flex flex-col items-start">
                <span className="text-[15px] font-semibold" style={{ color: darkMode ? DARK_TK.text : LIGHT_TK.text }}>Cámara</span>
                <span className="text-[12px]" style={{ color: darkMode ? DARK_TK.textMuted : LIGHT_TK.textMuted }}>Toma una foto ahora</span>
              </div>
            </button>
            {/* Galería */}
            <button
              onClick={() => pickGalleryRef.current?.click()}
              className="flex items-center gap-4 w-full px-5 py-4 active:opacity-75 transition-opacity"
            >
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: darkMode ? DARK_TK.surfaceMuted : LIGHT_TK.accentSurface }}>
                <Image className="w-5 h-5" style={{ color: darkMode ? DARK_TK.accent : LIGHT_TK.accent }} strokeWidth={1.8} />
              </span>
              <div className="flex flex-col items-start">
                <span className="text-[15px] font-semibold" style={{ color: darkMode ? DARK_TK.text : LIGHT_TK.text }}>Galería</span>
                <span className="text-[12px]" style={{ color: darkMode ? DARK_TK.textMuted : LIGHT_TK.textMuted }}>Elige desde tus fotos</span>
              </div>
            </button>
          </div>
          {/* Cancelar */}
          <div
            className="mx-4 mb-8 rounded-[18px] overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: darkMode ? DARK_TK.surface : LIGHT_TK.surface,
              border: `1px solid ${darkMode ? DARK_TK.border : LIGHT_TK.border}`,
              transform: pickVisible ? 'translateY(0)' : 'translateY(110%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePick}
              className="w-full py-4 text-[15px] font-semibold active:opacity-75 transition-opacity"
              style={{ color: darkMode ? DARK_TK.accent : LIGHT_TK.accent }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Add garment flow overlay ── */}
      {addFlowOpen && (
        <div className="absolute inset-0 z-50">
          <AddGarmentFlow onAdd={handleAdd} onCancel={() => setAddFlowOpen(false)} initialImg={flowImg} />
        </div>
      )}

      {/* ── Prenda añadida toast ── */}
      <div
        className="absolute bottom-[86px] left-4 right-4 z-50 pointer-events-none transition-all duration-300"
        style={{ opacity: addToast ? 1 : 0, transform: addToast ? 'translateY(0)' : 'translateY(12px)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg" style={{ backgroundColor: '#16A34A' }}>
          <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <Check className="w-3.5 h-3.5" style={{ color: '#FFFFFF' }} strokeWidth={2.5} />
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold" style={{ color: '#FFFFFF' }}>Prenda añadida</span>
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.75)' }}>La prenda se ha añadido a tu armario</span>
          </div>
        </div>
      </div>

      {/* ── Prenda eliminada toast ── */}
      <div
        className="absolute bottom-[86px] left-4 right-4 z-50 pointer-events-none transition-all duration-300"
        style={{ opacity: deleteToast ? 1 : 0, transform: deleteToast ? 'translateY(0)' : 'translateY(12px)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg" style={{ backgroundColor: '#DC2626' }}>
          <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <Trash2 className="w-3.5 h-3.5" style={{ color: '#FFFFFF' }} strokeWidth={2.5} />
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold" style={{ color: '#FFFFFF' }}>Prenda eliminada</span>
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.75)' }}>La prenda se ha eliminado de tu armario</span>
          </div>
        </div>
      </div>

      {/* ── Item detail slide-up overlay ── */}
      {selectedItem && (
        <div
          className="absolute inset-0 z-50"
          style={{
            transform: detailVisible ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <ItemDetail
            item={selectedItem}
            onBack={closeDetail}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            savedOutfits={savedOutfits}
            onOpenOutfit={handleOpenOutfit}
          />
        </div>
      )}

      {/* ── Notifications & Settings portals ── */}
      <NotificationsPanel
        open={notifOpen}
        anchorRect={notifBtnRect}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
      />
      <SettingsPanel
        open={settingsOpen}
        anchorRect={settingsBtnRect}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(v => !v)}
        pushNotifs={pushNotifs}
        onTogglePush={() => setPushNotifs(v => !v)}
        lang={lang}
        onSetLang={setLang}
        onOpenAllSettings={() => setAllSettingsOpen(true)}
      />
      <AllSettingsView
        open={allSettingsOpen}
        onClose={() => setAllSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(v => !v)}
        pushNotifs={pushNotifs}
        onTogglePush={() => setPushNotifs(v => !v)}
        lang={lang}
        onSetLang={setLang}
      />

      {/* ── Global notification & settings buttons overlay ── */}
      <div className="absolute top-0 right-0 z-40 pointer-events-none" style={{ paddingTop: 74, paddingRight: 20 }}>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            ref={notifBtnRef}
            onClick={() => {
              const rect = notifBtnRef.current?.getBoundingClientRect() ?? null;
              setNotifBtnRect(rect);
              setNotifOpen(v => !v);
              setSettingsOpen(false);
            }}
            className="relative w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ backgroundColor: darkMode ? DARK_TK.pillBg : LIGHT_TK.pillBg }}
          >
            <Bell className="w-[17px] h-[17px]" style={{ color: darkMode ? DARK_TK.text : LIGHT_TK.text }} strokeWidth={1.8} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444', border: `2px solid ${darkMode ? DARK_TK.bg : LIGHT_TK.bg}` }} />
            )}
          </button>
          <button
            ref={settingsBtnRef}
            onClick={() => {
              const rect = settingsBtnRef.current?.getBoundingClientRect() ?? null;
              setSettingsBtnRect(rect);
              setSettingsOpen(v => !v);
              setNotifOpen(false);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ backgroundColor: darkMode ? DARK_TK.pillBg : LIGHT_TK.pillBg }}
          >
            <Settings className="w-[17px] h-[17px]" style={{ color: darkMode ? DARK_TK.text : LIGHT_TK.text }} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
    </ThemeCtx.Provider>
  );
}
