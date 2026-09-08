# Securing the Digital Vault: A Vulnerability Assessment Case Study

As I progress through my cybersecurity training, I’ve learned that a security analyst's job isn't just about identifying "bugs"—it's about communicating risk in a way that helps a business make informed decisions. To practice this, I recently completed a comprehensive vulnerability assessment project for a hypothetical e-commerce company. 

In this case study, I was tasked with evaluating a critical security flaw: a remote database server that had been left open to the public for three years. This project allowed me to bridge the gap between technical vulnerability identification and executive-level risk reporting.

---

## The Scenario: A Publicly Exposed Gateway
The company in this scenario operates on a global scale with a remote workforce. Their "crown jewels"—sensitive customer information and potential lead data—reside on a database server. Because the company launched three years ago, the database was originally left accessible to the public to facilitate easy querying.

From a security standpoint, this is a textbook "critical" vulnerability. While it may have served the business's growth initially, the lack of access controls creates a massive attack surface for data exfiltration, regulatory non-compliance, and reputational damage.

## My Approach: From Analysis to Action
I approached this assignment by following a structured methodology, utilizing the **NIST SP 800-30 Rev. 1** framework to ensure my findings were grounded in industry standards.

### 1. Defining the Purpose
My first step was to articulate *why* this assessment mattered to the stakeholders. I didn't want to just say "the server is open"; I needed to explain the specific, multi-faceted risks to the business. I highlighted the following critical findings:

*   **Operational Dependency:** The server stores information that is accessed regularly by remote work staff around the world. If the server were disabled, it would interrupt operations for employees worldwide and disrupt business and customer acquisition.
*   **Data Sensitivity and Regulatory Exposure:** The server stores information about potential customers, specifically PII / SPII, including data about people and companies that are not even current customers. 
*   **Public Access and Major Risk:** The database has been accessible to the public for three years. This presents a major risk because anyone can access the database, meaning the information contained is not secured against unauthorized access. Because the information contained is sensitive, a leak could cause a number of significant issues:
    *   **Major reputational damage:** A leak or attack could lead to the company being viewed as: **1) unable to secure assets (can't be trusted)** and **2) was storing unrelated information.**
    *   **Regulation issues:** Improperly failing to restrict unauthorized access may be in violation of governmental regulations about PII/SPII.
    *   **Competition:** Competitors can access the database and extract information to give them an edge on acquiring the detailed clients first.

### 2. Identifying and Scoring Threats
Using the NIST framework, I performed a qualitative risk assessment. I identified three distinct threat sources, each with different likelihoods and severities based on my analysis of the system's current state.

I utilized a scoring system where **Likelihood** and **Severity** are rated on a scale of 1–3, with the final **Risk Score** being the product of those two numbers (Likelihood x Severity).

| Threat Source | Threat Event | Likelihood | Severity | Risk |
| :--- | :--- | :---: | :---: | :---: |
| **Hacker** | Obtain sensitive information via exfiltration | 3 | 3 | 9 |
| **Employee** | Leak sensitive information or execute human error resulting in system-wide disruption of operations | 2 | 3 | 6 |
| **Customer / General Public** | Could alter or delete critical information, compromising data integrity | 1 | 3 | 3 |

### 3. Developing the Remediation Strategy
First and foremost come access controls. I recommended closing access to the public by implementing authentication, authorization, and auditing mechanisms.
*   **Least Privilege:** In order to ensure only authorized users access the database server and that their permissions are limited only to what they need to perform their roles, I proposed the following policies:
    * Strong Passwords
    * Role-Based Access Controls
    * Multi-Factor Authentication (MFA)

These recommendations mitigate the risk of stolen credentials and cracked passwords—a common vector for both hackers and internal leaks. Additionally, with role-based access controls in place, cracking an employee's account will yield access only to a limited subset of the available data, helping to contain the incident from the get-go.

*   **Network Security:** In order to double-down on these protections from a technical angle, I also proposed the following solutions:
    * **Improved Encryption:** I recommended that data in motion be encrypted with TLS instead of SSL to improve security.
    * **IP Allow-listing:** By automatically blocking any IP address that isn't on the short-list of corporate offices, we prevent random users on the internet and malicious actors from using external devices to connect to the database.


## Reflections
By quantifying the risks and providing actionable remediation steps like IP allow-listing and MFA, I was able to create a roadmap that protects the company's assets without hindering its ability to function.

This experience served as a vital exercise in professional communication, preparing me to provide clear, high-impact security guidance in a real-world corporate environment.
