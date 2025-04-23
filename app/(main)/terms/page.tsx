import { Metadata } from 'next';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Sanicle',
  description: 'Terms of Service for Sanicle Women\'s Health Platform',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: May 1, 2024</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/register" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Registration
          </Link>
        </Button>
      </div>
      
      <div className="space-y-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to Sanicle, a comprehensive women&apos;s health platform designed for workplace wellness. By accessing or using our service, you agree to be bound by these Terms of Service (&quot;Terms&quot;).
            </p>
            <p>
              Sanicle provides personalized health tracking for female employees while providing HR departments with anonymized data insights for better workforce planning and employee support. Built with a multi-tenant architecture, the system supports organizations of various sizes while maintaining strict data privacy and security.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>2. User Accounts and Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To use certain features of the Service, you must register for an account with us. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your password and for any activities or actions under your account. We encourage you to use &quot;strong&quot; passwords (passwords that use a combination of upper and lowercase letters, numbers, and symbols) with your account.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>3. Organization Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you register on behalf of an organization, you represent and warrant that you have the authority to bind the organization to these Terms. If you register your company or organization for our Service, you will be the administrator of the organization account.
            </p>
            <p>
              As the administrator, you are responsible for managing access to your organization&apos;s account, including adding and removing users and managing their permission levels.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>4. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our Privacy Policy describes how we handle the information you provide to us when you use our Service. You understand that through your use of the Service you consent to the collection and use of this information as set forth in our Privacy Policy.
            </p>
            <p>
              We are committed to protecting your privacy and data. We use multi-tenant architecture with complete data isolation between organizations, data anonymization, end-to-end encryption, and role-based access control.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>5. Content and Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Sanicle and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p>
              You may not duplicate, copy, or reuse any portion of the HTML/CSS, JavaScript, or visual design elements or concepts without express written permission from Sanicle.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>6. User Conduct</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You agree not to use the Service for any purpose that is illegal or prohibited by these Terms, or to engage in any activity that would cause harm to others or interfere with the operation of the Service.
            </p>
            <p>
              Specifically, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service in any manner that could disable, overburden, damage, or impair the site</li>
              <li>Use any robot, spider or other automatic device, process or means to access the Service for any purpose</li>
              <li>Introduce any viruses, trojans, worms, logic bombs or other harmful material</li>
              <li>Attempt to gain unauthorized access to, interfere with, damage or disrupt any parts of the Service</li>
              <li>Use the Service to store or transmit harmful code</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>7. Health Information Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The health information provided by Sanicle is for general informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on the Service.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>8. Changes to Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may modify these Terms at any time. If we make changes, we will provide notice of such changes, such as by sending an email notification, providing notice through the Service, or updating the &quot;Last Updated&quot; date at the beginning of these Terms.
            </p>
            <p>
              Your continued use of the Service following the posting of updated Terms means that you accept and agree to the changes. If you do not agree to the updated Terms, you should discontinue using the Service.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>9. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-medium">
              support@sanicle.cloud
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 