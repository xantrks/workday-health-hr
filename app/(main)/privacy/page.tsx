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
  title: 'Privacy Policy | Sanicle',
  description: 'Privacy Policy for Sanicle Women\'s Health Platform',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: May 1, 2025</p>
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
              At Sanicle, we prioritize your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
            </p>
            <p>
              Sanicle is a comprehensive women&apos;s health platform designed for workplace wellness. We provide personalized health tracking for female employees while giving HR departments anonymized data insights for better workforce planning and employee support.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We collect several types of information to provide and improve our services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password (encrypted), and role within your organization.</li>
              <li><strong>Organization Information:</strong> Organization name, subscription details, and administrator contact information.</li>
              <li><strong>Health Data:</strong> Menstrual cycle information, symptoms, mood tracking, and other health-related data you voluntarily provide.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our service, such as pages visited, features used, and time spent on the platform.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service.</li>
              <li>To personalize your experience and offer health insights.</li>
              <li>To communicate with you about your account or the service.</li>
              <li>To improve our platform based on user feedback and usage patterns.</li>
              <li>To provide anonymized and aggregated data to HR departments for workforce planning.</li>
              <li>To protect the security and integrity of our platform.</li>
            </ul>
            <p>
              <strong>Important:</strong> Individual health data is never shared with employers or HR departments in a way that can identify you personally.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>4. Data Protection Measures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Sanicle employs robust security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Multi-Tenant Architecture:</strong> Complete data isolation between organizations.</li>
              <li><strong>Data Anonymization:</strong> HR dashboard only shows anonymized, aggregated data.</li>
              <li><strong>End-to-End Encryption:</strong> Secure communication for all health data.</li>
              <li><strong>Role-Based Access:</strong> Strict permission system for different user types.</li>
              <li><strong>GDPR Compliance:</strong> All data handling adheres to GDPR principles.</li>
              <li><strong>Secure Authentication:</strong> Advanced auth system with JWT and next-auth.</li>
              <li><strong>Audit Logging:</strong> Comprehensive activity tracking for security monitoring.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>5. Data Sharing and Third Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We do not sell your personal information to third parties. We may share data in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> We may share data with third-party vendors who help us provide and improve our services.</li>
              <li><strong>Analytics Partners:</strong> We use analytics services to improve our platform.</li>
              <li><strong>Legal Requirements:</strong> We may disclose data if required by law or in response to valid legal requests.</li>
              <li><strong>Organization Administrators:</strong> If you&apos;re using Sanicle through your employer, organization administrators may have access to certain account information but not your health data.</li>
            </ul>
            <p>
              All third parties we work with are bound by strict confidentiality obligations and data protection requirements.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>6. AI and Health Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our AI health assistant, Sani, provides personalized support and guidance:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your conversations with Sani are protected with the same security measures as all other data.</li>
              <li>The AI uses your health data to provide personalized recommendations but does not permanently store conversation content beyond what&apos;s necessary to provide the service.</li>
              <li>We use aggregated, anonymized data to improve the AI assistant&apos;s performance, but this cannot be traced back to individual users.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>7. Your Data Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> You can request copies of your personal data.</li>
              <li><strong>Rectification:</strong> You can request that we correct any information you believe is inaccurate.</li>
              <li><strong>Erasure:</strong> You can request that we erase your personal data in certain circumstances.</li>
              <li><strong>Restriction:</strong> You can request that we restrict the processing of your data in certain circumstances.</li>
              <li><strong>Data Portability:</strong> You can request that we transfer your data to another organization or directly to you.</li>
              <li><strong>Objection:</strong> You can object to our processing of your personal data.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at the information provided below.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>8. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            <p>
              When you delete your account, we will delete or anonymize your personal information, unless we need to retain certain information for legitimate business or legal purposes.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>9. Children&apos;s Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our service is not intended for individuals under the age of 18, and we do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe we have collected information from a child under 18, please contact us.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>10. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>11. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="font-medium">
              privacy@sanicle.cloud
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 