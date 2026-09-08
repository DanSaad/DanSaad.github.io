# Portfolio Project Summaries: 12-IncidentHandlersJournal

## Project 1: Ransomware Attack

| Date | Entry |
| :--- | :--- |
| 8/15/2025 | 1
| **Description** | An organized group of unethical hackers encrypted vital data via a phishing campaign and left a ransom note demanding money in exchange for the decryption key. |
| **Who** | Unethical hacking group known for targeting healthcare and transportation organizations. |
| **What** | Organization data was encrypted and held for ransom. |
| **When** | 9 am Tuesday morning |
| **Where** | Healthcare company |
| **Why** | An employee fell for a targeted phishing email, allowing the attackers to launch ransomware that encrypted patient files. |
| **Additional Notes:** | The company can prevent further incidents by engaging in employee training — ensuring that all employees are able to spot phishing emails — and by keeping robust, encrypted, up-to-date, and secured data backups. In order to get out of their current predicament, the company should pay the ransom if it does not have a robust, up-to-date backup.

***

## Project 2: Malware Executable in Email

| Date | Entry |
| :--- | :--- |
| 9/30/2025 | 2
| **Description** | An employee received and opened an email containing malicious executable files. |
| **Tools** | IDS, VirusTotal
| **Who** | An unidentified malicious actor or actors |
| **What** | Employee downloaded a suspicious email attachment, which created unauthorized executable files
|| The executable was found to have been a Trojan when the security team looked up the SHA hash value on VirusTotal
|| &emsp; 58/72 vendors flagged as malicious
|| &emsp; –272 community score). |
| **When** | 1:11 PM (email received)
|| 1:13 PM (employee downloads & opens file attachment)
|| 1:15 PM (file creates multiple unauthorized executable files on the computer)
|| 1:20 PM (IDS detects the executables and sends out an alert to SOC). |
| **Where** | Employee computer |
| **Why** | Insufficient training; employee should have known not to download an attachment from an unauthorized source. |
| **Additional Notes** | Additional education programs should reduce the chances of similair incidents.

***

## Project 3: Phishing Alert Ticket

| Date | Entry |
| :--- | :--- |
| 11/13/2025 | 3
| **Description** | Investigating an incident: phishing alert ticket: SERVER-MAIL Phishing attempt possible download of malware. |
| **Tools** | Phishing Incident Response Playbook. |
| **Who** | Malicious actor using the email "76tguyhh6tgftrt7tg.su", IP 114.114.114.11 |
| **What** | Attacker sent a phishing email to Inergy's HR email. Suspicious elements: |
|| &emsp; Multiple misspellings
|| &emsp; Mismatched names between email address, email name, and name in signature
|| &emsp; File attachment; hash was confirmed as belonging to a Trojan
|| User may have opened a malicious email and opened malicious attachments or links
| **When** | July 20, 2022 09:30:14 AM |
| **Where** | Company servers; employee computer |
| **Why** | Insufficient training on ignoring phishing emails & not downloading files from untrustworthy sources. |
| **Additional Notes** | The ticket identifies the severity as Medium, indicating it should be escalated to a level 2 analyst.

***

## Project 4: Incident Final Report

| Date | Entry |
| :--- | :--- |
| 11/14/2025 | 4
| **Description** | Reviewing a Final Report on an incident. |
| **Tools** | Final Report. |
| **Who** | Malicious actor |
| **What** | Data exfiltration attack followed by ransom attempt. |
|| Attacker used a forced browsing attack to collect purchase confirmation data, then used data exfiltration techniques to extract customer order data
|| Attacker then contacted employee to attempt to ransom this stolen information
|| Damage:
|| &emsp; 50,000 customer records affected
|| &emsp; $100,000 in direct costs & potential loss of revenue
| **When** | 3:13 PM PST 12/22/2022
|| 12/28/2022 |
| **Where** | E-commerce web application |
| **Why** | The e-commerce web app had a vulnerability that allowed attackers to perform forced browsing attacks
|| &emsp; Able to access customer transaction data by modifying order number included in the URL string of a purchase confirmation page
|| &emsp; Allowed attacker to access purchase confirmation pages, exposing customer data

**Recommendations**
- Conduct routine vulnerability scans and penetration testing.
- Implement proper access controls:
  - Allowlisting to allow access to specified set of URLs and auto-block all requests outside of that range
  - Ensure only authorized and authenticated users are authorized access to content