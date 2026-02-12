import React, { useRef, useState } from "react";

interface TermsContentProps {
  heightClass?: string;
  onScrollEnd?: (isAtBottom: boolean) => void;
}

const TermsContent: React.FC<TermsContentProps> = ({
  heightClass = "h-48",
  onScrollEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    setIsAtBottom(atBottom);
    if (onScrollEnd) onScrollEnd(atBottom);
  };
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-y-auto scrollbar-hide px-2 text-sm rounded-lg bg-transparent ${heightClass}`}
    >
      <p>
        Welcome to the To-do List App. By signing in, registering, or using this
        application, you agree to comply with and be bound by the following
        Terms and Conditions. If you do not agree, please do not use the
        application.
      </p>
      <p className="mt-4">
        <strong>1. Acceptance of Terms</strong>
        <br />
        By accessing or using the To-do List App, you acknowledge that you have
        read, understood, and agreed to these Terms and Conditions, along with
        our Privacy Policy.
      </p>
      <p className="mt-4">
        <strong>2. User Accounts</strong>
        <br />
        You are responsible for maintaining the confidentiality of your login
        credentials. You agree to provide accurate, current, and complete
        information during registration. You are fully responsible for all
        activities that occur under your account.
      </p>
      <p className="mt-4">
        <strong>3. User Roles and Access</strong>
        <br />
        Users may create, update, and manage their own tasks only. Admins have
        additional privileges, including managing users and viewing system-wide
        task data. Unauthorized access or misuse of admin privileges is strictly
        prohibited.
      </p>
      <p className="mt-4">
        <strong>4. Acceptable Use</strong>
        <br />
        You agree not to: Use the app for unlawful, harmful, or abusive
        activities. Attempt to gain unauthorized access to other users’ data or
        system resources. Upload malicious code, spam, or content that may
        disrupt the system.
      </p>
      <p className="mt-4">
        <strong>5. Data Privacy and Security</strong>
        <br />
        Your data is stored securely and used only for system functionality. We
        implement reasonable security measures, but absolute data security
        cannot be guaranteed. You are responsible for safeguarding your account
        information.
      </p>
      <p className="mt-4">
        <strong>6. Task Data Ownership</strong>
        <br />
        You retain ownership of the tasks and content you create. By using the
        app, you grant permission for the system to store and process your data
        for functionality and improvement purposes.
      </p>
      <p className="mt-4">
        <strong>7. System Availability</strong>
        <br />
        The app is provided on an “as is” and “as available” basis. We reserve
        the right to modify, suspend, or discontinue any part of the system
        without prior notice.
      </p>
      <p className="mt-4">
        <strong>8. Account Suspension or Termination</strong>
        <br />
        We reserve the right to suspend or terminate accounts that: Violate
        these Terms and Conditions, Engage in suspicious or harmful activities,
        Abuse system resources or other users.
      </p>
      <p className="mt-4">
        <strong>9. Limitation of Liability</strong>
        <br />
        The To-do List App and its developers shall not be held liable for: Data
        loss due to system failure or unauthorized access, Productivity loss,
        missed deadlines, or indirect damages arising from app usage.
      </p>
      <p className="mt-4">
        <strong>10. Changes to Terms</strong>
        <br />
        We may update these Terms and Conditions at any time. Continued use of
        the app after changes means you accept the revised terms.
      </p>
    </div>
  );
};

export default TermsContent;
