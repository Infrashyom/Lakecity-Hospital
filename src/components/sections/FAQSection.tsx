import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function FAQSection() {
  const [openIndexLeft, setOpenIndexLeft] = useState<number | null>(null);
  const [openIndexRight, setOpenIndexRight] = useState<number | null>(null);

  const faqs = [
    { question: "What are your visiting hours?", answer: "Visiting hours are typically from 10:00 AM to 12:00 PM and 5:00 PM to 7:00 PM. However, these may vary depending on the specific ward or department." },
    { question: "Do you offer counseling for fertility stress?", answer: "Yes. We understand that fertility treatment can be an emotional rollercoaster. We offer dedicated counseling and support sessions to help couples navigate the psychological aspects of the journey with positivity and strength." },
    { question: "What is the difference between IUI and IVF?", answer: "IUI (Intrauterine Insemination) places sperm directly in the uterus during ovulation. IVF (In Vitro Fertilization) fertilizes eggs with sperm outside the body in a lab, then transfers the embryo to the uterus." },
    { question: "Do you treat patients with cardiac (heart) issues during pregnancy?", answer: "Yes, we specialize in high-risk pregnancies and have a dedicated team of cardiologists and obstetricians to ensure the safety of both mother and child." },
    { question: "When should a couple consult an infertility specialist?", answer: "If you are under 35 and have been trying to conceive for a year without success, or over 35 and trying for 6 months, it's recommended to consult a specialist." },
    { question: "What counts as a 'High-Risk' pregnancy?", answer: "A high-risk pregnancy involves factors that could affect the mother or baby's health, such as advanced maternal age, preexisting conditions like diabetes, or multiple pregnancies (twins/triplets)." },
    { question: "How long does recovery take after 3D Laparoscopic surgery?", answer: "Recovery is typically much faster than open surgery. Most patients can go home within 24-48 hours and resume normal activities within 1 to 2 weeks." },
    { question: "What is the success rate of IVF at your centre?", answer: "Our success rates are among the highest in the region, generally ranging between 50% to 70% per cycle, depending on age and underlying health factors." },
    { question: "When is IVF needed?", answer: "IVF is often recommended for blocked fallopian tubes, severe male infertility, advanced maternal age, or unexplained infertility after other treatments have failed." },
    { question: "Is IVF painful?", answer: "The procedure is generally well-tolerated. Some injections may cause mild discomfort, and egg retrieval is performed under light anesthesia to ensure you don't feel pain." }
  ];

  const leftColumnFaqs = faqs.slice(0, 5);
  const rightColumnFaqs = faqs.slice(5, 10);

  const FAQItem = ({ faq, idx, isOpen, onToggle }: { faq: any, idx: number, isOpen: boolean, onToggle: () => void }) => (
    <div 
      className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md border-[#004b5f]/30 ring-1 ring-[#004b5f]/10' : 'hover:border-slate-300 bg-[#fbfdfd]'}`}
    >
      <button
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`font-semibold pr-8 ${isOpen ? 'text-[#004b5f]' : 'text-slate-900'}`}>{faq.question}</span>
        {isOpen ? (
          <div className="w-8 h-8 rounded-full bg-[#004b5f] text-white flex flex-shrink-0 items-center justify-center transition-colors">
            <ChevronUp className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-500 flex flex-shrink-0 items-center justify-center hover:bg-slate-300/60 transition-colors">
            <ChevronDown className="w-5 h-5" />
          </div>
        )}
      </button>
      
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-slate-600 border-t border-slate-100 pt-4 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-700 text-lg">Find answers to some of the most common questions about our hospital and services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-6xl mx-auto items-start">
          <div className="space-y-4">
            {leftColumnFaqs.map((faq, idx) => (
              <FAQItem 
                key={`left-${idx}`} 
                faq={faq} 
                idx={idx} 
                isOpen={openIndexLeft === idx} 
                onToggle={() => setOpenIndexLeft(openIndexLeft === idx ? null : idx)} 
              />
            ))}
          </div>
          <div className="space-y-4">
            {rightColumnFaqs.map((faq, idx) => (
              <FAQItem 
                key={`right-${idx}`} 
                faq={faq} 
                idx={idx} 
                isOpen={openIndexRight === idx} 
                onToggle={() => setOpenIndexRight(openIndexRight === idx ? null : idx)} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
