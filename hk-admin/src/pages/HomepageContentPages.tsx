import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export const HomepageContentPage: React.FC = () => {
  const { cms, updateCMS } = useAdmin();

  const [announcementText, setAnnouncementText] = useState(cms.announcementBarText);
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(cms.isAnnouncementActive);

  const [heroHeading, setHeroHeading] = useState(cms.heroBanners[0]?.heading || '');
  const [heroDesc, setHeroDesc] = useState(cms.heroBanners[0]?.description || '');
  const [heroCta, setHeroCta] = useState(cms.heroBanners[0]?.ctaText || '');
  const [heroLink, setHeroLink] = useState(cms.heroBanners[0]?.ctaLink || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedHero = [...cms.heroBanners];
    if (updatedHero[0]) {
      updatedHero[0] = {
        ...updatedHero[0],
        heading: heroHeading,
        description: heroDesc,
        ctaText: heroCta,
        ctaLink: heroLink
      };
    }

    updateCMS({
      announcementBarText: announcementText,
      isAnnouncementActive,
      heroBanners: updatedHero
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Homepage CMS Content Editor</h2>
          <p className="text-xs text-[#6B6B6B]">Manage banners, announcement text, and hero sliders without code</p>
        </div>
        <Button variant="gold" type="submit" icon={<CheckCircle className="w-4 h-4" />}>
          Save CMS Changes
        </Button>
      </div>

      {/* Announcement Bar Settings */}
      <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Store Announcement Ticker</h3>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isAnnouncementActive}
              onChange={e => setIsAnnouncementActive(e.target.checked)}
              className="rounded-xs text-[#D4AF37]"
            />
            <span>Active Ticker</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111111] mb-1">Ticker Message Text</label>
          <input
            type="text"
            value={announcementText}
            onChange={e => setAnnouncementText(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
          />
        </div>
      </div>

      {/* Hero Banner Section Editor */}
      <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Main Hero Banner Slider</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Hero Heading Title</label>
            <input
              type="text"
              value={heroHeading}
              onChange={e => setHeroHeading(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Hero Subtitle / Description</label>
            <textarea
              rows={2}
              value={heroDesc}
              onChange={e => setHeroDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">CTA Button Text</label>
              <input
                type="text"
                value={heroCta}
                onChange={e => setHeroCta(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">CTA Destination Link</label>
              <input
                type="text"
                value={heroLink}
                onChange={e => setHeroLink(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
