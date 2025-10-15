/**
 * Lead Qualification Form Component
 * Converted from Next.js to React Router
 * Source: lead-qualification-form.tsx
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, User, Building2, Phone, Send, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface LeadQualificationFormProps {
  onSubmit?: (data: LeadFormData) => void
  onClose?: () => void
  className?: string
}

export interface LeadFormData {
  name: string
  email: string
  company: string
  phone: string
  message?: string
}

export const LeadQualificationForm: React.FC<LeadQualificationFormProps> = ({
  onSubmit,
  onClose,
  className = '',
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (onSubmit) {
      onSubmit(formData)
    }

    setIsSubmitting(false)

    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name as keyof LeadFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <motion.div
      className={cn(
        'w-full max-w-2xl mx-auto p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl',
        className
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Join the Waitlist</h2>
        <p className="text-blue-100">
          Be among the first to experience revolutionary AI marketing automation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-2">
            <User className="inline h-4 w-4 mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-blue-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
              errors.name ? 'border-red-500' : 'border-white/20'
            )}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
            <Mail className="inline h-4 w-4 mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-blue-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
              errors.email ? 'border-red-500' : 'border-white/20'
            )}
            placeholder="john@company.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Company Field */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-blue-100 mb-2">
            <Building2 className="inline h-4 w-4 mr-2" />
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-blue-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
              errors.company ? 'border-red-500' : 'border-white/20'
            )}
            placeholder="Your Company Inc."
          />
          {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company}</p>}
        </div>

        {/* Phone Field (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-blue-100 mb-2">
            <Phone className="inline h-4 w-4 mr-2" />
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Message Field (Optional) */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-blue-100 mb-2">
            Tell us about your marketing goals (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            placeholder="What are your biggest marketing challenges?"
          />
        </div>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Join Waitlist
              </>
            )}
          </Button>
        </motion.div>

        {/* Privacy Note */}
        <p className="text-xs text-blue-200 text-center">
          By submitting, you agree to receive marketing communications. We respect your privacy.
        </p>

        {/* Close Button (if provided) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-blue-300 hover:text-white text-sm font-medium block mx-auto transition-colors"
          >
            Maybe later
          </button>
        )}
      </form>
    </motion.div>
  )
}
