# ROAST - Frontend Specification
## React/Lovable Web Application

> **Version**: 1.0 MVP  
> **Last Updated**: 2026-01-02  
> **Framework**: React (Lovable AI)

---

# 1. Technology Stack

## 1.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI Framework |
| TypeScript | 5+ | Type Safety |
| Vite | 5+ | Build Tool |
| React Router | 6+ | Navigation |
| TanStack Query | 5+ | Data Fetching |
| Zustand | 4+ | State Management |

## 1.2 UI & Styling

| Technology | Purpose |
|------------|---------|
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| Lucide Icons | Icon library |
| Shadcn/UI | Component primitives |

## 1.3 Integrations

| Service | Package | Purpose |
|---------|---------|---------|
| Supabase | `@supabase/supabase-js` | Auth, Database, Storage |
| Stripe | `@stripe/stripe-js` | Payments |

---

# 2. Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Progress.tsx
│   │   └── Toast.tsx
│   │
│   ├── layout/             # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── TabBar.tsx
│   │   ├── Header.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── onboarding/         # Onboarding components
│   │   ├── QuizQuestion.tsx
│   │   ├── SkinTypeQuiz.tsx
│   │   ├── ConcernsQuiz.tsx
│   │   ├── GoalsQuiz.tsx
│   │   └── SelfieCapture.tsx
│   │
│   ├── dashboard/          # Bento Dashboard components
│   │   ├── BentoGrid.tsx
│   │   ├── GlowScoreCard.tsx
│   │   ├── RoutineMiniCard.tsx
│   │   └── QuickInsight.tsx
│   │
│   ├── scan/               # Camera components
│   │   ├── CameraOverlay.tsx
│   │   └── ImageCompressor.tsx
│   │
│   ├── routine/            # Routine components
│   │   ├── RoutineCard.tsx
│   │   ├── RoutineStep.tsx
│   │   ├── ProductCard.tsx
│   │   └── RoutineToggle.tsx
│   │
│   ├── progress/           # Progress components
│   │   ├── ProgressChart.tsx
│   │   ├── PhotoGrid.tsx
│   │   ├── BeforeAfterSlider.tsx
│   │   └── PhotoCapture.tsx
│   │
│   └── subscription/       # Subscription components
│       ├── Paywall.tsx
│       ├── PlanCard.tsx
│       └── UpgradeModal.tsx
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── OnboardingPage.tsx
│   │
│   ├── DashboardPage.tsx
│   ├── ScanPage.tsx
│   ├── RoutinePage.tsx
│   ├── ProgressPage.tsx
│   └── ProfilePage.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useScan.ts
│   ├── useRoutine.ts
│   ├── useProgress.ts
│   ├── useQuota.ts
│   └── useSubscription.ts
│
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── api.ts              # API functions
│   └── utils.ts            # Utility functions
│
├── stores/
│   ├── authStore.ts
│   ├── scanStore.ts
│   └── onboardingStore.ts
│
├── types/
│   └── index.ts            # TypeScript types
│
├── styles/
│   └── globals.css         # Global styles
│
├── App.tsx
└── main.tsx
```

---

# 3. Design System

## 3.1 Color Palette

```css
:root {
  /* Brand - Roast Bold (Sassy Minimalist) */
  --roast-black: #0A0A0A;
  --roast-white: #FFFFFF;
  --roast-red: #FF3B30;      /* Accent / Roasted */
  --glow-green: #34C759;     /* Success */
  
  /* Neutral / Bento */
  --bento-bg: #F2F2F7;
  --bento-border: rgba(0,0,0,0.05);
  
  /* Semantic */
  --success: var(--glow-green);
  --error: var(--roast-red);
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-blur: blur(20px);
}
```

## 3.2 Typography

```css
:root {
  /* Font Family */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Outfit', system-ui, sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

## 3.3 Spacing & Layout

```css
:root {
  /* Spacing Scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  
  /* Border Radius */
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
}
```

---

# 4. Component Specifications

## 4.1 Button Component

```tsx
// components/ui/Button.tsx

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'outline';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Variants:
// primary: Purple background, white text
// secondary: Light purple background, purple text
// ghost: Transparent, hover shows light purple
// outline: Purple border, transparent background
```

## 4.2 GlowScoreCard Component

```tsx
// components/scan/GlowScoreCard.tsx

interface GlowScoreCardProps {
  score: number;              // 0-100
  previousScore?: number;     // For trend indicator
  lastScanDate?: Date;
  onTap?: () => void;
}

// Score Color Logic:
// 80-100: Green (Excellent)
// 60-79: Yellow-Green (Good)
// 40-59: Orange (Moderate)
// 0-39: Red (Needs Attention)

// Display:
// - Large score number with circular progress
// - Trend arrow (↑ or ↓) with point difference
// - Last scan date
```

## 4.3 CameraView Component

```tsx
// components/scan/CameraView.tsx

interface CameraViewProps {
  onCapture: (imageData: Blob) => void;
  onError: (error: Error) => void;
}

// Features:
// - Access front camera via navigator.mediaDevices
// - Display live video feed
// - Overlay face guide (oval)
// - Capture button (disabled until face detected)
// - Lighting indicator
// - Tips carousel at bottom
```

## 4.4 RoutineStep Component

```tsx
// components/routine/RoutineStep.tsx

interface RoutineStepProps {
  step: {
    order: number;
    type: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment';
    product?: Product;
    instructions: string;
    isLocked: boolean;
  };
  onProductTap?: () => void;
}

// Icons per type:
// cleanser: 🧴
// toner: 💧
// serum: ✨
// moisturizer: 🧴
// sunscreen: ☀️
// treatment: 💊
```

## 4.5 Paywall Component

```tsx
// components/subscription/Paywall.tsx

interface PaywallProps {
  trigger: 'scan_limit' | 'full_report' | 'pm_routine' | 'feature';
  featureName?: string;
  onClose: () => void;
  onUpgrade: () => void;
}

// Content varies by trigger:
// scan_limit: "You've used all your free scans. Stop being cheap."
// full_report: "Unlock your complete skin analysis. You know you want to."
// pm_routine: "Access your evening routine. Your pillow will thank you."
// feature: Dynamic based on featureName
```

---

# 5. Page Implementations

## 5.1 DashboardPage (Bento Layout)

```tsx
// pages/DashboardPage.tsx

export default function DashboardPage() {
  return (
    <AppLayout>
      <Header title="ROAST" showProfile />
      
      <main className="px-4 py-6">
        <BentoGrid>
          <GlowScoreCard 
            score={latestScore} 
            trend={+5}
          />
          <RoutineMiniCard 
            title="Next Step"
            product="Retinol Serum"
            time="PM"
          />
          <QuickInsight 
            text="Your forehead is oilier than a pizza. Fix it." 
          />
          <ScanButtonCard 
            onScan={() => navigate('/scan')}
          />
        </BentoGrid>
      </main>
      
      <TabBar activeTab="home" />
    </AppLayout>
  );
}
```

## 5.2 ScanPage

```tsx
// pages/ScanPage.tsx

export default function ScanPage() {
  const [stage, setStage] = useState<'camera' | 'processing' | 'results'>('camera');
  const { canScan, incrementUsage } = useQuota();
  
  // Check quota before showing camera
  useEffect(() => {
    if (!canScan) {
      showPaywall('scan_limit');
    }
  }, [canScan]);
  
  const handleCapture = async (imageBlob: Blob) => {
    setStage('processing');
    
    try {
      // 1. Upload image to Supabase Storage
      const imagePath = await uploadScanImage(imageBlob);
      
      // 2. Call Cloudflare Worker for AI analysis
      const results = await analyzeFace(imagePath);
      
      // 3. Save results to database
      await saveScanResults(results);
      
      // 4. Increment usage
      await incrementUsage();
      
      // 5. Show results
      setStage('results');
      setScanResults(results);
    } catch (error) {
      showError(error);
      setStage('camera');
    }
  };
  
  return (
    <AppLayout hideTabBar={stage !== 'results'}>
      {stage === 'camera' && (
        <CameraView onCapture={handleCapture} />
      )}
      
      {stage === 'processing' && (
        <ScanProcessing />
      )}
      
      {stage === 'results' && (
        <ScanResults results={scanResults} />
      )}
    </AppLayout>
  );
}
```

---

# 6. State Management

## 6.1 Auth Store

```tsx
// stores/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile) => void;
  setSubscription: (subscription: Subscription) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  subscription: null,
  isLoading: true,
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSubscription: (subscription) => set({ subscription }),
  signOut: () => set({ user: null, profile: null, subscription: null }),
}));
```

## 6.2 Scan Store

```tsx
// stores/scanStore.ts
import { create } from 'zustand';

interface ScanState {
  currentScan: Scan | null;
  recentScans: Scan[];
  isAnalyzing: boolean;
  
  setCurrentScan: (scan: Scan) => void;
  setRecentScans: (scans: Scan[]) => void;
  setAnalyzing: (analyzing: boolean) => void;
}
```

---

# 7. API Integration

## 7.1 Supabase Client

```tsx
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

## 7.2 API Functions

```tsx
// lib/api.ts

// Authentication
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({ provider: 'google' });
}

// Scans
export async function uploadScanImage(blob: Blob): Promise<string> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const fileName = `${userId}/${Date.now()}.jpg`;
  
  const { data, error } = await supabase.storage
    .from('scans')
    .upload(fileName, blob);
    
  if (error) throw error;
  return data.path;
}

export async function analyzeFace(imagePath: string) {
  const response = await fetch(
    `${CLOUDFLARE_WORKER_URL}/analyze-face`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath }),
    }
  );
  return response.json();
}

// Routines
export async function getRoutine(type: 'AM' | 'PM') {
  const { data, error } = await supabase
    .from('routines')
    .select(`
      *,
      routine_steps (
        *,
        product:products (*)
      )
    `)
    .eq('routine_type', type)
    .eq('is_active', true)
    .single();
    
  if (error) throw error;
  return data;
}

// Quota
export async function checkQuota(): Promise<{ canScan: boolean; remaining: number }> {
  const { data } = await supabase
    .from('scan_usage')
    .select('*')
    .eq('usage_date', new Date().toISOString().split('T')[0])
    .single();
    
  const used = data?.scans_used || 0;
  const limit = data?.scans_limit || 5;
  
  return { canScan: used < limit, remaining: limit - used };
}
```

---

# 8. Routing Configuration

```tsx
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/scan/results/:id" element={<ScanResultsPage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

# 9. Responsive Design

## 9.1 Breakpoints

```css
/* Tailwind breakpoints (mobile-first) */
/* Default: 0-639px (mobile) */
/* sm: 640px+ (large mobile) */
/* md: 768px+ (tablet) */
/* lg: 1024px+ (desktop) */
```

## 9.2 Mobile-First Approach

Since this is primarily a mobile app (via Flutter webview), design for:
- **Width**: 375-428px (iPhone range)
- **Safe areas**: Account for notch, home indicator
- **Touch targets**: Minimum 44x44px
- **Scroll**: Vertical scrolling, avoid horizontal

---

# 10. Performance Optimization

## 10.1 Code Splitting

```tsx
// Lazy load pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const RoutinePage = lazy(() => import('./pages/RoutinePage'));
```

## 10.2 Image Optimization

```tsx
// Use optimized image loading
<img 
  src={imageSrc}
  loading="lazy"
  decoding="async"
  alt={alt}
/>
```

## 10.3 Query Caching

```tsx
// TanStack Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});
```

---

# Document References

| Document | Purpose |
|----------|---------|
| [Workflow Spec](./WORKFLOW.md) | User flows and screens |
| [UI Spec](./UI.md) | Design system and styling |
| [Backend Spec](./BACKEND.md) | Supabase + Cloudflare Workers |
| [Technical Spec](./TECHNICAL.md) | Architecture & integration |
