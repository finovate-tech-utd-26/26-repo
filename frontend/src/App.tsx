import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { OnboardingLayout } from "@/layouts/OnboardingLayout";

import Landing from "@/pages/Landing";
import Demo from "@/pages/Demo";
import Marketplace from "@/pages/Marketplace";
import Login from "@/pages/Login";

import PublisherOverview from "@/pages/publisher/Overview";
import PublisherSites from "@/pages/publisher/Sites";
import PublisherSiteDetail from "@/pages/publisher/SiteDetail";
import PublisherRevenue from "@/pages/publisher/Revenue";
import PublisherOnboarding from "@/pages/publisher/Onboarding";
import PublisherSettings from "@/pages/publisher/Settings";

import AdvertiserOverview from "@/pages/advertiser/Overview";
import AdvertiserCampaigns from "@/pages/advertiser/Campaigns";
import AdvertiserCampaignDetail from "@/pages/advertiser/CampaignDetail";
import AdvertiserNewCampaign from "@/pages/advertiser/NewCampaign";
import AdvertiserBudget from "@/pages/advertiser/Budget";
import AdvertiserOnboarding from "@/pages/advertiser/Onboarding";
import AdvertiserSettings from "@/pages/advertiser/Settings";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/publisher" element={<PublisherOverview />} />
              <Route path="/publisher/sites" element={<PublisherSites />} />
              <Route path="/publisher/sites/:siteId" element={<PublisherSiteDetail />} />
              <Route path="/publisher/revenue" element={<PublisherRevenue />} />
              <Route path="/publisher/settings" element={<PublisherSettings />} />

              <Route path="/advertiser" element={<AdvertiserOverview />} />
              <Route path="/advertiser/campaigns" element={<AdvertiserCampaigns />} />
              <Route path="/advertiser/campaigns/new" element={<AdvertiserNewCampaign />} />
              <Route path="/advertiser/campaigns/:id" element={<AdvertiserCampaignDetail />} />
              <Route path="/advertiser/budget" element={<AdvertiserBudget />} />
              <Route path="/advertiser/settings" element={<AdvertiserSettings />} />
            </Route>

            <Route element={<OnboardingLayout />}>
              <Route path="/publisher/onboarding" element={<PublisherOnboarding />} />
              <Route path="/advertiser/onboarding" element={<AdvertiserOnboarding />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
