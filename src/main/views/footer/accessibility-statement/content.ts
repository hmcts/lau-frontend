export const content = {
  title: 'Accessibility Statement',
  heading1: 'Accessibility Statement for Log and Audit',
  paragraph2: 'This website is run by HM Courts and Tribunals. We want as many people as possible to be able to use this website. For example, that means you should be able to:',
  list1Item1: 'Change colours, contrast levels and fonts using browser or device settings.',
  list1Item2: 'Zoom in up to 400% without the text spilling off the screen.',
  list1Item3: 'Navigate most of the website using just a keyboard.',
  list1Item4: 'Navigate most of the website using speech recognition software.',
  list1Item5: 'Listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver.',
  paragraph3: 'We&rsquo;ve also made the website text as simple as possible to understand.',
  paragraph4: '<a href="https://mcmw.abilitynet.org.uk/" class="govuk-link" target="_blank" rel="external noopener noreferrer">AbilityNet</a> has advice on making your device easier to use if you have a disability.',

  heading2: 'How accessible this website is',
  paragraph5: 'We are aware of some accessibility issues with the date and time picker component, including contrast, screen reader compatibility, and error handling, and are working to address them.',

  heading3: 'Feedback and contact information',
  paragraph6: 'We provide a text relay service for people who are deaf, hearing impaired or have a speech impediment. If you need information on this website in a different format like accessible PDF, large print, easy read, audio recording or braille - email <a href="mailto:lau-team@HMCTS.NET" class="govuk-link">lau-team@HMCTS.NET</a>',
  paragraph7: 'We’re always looking to improve the accessibility of this website. If you find any problems that are not listed on this page or think we’re not meeting accessibility requirements please contact us on our email <a href="mailto:lau-team@HMCTS.NET" class="govuk-link">lau-team@HMCTS.NET</a>',
  paragraph8: 'We’ll consider your requests and get back to you within 10 working days.',

  heading5: 'Enforcement procedure',
  paragraph13: 'The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the &lsquo;accessibility regulations&rsquo;). If you&rsquo;re not happy with how we respond to your complaint, <a href="https://www.equalityadvisoryservice.com/" target="_blank" rel="external noopener noreferrer" class="govuk-link">contact the Equality Advisory and Support Service (EASS)</a>.',

  heading6: 'Technical information about this website&rsquo;s accessibility',
  paragraph14: 'HMCTS is committed to making its websites accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.',

  heading7: 'Compliance status',
  paragraph15: 'This website is partially compliant with the <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="external noopener noreferrer" class="govuk-link">Web Content Accessibility Guidelines version 2.2</a> AA standard, due to the non-compliances listed below.',

  heading8: 'Non-accessible content',
  paragraph16: 'The content listed below is non-accessible for the following reasons:',

  heading9: 'Non-compliance with the accessibility regulations',
  list2Item1: 'The date and time picker component fails to meet minimum contrast requirements. Users with vision impairments may not distinguish these buttons or focus elements. This fails WCAG 2.2 criteria: 1.4.3: Contrast (Minimum) (Level AA).',
  list2Item2: 'When using the screen reader to navigate date and time input fields, the placeholder text is read out as a percentage. This could be a critical comprehension issue for assistive technology users as they may not understand the expected input. This fails WCAG 2.2 criteria: 4.1.2: Name, Role, Value (Level A).',
  list2Item3: 'If a user enters a date in the date/time field and an error is triggered, the date entered is deleted. Screen reader users are not made aware that the date is missing in the error message so are not alerted to the missing required date. This fails WCAG 2.2 criteria: 3.3.7: Redundant Entry (Level A).',
  list2Item4: 'The focus indicator for the datetime picker fails to meet minimum contrast requirements with the page background. Users with visual impairments may not detect the focus location. This fails WCAG 2.2 criteria: 1.4.11: Non-text Contrast (Level AA).',

  paragraph17: 'We have reviewed all the above issues which relate to the datetime picker component and we have raised all of them as a single GitHub Issue on the Notgov design system. We are tracking them on <a href="https://github.com/daniel-ac-martin/NotGovUK/issues/1552" target="_blank" class="govuk-link">https://github.com/daniel-ac-martin/NotGovUK/issues/1552.</a>',

  heading10: 'What we&rsquo;re doing to improve accessibility',
  paragraph19: 'This website is continually tested using accessibility automated tests and basic manual and assistive technology checks. Any new features which are introduced will also be tested internally or with the support of the internal HMCTS accessibility testing team.',


  heading11: 'Preparation of this accessibility statement',
  paragraph20: 'This statement was prepared on 5<sup>th</sup> August 2024. It was last reviewed on 11<sup>th</sup> September 2025.',
  paragraph21: 'This website was last tested on 6<sup>th</sup> May 2025. The audit was carried out by the internal HMCTS accessibility testing team. The team tested against a range of assistive technologies and accessibility testing tools.',
};
