/**
 * Run createIntakeForm() once from script.google.com to (re)build the
 * client intake form linked from the site's contact section.
 *
 * To edit the EXISTING form in place (keeps the same forms.gle link, no
 * site update needed), replace the FormApp.create(...) line below with:
 *   var form = FormApp.openById('YOUR_FORM_EDIT_ID');
 * (Grab YOUR_FORM_EDIT_ID from the form's edit URL: docs.google.com/forms/d/{ID}/edit)
 *
 * Otherwise this creates a brand-new form — after running, copy the
 * published URL from the logs and update the href in index.html's
 * contact section (search for "forms.gle").
 */
function createIntakeForm() {
  var form = FormApp.create('New Client Intake — Cassandra Goodman')
    .setDescription("Thanks for reaching out! A few questions to help me prepare for our first conversation.")
    .setCollectEmail(true)
    .setConfirmationMessage("Thank you — I'll follow up within 1–2 business days to schedule our first conversation.");

  form.addSectionHeaderItem().setTitle('About your student');
  form.addTextItem().setTitle("Student's full name").setRequired(true);
  form.addTextItem().setTitle("Parent/guardian name (if different)");
  form.addTextItem().setTitle("Best phone number");
  form.addMultipleChoiceItem()
    .setTitle("Student's current grade")
    .setChoiceValues(['9th grade', '10th grade', '11th grade', '12th grade', 'Current college student (transfer)', 'Other'])
    .setRequired(true);
  form.addTextItem().setTitle("Current high school (or college, if transfer)");
  form.addTextItem().setTitle("Anticipated application year (e.g. Fall 2027)");
  form.addMultipleChoiceItem()
    .setTitle("Domestic or international applicant?")
    .setChoiceValues(['U.S. domestic', 'International']);

  form.addSectionHeaderItem().setTitle('Academic snapshot');
  form.addTextItem().setTitle("Approximate GPA (note weighted or unweighted)");
  form.addTextItem().setTitle("Standardized test scores, if taken (SAT/ACT), or testing plans");
  form.addParagraphTextItem().setTitle("Intended major(s) or areas of academic interest");

  form.addSectionHeaderItem().setTitle('Goals & fit');
  form.addParagraphTextItem().setTitle("What does your student want most out of the college experience?");
  form.addParagraphTextItem().setTitle("Any specific colleges already on the radar?");
  form.addParagraphTextItem().setTitle("What's prompting you to look for a consultant now?");

  form.addSectionHeaderItem().setTitle('Working together');
  form.addMultipleChoiceItem()
    .setTitle("Which service are you most interested in?")
    .setChoiceValues(['Discovery Session', 'Application Intensive', 'Comprehensive Counseling', 'Not sure yet — help me decide'])
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle("Preferred meeting format")
    .setChoiceValues(['Video call', 'In person', 'No preference']);
  form.addParagraphTextItem().setTitle("Best days/times for a first conversation");
  form.addTextItem().setTitle("How did you hear about me?");
  form.addParagraphTextItem().setTitle("Anything else you'd like me to know before we talk?");

  Logger.log('Published URL: ' + form.getPublishedUrl());
  Logger.log('Edit URL: ' + form.getEditUrl());
}
