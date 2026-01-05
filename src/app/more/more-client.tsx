"use client";

import { Navigation } from "@/components/layout/navigation";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { User, CreditCard, Bell, Shield, Info, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "./actions";

interface SettingItem {
  icon: any;
  label: string;
  value?: string;
  action?: string;
  href?: string;
}

interface SettingGroup {
  title: string;
  items: SettingItem[];
}

interface MoreClientProps {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
  subscription: {
    plan_type: string;
    status: string | null;
  } | null;
  email: string | undefined;
}

export function MoreClient({ profile, subscription, email }: MoreClientProps) {
  const displayName = profile?.full_name || email?.split('@')[0] || 'User';
  const displayEmail = profile?.email || email || '';
  const planName = subscription?.plan_type === 'premium' 
    ? 'Premium' 
    : subscription?.plan_type === 'pro' 
      ? 'Pro' 
      : 'Free Plan';
  
  const SETTINGS_GROUPS: SettingGroup[] = [
    {
      title: "Account",
      items: [
        { icon: User, label: "My Profile", value: displayName },
        { icon: CreditCard, label: "My Plan", value: planName, action: subscription?.plan_type === 'premium' ? undefined : "Upgrade" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", value: "Daily Reminders" },
        { icon: Shield, label: "Privacy", value: "Managed Data", href: "/privacy" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: Info, label: "Help Center" },
        { icon: Info, label: "Terms of Service", href: "/terms" },
      ]
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <PageWrapper className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-300">
      <header className="border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
          <FadeInItem>
            <Typography variant="headline" weight="bold">Settings</Typography>
          </FadeInItem>
          <FadeInItem>
            <Button variant="ghost" size="sm" className="text-primary font-bold">Done</Button>
          </FadeInItem>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center py-8">
           <FadeInItem className="size-24 rounded-full bg-gradient-to-br from-primary to-orange-500 border-4 border-white/5 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
           </FadeInItem>
           <FadeInItem className="flex flex-col">
              <Typography variant="headline" weight="black" className="text-2xl">{displayName}</Typography>
              <Typography className="text-sm opacity-40">{displayEmail}</Typography>
           </FadeInItem>
           <FadeInItem>
             <Button variant="outline" size="sm" className="h-9 px-4 rounded-full">Edit Profile</Button>
           </FadeInItem>
        </div>
        {SETTINGS_GROUPS.map((group, i) => (
          <FadeInItem key={i} className="flex flex-col gap-4">
            <Typography variant="caption" className="pl-2">{group.title}</Typography>
            <Card className="divide-y divide-white/5 rounded-2xl overflow-hidden border-white/5">
              {group.items.map((item, j) => (
                <div key={j} className="p-5 flex items-center justify-between hover:bg-white/5 cursor-pointer group transition-all">
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
                        <Icon icon={item.icon} size={20} className="opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                     </div>
                     <Typography weight="bold" className="text-sm">{item.label}</Typography>
                  </div>
                  <div className="flex items-center gap-2">
                     {item.value && <Typography className="text-xs opacity-40">{item.value}</Typography>}
                     {item.action === "Upgrade" ? (
                       <Button variant="primary" size="sm" className="h-7 px-3 text-[10px] uppercase rounded-full">{item.action}</Button>
                     ) : (
                       <Icon icon={ChevronRight} size={16} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     )}
                  </div>
                </div>
              ))}
            </Card>
          </FadeInItem>
        ))}

        <FadeInItem>
          <form action={handleSignOut}>
            <Button type="submit" variant="ghost" className="w-full text-primary mt-4 group rounded-2xl">
              <Icon icon={LogOut} size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Sign Out
            </Button>
          </form>
        </FadeInItem>
      </main>

      <Navigation />
    </PageWrapper>
  );
}
