import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';

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
  const { data, loading, error } = useFetch('/services', []);
  const services = data?.data || [];
  return (
    <div className="bg-background py-16">
      <div className="container-page overflow-visible">
      <Seo title="Services" description="Accounting, GST, tax, audit, ROC, and consulting services." />
      <SectionHeading eyebrow="Services" title="Professional Financial Solutions for Modern Businesses" />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="grid gap-20 overflow-visible md:grid-cols-2 xl:grid-cols-3">
        {services.map((item) => (
          <ServiceCard
            key={item.title}
            title={item.title}
            desc={item.description}
            benefits={item.benefits || benefits[item.title] || []}
            imageUrl={item.imageUrl || item.image || ''}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
