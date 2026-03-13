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
import { CTAButton } from '../components/common/CTAButton'

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

      <div className="min-h-screen bg-bg-deep px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              {t('contact:hero.title')}
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              {t('contact:hero.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              className="bg-bg-surface border border-border-primary rounded-sm p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {!isSubmitted ? (
                <>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">
                    {t('contact:form.title')}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        {t('contact:form.name_label')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bg-elevated border border-border-primary rounded-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-system focus:border-accent-system transition-all"
                        placeholder={t('contact:form.name_placeholder')}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        {t('contact:form.email_label')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bg-elevated border border-border-primary rounded-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-system focus:border-accent-system transition-all"
                        placeholder={t('contact:form.email_placeholder')}
                        required
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        {t('contact:form.company_label')}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bg-elevated border border-border-primary rounded-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-system focus:border-accent-system transition-all"
                        placeholder={t('contact:form.company_placeholder')}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        {t('contact:form.message_label')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 bg-bg-elevated border border-border-primary rounded-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-system focus:border-accent-system transition-all resize-none"
                        placeholder={t('contact:form.message_placeholder')}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-accent-system hover:bg-accent-system/90 text-bg-deep font-semibold py-3 rounded-sm transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin mr-2" />
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
                  <CheckCircle2 className="w-16 h-16 text-accent-system mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    {t('contact:form.success_title')}
                  </h3>
                  <p className="text-text-secondary mb-6">{t('contact:form.success_message')}</p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="bg-bg-elevated border-border-primary text-text-primary hover:bg-bg-surface"
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
              <div className="bg-accent-system/10 border border-accent-system/20 rounded-sm p-6">
                <Calendar className="w-12 h-12 text-accent-system mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  {t('contact:book_demo.title')}
                </h3>
                <p className="text-text-secondary mb-4">{t('contact:book_demo.description')}</p>
                <CTAButton calendly size="md">
                  <Calendar className="w-5 h-5" />
                  {t('contact:book_demo.button')}
                </CTAButton>
              </div>

              {/* Direct Contact */}
              <div className="bg-bg-surface border border-border-primary rounded-sm p-6">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  {t('contact:direct_contact.title')}
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <a
                    href="mailto:hello@futuremarketingai.com"
                    className="flex items-start gap-3 text-text-secondary hover:text-accent-system transition-colors group"
                  >
                    <Mail className="w-5 h-5 mt-0.5 text-accent-system group-hover:text-accent-system/80" />
                    <div>
                      <div className="text-sm text-text-muted mb-1">
                        {t('contact:direct_contact.email_label')}
                      </div>
                      <div className="font-semibold">
                        {t('contact:direct_contact.email_address')}
                      </div>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-3 text-text-secondary">
                    <MapPin className="w-5 h-5 mt-0.5 text-accent-system" />
                    <div>
                      <div className="text-sm text-text-muted mb-1">
                        {t('contact:direct_contact.location_label')}
                      </div>
                      <div className="font-semibold">
                        {t('contact:direct_contact.location_text')}
                      </div>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-start gap-3 text-text-secondary">
                    <Phone className="w-5 h-5 mt-0.5 text-accent-system" />
                    <div>
                      <div className="text-sm text-text-muted mb-1">
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
              <div className="bg-bg-surface border border-border-primary rounded-sm p-6">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  {t('contact:social.title')}
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com/company/futuremarketingai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-accent-system/10 border border-accent-system/20 rounded-sm text-accent-system hover:bg-accent-system/20 hover:text-accent-system/80 transition-all"
                    aria-label={t('contact:social.linkedin_aria')}
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href="https://twitter.com/FutureMarketAI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-accent-system/10 border border-accent-system/20 rounded-sm text-accent-system hover:bg-accent-system/20 hover:text-accent-system/80 transition-all"
                    aria-label={t('contact:social.twitter_aria')}
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Not ready yet? */}
              <div className="bg-accent-human/10 border border-accent-human/20 rounded-sm p-6 text-center">
                <p className="text-text-secondary mb-4">{t('contact:not_ready.text')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-bg-elevated border border-border-primary rounded-sm text-text-primary hover:bg-bg-surface transition-all text-sm"
                  >
                    {t('contact:not_ready.demo_button')}
                  </a>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center px-4 py-2 bg-bg-elevated border border-border-primary rounded-sm text-text-primary hover:bg-bg-surface transition-all text-sm"
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
