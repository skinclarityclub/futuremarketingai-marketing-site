/**
 * Contact/Sales Page - Get in touch with the team
 *
 * Multiple contact methods:
 * - Contact form
 * - Direct email
 * - Calendly integration (book demo call)
 * - Social links
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { Button } from '../components/ui/button'
import { Mail, Calendar, Linkedin, Twitter, Send, CheckCircle2, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export const ContactPage: React.FC = () => {
  const { t } = useTranslation(['contact', 'common'])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Integrate with backend/CRM
    console.log('Contact form submitted:', formData)

    // Simulate submission
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      {/* Simple Header */}
      <SimpleHeader />

      {/* SEO Meta Tags */}
      <SEOHead
        title={t('contact:seo.title')}
        description={t('contact:seo.description')}
        keywords={t('contact:seo.keywords', { returnObjects: true }) as string[]}
        canonical="https://futuremarketingai.com/contact"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('contact:hero.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('contact:hero.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {!isSubmitted ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">{t('contact:form.title')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                        {t('contact:form.name_label')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('contact:form.name_placeholder')}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        {t('contact:form.email_label')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('contact:form.email_placeholder')}
                        required
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-white mb-2"
                      >
                        {t('contact:form.company_label')}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('contact:form.company_placeholder')}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-white mb-2"
                      >
                        {t('contact:form.message_label')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder={t('contact:form.message_placeholder')}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          {t('contact:form.submitting')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t('contact:form.submit_button')}
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {t('contact:form.success_title')}
                  </h3>
                  <p className="text-blue-100 mb-6">{t('contact:form.success_message')}</p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                  >
                    {t('contact:form.success_button')}
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Contact Info & CTAs */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Book a Demo */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6">
                <Calendar className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t('contact:book_demo.title')}
                </h3>
                <p className="text-blue-100 mb-4">{t('contact:book_demo.description')}</p>
                <a
                  href="https://calendly.com/futuremarketingai/demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  {t('contact:book_demo.button')}
                </a>
              </div>

              {/* Direct Contact */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {t('contact:direct_contact.title')}
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <a
                    href="mailto:hello@futuremarketingai.com"
                    className="flex items-start gap-3 text-blue-100 hover:text-blue-400 transition-colors group"
                  >
                    <Mail className="w-5 h-5 mt-0.5 text-blue-400 group-hover:text-blue-300" />
                    <div>
                      <div className="text-sm text-blue-300 mb-1">
                        {t('contact:direct_contact.email_label')}
                      </div>
                      <div className="font-semibold">
                        {t('contact:direct_contact.email_address')}
                      </div>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-3 text-blue-100">
                    <MapPin className="w-5 h-5 mt-0.5 text-blue-400" />
                    <div>
                      <div className="text-sm text-blue-300 mb-1">
                        {t('contact:direct_contact.location_label')}
                      </div>
                      <div className="font-semibold">
                        {t('contact:direct_contact.location_text')}
                      </div>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-start gap-3 text-blue-100">
                    <Phone className="w-5 h-5 mt-0.5 text-blue-400" />
                    <div>
                      <div className="text-sm text-blue-300 mb-1">
                        {t('contact:direct_contact.response_time_label')}
                      </div>
                      <div className="font-semibold">
                        {t('contact:direct_contact.response_time_text')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">{t('contact:social.title')}</h3>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com/company/futuremarketingai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all"
                    aria-label={t('contact:social.linkedin_aria')}
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href="https://twitter.com/FutureMarketAI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all"
                    aria-label={t('contact:social.twitter_aria')}
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Not ready yet? */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 text-center">
                <p className="text-blue-100 mb-4">{t('contact:not_ready.text')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all text-sm"
                  >
                    {t('contact:not_ready.demo_button')}
                  </a>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all text-sm"
                  >
                    {t('contact:not_ready.pricing_button')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage
