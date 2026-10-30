import React from "react";
import { View, TouchableOpacity, Linking } from "react-native";
import PolicyText from "./PolicyText";

interface IPolicyContentProps {}

const PolicyContent: React.FC<IPolicyContentProps> = () => {
  return (
    <>
      <PolicyText>Privacy Policy</PolicyText>
      <PolicyText>Last modified: July 14, 2023</PolicyText>
      <PolicyText>Introduction</PolicyText>
      <PolicyText>
        DoSpace Inc. (“Company” or “We” or “Us” or “Our”) respects your privacy
        and is committed to protecting it through our compliance with this
        policy.
      </PolicyText>
      <PolicyText>
        This policy describes the types of information we may collect from you
        or that you may provide when you visit the websites Dospace.tech and
        Viewspace.tech (collectively, our “Website”) and our practices for
        collecting, using, maintaining, protecting, and disclosing that
        information.
      </PolicyText>
      <PolicyText>This policy applies to information we collect:</PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            On this Website, including through any third party accounts you use
            to access the Website.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            In email, text, and other electronic messages between you and this
            Website.
          </PolicyText>
        </View>
      </View>

      <PolicyText>It does not apply to information collected by:</PolicyText>
      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Us offline or through any other means, including on any other
            website operated by Company or any third party (including our
            affiliates and subsidiaries); or
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Any third party (including our affiliates and subsidiaries),
            including through any application or content (including advertising)
            that may link to or be accessible from or on the Website
          </PolicyText>
        </View>
      </View>
      <PolicyText>
        Please read this policy carefully to understand our policies and
        practices regarding your information and how we will treat it. If you do
        not agree with our policies and practices, your choice is not to use our
        Website. By accessing or using this Website, you agree to this privacy
        policy. This policy may change from time to time (see Changes to Our
        Privacy Policy). Your continued use of this Website after we make
        changes is deemed to be acceptance of those changes, so please check the
        policy periodically for updates.
      </PolicyText>
      <PolicyText>
        Information We Collect About You and How We Collect It
      </PolicyText>
      <PolicyText>
        We collect several types of information from and about users of our
        Website, including information:
      </PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            By which you may be personally identified, such as name, postal
            address, e-mail address, or telephone number (“personal
            information”);
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            That is about you but individually does not identify you; and
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            About your internet connection, the equipment you use to access our
            Website, and usage details.
          </PolicyText>
        </View>
      </View>

      <PolicyText>We collect this information:</PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Directly from you when you provide it to us.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Automatically as you navigate through the site. Information
            collected automatically may include usage details, IP addresses, and
            information collected through cookies.
          </PolicyText>
        </View>
      </View>

      <PolicyText>Information You Provide to Us</PolicyText>
      <PolicyText>
        The information we collect on or through our Website may include:
      </PolicyText>
      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Information that you provide by filling in forms on our Website.
            This includes information provided at the time of registering to use
            our Website, subscribing to our service, or requesting further
            services. We may also ask you for information when you report a
            problem with our Website.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Records and copies of your correspondence (including email
            addresses), if you contact us.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Your search queries on the Website.
          </PolicyText>
        </View>
      </View>

      <PolicyText>
        Information We Collect Through Automatic Data Collection Technologies
      </PolicyText>
      <PolicyText>
        As you navigate through and interact with our Website, we may use
        automatic data collection technologies to collect certain information
        about your equipment, browsing actions, and patterns, including:
      </PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Details of your visits to our Website, including traffic data,
            location data, logs, and other communication data and the resources
            that you access and use on the Website.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Information about your computer and internet connection, including
            your IP address, operating system, and browser type.
          </PolicyText>
        </View>
      </View>

      <PolicyText>
        The information we collect automatically is only statistical data and
        does not include personal information, but we may maintain it or
        associate it with personal information we collect in other ways or
        receive from third parties. It helps us to improve our Website and to
        deliver a better and more personalized service, including by enabling us
        to:
      </PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Estimate our audience size and usage patterns.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Store information about your preferences, allowing us to customize
            our Website according to your individual interests.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Speed up your searches.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Recognize you when you return to our Website.
          </PolicyText>
        </View>
      </View>

      <PolicyText>
        The technologies we use for this automatic data collection may include:
      </PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Cookies (or browser cookies). A cookie is a small file placed on the
            hard drive of your computer. You may refuse to accept browser
            cookies by activating the appropriate setting on your browser.
            However, if you select this setting you may be unable to access
            certain parts of our Website. Unless you have adjusted your browser
            setting so that it will refuse cookies, our system will issue
            cookies when you direct your browser to our Website.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Web Beacons. Pages of our Website may contain small electronic files
            known as web beacons (also referred to as clear gifs, pixel tags,
            and single-pixel gifs) that permit the Company, for example, to
            count users who have visited those pages and for other related
            website statistics (for example, recording the popularity of certain
            website content and verifying system and server integrity).
          </PolicyText>
        </View>
      </View>

      <PolicyText>Third-Party Use of Cookies</PolicyText>
      <PolicyText>
        Some content or applications, including advertisements, on the Website
        are served by third-parties, including advertisers, ad networks and
        servers, content providers, and application providers. These third
        parties may use cookies to collect information about you when you use
        our Website. The information they collect may be associated with your
        personal information or they may collect information, including personal
        information, about your online activities over time and across different
        websites and other online services. They may use this information to
        provide you with interest-based (behavioral) advertising or other
        targeted content.
      </PolicyText>
      <PolicyText>
        We do not control these third parties' tracking technologies or how they
        may be used. If you have any questions about an advertisement or other
        targeted content, you should contact the responsible provider directly.
        For information about how you can opt out of receiving targeted
        advertising from many providers, see Choices About How We Use and
        Disclose Your Information.
      </PolicyText>
      <PolicyText>How We Use Your Information</PolicyText>
      <PolicyText>
        We use information that we collect about you or that you provide to us,
        including any personal information:
      </PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To present our Website and its contents to you.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To provide you with information, products, or services that you
            request from us.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To fulfill any other purpose for which you provide it.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To carry out our obligations and enforce our rights arising from any
            contracts entered into between you and us, including for billing and
            collection.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To notify you about changes to our Website or any products or
            services we offer or provide though it.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To allow you to participate in interactive features on our Website.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To send you promotional offers and provide targeted advertising.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            In any other way we may describe when you provide the information.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            For any other purpose with your consent.
          </PolicyText>
        </View>
      </View>

      <PolicyText>Disclosure of Your Information</PolicyText>
      <PolicyText>
        We may disclose personal information that we collect or you provide as
        described in this privacy policy:
      </PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To our subsidiaries and affiliates.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To contractors, service providers, vendors, and other third parties
            we use to support our business.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To a buyer or other successor in the event of a merger, divestiture,
            restructuring, reorganization, dissolution, or other sale or
            transfer of some or all of 429 Technologies, LLC’s assets, whether
            as a going concern or as part of bankruptcy, liquidation, or similar
            proceeding, in which personal information held by 429 Technologies,
            LLC about our Website users is among the assets transferred.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            For marketing and advertising purposes.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To fulfill the purpose for which you provide it.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            For any other purpose disclosed by us when you provide the
            information.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            With your consent.
          </PolicyText>
        </View>
      </View>
      <PolicyText>We may also disclose your personal information:</PolicyText>

      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To comply with any court order, law, or legal process, including to
            respond to any government or regulatory request.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            To enforce or apply other agreements, including for billing and
            collection purposes.
          </PolicyText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            If we believe disclosure is necessary or appropriate to protect the
            rights, property, or safety of 429 Technologies, LLC our customers,
            or others.
          </PolicyText>
        </View>
      </View>
      <PolicyText>
        Choices About How We Use and Disclose Your Information
      </PolicyText>
      <PolicyText>
        We strive to provide you with choices regarding the personal information
        you provide to us. We have created mechanisms to provide you with the
        following control over your information:
      </PolicyText>
      <View style={{ marginLeft: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <PolicyText>{"\u2022"}</PolicyText>
          <PolicyText style={{ flex: 1, paddingLeft: 5 }}>
            Tracking Technologies and Advertising. You can set your browser to
            refuse all or some browser cookies, or to alert you when cookies are
            being sent. To learn how you can manage your Flash cookie settings,
            visit the Flash player settings page on Adobe’s website. If you
            disable or refuse cookies, please note that some parts of this site
            may then be inaccessible or not function properly.
          </PolicyText>
        </View>
      </View>

      <PolicyText>
        We do not control third parties’ collection or use of your information
        to serve interest-based advertising. However these third parties may
        provide you with ways to choose not to have your information collected
        or used in this way. You can opt out of receiving targeted ads from
        members of the Network Advertising Initiative (“NAI”) on the NAI's
        website.
      </PolicyText>
      <PolicyText>Accessing and Correcting Your Information</PolicyText>

      <PolicyText>
        You can review and request a change your personal information by sending
        us an email at Info@dospace.tech to request access to, correct or delete
        any personal information that you have provided to us. We may not
        accommodate a request to change information if we believe the change
        would violate any law or legal requirement or cause the information to
        be incorrect.
      </PolicyText>

      <PolicyText>State Privacy Laws</PolicyText>
      <PolicyText>
        We do not meet the conditions as outlined in Section 1798.140 of the
        California Consumer Privacy Act of 2018 (the “CCPA”) and therefore are
        not subject to CCPA requirements. We are also do not meet the
        eligibility conditions outlined in the Virginia Consumer Data Protection
        Act, Colorado Privacy Act, Connecticut Data Privacy Act, or Utah
        Consumer Privacy Act and are therefore are not subject to the
        requirements of these laws. For specific information related to your
        ability to access and correct your personal information, see Accessing
        and Correcting Your Information above.
      </PolicyText>
      <PolicyText>Data Security</PolicyText>
      <PolicyText>
        We have implemented measures designed to secure your personal
        information from accidental loss and from unauthorized access, use,
        alteration, and disclosure. The safety and security of your information
        also depends on you. Although we do our best to protect your personal
        information, we cannot guarantee the security of your personal
        information transmitted to our Website. Any transmission of personal
        information is at your own risk. We are not responsible for
        circumvention of any privacy settings or security measures contained on
        the Website.
      </PolicyText>
      <PolicyText>Children Under the Age of 13</PolicyText>
      <PolicyText>
        Our Website is not intended for children under 13 years of age. No one
        under age 13 may provide any personal information to or on the Website.
        We do not knowingly collect personal information from children under 13.
        If you are under 13, do not use or provide any information on this
        Website, register on the Website, or provide any information about
        yourself to us, including your name, address, telephone number, email
        address, or any screen name or user name you may use. If we learn we
        have collected or received personal information from a child under 13
        without verification of parental consent, we will delete that
        information. If you believe we might have any information from or about
        a child under 13, please contact us at Info@dospace.tech.
        {/* <a href="mailto:Info@dospace.tech" target="_self">
            Info@dospace.tech
          </a> */}
      </PolicyText>
      <PolicyText>Changes to Our Privacy Policy</PolicyText>
      <PolicyText>
        It is our policy to post any changes we make to our privacy policy on
        this page. If we make material changes to how we treat our users’
        personal information, we will notify you by email or through a notice on
        the Website home page. The date the privacy policy was last revised is
        identified at the top of the page. You are responsible for ensuring we
        have an up-to-date active and deliverable email address for you, and for
        periodically visiting our Website and this privacy policy to check for
        any changes.
      </PolicyText>
      <PolicyText>Contact Information</PolicyText>
      <PolicyText>
        To ask questions or comment about this privacy policy and our privacy
        practices, contact us at:
      </PolicyText>
      <PolicyText> </PolicyText>
      <PolicyText>DoSpace, Inc.</PolicyText>
      <PolicyText>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:Info@dospace.tech")}
        >
          <PolicyText>Info@dospace.tech</PolicyText>
        </TouchableOpacity>
      </PolicyText>
      <PolicyText>(402) 885-9731</PolicyText>
      <PolicyText
        style={{
          marginBottom: 40,
        }}
      >
        10330 Regency Pkwy Drive #100, Omaha, NE 68114
      </PolicyText>
    </>
  );
};

export default PolicyContent;
