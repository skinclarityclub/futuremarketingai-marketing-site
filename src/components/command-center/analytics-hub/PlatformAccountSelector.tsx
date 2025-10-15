import React from 'react'
import { motion } from 'framer-motion'
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaCheckCircle as CheckCircle2,
  FaUsers as Users,
} from 'react-icons/fa'
import type { Account } from '../multi-account-manager/mockAccountData'

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'

interface PlatformAccountSelectorProps {
  availablePlatforms: Platform[]
  selectedPlatforms: Platform[]
  onPlatformToggle: (platform: Platform) => void

  availableAccounts: Account[]
  selectedAccounts: string[]
  onAccountToggle: (accountId: string) => void
}

const platformConfig = {
  instagram: { icon: FaInstagram, color: '#E4405F', label: 'Instagram' },
  tiktok: { icon: FaTiktok, color: '#000000', label: 'TikTok' },
  youtube: { icon: FaYoutube, color: '#FF0000', label: 'YouTube' },
  facebook: { icon: FaFacebook, color: '#1877F2', label: 'Facebook' },
  twitter: { icon: FaTwitter, color: '#1DA1F2', label: 'Twitter/X' },
}

export const PlatformAccountSelector: React.FC<PlatformAccountSelectorProps> = ({
  availablePlatforms,
  selectedPlatforms,
  onPlatformToggle,
  availableAccounts,
  selectedAccounts,
  onAccountToggle,
}) => {
  // Filter accounts by selected platforms
  const filteredAccounts =
    selectedPlatforms.length > 0
      ? availableAccounts.filter((acc) => selectedPlatforms.includes(acc.platform))
      : availableAccounts

  return (
    <div className="space-y-6">
      {/* Platform Selector */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">
          Select Platforms
        </h3>
        <div className="flex flex-wrap gap-2">
          {availablePlatforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform)
            const config = platformConfig[platform]
            const Icon = config.icon

            return (
              <motion.button
                key={platform}
                onClick={() => onPlatformToggle(platform)}
                className={`
                  group relative px-4 py-2.5 rounded-lg
                  backdrop-blur-md border-2 transition-all duration-300
                  flex items-center gap-2
                  ${isSelected ? 'border-white/30' : 'border-white/10 hover:border-white/20'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" style={{ color: isSelected ? config.color : '#fff' }} />
                <span className="text-sm font-medium text-white">{config.label}</span>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Account Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            Select Accounts
          </h3>
          <span className="text-xs text-white/40">
            {selectedAccounts.length} of {filteredAccounts.length} selected
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => {
              const isSelected = selectedAccounts.includes(account.id)
              const config = platformConfig[account.platform]
              const Icon = config.icon

              return (
                <motion.button
                  key={account.id}
                  onClick={() => onAccountToggle(account.id)}
                  className={`
                    w-full p-3 rounded-lg backdrop-blur-md border
                    transition-all duration-200 text-left
                    ${isSelected ? 'border-white/30' : 'border-white/10 hover:bg-white/8'}
                  `}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-8 h-8 rounded-full border border-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{account.handle}</p>
                        <Icon className="w-3 h-3 flex-shrink-0" style={{ color: config.color }} />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-white/50">{account.type}</p>
                        <span className="text-white/30">•</span>
                        <p className="text-xs text-white/50">
                          {(account.followers / 1000).toFixed(1)}K followers
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              )
            })
          ) : (
            <div className="text-center py-8 text-white/40">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Select platforms to see accounts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
