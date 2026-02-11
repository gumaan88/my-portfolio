import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-navy-950 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">لنبدأ <span className="text-electric-400">العمل معاً</span></h2>
            <p className="text-gray-400">
              هل لديك مشروع طموح؟ أنا مستعد للمساعدة في تحويل أفكارك إلى واقع تقني ملموس.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-12 bg-navy-900/50 p-2 md:p-8 rounded-3xl border border-white/5">
            {/* Social & Info */}
            <div className="md:col-span-2 space-y-8 p-6">
              <div>
                <h3 className="text-white font-bold text-xl mb-6">قنوات التواصل</h3>
                <div className="flex flex-col gap-4">
                  {SOCIAL_LINKS.map((link) => (
                    <a 
                      key={link.platform}
                      href={link.url}
                      className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors p-3 rounded-lg hover:bg-white/5"
                    >
                      <link.icon size={20} className="text-electric-500" />
                      <span>{link.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="p-6 rounded-xl bg-electric-900/10 border border-electric-500/10">
                <p className="text-electric-400 text-sm leading-relaxed">
                  "التكنولوجيا ليست مجرد أدوات، بل هي الطريقة التي نبني بها مستقبلاً أفضل وأكثر كفاءة."
                </p>
                <div className="mt-4 text-gray-500 text-xs font-bold">- م. جمعان سعيد</div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3 bg-navy-800 rounded-2xl p-8 border border-white/5">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
                    <Send size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">تم الإرسال بنجاح</h3>
                  <p className="text-gray-400">شكراً لتواصلك. سأقوم بالرد عليك في أقرب وقت ممكن.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-electric-400 hover:text-electric-300 text-sm">
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      required
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/50 transition-all"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/50 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">الرسالة</label>
                    <textarea 
                      rows={4}
                      required
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                      className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/50 transition-all resize-none"
                      placeholder="كيف يمكنني مساعدتك؟"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-electric-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                    {!isSubmitting && <Send size={18} className="rtl:rotate-180" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;