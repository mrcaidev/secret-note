import { H1, H2, P } from "@/components/ui/typography";
import { View } from "react-native";

export default function PrivacyPolicyPage() {
  return (
    <View className="grow px-6 py-24 bg-background">
      <H1 className="mb-8">Privacy Policy</H1>
      <H2 className="mb-4">1 Introduction</H2>
      <P className="mb-4">
        On Secret Note, security is our first concern. We take your privacy
        seriously and are committed to protecting your personal data and the
        content you have created. This privacy policy explains how we collect,
        use and protect your data.
      </P>
      <H2 className="mb-4">2 Personal data</H2>
      <P className="mb-4">
        We do not collect any personal data, except your email address, which is
        used solely as a login credential. We send you emails only on
        registration or MFA for identity verification purpose. We never share
        your email address with any third party.
      </P>
      <H2 className="mb-4">3 Note Content</H2>
      <P className="mb-4">
        All notes created on our platform are considered highly confidential.
        They are only accessible to the author and users who have acquired
        explicit access permission granted by the author. We store your notes
        securely after encryption and never share them with any third party.
      </P>
      <H2 className="mb-4">4 Future Changes</H2>
      <P className="mb-4">
        This privacy policy is subject to change. Any future updates will be
        posted on this page.
      </P>
      <P>
        If you have any questions about this privacy policy, please contact us.
      </P>
    </View>
  );
}
