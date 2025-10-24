'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ContactFormData } from '@/types';

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form" noValidate>
      <Input
        label="Name"
        type="text"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        error={errors.name}
        placeholder="Your full name"
        disabled={isSubmitting}
        data-testid="contact-name-input"
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        placeholder="your.email@example.com"
        disabled={isSubmitting}
        data-testid="contact-email-input"
      />

      <Textarea
        label="Message"
        value={formData.message}
        onChange={(e) => handleInputChange('message', e.target.value)}
        error={errors.message}
        placeholder="Tell us about your project or inquiry..."
        rows={5}
        disabled={isSubmitting}
        data-testid="contact-message-input"
      />

      {submitStatus === 'success' && (
        <div 
          className="p-4 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:border-green-800"
          data-testid="contact-success-message"
        >
          <p className="text-green-800 dark:text-green-200">
            Thank you for your message! We&apos;ll get back to you soon.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200">
            Sorry, there was an error sending your message. Please try again.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
        data-testid="submit-contact-form"
      >
        {isSubmitting ? (
          <>
            <span data-testid="submit-loading">Sending...</span>
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );
}