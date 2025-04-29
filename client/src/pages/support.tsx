import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Sidebar from "@/components/layout/SidebarComponent";

// Type definitions
type FAQ = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

type SupportCategory = {
  id: string;
  name: string;
  description: string;
};

// Form schema
const contactFormSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Support() {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();

  // React Query hooks for fetching data
  const { data: faqs = [] } = useQuery<FAQ[]>({
    queryKey: ["/api/faq"],
  });

  const { data: categories = [] } = useQuery<SupportCategory[]>({
    queryKey: ["/api/support/categories"],
  });

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group FAQs by category for display
  const faqsByCategory = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  // Form handling
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: "",
      category: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // In a real app, this would call the API
      toast({
        title: "Support ticket submitted",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error submitting ticket",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-6 pt-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary">Support & Help Center</h1>
          <p className="text-muted-foreground">Find answers to your questions or get in touch with our team</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common questions about AUTTOBI</CardDescription>
                  </div>
                  
                  <div className="w-full md:w-64">
                    <Input
                      placeholder="Search FAQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    variant={activeCategory === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveCategory("all")}
                  >
                    All
                  </Button>
                  
                  <Button 
                    variant={activeCategory === "account" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveCategory("account")}
                  >
                    Account
                  </Button>
                  
                  <Button 
                    variant={activeCategory === "wallet" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveCategory("wallet")}
                  >
                    Wallet
                  </Button>
                  
                  <Button 
                    variant={activeCategory === "security" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveCategory("security")}
                  >
                    Security
                  </Button>
                  
                  <Button 
                    variant={activeCategory === "trading" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveCategory("trading")}
                  >
                    Trading
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No results found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or filter to find what you're looking for
                    </p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id.toString()}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="prose dark:prose-invert max-w-none">
                            <p>{faq.answer}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need help with something specific? Our support team is here to help.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief summary of your issue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your issue in detail..." 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Include any relevant details that might help us assist you better.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full sm:w-auto">
                      Submit Ticket
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted/50 p-6 rounded-b-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-medium">Need urgent assistance?</h3>
                  <p className="text-muted-foreground mt-1">
                    For urgent matters, please contact us directly at support@auttobi.com
                  </p>
                </div>
                <Button variant="outline">Email Support</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}