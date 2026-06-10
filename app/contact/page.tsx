"use client";

import { useState } from "react";
import { Mail, MapPin, Clock, Send, Ship, Waves } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-50/80 via-white to-white" />
        <div className="max-w-[1100px] mx-auto relative">
          <div className="text-center mb-12">
            {/* Studio badge */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-50 border border-ocean-100">
                <Ship className="w-3.5 h-3.5 text-ocean-500" />
                <span className="text-xs font-medium text-ocean-700">TideDriven Studio #27</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Get in Touch
            </h1>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Have a question about a VPN review, want to suggest a service for testing,
              or just want to say hello to the team? We would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
            <div className="lg:col-span-2">
              <div className="bg-white border border-ocean-100 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                {submitted ? (
                  <div className="bg-ocean-50 border border-ocean-100 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center mx-auto mb-3">
                      <Send className="w-6 h-6 text-ocean-500" />
                    </div>
                    <p className="text-gray-900 font-semibold text-lg mb-1">Message Sent!</p>
                    <p className="text-gray-500 text-sm">
                      Thank you for reaching out. Our team at TideDriven will get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-500/20 focus:outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-500/20 focus:outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-500/20 focus:outline-none transition-all"
                      >
                        <option value="">Select a subject...</option>
                        <option value="general">General Inquiry</option>
                        <option value="vpn-suggestion">Suggest a VPN for Review</option>
                        <option value="bug">Report an Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-500/20 focus:outline-none transition-all resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 bg-ocean-500 hover:bg-ocean-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white border border-ocean-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-ocean-500" />
                  Email Us
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    <strong className="text-gray-700">General:</strong>
                    <br />
                    <a href="mailto:hello@tidedriven.io" className="text-ocean-500 hover:underline">
                      hello@tidedriven.io
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong className="text-gray-700">VPN Suggestions:</strong>
                    <br />
                    <a href="mailto:vpn@tidedriven.io" className="text-ocean-500 hover:underline">
                      vpn@tidedriven.io
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong className="text-gray-700">Press:</strong>
                    <br />
                    <a href="mailto:press@tidedriven.io" className="text-ocean-500 hover:underline">
                      press@tidedriven.io
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-white border border-ocean-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-ocean-500" />
                  Studio
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  TideDriven Studio #27
                  <br />
                  Helsingborg, Sweden
                </p>
              </div>

              <div className="bg-white border border-ocean-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ocean-500" />
                  Response Time
                </h3>
                <p className="text-sm text-gray-500">
                  We typically respond within <strong className="text-gray-700">24 hours</strong> during
                  business days (CET/CEST timezone).
                </p>
              </div>

              <div className="bg-ocean-50 border border-ocean-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Ship className="w-4 h-4 text-ocean-500" />
                  <span className="text-xs font-semibold text-ocean-700">TideDriven Studio #27</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Part of TideDriven — a cloud solutions collective based in Helsingborg, Sweden.
                  We run Tunnel Picks as our VPN comparison project.
                </p>
                <Link
                  href="/about"
                  className="text-xs text-ocean-500 hover:text-ocean-600 font-medium mt-2 inline-block"
                >
                  Learn more about us →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
