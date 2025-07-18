import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, CheckCircle, Quote, TrendingUp, Zap, BarChartBig } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: <BarChartBig className="h-8 w-8 text-accent" />,
      title: 'Advanced Analytics',
      description: 'Unlock deep insights with our comprehensive suite of analytical tools and visualizations.',
    },
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: 'Real-Time Dashboards',
      description: 'Monitor your key metrics in real-time with dynamic, interactive, and customizable dashboards.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-accent" />,
      title: 'Predictive Modeling',
      description: 'Leverage machine learning to forecast trends and make proactive, data-informed decisions.',
    },
  ];

  const faqs = [
    {
      question: 'What kind of data sources can I connect?',
      answer: 'Dataly supports a wide range of data sources, including SQL databases, NoSQL databases, cloud storage services like S3 and Google Cloud Storage, as well as popular third-party services like Google Analytics and Salesforce.',
    },
    {
      question: 'Is Dataly suitable for small businesses?',
      answer: 'Absolutely. Our platform is designed to be scalable and flexible, meeting the needs of businesses of all sizes. We offer various pricing tiers, including a plan that is perfect for startups and small businesses looking to get started with data analytics.',
    },
    {
      question: 'How secure is my data?',
      answer: 'Data security is our top priority. We employ end-to-end encryption, regular security audits, and comply with industry-standard security protocols like SOC 2 and GDPR to ensure your data is always protected.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
             <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="h-6 w-6 text-accent"
              fill="currentColor"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM112,184a8,8,0,0,1-16,0V144H80a8,8,0,0,1,0-16h16V72a8,8,0,0,1,16,0v56h16a8,8,0,0,1,0,16H112Zm64,0a8,8,0,0,1-16,0V160H144a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16a8,8,0,0,1,0,16H176Z" />
            </svg>
            <span className="font-bold font-headline text-lg">Dataly</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Sign In</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 sm:py-32 md:py-40">
          <div className="container px-4 text-center">
            <div className="bg-accent/20 text-accent font-medium inline-flex items-center gap-2 rounded-full px-4 py-1 mb-6">
              <CheckCircle className="h-4 w-4" />
              <span>Now with AI-Powered Predictive Analytics</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Turn Data into Actionable Insights
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Dataly is the all-in-one analytics platform that empowers your team to explore data, build real-time dashboards, and make smarter decisions without the complexity.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20">
                <Link href="/dashboard">Get Started for Free <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline">
                Book a Demo
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-24 bg-secondary">
          <div className="container px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">The Platform for Data-Driven Teams</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Stop guessing. Start knowing. Everything you need to understand your business and customers on a deeper level.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/80 hover:bg-card transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4 border border-accent/20">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="container px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Trusted by the most innovative companies</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Our customers see an average 45% increase in operational efficiency and a 30% boost in revenue within the first year.
                </p>
              </div>
              <div className="relative">
                <Card className="bg-secondary/50 p-8 rounded-xl shadow-lg">
                  <Quote className="h-10 w-10 text-accent/50 absolute -top-4 -left-4" />
                  <blockquote className="text-lg text-foreground italic">
                    "Dataly has completely transformed how we approach our data. What used to take weeks of engineering time now takes minutes. It's the most intuitive and powerful analytics tool we've ever used."
                  </blockquote>
                  <div className="mt-6">
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Head of Product, InnovateCorp</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 sm:py-24 bg-secondary">
           <div className="container px-4 max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Frequently Asked Questions</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                  Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full mt-12">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i + 1}`}>
                    <AccordionTrigger className="text-lg font-medium text-left hover:text-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
           </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Dataly. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
