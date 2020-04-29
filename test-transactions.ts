/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import GMail from './gmail-app-script/gmail';
import StandardChartered from './bank';

function testTransaction() {
  const gmailApp = new GMail(GmailApp);
  const sc = new StandardChartered(gmailApp);
  console.log(sc.getTransactions());
}
