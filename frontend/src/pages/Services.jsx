import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import { serviceCards } from '../data/site';

const benefits = {
  'Accounting & Bookkeeping': ['Accurate books', 'Monthly MIS', 'Better decision making'],
  'GST Services': ['Compliance control', 'Timely filings', 'Input tax tracking'],
  'Income Tax Filing': ['Error-free returns', 'Optimal deductions', 'Reduced risk'],
  'Audit & Assurance': ['Financial reliability', 'Control testing', 'Regulatory confidence'],
  'ROC Compliance': ['On-time filings', 'Corporate governance', 'Lower penalties'],
  'Company Registration': ['Fast setup', 'Proper structure', 'Compliance ready'],
  'Startup Advisory': ['Entity planning', 'Financial systems', 'Scaling support'],
  'Financial Consulting': ['Cash flow clarity', 'Strategic insights', 'Profit improvement']
};

export default function Services() {
  return (
    <div className="bg-background py-16">
      <div className="container-page overflow-visible">
      <Seo title="Services" description="Accounting, GST, tax, audit, ROC, and consulting services." />
      <SectionHeading eyebrow="Services" title="Professional Financial Solutions for Modern Businesses" />
      <div className="grid gap-20 overflow-visible md:grid-cols-2 xl:grid-cols-3">
        {serviceCards.map((item) => (
          <ServiceCard key={item.title} title={item.title} desc={item.desc} benefits={benefits[item.title] || []} />
        ))}
      </div>
      </div>
    </div>
  );
}
