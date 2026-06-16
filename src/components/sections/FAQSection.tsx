import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What are your visiting hours?",
      answer: "Visiting hours are typically from 10:00 AM to 12:00 PM and 5:00 PM to 7:00 PM. However, these may vary depending on the specific ward or department. Please check with the respective reception desk or your patient's nursing staff for precise timings."
    },
    {
      question: "Do you accept health insurance?",
      answer: "Yes, we partner with major insurance companies and are empaneled with Ayushman Bharat. Our TPA (Third Party Administrator) desk can assist you with cashless hospitalization, policy coverage details, and claim processing."
    },
    {
      question: "How can I book an appointment?",
      answer: "You can book an appointment online through our website, by calling our helpline at 1800-123-4567, or by visiting the hospital reception in person. For emergencies, please call 1066 directly."
    },
    {
      question: "Is there an emergency room available 24/7?",
      answer: "Yes, our Emergency and Trauma Centre is open 24/7, fully equipped to handle critical cases, accidents, and sudden medical emergencies with specialized doctors on rotation."
    },
    {
      question: "What should I bring for my admission?",
      answer: "Please bring a valid photo ID (Aadhar Card, Pan Card, etc.), any prior medical records, your doctor's admission advice, and your insurance card/documents if you're seeking cashless treatment."
    }
  ];

  return (
    <section className="py-24 bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-700 text-lg">Find answers to some of the most common questions about our hospital and services.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === idx ? 'shadow-md border-primary/30 ring-1 ring-primary/10' : 'hover:border-slate-300 bg-slate-50'}`}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
              >
                <span className="font-semibold text-slate-900 pr-8">{faq.question}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="text-slate-600 border-t border-slate-100 pt-4 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
