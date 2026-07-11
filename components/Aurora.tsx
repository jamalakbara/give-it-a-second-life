// Fixed animated aurora behind the whole app — recreates the drifting
// mesh-gradient glow of jackwatkins.co/works over a near-black base.
// Blooms overlap toward the centre so colour stays visible at any scroll
// depth (the layer is fixed; the viewport centre must not read pure black).
export function Aurora() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden bg-void">
      {/* blue — top-right, large, reaching in */}
      <div className="absolute -right-[6%] -top-[12%] h-[90vh] w-[62vw] rounded-full bg-aurora-blue opacity-80 blur-[120px] animate-drift-a" />
      {/* violet — centre-right, fills the middle */}
      <div className="absolute right-[8%] top-[22%] h-[80vh] w-[55vw] rounded-full bg-aurora-violet opacity-70 blur-[130px] animate-drift-c" />
      {/* rose — bottom-left, reaching toward centre */}
      <div className="absolute -left-[8%] bottom-[-12%] h-[85vh] w-[60vw] rounded-full bg-aurora-rose opacity-70 blur-[130px] animate-drift-b" />
      {/* magenta — bottom-centre */}
      <div className="absolute left-[22%] bottom-[-16%] h-[70vh] w-[52vw] rounded-full bg-aurora-magenta opacity-60 blur-[140px] animate-drift-a" />
      {/* crimson — left flank */}
      <div className="absolute -left-[10%] top-[6%] h-[75vh] w-[46vw] rounded-full bg-aurora-crimson opacity-55 blur-[120px] animate-drift-c" />
      {/* soft violet centre bloom so the middle never goes black */}
      <div className="absolute left-[28%] top-[28%] h-[55vh] w-[46vw] rounded-full bg-aurora-violet opacity-40 blur-[150px] animate-drift-b" />
      {/* light centre darkening for text legibility; colours keep blooming */}
      <div className="absolute inset-0 bg-[radial-gradient(135%_135%_at_50%_45%,transparent_0,rgba(1,0,8,0.16)_60%,rgba(1,0,8,0.42)_100%)]" />
      {/* fine grain to kill banding */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
    </div>
  );
}
